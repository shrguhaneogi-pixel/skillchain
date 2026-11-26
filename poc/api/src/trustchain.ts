import { randomBytes } from 'node:crypto'
import { Contract, ContractFactory, EventLog, FetchRequest, JsonRpcProvider, Wallet, parseEther } from 'ethers'
import { compileRegistry } from '../../chain/compile.mjs'
import { sha256 } from './evidence.ts'
import documentFixtures from './documents.json' with { type: 'json' }

export const statuses = ['Unregistered', 'Verified', 'Suspended', 'Revoked'] as const
export type Status = typeof statuses[number]
export type Transition = 'verify' | 'suspend' | 'reinstate' | 'revoke'
export type DocumentId = keyof typeof documentFixtures
export type Snapshot = ReturnType<typeof snapshotDocuments>

export function snapshotDocuments(ids: DocumentId[], salt = randomBytes(32).toString('hex')) {
  const entries = [...new Set(ids)].sort().map(id => ({ id, bytes: Buffer.from(documentFixtures[id]) }))
  return { salt, entries, commitment: manifestCommitment(salt, entries) }
}

export function manifestCommitment(salt: string, entries: SnapshotEntry[]) {
  const documents = [...entries].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    .map(entry => ({ id: entry.id, sha256: sha256(entry.bytes) }))
  return '0x' + sha256(JSON.stringify({ schemaVersion: 1, salt, documents }))
}

type SnapshotEntry = { id: DocumentId; bytes: Uint8Array }

export function checkSnapshot(snapshot: Snapshot, altered: boolean, commitment: string) {
  const entries = snapshot.entries.map(entry => ({ id: entry.id, bytes: new Uint8Array(entry.bytes) }))
  if (altered && entries[0]?.bytes.length) entries[0].bytes[0] ^= 1
  const computed = manifestCommitment(snapshot.salt, entries)
  return { matches: computed === commitment, computed, commitment, variant: altered ? 'altered' : 'original' }
}

export function opaqueCompanyId() {
  return '0x' + randomBytes(32).toString('hex')
}

export async function deployRegistry(rpcUrl = 'http://127.0.0.1:8545') {
  const request = new FetchRequest(rpcUrl)
  request.timeout = 4_000
  const provider = new JsonRpcProvider(request, 31337, { cacheTimeout: -1, staticNetwork: true })
  if (await provider.send('eth_chainId', []) !== '0x7a69') throw new Error('SkillChain requires its local Hardhat chain.')
  const funder = await provider.getSigner(0)
  const signer = Wallet.createRandom().connect(provider)
  await (await funder.sendTransaction({ to: signer.address, value: parseEther('1') })).wait()
  const artifact = compileRegistry()
  const deployment = await new ContractFactory(artifact.abi, artifact.bytecode, signer).deploy(await signer.getAddress())
  const receipt = await deployment.deploymentTransaction()!.wait()
  const registry = new Contract(await deployment.getAddress(), artifact.abi, signer)
  let snapshot: string | undefined

  async function readStatus(id: string): Promise<Status> {
    const record = await registry.getFunction('records')(id)
    return statuses[Number(record.status)]
  }

  return {
    provider, registry, artifact,
    readStatus,
    async read(id: string) {
      const block = await provider.getBlockNumber()
      const record = await registry.getFunction('records')(id, { blockTag: block })
      const status = statuses[Number(record.status)]
      if (status === 'Unregistered') return
      const events = await registry.queryFilter(registry.getEvent('StatusChanged')(id), receipt!.blockNumber, block)
      const history = events.filter((event): event is EventLog => event instanceof EventLog).map(event => ({
        status: statuses[Number(event.args.status)], version: Number(event.args.version),
        commitment: String(event.args.commitment), verifier: String(event.args.verifier),
        timestamp: Number(event.args.timestamp), transactionHash: event.transactionHash,
      }))
      return {
        id, status, commitment: String(record.commitment), version: Number(record.version),
        verifier: String(record.verifier), timestamp: Number(record.timestamp),
        transactionHash: history.at(-1)?.transactionHash, history, network: 'Local Hardhat · 31337',
      }
    },
    async change(id: string, transition: Transition, commitment?: string) {
      const target = transition === 'suspend' ? 2 : transition === 'reinstate' ? 1 : 3
      const transaction = transition === 'verify'
        ? await registry.getFunction('register')(id, commitment)
        : await registry.getFunction('changeStatus')(id, target)
      const mined = await transaction.wait()
      return mined.hash as string
    },
    async captureBaseline() {
      snapshot = await provider.send('evm_snapshot', []) as string
    },
    async reset() {
      if (!snapshot || !await provider.send('evm_revert', [snapshot])) throw new Error('Could not restore the chain baseline.')
      snapshot = await provider.send('evm_snapshot', []) as string
    },
  }
}

export type Registry = Awaited<ReturnType<typeof deployRegistry>>
export type Verification = NonNullable<Awaited<ReturnType<Registry['read']>>>
