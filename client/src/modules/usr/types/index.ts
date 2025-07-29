// ?¬ìš©???€??
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

// ?¬ìš©??ê¶Œí•œ ?€??
export interface UserRole {
	roleId: string
	roleName: string
	permissions: string[]
	description?: string
}

// ?¬ìš©??ê²€??ì¡°ê±´ ?€??
export interface UserSearchCriteria {
	username?: string
	name?: string
	email?: string
	department?: string
	role?: string
	status?: string
}


