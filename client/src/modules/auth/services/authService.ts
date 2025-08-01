/**
 * ?Έμ¦ κ΄??API ?λΉ??
 */

class AuthService {
	private static readonly API_BASE_URL =
		(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/auth'

	/**
	 * ?¬μ©??λ‘κ·Έ??
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

			// ?λ΅ ?ν ?μΈ
			if (!response.ok) {
				// HTTP ?ν μ½λλ³??¬μ©??μΉν??λ©μμ§
				let userMessage = 'λ‘κ·Έ?Έμ ?€ν¨?μ΅?λ€.'
				switch (response.status) {
					case 401:
						userMessage = '?¬λ² ?λ λΉλ?λ²νΈκ° ?¬λ°λ₯΄μ? ?μ΅?λ€.'
						break
					case 403:
						userMessage = '?κ·Ό κΆν???μ΅?λ€.'
						break
					case 404:
						userMessage = '?λ²???°κ²°?????μ΅?λ€.'
						break
					case 500:
						userMessage = '?λ² ?€λ₯κ° λ°μ?μ΅?λ€. ? μ ???€μ ?λ?΄μ£Ό?Έμ.'
						break
					default:
						userMessage = 'λ‘κ·Έ??μ€??€λ₯κ° λ°μ?μ΅?λ€.'
				}

				throw new Error(userMessage)
			}

			// Content-Type ?μΈ
			const contentType = response.headers.get('content-type')
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('?λ²?μ JSON ?λ΅??λ°ν?μ? ?μ?΅λ??')
			}

			const data = await response.json()
			return data
		} catch (error) {
			// λ‘κ·Έ ?μ  ?κ±° - λ³΄μ??λ―Όκ°???λ³΄ ?ΈμΆ λ°©μ?
			throw error
		}
	}

	/**
	 * ?Έμ ?μΈ
	 */
	static async checkSession(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				method: 'GET',
				credentials: 'include',
			})

			// 401 ?λ 403 ?€λ₯ ???Έμ λ¬΄ν¨ (λ‘κ·Έ ?κ±°)
			if (response.status === 401 || response.status === 403) {
				return { success: false, user: null }
			}

			// ?±κ³΅?μΈ ?λ΅λ§?μ²λ¦¬
			if (response.ok) {
				const data = await response.json()
				return data
			}

			// κΈ°ν? ?€λ₯ ?μ???Έμ λ¬΄ν¨λ‘?μ²λ¦¬ (λ‘κ·Έ ?κ±°)
			return { success: false, user: null }
		} catch (error) {
			// ?€νΈ?ν¬ ?€λ₯ ?μ???Έμ λ¬΄ν¨λ‘?μ²λ¦¬ (λ‘κ·Έ ?κ±°)
			return { success: false, user: null }
		}
	}

	/**
	 * λ‘κ·Έ?μ
	 */
	static async logout(): Promise<any> {
		try {
			console.log('?ͺ λ‘κ·Έ?μ API ?ΈμΆ ?μ')

			const response = await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include',
			})

			console.log('?ͺ λ‘κ·Έ?μ API ?λ΅ ?ν:', response.status)

			// λ‘κ·Έ?μ ?±κ³΅ ?¬λ?? κ΄κ³μ???±κ³΅?Όλ‘ μ²λ¦¬
			// (?λ²?μ ?Έμ???? ?μ?Όλ©΄ ?±κ³΅)
			if (response.status === 200 || response.status === 401) {
				console.log('?ͺ λ‘κ·Έ?μ μ²λ¦¬ ?λ£')
				return { success: true, message: 'λ‘κ·Έ?μ?μ?΅λ??' }
			}

			const data = await response.json()
			console.log('?ͺ λ‘κ·Έ?μ API ?λ΅ ?°μ΄??', data)
			return data
		} catch (error) {
			// ?€λ₯ λ¬΄μ - ?μ΄μ§ ?΄λ?Όλ‘ ?Έν ?μ?μΈ ?€ν¨
			return { success: true, message: 'λ‘κ·Έ?μ?μ?΅λ??' }
		}
	}

	/**
	 * λΉλ?λ²νΈ λ³κ²?
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
			console.error('λΉλ?λ²νΈ λ³κ²?API ?€λ₯:', error)
			throw error
		}
	}
}

export default AuthService


