declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test'
		PORT: string
		RAILWAY_ENVIRONMENT: string
		TOKEN_LIST_URLS: string
	}
}
