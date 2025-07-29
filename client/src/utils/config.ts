/**
 * ?�경 변??기반 ?�정 관�?
 * ?�드코딩???�정값들???�경 변?�로 관�?
 */

// ?�경 변???�???�의
interface AppConfig {
	// API ?�정
	API_BASE_URL: string
	API_TIMEOUT: number
	API_RETRY_COUNT: number

	// ?�플리�??�션 ?�정
	APP_NAME: string
	APP_VERSION: string
	APP_ENV: 'development' | 'production' | 'test'

	// ?�증 ?�정
	AUTH_TOKEN_EXPIRY: number
	AUTH_REFRESH_TOKEN_EXPIRY: number

	// UI ?�정
	MAX_TABS: number
	DEFAULT_THEME: 'light' | 'dark'

	// 로깅 ?�정
	LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
	ENABLE_CONSOLE_LOG: boolean

	// ?�능 ?�정
	ENABLE_CACHE: boolean
	CACHE_TTL: number

	// 보안 ?�정
	ENABLE_CSRF_PROTECTION: boolean
	SESSION_SECURE: boolean
}

// 기본 ?�정�?
const defaultConfig: AppConfig = {
	// API ?�정
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
	API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
	API_RETRY_COUNT: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),

	// ?�플리�??�션 ?�정
	APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BIST_NEW',
	APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
	APP_ENV:
		(process.env.NEXT_PUBLIC_APP_ENV as AppConfig['APP_ENV']) || 'development',

	// ?�증 ?�정
	AUTH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_TOKEN_EXPIRY || '3600000'
	), // 1?�간
	AUTH_REFRESH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_EXPIRY || '2592000000'
	), // 30??

	// UI ?�정
	MAX_TABS: parseInt(process.env.NEXT_PUBLIC_MAX_TABS || '5'),
	DEFAULT_THEME:
		(process.env.NEXT_PUBLIC_DEFAULT_THEME as AppConfig['DEFAULT_THEME']) ||
		'light',

	// 로깅 ?�정
	LOG_LEVEL:
		(process.env.NEXT_PUBLIC_LOG_LEVEL as AppConfig['LOG_LEVEL']) || 'info',
	ENABLE_CONSOLE_LOG: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOG === 'true',

	// ?�능 ?�정
	ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
	CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5�?

	// 보안 ?�정
	ENABLE_CSRF_PROTECTION:
		process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION !== 'false',
	SESSION_SECURE: process.env.NEXT_PUBLIC_SESSION_SECURE === 'true',
}

// ?�정 객체 ?�성
export const config: AppConfig = {
	...defaultConfig,
}

// ?�경�??�정 ?�버?�이??
if (config.APP_ENV === 'production') {
	config.ENABLE_CONSOLE_LOG = false
	config.LOG_LEVEL = 'warn'
	config.SESSION_SECURE = true
}

if (config.APP_ENV === 'test') {
	config.API_TIMEOUT = 5000
	config.ENABLE_CACHE = false
}

// ?�정 ?�효??검�?
export const validateConfig = (): void => {
	const requiredFields: (keyof AppConfig)[] = ['API_BASE_URL', 'APP_NAME']

	for (const field of requiredFields) {
		if (!config[field]) {
			throw new Error(`?�수 ?�정값이 ?�락?�었?�니?? ${field}`)
		}
	}

	if (config.MAX_TABS < 1 || config.MAX_TABS > 10) {
		throw new Error('MAX_TABS??1-10 ?�이??값이?�야 ?�니??')
	}

	if (config.API_TIMEOUT < 1000 || config.API_TIMEOUT > 60000) {
		throw new Error('API_TIMEOUT?� 1000-60000ms ?�이??값이?�야 ?�니??')
	}
}

// 개발 ?�경?�서�??�정 로깅
if (config.APP_ENV === 'development') {
	console.log('?�� ?�플리�??�션 ?�정:', config)
}

// ?�정 ?�보?�기
export default config


