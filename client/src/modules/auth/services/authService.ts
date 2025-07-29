/**
 * 인증 관련 API 서비스
 */

class AuthService {
	private static readonly API_BASE_URL =
		(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/auth'

	/**
	 * 사용자 로그인
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

			// 응답 상태 확인
			if (!response.ok) {
				// HTTP 상태 코드별 사용자 친화적 메시지
				let userMessage = '로그인에 실패했습니다.'
				switch (response.status) {
					case 401:
						userMessage = '사번 또는 비밀번호가 올바르지 않습니다.'
						break
					case 403:
						userMessage = '접근 권한이 없습니다.'
						break
					case 404:
						userMessage = '서버에 연결할 수 없습니다.'
						break
					case 500:
						userMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
						break
					default:
						userMessage = '로그인 중 오류가 발생했습니다.'
				}

				throw new Error(userMessage)
			}

			// Content-Type 확인
			const contentType = response.headers.get('content-type')
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('서버에서 JSON 응답을 반환하지 않았습니다.')
			}

			const data = await response.json()
			return data
		} catch (error) {
			// 로그 완전 제거 - 보안상 민감한 정보 노출 방지
			throw error
		}
	}

	/**
	 * 세션 확인
	 */
	static async checkSession(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				method: 'GET',
				credentials: 'include',
			})

			// 401 또는 403 오류 시 세션 무효 (로그 제거)
			if (response.status === 401 || response.status === 403) {
				return { success: false, user: null }
			}

			// 성공적인 응답만 처리
			if (response.ok) {
				const data = await response.json()
				return data
			}

			// 기타 오류 시에도 세션 무효로 처리 (로그 제거)
			return { success: false, user: null }
		} catch (error) {
			// 네트워크 오류 시에도 세션 무효로 처리 (로그 제거)
			return { success: false, user: null }
		}
	}

	/**
	 * 로그아웃
	 */
	static async logout(): Promise<any> {
		try {
			console.log('🚪 로그아웃 API 호출 시작')

			const response = await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include',
			})

			console.log('🚪 로그아웃 API 응답 상태:', response.status)

			// 로그아웃 성공 여부와 관계없이 성공으로 처리
			// (서버에서 세션이 삭제되었으면 성공)
			if (response.status === 200 || response.status === 401) {
				console.log('🚪 로그아웃 처리 완료')
				return { success: true, message: '로그아웃되었습니다.' }
			}

			const data = await response.json()
			console.log('🚪 로그아웃 API 응답 데이터:', data)
			return data
		} catch (error) {
			// 오류 무시 - 페이지 이동으로 인한 정상적인 실패
			return { success: true, message: '로그아웃되었습니다.' }
		}
	}

	/**
	 * 비밀번호 변경
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
			console.error('비밀번호 변경 API 오류:', error)
			throw error
		}
	}
}

export default AuthService
