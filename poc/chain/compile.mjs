import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import solc from 'solc'

const require = createRequire(import.meta.url)

export function compileRegistry() {
  const file = 'TrustChain.sol'
  const source = readFileSync(new URL('./contracts/TrustChain.sol', import.meta.url), 'utf8')
  const input = {
    language: 'Solidity',
    sources: { [file]: { content: source } },
    settings: {
      evmVersion: 'osaka',
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } },
    },
  }
  const output = JSON.parse(solc.compile(JSON.stringify(input), {
    import(path) {
      if (!path.startsWith('@openzeppelin/contracts/')) return { error: 'Unexpected Solidity import.' }
      return { contents: readFileSync(require.resolve(path), 'utf8') }
    },
  }))
  const errors = output.errors?.filter(error => error.severity === 'error') ?? []
  if (errors.length) throw new Error(errors.map(error => error.formattedMessage).join('\n'))
  const artifact = output.contracts[file].TrustChain
  return { abi: artifact.abi, bytecode: '0x' + artifact.evm.bytecode.object }
}
