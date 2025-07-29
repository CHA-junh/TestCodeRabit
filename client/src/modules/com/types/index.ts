// ?œìŠ¤??ì½”ë“œ ?€??
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

// ?±ê¸‰ë³??¨ê? ?€??
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

// ê²€??ê²°ê³¼ ?€??
export interface SearchResult {
	id: string
	name: string
	code?: string
	description?: string
}


