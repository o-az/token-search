export * from './fetchers.js'
import { chains } from '#/constants'
import type { Chain } from '#/types'
import { Buffer } from 'node:buffer'

export const apiKey = (key: keyof Env, env?: Env) =>
  env?.[key] ? env[key] : process.env[key] ? process.env[key] : ''

export const isChain = (chain: string): chain is Chain => chain in chains

export function sleep(milliseconds: number): void {
  typeof Atomics === 'undefined'
    ? new Promise((resolve) => setTimeout(resolve, milliseconds))
    : Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Math.max(1, milliseconds | 0))
}

export const isSettled = <T>(
  promise: PromiseSettledResult<T>
): promise is PromiseFulfilledResult<T> => promise.status === 'fulfilled'

export const isRejected = <T>(promise: PromiseSettledResult<T>): promise is PromiseRejectedResult =>
  promise.status === 'rejected'

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
