// ?�사 기본 ?�보 ?�??
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

// ?�사 ?�세 ?�보 ?�??
export interface PersonnelDetail extends Personnel {
	address: string
	emergencyContact: string
	emergencyPhone: string
	education: string
	skills: string[]
	certifications: string[]
	workHistory: WorkHistory[]
}

// 근무 ?�력 ?�??
export interface WorkHistory {
	id: string
	company: string
	position: string
	startDate: string
	endDate?: string
	description: string
}

// ?�사 검??조건 ?�??
export interface PersonnelSearchCriteria {
	name?: string
	department?: string
	position?: string
	status?: string
	hireDateFrom?: string
	hireDateTo?: string
}


