import type { Chain } from '@/types';

export const NATIVE_TOKENS = ['ETH', 'MATIC', 'OP', 'BNB', 'AVAX', 'FTM', 'ONE', 'CELO', 'XDAI'];
export const chains = [
  'ethereum',
  'polygon',
  'optimism',
  'arbitrum',
  'xdai',
  'bsc',
  'avax',
  'fantom',
  'harmony',
  'celo',
] as const;

const actualSource = 'https://github.com/llamafolio/llamafolio-tokens';

export const invalidResponse = {
  chain: {
    success: false,
    data: `Invalid chain. See available chains here: ${actualSource}`,
  },
  token: {
    success: false,
    data: `Invalid token. See available tokens here: ${actualSource}`,
  },
};

export const getTokenListURL = (chain: Chain) =>
  `https://raw.githubusercontent.com/llamafolio/llamafolio-tokens/master/${chain}/tokenlist.json`;
