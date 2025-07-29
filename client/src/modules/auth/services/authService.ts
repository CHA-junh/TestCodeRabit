/**
 * ?�증 관??API ?�비??
 */

class AuthService {
	private static readonly API_BASE_URL =
		(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/auth'

	/**
	 * ?�용??로그??
	 */
	static async login(empNo: string, password: string): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ empNo, password }),
			})

			// ?�답 ?�태 ?�인
			if (!response.ok) {
				// HTTP ?�태 코드�??�용??친화??메시지
				let userMessage = '로그?�에 ?�패?�습?�다.'
				switch (response.status) {
					case 401:
						userMessage = '?�번 ?�는 비�?번호가 ?�바르�? ?�습?�다.'
						break
					case 403:
						userMessage = '?�근 권한???�습?�다.'
						break
					case 404:
						userMessage = '?�버???�결?????�습?�다.'
						break
					case 500:
						userMessage = '?�버 ?�류가 발생?�습?�다. ?�시 ???�시 ?�도?�주?�요.'
						break
					default:
						userMessage = '로그??�??�류가 발생?�습?�다.'
				}

				throw new Error(userMessage)
			}

			// Content-Type ?�인
			const contentType = response.headers.get('content-type')
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('?�버?�서 JSON ?�답??반환?��? ?�았?�니??')
			}

			const data = await response.json()
			return data
		} catch (error) {
			// 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
			throw error
		}
	}

	/**
	 * ?�션 ?�인
	 */
	static async checkSession(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				method: 'GET',
				credentials: 'include',
			})

			// 401 ?�는 403 ?�류 ???�션 무효 (로그 ?�거)
			if (response.status === 401 || response.status === 403) {
				return { success: false, user: null }
			}

			// ?�공?�인 ?�답�?처리
			if (response.ok) {
				const data = await response.json()
				return data
			}

			// 기�? ?�류 ?�에???�션 무효�?처리 (로그 ?�거)
			return { success: false, user: null }
		} catch (error) {
			// ?�트?�크 ?�류 ?�에???�션 무효�?처리 (로그 ?�거)
			return { success: false, user: null }
		}
	}

	/**
	 * 로그?�웃
	 */
	static async logout(): Promise<any> {
		try {
			console.log('?�� 로그?�웃 API ?�출 ?�작')

			const response = await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include',
			})

			console.log('?�� 로그?�웃 API ?�답 ?�태:', response.status)

			// 로그?�웃 ?�공 ?��??� 관계없???�공?�로 처리
			// (?�버?�서 ?�션????��?�었?�면 ?�공)
			if (response.status === 200 || response.status === 401) {
				console.log('?�� 로그?�웃 처리 ?�료')
				return { success: true, message: '로그?�웃?�었?�니??' }
			}

			const data = await response.json()
			console.log('?�� 로그?�웃 API ?�답 ?�이??', data)
			return data
		} catch (error) {
			// ?�류 무시 - ?�이지 ?�동?�로 ?�한 ?�상?�인 ?�패
			return { success: true, message: '로그?�웃?�었?�니??' }
		}
	}

	/**
	 * 비�?번호 변�?
	 */
	static async changePassword(
		userId: string,
		newPassword: string
	): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/change-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ userId, newPassword }),
			})

			const data = await response.json()
			return data
		} catch (error) {
			console.error('비�?번호 변�?API ?�류:', error)
			throw error
		}
	}
}

export default AuthService


