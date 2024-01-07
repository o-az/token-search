import type { Chain } from '#/types'
import { apiKey, jsonRpcFetch } from '#/utilities'

export async function ankrGetPrice(chain: Chain, addresses?: string[]) {
  const result = await jsonRpcFetch<
    { blockchain: string; address: string },
    {
      usdPrice: string
      blockchain: string
      contractAddress: string
    }[]
  >({
    url: `https://rpc.ankr.com/multichain/${apiKey('ANKR_API_KEY')}/?ankr_getPrice=`,
    method: 'ankr_getTokenPrice',
    params: addresses.map(address => ({
      blockchain: chain === 'ethereum' ? 'eth' : chain,
      address
    }))
  })
  return result
}

type AnkrTokenType = {
  blockchain: string
  address: string
  name: string
  decimals: number
  symbol: string
  thumbnail: string
}

async function getAnkrTokens(chain: Chain) {
  const result = await jsonRpcFetch<{ blockchain: string }, { currencies: AnkrTokenType[] }>({
    url: `https://rpc.ankr.com/multichain/${apiKey('ANKR_API_KEY')}/?ankr_getCurrencies=`,
    method: 'ankr_getCurrencies',
    params: [
      {
        blockchain: chain === 'ethereum' ? 'eth' : chain
      }
    ]
  })
  return result
}
