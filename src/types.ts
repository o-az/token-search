import { type chains } from '@/constants';

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  coingeckoId: string | null;
  wallet: boolean;
  stable: boolean;
  native?: boolean;
}

export type Chain = (typeof chains)[number];
