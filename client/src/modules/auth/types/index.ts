// 로그인 요청 타입
export interface LoginRequest {
	empNo: string
	password: string
}

// GW 인증 응답 타입
export interface GWAuthResponse {
	jsonMessage: {
		message: string
		result: 'success' | 'fail'
		message_cd: string
	}
}

// 사용자 정보 타입
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
	// 클라이언트 호환성을 위한 별칭
	empNo?: string
	name?: string
	department?: string
	position?: string
	role?: string
	permissions?: string[]
	lastLoginAt?: string
	needsPasswordChange?: boolean
	menuList?: any[] // 권한 기반 메뉴 리스트
	programList?: any[] // 권한 기반 프로그램 리스트
}

// 로그인 응답 타입
export interface LoginResponse {
	success: boolean
	message: string
	user?: UserInfo
	token?: string
}

// 세션 정보 타입
export interface SessionInfo {
	isAuthenticated: boolean
	user?: UserInfo
	token?: string
	expiresAt?: number
	menuList?: any[] // 권한 기반 메뉴 리스트
	programList?: any[] // 권한 기반 프로그램 리스트
}
