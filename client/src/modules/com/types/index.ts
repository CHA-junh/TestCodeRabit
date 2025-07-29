// 시스템 코드 타입
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

// 등급별 단가 타입
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

// 검색 결과 타입
export interface SearchResult {
	id: string
	name: string
	code?: string
	description?: string
}
