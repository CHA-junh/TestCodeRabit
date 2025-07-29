// USR API ?�비??
export interface UserData {
	empNo: string // ?�원번호
	ownOutsDiv: string // ?�사?�주구분
	entrNo: string // ?�체번호
	empNm: string // ?�원?�명
	entrDt: string // ?�사?�자
	retirDt: string // ?�사?�자
	hqDivCd: string // 본�?구분코드
	hqDivNm: string // 본�?�?
	deptDivCd: string // 부?�구분코??
	deptDivNm: string // 부?�명
	dutyCd: string // 직책코드
	dutyNm: string // 직책�?
	wmailYn: string // ?�메?�등록여부
	authCd: string // 권한코드
	authCdNm: string // 권한�?
	dutyDivCd: string // 직책구분코드
	dutyDivCdNm: string // 직책구분�?
	apvApofId: string // ?�인결재?�ID
	apvApofNm: string // ?�인결재?�명
	wrkCnt: string // ?�용권한?�무�?��
	lastWrk: string // 최종?�록?�업�?
	bsnUseYn: string // ?�업/?�로?�트 ?�용?�무
	wpcUseYn: string // ?�무추진�??�용?�무
	psmUseYn: string // ?�사/복리 ?�용?�무
	emailAddr: string // ?�메?�주??
	usrRoleId: string // ?�용?�역?�ID
	usrRoleNm: string // ?�용?�역?�명
}

export interface WorkAuthData {
	smlCsfCd: string // ?�무구분코드
	smlCsfNm: string // ?�무구분�?
	wrkUseYn: string // ?�용권한?��?
	rmk?: string // 비고
	regDttm?: string // ?�록?�시
	chngrId?: string // 변경자ID
}

export interface UserSaveData {
	empNo: string
	empNm: string
	hqDivCd: string
	deptDivCd: string
	dutyCd: string
	dutyDivCd: string
	authCd: string
	apvApofId: string
	emailAddr: string
	workAuthList: WorkAuthData[]
	regUserId: string
	usrRoleId?: string // ?�용?�역?�ID (?�택?? 기본�? 'A250715001')
	apvApofNm?: string // ?�인결재?�명 추�?
}

export interface SearchConditions {
	hqDiv?: string
	deptDiv?: string
	userNm?: string
}

// 코드 조회???�터?�이??
export interface CodeData {
	data: string // 코드�?
	label: string // 코드�?
}

class UsrApiService {
	private baseUrl = '/api/usr'
	private codeUrl = '/api/code'

	/**
	 * 코드 조회 (COM_03_0101_S ?�로?��? ?�출)
	 */
	async getCodes(largeCategoryCode: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode }),
			})
			if (!response.ok) throw new Error('코드 조회 ?�패')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('코드 조회 ?�패:', error)
			throw error
		}
	}

	/**
	 * 본�?구분코드 조회
	 */
	async getHqDivCodes(): Promise<CodeData[]> {
		return this.getCodes('113')
	}

	/**
	 * 부?�구분코??조회 (?�체 부??
	 */
	async getDeptDivCodes(): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/dept-by-hq', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ hqDivCd: 'ALL', allYn: 'Y' }),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.data) {
				return result.data
			} else {
				throw new Error(result.message || '부??코드 조회???�패?�습?�다.')
			}
		} catch (error) {
			console.error('부??코드 조회 ?�패:', error)
			// ?�패 ??기본 코드 조회�??�백
			return this.getCodes('112')
		}
	}

	/**
	 * 본�?�?부?�구분코??조회 (본�? ?�택 ???�당 본�???부?�만 조회)
	 */
	async getDeptDivCodesByHq(hqDivCd: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/dept-by-hq', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ hqDivCd }),
			})
			if (!response.ok) throw new Error('부??코드 조회 ?�패')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('본�?�?부??코드 조회 ?�패:', error)
			throw error
		}
	}

	/**
	 * ?�용?�권?�코??조회
	 */
	async getAuthCodes(): Promise<CodeData[]> {
		return this.getCodes('101')
	}

	/**
	 * 직책구분코드 조회
	 */
	async getDutyDivCodes(): Promise<CodeData[]> {
		return this.getCodes('114')
	}

	/**
	 * ?�용??목록 조회
	 */
	async getUserList(conditions: SearchConditions): Promise<UserData[]> {
		try {
			const params = new URLSearchParams()
			if (conditions.hqDiv) params.append('hqDiv', conditions.hqDiv)
			if (conditions.deptDiv) params.append('deptDiv', conditions.deptDiv)
			if (conditions.userNm) params.append('userNm', conditions.userNm)

			const response = await fetch(
				`${this.baseUrl}/list?${params.toString()}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success) {
				return result.data
			} else {
				throw new Error(result.message || '?�용??목록 조회???�패?�습?�다.')
			}
		} catch (error) {
			console.error('?�용??목록 조회 ?�패:', error)
			throw error
		}
	}

	/**
	 * ?�용???�무권한 목록 조회
	 */
	async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
		try {
			// �?userId???�는 "99999"�??�달 (Flex ?�스?� ?�일)
			const targetUserId = userId === '' ? '99999' : userId

			const response = await fetch(
				`${this.baseUrl}/work-auth/${targetUserId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success) {
				return result.data
			} else {
				throw new Error(result.message || '?�무권한 목록 조회???�패?�습?�다.')
			}
		} catch (error) {
			console.error('?�무권한 목록 조회 ?�패:', error)
			throw error
		}
	}

	/**
	 * ?�용????�� 목록 조회
	 */
	async getUserRoles(): Promise<{ usrRoleId: string; usrRoleNm: string }[]> {
		try {
			const response = await fetch(`${this.baseUrl}/roles`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success && result.data) {
				return result.data
			} else {
				throw new Error(
					result.message || '?�용????�� 목록 조회???�패?�습?�다.'
				)
			}
		} catch (error) {
			console.error('?�용????�� 목록 조회 ?�패:', error)
			throw error
		}
	}

	/**
	 * ?�용???�보 ?�??
	 */
	async saveUser(userData: UserSaveData): Promise<string> {
		try {
			const response = await fetch(`${this.baseUrl}/save`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success) {
				return result.data
			} else {
				throw new Error(result.message || '?�용???�보 ?�?�에 ?�패?�습?�다.')
			}
		} catch (error) {
			console.error('?�용???�보 ?�???�패:', error)
			throw error
		}
	}

	/**
	 * 비�?번호 초기??
	 */
	async initPassword(userId: string): Promise<string> {
		try {
			const response = await fetch(`${this.baseUrl}/password-init`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId }),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success) {
				return result.data
			} else {
				throw new Error(result.message || '비�?번호 초기?�에 ?�패?�습?�다.')
			}
		} catch (error) {
			console.error('비�?번호 초기???�패:', error)
			throw error
		}
	}

	/**
	 * ?�인결재??검??
	 */
	async searchApprover(approverNm: string): Promise<UserData[]> {
		try {
			const params = new URLSearchParams()
			params.append('approverNm', approverNm)

			const response = await fetch(
				`${this.baseUrl}/approver-search?${params.toString()}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			if (result.success) {
				return result.data
			} else {
				throw new Error(result.message || '?�인결재??검?�에 ?�패?�습?�다.')
			}
		} catch (error) {
			console.error('?�인결재??검???�패:', error)
			throw error
		}
	}
}

// ?��????�스?�스 ?�성
export const usrApiService = new UsrApiService()


