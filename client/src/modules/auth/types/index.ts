// 로그???�청 ?�??
export interface LoginRequest {
	empNo: string
	password: string
}

// GW ?�증 ?�답 ?�??
export interface GWAuthResponse {
	jsonMessage: {
		message: string
		result: 'success' | 'fail'
		message_cd: string
	}
}

// ?�용???�보 ?�??
export interface UserInfo {
	userId: string
	userName?: string
	deptCd?: string
	deptNm?: string
	dutyCd?: string
	dutyNm?: string
	dutyDivCd?: string
	authCd?: string
	emailAddr?: string
	usrRoleId?: string
	// ?�라?�언???�환?�을 ?�한 별칭
	empNo?: string
	name?: string
	department?: string
	position?: string
	role?: string
	permissions?: string[]
	lastLoginAt?: string
	needsPasswordChange?: boolean
	menuList?: any[] // 권한 기반 메뉴 리스??
	programList?: any[] // 권한 기반 ?�로그램 리스??
}

// 로그???�답 ?�??
export interface LoginResponse {
	success: boolean
	message: string
	user?: UserInfo
	token?: string
}

// ?�션 ?�보 ?�??
export interface SessionInfo {
	isAuthenticated: boolean
	user?: UserInfo
	token?: string
	expiresAt?: number
	menuList?: any[] // 권한 기반 메뉴 리스??
	programList?: any[] // 권한 기반 ?�로그램 리스??
}


