/**
 * 환경 변수 기반 설정 관리
 * 하드코딩된 설정값들을 환경 변수로 관리
 */

// 환경 변수 타입 정의
interface AppConfig {
	// API 설정
	API_BASE_URL: string
	API_TIMEOUT: number
	API_RETRY_COUNT: number

	// 애플리케이션 설정
	APP_NAME: string
	APP_VERSION: string
	APP_ENV: 'development' | 'production' | 'test'

	// 인증 설정
	AUTH_TOKEN_EXPIRY: number
	AUTH_REFRESH_TOKEN_EXPIRY: number

	// UI 설정
	MAX_TABS: number
	DEFAULT_THEME: 'light' | 'dark'

	// 로깅 설정
	LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
	ENABLE_CONSOLE_LOG: boolean

	// 성능 설정
	ENABLE_CACHE: boolean
	CACHE_TTL: number

	// 보안 설정
	ENABLE_CSRF_PROTECTION: boolean
	SESSION_SECURE: boolean
}

// 기본 설정값
const defaultConfig: AppConfig = {
	// API 설정
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
	API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
	API_RETRY_COUNT: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),

	// 애플리케이션 설정
	APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BIST_NEW',
	APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
	APP_ENV:
		(process.env.NEXT_PUBLIC_APP_ENV as AppConfig['APP_ENV']) || 'development',

	// 인증 설정
	AUTH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_TOKEN_EXPIRY || '3600000'
	), // 1시간
	AUTH_REFRESH_TOKEN_EXPIRY: parseInt(
		process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_EXPIRY || '2592000000'
	), // 30일

	// UI 설정
	MAX_TABS: parseInt(process.env.NEXT_PUBLIC_MAX_TABS || '5'),
	DEFAULT_THEME:
		(process.env.NEXT_PUBLIC_DEFAULT_THEME as AppConfig['DEFAULT_THEME']) ||
		'light',

	// 로깅 설정
	LOG_LEVEL:
		(process.env.NEXT_PUBLIC_LOG_LEVEL as AppConfig['LOG_LEVEL']) || 'info',
	ENABLE_CONSOLE_LOG: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOG === 'true',

	// 성능 설정
	ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
	CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5분

	// 보안 설정
	ENABLE_CSRF_PROTECTION:
		process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION !== 'false',
	SESSION_SECURE: process.env.NEXT_PUBLIC_SESSION_SECURE === 'true',
}

// 설정 객체 생성
export const config: AppConfig = {
	...defaultConfig,
}

// 환경별 설정 오버라이드
if (config.APP_ENV === 'production') {
	config.ENABLE_CONSOLE_LOG = false
	config.LOG_LEVEL = 'warn'
	config.SESSION_SECURE = true
}

if (config.APP_ENV === 'test') {
	config.API_TIMEOUT = 5000
	config.ENABLE_CACHE = false
}

// 설정 유효성 검증
export const validateConfig = (): void => {
	const requiredFields: (keyof AppConfig)[] = ['API_BASE_URL', 'APP_NAME']

	for (const field of requiredFields) {
		if (!config[field]) {
			throw new Error(`필수 설정값이 누락되었습니다: ${field}`)
		}
	}

	if (config.MAX_TABS < 1 || config.MAX_TABS > 10) {
		throw new Error('MAX_TABS는 1-10 사이의 값이어야 합니다.')
	}

	if (config.API_TIMEOUT < 1000 || config.API_TIMEOUT > 60000) {
		throw new Error('API_TIMEOUT은 1000-60000ms 사이의 값이어야 합니다.')
	}
}

// 개발 환경에서만 설정 로깅
if (config.APP_ENV === 'development') {
	console.log('🔧 애플리케이션 설정:', config)
}

// 설정 내보내기
export default config
