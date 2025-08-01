// ?¬μ©?????
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

// ?¬μ©??κΆν ???
export interface UserRole {
	roleId: string
	roleName: string
	permissions: string[]
	description?: string
}

// ?¬μ©??κ²??μ‘°κ±΄ ???
export interface UserSearchCriteria {
	username?: string
	name?: string
	email?: string
	department?: string
	role?: string
	status?: string
}


