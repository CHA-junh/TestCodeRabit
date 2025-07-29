// 사용자 타입
export interface User {
	userId: string
	username: string
	email: string
	name: string
	department: string
	role: string
	status: 'active' | 'inactive' | 'locked'
	lastLoginAt?: string
	createdAt: string
	updatedAt: string
}

// 사용자 권한 타입
export interface UserRole {
	roleId: string
	roleName: string
	permissions: string[]
	description?: string
}

// 사용자 검색 조건 타입
export interface UserSearchCriteria {
	username?: string
	name?: string
	email?: string
	department?: string
	role?: string
	status?: string
}
