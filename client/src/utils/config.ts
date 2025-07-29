/**
 * ?๊ฒฝ ๋ณ€??๊ธฐ๋ฐ ?ค์ • ๊ด€๋ฆ?
 * ?๋“์ฝ”๋”ฉ???ค์ •๊ฐ’๋“ค???๊ฒฝ ๋ณ€?๋ก ๊ด€๋ฆ?
 */

// ?๊ฒฝ ๋ณ€???€???•์
interface AppConfig {
	// API ?ค์ •
	API_BASE_URL: string
	API_TIMEOUT: number
	API_RETRY_COUNT: number

	// ? ํ”๋ฆฌ์??ด์… ?ค์ •
	APP_NAME: string
	APP_VERSION: string
	APP_ENV: 'development' | 'production' | 'test'

	// ?ธ์ฆ ?ค์ •
	AUTH_TOKEN_EXPIRY: number
	AUTH_REFRESH_TOKEN_EXPIRY: number

	// UI ?ค์ •
	MAX_TABS: number
	DEFAULT_THEME: 'light' | 'dark'

	// ๋ก๊น… ?ค์ •
	LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
	ENABLE_CONSOLE_LOG: boolean

	// ?ฑ๋ฅ ?ค์ •
	ENABLE_CACHE: boolean
	CACHE_TTL: number

	// ๋ณด์• ?ค์ •
	ENABLE_CSRF_PROTECTION: boolean
	SESSION_SECURE: boolean
}

// ๊ธฐ๋ณธ ?ค์ •๊ฐ?
const defaultConfig: AppConfig = {
	// API ?ค์ •
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
	API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
	API_RETRY_COUNT: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),

	// ? ํ”๋ฆฌ์??ด์… ?ค์ •
	APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BIST_NEW',
	APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
	APP_ENV:
		(process.env.NEXT_PUBLIC_APP_ENV as AppConfig['APP_ENV']) || 'development',

	// ?ธ์ฆ ?ค์ •
	AUTH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_TOKEN_EXPIRY || '3600000'
	), // 1?๊ฐ
	AUTH_REFRESH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_EXPIRY || '2592000000'
	), // 30??

	// UI ?ค์ •
	MAX_TABS: parseInt(process.env.NEXT_PUBLIC_MAX_TABS || '5'),
	DEFAULT_THEME:
		(process.env.NEXT_PUBLIC_DEFAULT_THEME as AppConfig['DEFAULT_THEME']) ||
		'light',

	// ๋ก๊น… ?ค์ •
	LOG_LEVEL:
		(process.env.NEXT_PUBLIC_LOG_LEVEL as AppConfig['LOG_LEVEL']) || 'info',
	ENABLE_CONSOLE_LOG: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOG === 'true',

	// ?ฑ๋ฅ ?ค์ •
	ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
	CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5๋ถ?

	// ๋ณด์• ?ค์ •
	ENABLE_CSRF_PROTECTION:
		process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION !== 'false',
	SESSION_SECURE: process.env.NEXT_PUBLIC_SESSION_SECURE === 'true',
}

// ?ค์ • ๊ฐ์ฒด ?์ฑ
export const config: AppConfig = {
	...defaultConfig,
}

// ?๊ฒฝ๋ณ??ค์ • ?ค๋ฒ?ผ์ด??
if (config.APP_ENV === 'production') {
	config.ENABLE_CONSOLE_LOG = false
	config.LOG_LEVEL = 'warn'
	config.SESSION_SECURE = true
}

if (config.APP_ENV === 'test') {
	config.API_TIMEOUT = 5000
	config.ENABLE_CACHE = false
}

// ?ค์ • ? ํจ??๊ฒ€์ฆ?
export const validateConfig = (): void => {
	const requiredFields: (keyof AppConfig)[] = ['API_BASE_URL', 'APP_NAME']

	for (const field of requiredFields) {
		if (!config[field]) {
			throw new Error(`?์ ?ค์ •๊ฐ’์ด ?๋ฝ?์—?ต๋?? ${field}`)
		}
	}

	if (config.MAX_TABS < 1 || config.MAX_TABS > 10) {
		throw new Error('MAX_TABS??1-10 ?ฌ์ด??๊ฐ’์ด?ด์•ผ ?ฉ๋??')
	}

	if (config.API_TIMEOUT < 1000 || config.API_TIMEOUT > 60000) {
		throw new Error('API_TIMEOUT?€ 1000-60000ms ?ฌ์ด??๊ฐ’์ด?ด์•ผ ?ฉ๋??')
	}
}

// ๊ฐ๋ฐ ?๊ฒฝ?์๋ง??ค์ • ๋ก๊น…
if (config.APP_ENV === 'development') {
	console.log('?”ง ? ํ”๋ฆฌ์??ด์… ?ค์ •:', config)
}

// ?ค์ • ?ด๋ณด?ด๊ธฐ
export default config


