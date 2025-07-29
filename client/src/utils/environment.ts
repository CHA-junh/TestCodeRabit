/**
 * 환경별 시스템명 반환
 */
export function getSystemName(): string {
	// 1. 환경 변수 우선 확인 (가장 확실한 방법)
	const appEnv = process.env.NEXT_PUBLIC_APP_ENV
	if (appEnv) {
		switch (appEnv.toLowerCase()) {
			case 'development':
			case 'dev':
				return 'BIST (Dev)'
			case 'production':
			case 'prod':
				return 'BIST (Prod)'
			case 'local':
				return 'BIST (Local)'
		}
	}

	// 2. 호스트명 기반 확인 (localhost는 Local 환경)
	const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return 'BIST (Local)'
	}

	// 3. NODE_ENV 확인 (localhost가 아닌 경우)
	if (process.env.NODE_ENV === 'development') {
		return 'BIST (Dev)'
	}

	// 운영 환경 (기본값)
	return 'BIST (Prod)'
}

/**
 * 환경별 브라우저 탭 제목 반환
 */
export function getPageTitle(pageName?: string): string {
	const systemName = getSystemName()
	return pageName ? `${pageName} - ${systemName}` : systemName
}
