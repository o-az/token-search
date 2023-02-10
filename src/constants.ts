// would probably want to have this in a .env file. Skipping for the sake of this demo
export const TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/llamafolio/llamafolio-tokens/master/ethereum/tokenlist.json';

export const NATIVE_TOKENS = ['ETH', 'MATIC', 'OP', 'BNB'] as const;

export const chains = ['ethereum', 'polygon', 'optimism', 'arbitrum'] as const;
