// USR API ?œë¹„??
export interface UserData {
	empNo: string // ?¬ì›ë²ˆí˜¸
	ownOutsDiv: string // ?ì‚¬?¸ì£¼êµ¬ë¶„
	entrNo: string // ?…ì²´ë²ˆí˜¸
	empNm: string // ?¬ì›?±ëª…
	entrDt: string // ?…ì‚¬?¼ì
	retirDt: string // ?´ì‚¬?¼ì
	hqDivCd: string // ë³¸ë?êµ¬ë¶„ì½”ë“œ
	hqDivNm: string // ë³¸ë?ëª?
	deptDivCd: string // ë¶€?œêµ¬ë¶„ì½”??
	deptDivNm: string // ë¶€?œëª…
	dutyCd: string // ì§ì±…ì½”ë“œ
	dutyNm: string // ì§ì±…ëª?
	wmailYn: string // ?¹ë©”?¼ë“±ë¡ì—¬ë¶€
	authCd: string // ê¶Œí•œì½”ë“œ
	authCdNm: string // ê¶Œí•œëª?
	dutyDivCd: string // ì§ì±…êµ¬ë¶„ì½”ë“œ
	dutyDivCdNm: string // ì§ì±…êµ¬ë¶„ëª?
	apvApofId: string // ?¹ì¸ê²°ì¬?ID
	apvApofNm: string // ?¹ì¸ê²°ì¬?ëª…
	wrkCnt: string // ?¬ìš©ê¶Œí•œ?…ë¬´ê°?ˆ˜
	lastWrk: string // ìµœì¢…?±ë¡?œì—…ë¬?
	bsnUseYn: string // ?¬ì—…/?„ë¡œ?íŠ¸ ?¬ìš©? ë¬´
	wpcUseYn: string // ?…ë¬´ì¶”ì§„ë¹??¬ìš©? ë¬´
	psmUseYn: string // ?¸ì‚¬/ë³µë¦¬ ?¬ìš©? ë¬´
	emailAddr: string // ?´ë©”?¼ì£¼??
	usrRoleId: string // ?¬ìš©?ì—­? ID
	usrRoleNm: string // ?¬ìš©?ì—­? ëª…
}

export interface WorkAuthData {
	smlCsfCd: string // ?…ë¬´êµ¬ë¶„ì½”ë“œ
	smlCsfNm: string // ?…ë¬´êµ¬ë¶„ëª?
	wrkUseYn: string // ?¬ìš©ê¶Œí•œ?¬ë?
	rmk?: string // ë¹„ê³ 
	regDttm?: string // ?±ë¡?¼ì‹œ
	chngrId?: string // ë³€ê²½ìID
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
	usrRoleId?: string // ?¬ìš©?ì—­? ID (? íƒ?? ê¸°ë³¸ê°? 'A250715001')
	apvApofNm?: string // ?¹ì¸ê²°ì¬?ëª… ì¶”ê?
}

export interface SearchConditions {
	hqDiv?: string
	deptDiv?: string
	userNm?: string
}

// ì½”ë“œ ì¡°íšŒ???¸í„°?˜ì´??
export interface CodeData {
	data: string // ì½”ë“œê°?
	label: string // ì½”ë“œëª?
}

class UsrApiService {
	private baseUrl = '/api/usr'
	private codeUrl = '/api/code'

	/**
	 * ì½”ë“œ ì¡°íšŒ (COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ)
	 */
	async getCodes(largeCategoryCode: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode }),
			})
			if (!response.ok) throw new Error('ì½”ë“œ ì¡°íšŒ ?¤íŒ¨')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('ì½”ë“œ ì¡°íšŒ ?¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ë³¸ë?êµ¬ë¶„ì½”ë“œ ì¡°íšŒ
	 */
	async getHqDivCodes(): Promise<CodeData[]> {
		return this.getCodes('113')
	}

	/**
	 * ë¶€?œêµ¬ë¶„ì½”??ì¡°íšŒ (?„ì²´ ë¶€??
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
				throw new Error(result.message || 'ë¶€??ì½”ë“œ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('ë¶€??ì½”ë“œ ì¡°íšŒ ?¤íŒ¨:', error)
			// ?¤íŒ¨ ??ê¸°ë³¸ ì½”ë“œ ì¡°íšŒë¡??´ë°±
			return this.getCodes('112')
		}
	}

	/**
	 * ë³¸ë?ë³?ë¶€?œêµ¬ë¶„ì½”??ì¡°íšŒ (ë³¸ë? ? íƒ ???´ë‹¹ ë³¸ë???ë¶€?œë§Œ ì¡°íšŒ)
	 */
	async getDeptDivCodesByHq(hqDivCd: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/dept-by-hq', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ hqDivCd }),
			})
			if (!response.ok) throw new Error('ë¶€??ì½”ë“œ ì¡°íšŒ ?¤íŒ¨')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ ?¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ?¬ìš©?ê¶Œ?œì½”??ì¡°íšŒ
	 */
	async getAuthCodes(): Promise<CodeData[]> {
		return this.getCodes('101')
	}

	/**
	 * ì§ì±…êµ¬ë¶„ì½”ë“œ ì¡°íšŒ
	 */
	async getDutyDivCodes(): Promise<CodeData[]> {
		return this.getCodes('114')
	}

	/**
	 * ?¬ìš©??ëª©ë¡ ì¡°íšŒ
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
				throw new Error(result.message || '?¬ìš©??ëª©ë¡ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('?¬ìš©??ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ?¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ
	 */
	async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
		try {
			// ë¹?userId???ŒëŠ” "99999"ë¡??„ë‹¬ (Flex ?ŒìŠ¤?€ ?™ì¼)
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
				throw new Error(result.message || '?…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('?…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
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
					result.message || '?¬ìš©????•  ëª©ë¡ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.'
				)
			}
		} catch (error) {
			console.error('?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ?¬ìš©???•ë³´ ?€??
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
				throw new Error(result.message || '?¬ìš©???•ë³´ ?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('?¬ìš©???•ë³´ ?€???¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
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
				throw new Error(result.message || 'ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°?”ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???¤íŒ¨:', error)
			throw error
		}
	}

	/**
	 * ?¹ì¸ê²°ì¬??ê²€??
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
				throw new Error(result.message || '?¹ì¸ê²°ì¬??ê²€?‰ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('?¹ì¸ê²°ì¬??ê²€???¤íŒ¨:', error)
			throw error
		}
	}
}

// ?±ê????¸ìŠ¤?´ìŠ¤ ?ì„±
export const usrApiService = new UsrApiService()


