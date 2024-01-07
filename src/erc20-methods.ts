import { chains } from '#/constants'
import type { Chain, RPC_Response } from '#/types'
import { apiKey } from '#/utilities'

export async function erc20Method({
  chain,
  address,
  method,
  env
}: {
  chain: Chain
  address: string
  method: 'decimals' | 'symbol' | 'name' | 'totalSupply'
  env?: Env
}) {
  if (!(chain in chains)) throw new Error('invalid chain')
  if (!address) throw new Error('invalid address')

  const rpc = `https://rpc.ankr.com/${chain === 'ethereum' ? 'eth' : chain}/${apiKey(
    'ANKR_API_KEY',
    env
  )}`
  const response = await fetch(rpc, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: address,
          data: `0x${
            {
              balanceOf: '70a08231',
              decimals: '313ce567',
              symbol: '95d89b41',
              name: '06fdde03',
              totalSupply: '18160ddd'
            }[method]
          }`
        },
        'latest'
      ]
    })
  })
  const data = (await response.json()) as RPC_Response
  if (data.error) throw new Error(data.error.message)
  const { result } = data
  if (result === '0x') return '0'
  if (['decimals', 'totalSupply'].includes(method)) return parseInt(result, 16).toString()
  if (['symbol', 'name'].includes(method)) return Buffer.from(result.slice(2), 'hex').toString()
  throw new Error('invalid method')
}

// check if contract address has balanceOf method
export async function hasBalanceOf(chain: Chain, address: string, env?: Env) {
  const rpc = `https://rpc.ankr.com/${chain === 'ethereum' ? 'eth' : chain}/${apiKey(
    'ANKR_API_KEY',
    env
  )}`
  const response = await fetch(rpc, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: address,
          data: `0x70a08231`
        },
        'latest'
      ]
    })
  })
  const data = (await response.json()) as RPC_Response
  if (data.error) throw new Error(data.error.message)
  const { result } = data
  if (result === '0x') return false
  return true
}

// check if contracts have balanceOf method (for batch)
export async function hasBalanceOfBatch(chain: Chain, addresses: string[], env?: Env) {
  const rpc = `https://rpc.ankr.com/${chain === 'ethereum' ? 'eth' : chain}/${apiKey(
    'ANKR_API_KEY',
    env
  )}`
  const response = await fetch(rpc, {
    method: 'POST',
    body: JSON.stringify(
      addresses.map((address, index) => ({
        jsonrpc: '2.0',
        id: index + 1,
        method: 'eth_call',
        params: [
          {
            to: address,
            data: `0x70a08231`
          },
          'latest'
        ]
      }))
    )
  })
  const data = (await response.json()) as Array<RPC_Response>
  return data.map(({ result }) => (result === '0x' ? false : true))
}
