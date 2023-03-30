import { Database } from 'bun:sqlite'

export const database = Database.open('tokens.sqlite', { create: true, readwrite: true })
