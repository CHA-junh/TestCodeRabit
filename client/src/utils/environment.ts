/**
 * ?�경�??�스?�명 반환
 */
export function getSystemName(): string {
	// 1. ?�경 변???�선 ?�인 (가???�실??방법)
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

	// 2. ?�스?�명 기반 ?�인 (localhost??Local ?�경)
	const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return 'BIST (Local)'
	}

	// 3. NODE_ENV ?�인 (localhost가 ?�닌 경우)
	if (process.env.NODE_ENV === 'development') {
		return 'BIST (Dev)'
	}

	// ?�영 ?�경 (기본�?
	return 'BIST (Prod)'
}

/**
 * ?�경�?브라?��? ???�목 반환
 */
export function getPageTitle(pageName?: string): string {
	const systemName = getSystemName()
	return pageName ? `${pageName} - ${systemName}` : systemName
}



