// ?∏ÏÇ¨ Í∏∞Î≥∏ ?ïÎ≥¥ ?Ä??
export interface Personnel {
	employeeId: string
	name: string
	email: string
	phone: string
	department: string
	position: string
	hireDate: string
	status: 'active' | 'inactive' | 'retired'
	salary: number
	managerId?: string
	createdAt: string
	updatedAt: string
}

// ?∏ÏÇ¨ ?ÅÏÑ∏ ?ïÎ≥¥ ?Ä??
export interface PersonnelDetail extends Personnel {
	address: string
	emergencyContact: string
	emergencyPhone: string
	education: string
	skills: string[]
	certifications: string[]
	workHistory: WorkHistory[]
}

// Í∑ºÎ¨¥ ?¥Î†• ?Ä??
export interface WorkHistory {
	id: string
	company: string
	position: string
	startDate: string
	endDate?: string
	description: string
}

// ?∏ÏÇ¨ Í≤Ä??Ï°∞Í±¥ ?Ä??
export interface PersonnelSearchCriteria {
	name?: string
	department?: string
	position?: string
	status?: string
	hireDateFrom?: string
	hireDateTo?: string
}


