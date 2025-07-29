// ?�용???�??
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

// ?�용??권한 ?�??
export interface UserRole {
	roleId: string
	roleName: string
	permissions: string[]
	description?: string
}

// ?�용??검??조건 ?�??
export interface UserSearchCriteria {
	username?: string
	name?: string
	email?: string
	department?: string
	role?: string
	status?: string
}


