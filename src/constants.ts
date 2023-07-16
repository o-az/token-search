import type { Chain, UnsupportedChain } from '#/types'

type Chains = Record<Chain, { name: string; id: number; currency: string; explorer: string }>
type UnsupportedChains = Record<UnsupportedChain, Chains[keyof Chains]>

export const chains = {
  ethereum: {
    name: 'Ethereum Mainnet',
    id: 1,
    currency: 'ETH',
    explorer: 'https://etherscan.io',
  },
  optimism: {
    name: 'Optimism Mainnet',
    id: 10,
    currency: 'ETH',
    explorer: 'https://optimistic.etherscan.io',
  },
  gnosis: {
    name: 'Gnosis Chain',
    id: 100,
    currency: 'xDai',
    explorer: 'https://gnosischain.com',
  },
  arbitrum: {
    name: 'Arbitrum One',
    id: 42_161,
    currency: 'ETH',
    explorer: 'https://arbiscan.io',
  },
  polygon: {
    name: 'Polygon (Matic) Mainnet',
    id: 137,
    currency: 'MATIC',
    explorer: 'https://explorer-mainnet.maticvigil.com',
  },
  celo: {
    name: 'Celo Mainnet',
    id: 42_220,
    currency: 'CELO',
    explorer: 'https://explorer.celo.org',
  },
  moonbeam: {
    name: 'Moonbeam',
    id: 1284,
    currency: 'GLMR',
    explorer: 'https://blockscout.moonbeam.network',
  },
  avalanche: {
    name: 'Avalanche Mainnet',
    id: 43_114,
    currency: 'AVAX',
    explorer: 'https://explorer.avax.network',
  },
  fantom: {
    name: 'Fantom Opera',
    id: 250,
    currency: 'FTM',
    explorer: 'https://ftmscan.com',
  },
  bsc: {
    name: 'Binance Smart Chain',
    id: 56,
    currency: 'BNB',
    explorer: 'https://bscscan.com',
  },
  harmony: {
    name: 'Harmony One',
    id: 1_666_600_000,
    currency: 'ONE',
    explorer: 'https://explorer.harmony.one',
  },
} as const satisfies Chains

export const unsupportedChains = {
  aurora: {
    name: 'Aurora',
    id: 1_313_161_554,
    currency: 'NEAR',
    explorer: 'https://explorer.aurora.dev',
  },
  goerli: {
    name: 'Görli Testnet',
    id: 5,
    currency: 'ETH',
    explorer: 'https://goerli.etherscan.io',
  },
  optimismGoerli: {
    name: 'Optimism Görli Testnet',
    id: 420,
    currency: 'ETH',
    explorer: 'https://goerli.optimism.io',
  },
  baseGoerli: {
    name: 'Base Görli Testnet',
    id: 84_531,
    currency: 'ETH',
    explorer: 'https://goerli.etherscan.io',
  },

  arbitrumNova: {
    name: 'Arbitrum Nova',
    id: 42_170,
    currency: 'ARB',
    explorer: 'https://explorer.arbitrum.io',
  },
  bitorrnet: {
    name: 'BitTorrent',
    id: 199,
    currency: 'BTT',
    explorer: 'https://bttcscan.com',
  },
  moonriver: {
    name: 'Moonriver',
    id: 1285,
    currency: 'MOVR',
    explorer: 'https://blockscout.moonriver.moonbeam.network',
  },
  evmos: {
    name: 'Evmos',
    id: 9001,
    currency: 'EVM',
    explorer: 'https://explorer.evmos.org',
  },
  cento: {
    name: 'Cento',
    id: 7700,
    currency: 'CENTO',
    explorer: 'https://explorer.cento.org',
  },
  sepolia: {
    name: 'Sepolia Testnet',
    id: 11_155_111,
    currency: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
  },
  polygonMumbai: {
    name: 'Polygon (Matic) Mumbai Testnet',
    id: 80_001,
    currency: 'MATIC',
    explorer: 'https://explorer-mumbai.maticvigil.com',
  },
  centoTestnet: {
    name: 'Cento Testnet',
    id: 740,
    currency: 'CENTO',
    explorer: 'https://testnet.explorer.cento.org',
  },
  avalancheFuji: {
    name: 'Avalanche Fuji Testnet',
    id: 43_113,
    currency: 'AVAX',
    explorer: 'https://explorer.fuji.avax.network',
  },
  fantomTestnet: {
    name: 'Fantom Testnet',
    id: 4002,
    currency: 'FTM',
    explorer: 'https://testnet.ftmscan.com',
  },
  arbitrumGoerli: {
    name: 'Arbitrum Görli Testnet',
    id: 421_613,
    currency: 'ETH',
    explorer: 'https://goerli.arbiscan.io',
  },
} satisfies UnsupportedChains

export const chainNames = Object.keys(chains) as Array<Chain>

export const invalidResponse = {
  chain: {
    success: false,
    data: `Invalid chain. Available chains: ${Object.keys(chains).join(', ')}`,
  },
  token: {
    success: false,
    data: 'Invalid token.',
  },
}
