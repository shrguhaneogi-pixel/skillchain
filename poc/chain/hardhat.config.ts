import { defineConfig } from 'hardhat/config'

export default defineConfig({
  solidity: { version: '0.8.39', settings: { evmVersion: 'osaka' } },
  networks: {
    hardhatMainnet: { type: 'edr-simulated', chainType: 'l1', chainId: 31337, hardfork: 'osaka' },
  },
})
