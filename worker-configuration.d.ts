interface Env {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: string
  DB: D1Database
  TOKEN_LIST_URLS: string
  CLOUDFLARE_API_BASE_URL: string
}
