// ?�스??코드 ?�??
export interface SystemCode {
	codeId: string
	codeName: string
	codeValue: string
	description?: string
	sortOrder: number
	isActive: boolean
	createdAt: string
	updatedAt: string
}

// ?�급�??��? ?�??
export interface PriceGrade {
	gradeId: string
	gradeName: string
	unitPrice: number
	currency: string
	effectiveDate: string
	expiryDate?: string
	description?: string
	isActive: boolean
}

// 검??결과 ?�??
export interface SearchResult {
	id: string
	name: string
	code?: string
	description?: string
}


