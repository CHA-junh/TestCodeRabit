import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { empNo, password } = body

		// ?�력 검�?
		if (!empNo || !password) {
			return NextResponse.json(
				{ success: false, message: '?�원번호?� 비�?번호�??�력?�주?�요.' },
				{ status: 400 }
			)
		}

		// ?�버(DB) ?�증 ?�청
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
					message: errorText || '?�용???�보 조회???�패?�습?�다.',
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

		// ?�버?�서 조회???�용???�보�??�라?�언???�식?�로 변??
		const user = dbData.user

		// ?�버?�서 ?�정???�션 쿠키�?그�?�??�용
		const response = NextResponse.json({
			success: true,
			message: '로그???�공',
			user,
		})

		const setCookieHeader = dbResponse.headers.get('set-cookie')
		if (setCookieHeader) {
			response.headers.set('set-cookie', setCookieHeader)
		}

		return response
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: '?�버 ?�류가 발생?�습?�다.' },
			{ status: 500 }
		)
	}
}


