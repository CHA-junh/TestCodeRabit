import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// ?¸ì…˜ ì¿ í‚¤ ?•ì¸
		const sessionCookie = request.cookies.get('session')

		if (!sessionCookie) {
			console.log('???¸ì…˜ ì¿ í‚¤ ?†ìŒ')
			return NextResponse.json({ user: null }, { status: 401 })
		}

		console.log('?ª ?¸ì…˜ ì¿ í‚¤:', sessionCookie.value)

		// ?œë²„???¸ì…˜ ?•ì¸ API ?¸ì¶œ
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		const response = await fetch(`${serverUrl}/auth/session`, {
			method: 'GET',
			headers: {
				Cookie: `session=${sessionCookie.value}`,
			},
		})

		console.log('?“¥ ?œë²„ ?¸ì…˜ ?•ì¸ ?‘ë‹µ ?íƒœ:', response.status)

		if (!response.ok) {
			console.log('???œë²„ ?¸ì…˜ ?•ì¸ ?¤íŒ¨')
			// ?œë²„ ?¤ë¥˜ ??ì¿ í‚¤ ?? œ
			const errorResponse = NextResponse.json({ user: null }, { status: 401 })
			errorResponse.cookies.delete('session')
			return errorResponse
		}

		const data = await response.json()
		console.log('?“Š ?œë²„ ?¸ì…˜ ?•ì¸ ?‘ë‹µ ?°ì´??', data)

		// ?œë²„?ì„œ success: false ?ëŠ” userê°€ null?´ë©´ ?¸ì…˜ ë¬´íš¨
		if (!data.success || !data.user) {
			console.log('???œë²„?ì„œ ?¬ìš©???•ë³´ ?†ìŒ')
			// ?¸ì…˜ ë¬´íš¨ ??ì¿ í‚¤ ?? œ
			const invalidResponse = NextResponse.json({ user: null }, { status: 401 })
			invalidResponse.cookies.delete('session')

			// ?œë²„?ì„œ ë³´ë‚¸ Set-Cookie ?¤ë”ê°€ ?ˆìœ¼ë©?ê·¸ë?ë¡??„ë‹¬
			const setCookieHeader = response.headers.get('set-cookie')
			if (setCookieHeader) {
				invalidResponse.headers.set('set-cookie', setCookieHeader)
			}

			return invalidResponse
		}

		// ?œë²„?ì„œ ë°›ì? ?¬ìš©???•ë³´ë¥??´ë¼?´ì–¸???•ì‹?¼ë¡œ ë³€??
		const user = {
			userId: data.user.userId,
			empNo: data.user.userId,
			name: data.user.userName || '?¬ìš©??,
			email: data.user.emailAddr || `${data.user.userId}@buttle.co.kr`,
			department: data.user.deptNm || `ë¶€??${data.user.deptCd})`,
			position: data.user.dutyNm || 'ì§ê¸‰',
			role: data.user.usrRoleId || 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
			needsPasswordChange: false, // ?¸ì…˜ ?•ì¸ ?œì—????ƒ falseë¡?ë°˜í™˜
		}

		console.log('??ë³€?˜ëœ ?¬ìš©???•ë³´:', user)

		// ?±ê³µ ?‘ë‹µ?ë„ ?œë²„??Set-Cookie ?¤ë” ?„ë‹¬
		const successResponse = NextResponse.json({ user })
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			successResponse.headers.set('set-cookie', setCookieHeader)
		}

		return successResponse
	} catch (error) {
		console.error('???¸ì…˜ ?•ì¸ API ?¤ë¥˜:', error)
		// ?¤ë¥˜ ë°œìƒ ??ì¿ í‚¤ ?? œ
		const errorResponse = NextResponse.json({ user: null }, { status: 500 })
		errorResponse.cookies.delete('session')
		return errorResponse
	}
}


