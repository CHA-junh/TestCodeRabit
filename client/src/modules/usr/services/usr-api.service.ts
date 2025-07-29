// USR API 서비스
export interface UserData {
	empNo: string // 사원번호
	ownOutsDiv: string // 자사외주구분
	entrNo: string // 업체번호
	empNm: string // 사원성명
	entrDt: string // 입사일자
	retirDt: string // 퇴사일자
	hqDivCd: string // 본부구분코드
	hqDivNm: string // 본부명
	deptDivCd: string // 부서구분코드
	deptDivNm: string // 부서명
	dutyCd: string // 직책코드
	dutyNm: string // 직책명
	wmailYn: string // 웹메일등록여부
	authCd: string // 권한코드
	authCdNm: string // 권한명
	dutyDivCd: string // 직책구분코드
	dutyDivCdNm: string // 직책구분명
	apvApofId: string // 승인결재자ID
	apvApofNm: string // 승인결재자명
	wrkCnt: string // 사용권한업무갯수
	lastWrk: string // 최종등록된업무
	bsnUseYn: string // 사업/프로젝트 사용유무
	wpcUseYn: string // 업무추진비 사용유무
	psmUseYn: string // 인사/복리 사용유무
	emailAddr: string // 이메일주소
	usrRoleId: string // 사용자역할ID
	usrRoleNm: string // 사용자역할명
}

export interface WorkAuthData {
	smlCsfCd: string // 업무구분코드
	smlCsfNm: string // 업무구분명
	wrkUseYn: string // 사용권한여부
	rmk?: string // 비고
	regDttm?: string // 등록일시
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
	usrRoleId?: string // 사용자역할ID (선택적, 기본값: 'A250715001')
	apvApofNm?: string // 승인결재자명 추가
}

export interface SearchConditions {
	hqDiv?: string
	deptDiv?: string
	userNm?: string
}

// 코드 조회용 인터페이스
export interface CodeData {
	data: string // 코드값
	label: string // 코드명
}

class UsrApiService {
	private baseUrl = '/api/usr'
	private codeUrl = '/api/code'

	/**
	 * 코드 조회 (COM_03_0101_S 프로시저 호출)
	 */
	async getCodes(largeCategoryCode: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode }),
			})
			if (!response.ok) throw new Error('코드 조회 실패')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('코드 조회 실패:', error)
			throw error
		}
	}

	/**
	 * 본부구분코드 조회
	 */
	async getHqDivCodes(): Promise<CodeData[]> {
		return this.getCodes('113')
	}

	/**
	 * 부서구분코드 조회 (전체 부서)
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
				throw new Error(result.message || '부서 코드 조회에 실패했습니다.')
			}
		} catch (error) {
			console.error('부서 코드 조회 실패:', error)
			// 실패 시 기본 코드 조회로 폴백
			return this.getCodes('112')
		}
	}

	/**
	 * 본부별 부서구분코드 조회 (본부 선택 시 해당 본부의 부서만 조회)
	 */
	async getDeptDivCodesByHq(hqDivCd: string): Promise<CodeData[]> {
		try {
			const response = await fetch('/api/common/dept-by-hq', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ hqDivCd }),
			})
			if (!response.ok) throw new Error('부서 코드 조회 실패')
			const result = await response.json()
			return result.data
		} catch (error) {
			console.error('본부별 부서 코드 조회 실패:', error)
			throw error
		}
	}

	/**
	 * 사용자권한코드 조회
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
	 * 사용자 목록 조회
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
				throw new Error(result.message || '사용자 목록 조회에 실패했습니다.')
			}
		} catch (error) {
			console.error('사용자 목록 조회 실패:', error)
			throw error
		}
	}

	/**
	 * 사용자 업무권한 목록 조회
	 */
	async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
		try {
			// 빈 userId일 때는 "99999"로 전달 (Flex 소스와 동일)
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
				throw new Error(result.message || '업무권한 목록 조회에 실패했습니다.')
			}
		} catch (error) {
			console.error('업무권한 목록 조회 실패:', error)
			throw error
		}
	}

	/**
	 * 사용자 역할 목록 조회
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
					result.message || '사용자 역할 목록 조회에 실패했습니다.'
				)
			}
		} catch (error) {
			console.error('사용자 역할 목록 조회 실패:', error)
			throw error
		}
	}

	/**
	 * 사용자 정보 저장
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
				throw new Error(result.message || '사용자 정보 저장에 실패했습니다.')
			}
		} catch (error) {
			console.error('사용자 정보 저장 실패:', error)
			throw error
		}
	}

	/**
	 * 비밀번호 초기화
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
				throw new Error(result.message || '비밀번호 초기화에 실패했습니다.')
			}
		} catch (error) {
			console.error('비밀번호 초기화 실패:', error)
			throw error
		}
	}

	/**
	 * 승인결재자 검색
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
				throw new Error(result.message || '승인결재자 검색에 실패했습니다.')
			}
		} catch (error) {
			console.error('승인결재자 검색 실패:', error)
			throw error
		}
	}
}

// 싱글톤 인스턴스 생성
export const usrApiService = new UsrApiService()
