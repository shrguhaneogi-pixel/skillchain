import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = new URL('../', import.meta.url)
const children = []
let stopping = false
const fixture = process.argv.includes('--fixture')
const apiOnly = process.argv.includes('--api-only')

function stop(code) {
  if (stopping) return
  stopping = true
  for (const child of [...children].reverse()) child.kill()
  process.exitCode = code
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))

function launch(label, filepath, args = [], cwd = root, env = process.env) {
  const child = spawn(process.execPath, [fileURLToPath(new URL(filepath, root)), ...args], {
    cwd: fileURLToPath(cwd), env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  })
  children.push(child)
  if (label === 'chain') child.stdout.resume()
  else child.stdout.on('data', chunk => process.stdout.write(`[${label}] ${chunk}`))
  child.stderr.on('data', chunk => process.stderr.write(`[${label}] ${chunk}`))
  child.once('error', error => { console.error(error.message); stop(1) })
  child.once('exit', code => {
    if (!stopping) { console.error(`${label} exited with code ${code}`); stop(1) }
  })
}

async function waitFor(url, options, ready = response => response.ok) {
  let lastError
  for (let attempt = 0; attempt < 120 && !stopping; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(750) })
      if (await ready(response)) return
    } catch (error) {
      lastError = error.cause ?? error
      if (lastError.code === 'EACCES') throw lastError
    }
    await delay(250)
  }
  throw new Error(`Readiness failed for ${url}${lastError ? ': ' + lastError.message : ''}`)
}

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const check = createServer()
    check.once('error', error => reject(new Error(`Port ${port} is unavailable: ${error.message}`)))
    check.listen(port, '127.0.0.1', () => check.close(resolve))
  })
}

try {
  await Promise.all([checkPort(4310), ...fixture ? [] : [checkPort(8545)], ...apiOnly ? [] : [checkPort(5173)]])
  if (!fixture) {
    launch('chain', 'node_modules/hardhat/dist/src/cli.js', ['node', '--hostname', '127.0.0.1', '--port', '8545'], new URL('chain/', root))
    await waitFor('http://127.0.0.1:8545', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }),
    }, async response => response.ok && (await response.json()).result === '0x7a69')
    console.log('Hardhat development chain ready on loopback')
  }
  launch('api', 'api/src/server.ts', [], root, { ...process.env, SKILLCHAIN_FIXTURE: fixture ? '1' : '0' })
  await waitFor('http://127.0.0.1:4310/api/health')
  if (!apiOnly) {
    launch('web', 'node_modules/vite/bin/vite.js', ['web'])
    await waitFor('http://127.0.0.1:5173/api/health')
    console.log('SkillChain is ready at http://127.0.0.1:5173')
  }
} catch (error) {
  if (!stopping) { console.error(error.message); stop(1) }
}
