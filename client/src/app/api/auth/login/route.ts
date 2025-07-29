import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { empNo, password } = body

		// ?…ë ¥ ê²€ì¦?
		if (!empNo || !password) {
			return NextResponse.json(
				{ success: false, message: '?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.' },
				{ status: 400 }
			)
		}

		// ?œë²„(DB) ?¸ì¦ ?”ì²­
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		const requestBody = JSON.stringify({ empNo, password })

		const dbResponse = await fetch(`${serverUrl}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: requestBody,
		})

		if (!dbResponse.ok) {
			const errorText = await dbResponse.text()
			return NextResponse.json(
				{
					success: false,
					message: errorText || '?¬ìš©???•ë³´ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.',
				},
				{ status: dbResponse.status }
			)
		}

		const dbData = await dbResponse.json()

		if (!dbData.success) {
			return NextResponse.json(
				{ success: false, message: dbData.message },
				{ status: 401 }
			)
		}

		// ?œë²„?ì„œ ì¡°íšŒ???¬ìš©???•ë³´ë¥??´ë¼?´ì–¸???•ì‹?¼ë¡œ ë³€??
		const user = dbData.user

		// ?œë²„?ì„œ ?¤ì •???¸ì…˜ ì¿ í‚¤ë¥?ê·¸ë?ë¡??¬ìš©
		const response = NextResponse.json({
			success: true,
			message: 'ë¡œê·¸???±ê³µ',
			user,
		})

		const setCookieHeader = dbResponse.headers.get('set-cookie')
		if (setCookieHeader) {
			response.headers.set('set-cookie', setCookieHeader)
		}

		return response
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: '?œë²„ ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' },
			{ status: 500 }
		)
	}
}


