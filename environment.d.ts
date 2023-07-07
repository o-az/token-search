interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: string
  ANKR_API_KEY: string
  TOKEN_LIST_URLS: string
}

// Cloudflare Workers
interface Env extends EnvironmentVariables {
  DB: D1Database
  CLOUDFLARE_API_BASE_URL: string
}

// Node.js
declare namespace NodeJS {
  type ProcessEnv = Env
}
