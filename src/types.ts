export type AppEnv = Pretty<Env>

export interface Token {
  address: string
  name: string
  symbol: string
  chainId: number
  decimals: number
  logoURI: string
}

export type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

export type Truthy<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends undefined | null ? never : K
  }[keyof T]
>

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// XOR - One or the other, but not both
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

// AtLeastOnePropertyOf - One or more of the properties
export type AtLeastOnePropertyOf<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Record<Exclude<keyof T, K>, undefined>> extends infer U
    ? { [P in keyof U]: U[P] }
    : never
}[keyof T]

export type Chain =
  | 'gnosis'
  | 'goerli'
  | 'polygon'
  | 'optimism'
  | 'optimismGoerli'
  | 'ethereum'
  | 'celo'
  | 'moonbeam'
  | 'avalanche'
  | 'fantom'
  | 'bsc'
  | 'aurora'
  | 'arbitrum'
  | 'harmony'
  | 'baseGoerli'

export type UnsupportedChain =
  /**
   * but soon
   */
  | 'sepolia'
  | 'polygonMumbai'
  | 'moonriver'
  | 'evmos'
  | 'avalancheFuji'
  | 'fantomTestnet'
  | 'centoTestnet'
  | 'arbitrumNova'
  | 'bitorrnet'
  | 'cento'
  | 'arbitrumGoerli'

export type AlmostAny =
  | string
  | number
  | bigint
  | boolean
  | Uint8Array
  | Int8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | Record<string, never>
