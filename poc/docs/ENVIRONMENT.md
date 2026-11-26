# Environment preflight

Windows reported Node 24.19.0, npm 11.17.0, and Git 2.56.1.windows.1. No listener was reported on the demo ports 4310, 5173, and 8545 before startup. The existing workspace had React, Vite, Zod, Vitest, Playwright, and TypeScript but lacked Fastify, ethers, Hardhat, solc, and OpenZeppelin.

The sandboxed registry check returned `ENOTFOUND registry.npmjs.org`. The approved network check reached the official registry. We queried `npm view` for version, engines, and peer dependencies for the selections below. `npm install` created the lockfile, and `npm ls --depth=0 --workspaces --include-workspace-root` confirmed the installed versions.

| Package | Resolved version | Relevant engine or peer result |
|---|---|---|
| react | 19.3.1 | Node ≥0.10 |
| react-dom | 19.3.1 | React ^19.3.1 |
| @types/react | 19.3.0 | No peers reported |
| @types/react-dom | 19.3.0 | @types/react ^19.3.0 |
| @types/node | 24.19.4 | No peers reported |
| vite | 8.4.0 | Node ^20.19 or ≥22.12. Installed Node and Node types satisfy the range. |
| typescript | 6.0.3 | Node ≥14.17 |
| fastify | 5.12.8 | No engines or peers reported by the registry query |
| zod | 4.6.7 | No engines or peers reported by the registry query |
| hardhat | 3.22.0 | No engines or peers reported by the registry query |
| ethers | 6.17.0 | Node ≥14 |
| solc | 0.8.39 | Node ≥16 |
| @openzeppelin/contracts | 5.7.0 | No engines or peers reported by the registry query |
| vitest | 5.1.2 | Node ^22.12, ^24 or ≥26. Vite ^6.4, ^7 or ^8. |
| @playwright/test | 1.65.1 | Node ≥20 |
| @fontsource/spectral | 5.3.0 | No engines or peers reported by the registry query |
| @fontsource-variable/source-sans-3 | 5.3.1 | No engines or peers reported by the registry query |
| @fontsource/ibm-plex-mono | 5.3.0 | No engines or peers reported by the registry query |

The desktop sandbox can also deny local connections with `EACCES`. When needed, run the local browser and blockchain checks in a terminal that can access loopback. The app does not need an internet connection after installation.

The workspace overrides Solidity’s `tmp` dependency to 0.2.7 for [GHSA-7c78-jf6q-g5cm](https://github.com/advisories/GHSA-7c78-jf6q-g5cm). The latest stable Hardhat 3 release available during the audit still uses Zod 3, which npm flags under [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The API has its own patched Zod 4 dependency. Hardhat remains a local-only development tool on loopback.
