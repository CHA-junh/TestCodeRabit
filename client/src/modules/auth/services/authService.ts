/**
 * ?¸ì¦ ê´€??API ?œë¹„??
 */

class AuthService {
	private static readonly API_BASE_URL =
		(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/auth'

	/**
	 * ?¬ìš©??ë¡œê·¸??
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

			// ?‘ë‹µ ?íƒœ ?•ì¸
			if (!response.ok) {
				// HTTP ?íƒœ ì½”ë“œë³??¬ìš©??ì¹œí™”??ë©”ì‹œì§€
				let userMessage = 'ë¡œê·¸?¸ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.'
				switch (response.status) {
					case 401:
						userMessage = '?¬ë²ˆ ?ëŠ” ë¹„ë?ë²ˆí˜¸ê°€ ?¬ë°”ë¥´ì? ?ŠìŠµ?ˆë‹¤.'
						break
					case 403:
						userMessage = '?‘ê·¼ ê¶Œí•œ???†ìŠµ?ˆë‹¤.'
						break
					case 404:
						userMessage = '?œë²„???°ê²°?????†ìŠµ?ˆë‹¤.'
						break
					case 500:
						userMessage = '?œë²„ ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.'
						break
					default:
						userMessage = 'ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
				}

				throw new Error(userMessage)
			}

			// Content-Type ?•ì¸
			const contentType = response.headers.get('content-type')
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('?œë²„?ì„œ JSON ?‘ë‹µ??ë°˜í™˜?˜ì? ?Šì•˜?µë‹ˆ??')
			}

			const data = await response.json()
			return data
		} catch (error) {
			// ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
			throw error
		}
	}

	/**
	 * ?¸ì…˜ ?•ì¸
	 */
	static async checkSession(): Promise<any> {
		try {
			const response = await fetch(`${this.API_BASE_URL}/session`, {
				method: 'GET',
				credentials: 'include',
			})

			// 401 ?ëŠ” 403 ?¤ë¥˜ ???¸ì…˜ ë¬´íš¨ (ë¡œê·¸ ?œê±°)
			if (response.status === 401 || response.status === 403) {
				return { success: false, user: null }
			}

			// ?±ê³µ?ì¸ ?‘ë‹µë§?ì²˜ë¦¬
			if (response.ok) {
				const data = await response.json()
				return data
			}

			// ê¸°í? ?¤ë¥˜ ?œì—???¸ì…˜ ë¬´íš¨ë¡?ì²˜ë¦¬ (ë¡œê·¸ ?œê±°)
			return { success: false, user: null }
		} catch (error) {
			// ?¤íŠ¸?Œí¬ ?¤ë¥˜ ?œì—???¸ì…˜ ë¬´íš¨ë¡?ì²˜ë¦¬ (ë¡œê·¸ ?œê±°)
			return { success: false, user: null }
		}
	}

	/**
	 * ë¡œê·¸?„ì›ƒ
	 */
	static async logout(): Promise<any> {
		try {
			console.log('?šª ë¡œê·¸?„ì›ƒ API ?¸ì¶œ ?œì‘')

			const response = await fetch(`${this.API_BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include',
			})

			console.log('?šª ë¡œê·¸?„ì›ƒ API ?‘ë‹µ ?íƒœ:', response.status)

			// ë¡œê·¸?„ì›ƒ ?±ê³µ ?¬ë??€ ê´€ê³„ì—†???±ê³µ?¼ë¡œ ì²˜ë¦¬
			// (?œë²„?ì„œ ?¸ì…˜???? œ?˜ì—ˆ?¼ë©´ ?±ê³µ)
			if (response.status === 200 || response.status === 401) {
				console.log('?šª ë¡œê·¸?„ì›ƒ ì²˜ë¦¬ ?„ë£Œ')
				return { success: true, message: 'ë¡œê·¸?„ì›ƒ?˜ì—ˆ?µë‹ˆ??' }
			}

			const data = await response.json()
			console.log('?šª ë¡œê·¸?„ì›ƒ API ?‘ë‹µ ?°ì´??', data)
			return data
		} catch (error) {
			// ?¤ë¥˜ ë¬´ì‹œ - ?˜ì´ì§€ ?´ë™?¼ë¡œ ?¸í•œ ?•ìƒ?ì¸ ?¤íŒ¨
			return { success: true, message: 'ë¡œê·¸?„ì›ƒ?˜ì—ˆ?µë‹ˆ??' }
		}
	}

	/**
	 * ë¹„ë?ë²ˆí˜¸ ë³€ê²?
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
			console.error('ë¹„ë?ë²ˆí˜¸ ë³€ê²?API ?¤ë¥˜:', error)
			throw error
		}
	}
}

export default AuthService


