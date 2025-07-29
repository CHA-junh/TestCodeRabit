// 인사 기본 정보 타입
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

// 인사 상세 정보 타입
export interface PersonnelDetail extends Personnel {
	address: string
	emergencyContact: string
	emergencyPhone: string
	education: string
	skills: string[]
	certifications: string[]
	workHistory: WorkHistory[]
}

// 근무 이력 타입
export interface WorkHistory {
	id: string
	company: string
	position: string
	startDate: string
	endDate?: string
	description: string
}

// 인사 검색 조건 타입
export interface PersonnelSearchCriteria {
	name?: string
	department?: string
	position?: string
	status?: string
	hireDateFrom?: string
	hireDateTo?: string
}
