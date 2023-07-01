import type { RPC_Response } from '#/types'

export async function jsonRpcFetch<T, Y>({
  url,
  method,
  params,
}: { url: string; method: string; params: T[] }) {
  // generic json rpc fetch
  const response = await fetch(url, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: Array.isArray(params)
      ? JSON.stringify(params.map((params) => ({ jsonrpc: '2.0', method, params, id: 1 })))
      : JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  })
  if (!response.ok) throw new Error('invalid response')
  const data = await response.json<RPC_Response<Y>[]>()
  if (Array.isArray(data) && data.some((datum) => datum.error)) throw new Error('invalid response')
  return data.map((datum: typeof data[0]) => datum.result) //: data.result
}
