declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: string
    TOKEN_LIST_URLS: string
    // Cloudflare Workers default environment variables
    CLOUDFLARE_API_BASE_URL: string
    ANKR_API_KEY: string
  }
}
