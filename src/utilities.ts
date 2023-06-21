import { Buffer } from 'node:buffer'

/**
 * Used to get SQL statement size to stay below limit
 * @cloudflare D1 limit is 100KB
 */
export function stringSize(str: string) {
  return Buffer.byteLength(str, 'utf8')
}

export function arrayToChunks<T>(array: Array<T>, size: number): Array<Array<T>> {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const prepend$ToKeys = <T>(parameter: T) =>
  Object.fromEntries(Object.entries(parameter).map(([key, value]) => [`$${key}`, value]))
