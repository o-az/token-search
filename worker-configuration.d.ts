interface Env {
  NODE_ENV: 'development' | 'production' | 'test'
  API_KEY: string
  DB: D1Database
  TOKEN_LIST_URLS: string
  CLOUDFLARE_API_BASE_URL: string
  ANKR_API_KEY: string
}
