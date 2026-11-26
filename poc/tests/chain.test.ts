import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { Contract } from 'ethers'
import { expect, it } from 'vitest'
import { buildServer } from '../api/src/server.ts'
import { deployRegistry, opaqueCompanyId, snapshotDocuments } from '../api/src/trustchain.ts'

it('mines, enforces and resets the registry on a local Hardhat node', async () => {
  const cwd = fileURLToPath(new URL('../chain/', import.meta.url))
  const cli = fileURLToPath(new URL('../node_modules/hardhat/dist/src/cli.js', import.meta.url))
  const port = 18545
  const local = 'http://127.0.0.1:' + port
  const node = spawn(process.execPath, [cli, 'node', '--hostname', '127.0.0.1', '--port', String(port)], { cwd, stdio: 'ignore', windowsHide: true })
  let registry: Awaited<ReturnType<typeof deployRegistry>> | undefined
  let server: Awaited<ReturnType<typeof buildServer>> | undefined
  try {
    for (let attempt = 0; ; attempt++) {
      if (node.exitCode !== null || attempt > 80) throw new Error('Hardhat test node did not become ready.')
      try {
        const response = await fetch(local, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }) })
        if ((await response.json()).result === '0x7a69') break
      } catch (error) {
        if ((error as Error & { cause?: { code?: string } }).cause?.code === 'EACCES') throw error
      }
      await delay(100)
    }
    registry = await deployRegistry(local)
    const id = opaqueCompanyId()
    const commitment = snapshotDocuments(['authorization']).commitment
    const intruder = new Contract(await registry.registry.getAddress(), registry.artifact.abi, await registry.provider.getSigner(1))
    await expect(intruder.getFunction('register')(id, commitment)).rejects.toThrow()
    await expect(registry.change(id, 'suspend')).rejects.toThrow()
    const transaction = await registry.change(id, 'verify', commitment)
    await expect(registry.change(id, 'verify', commitment)).rejects.toThrow()
    await expect(intruder.getFunction('changeStatus')(id, 2)).rejects.toThrow()
    await registry.change(id, 'suspend')
    await registry.change(id, 'reinstate')
    await registry.change(id, 'revoke')
    await expect(registry.change(id, 'reinstate')).rejects.toThrow()
    const record = await registry.read(id)
    expect(record?.history.map(event => event.status)).toEqual(['Verified', 'Suspended', 'Verified', 'Revoked'])
    expect(record?.history.map(event => event.version)).toEqual([1, 2, 3, 4])
    expect(record?.history[0].transactionHash).toEqual(transaction)
    expect(record?.history.every(event => event.commitment === commitment && event.verifier === record.verifier)).toBe(true)

    server = await buildServer({ registry })
    async function login(role: string) {
      const response = await server!.inject({ method: 'POST', url: '/api/auth/sign-in', payload: { role } })
      return { authorization: 'Bearer ' + response.json().token }
    }
    async function post(url: string, headers: { authorization: string }, payload: unknown = {}) {
      return server!.inject({ method: 'POST', url, headers, payload: payload as object })
    }
    let admin = await login('admin')
    let hr = await login('hr')
    let applicant = await login('applicant')
    const vacancy = (await server.inject({ url: '/api/vacancy', headers: applicant })).json()
    const endpoint = '/api/companies/' + vacancy.companyId + '/status'
    expect((await post(endpoint, hr, { action: 'verify' })).statusCode).toBe(403)
    const application = (await post('/api/applications', applicant)).json()
    expect((await post(endpoint, admin, { action: 'suspend' })).statusCode).toBe(200)
    expect((await server.inject({ url: '/api/vacancy', headers: applicant })).json().status).toBe('Paused')
    expect((await post('/api/applications/' + application.id + '/run', applicant, { consent: true, allowance: 1 })).statusCode).toBe(409)
    expect((await post(endpoint, admin, { action: 'reinstate' })).statusCode).toBe(200)
    expect((await server.inject({ url: '/api/vacancy', headers: applicant })).json().status).toBe('Open')
    const run = (await post('/api/applications/' + application.id + '/run', applicant, { consent: true, allowance: 1 })).json()
    expect(run.id).toBeTruthy()
    expect((await post(endpoint, admin, { action: 'suspend' })).statusCode).toBe(200)
    expect((await post('/api/runs/' + run.id + '/finish', applicant)).statusCode).toBe(200)
    expect((await post('/api/applications/' + application.id + '/decision', hr, { outcome: 'Hire', feedback: 'Feedback' })).statusCode).toBe(409)
    for (let attempt = 0; attempt < 2; attempt++) {
      expect((await post('/api/demo/reset', admin)).statusCode).toBe(200)
      expect((await post('/api/applications', applicant)).statusCode).toBe(401)
      admin = await login('admin')
      applicant = await login('applicant')
      hr = await login('hr')
      const restored = await registry.read(vacancy.companyId)
      expect(restored?.status).toBe('Verified')
      expect(restored?.history).toHaveLength(1)
    }
    node.kill()
    await once(node, 'exit')
    expect((await post('/api/vacancy', hr, { level: 1 })).statusCode).toBe(503)
  } finally {
    await server?.close()
    registry?.provider.destroy()
    if (node.exitCode === null && node.signalCode === null) node.kill()
  }
}, 35_000)
