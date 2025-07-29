import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// ?�션 쿠키 ?�인
		const sessionCookie = request.cookies.get('session')

		if (!sessionCookie) {
			console.log('???�션 쿠키 ?�음')
			return NextResponse.json({ user: null }, { status: 401 })
		}

		console.log('?�� ?�션 쿠키:', sessionCookie.value)

		// ?�버???�션 ?�인 API ?�출
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		const response = await fetch(`${serverUrl}/auth/session`, {
			method: 'GET',
			headers: {
				Cookie: `session=${sessionCookie.value}`,
			},
		})

		console.log('?�� ?�버 ?�션 ?�인 ?�답 ?�태:', response.status)

		if (!response.ok) {
			console.log('???�버 ?�션 ?�인 ?�패')
			// ?�버 ?�류 ??쿠키 ??��
			const errorResponse = NextResponse.json({ user: null }, { status: 401 })
			errorResponse.cookies.delete('session')
			return errorResponse
		}

		const data = await response.json()
		console.log('?�� ?�버 ?�션 ?�인 ?�답 ?�이??', data)

		// ?�버?�서 success: false ?�는 user가 null?�면 ?�션 무효
		if (!data.success || !data.user) {
			console.log('???�버?�서 ?�용???�보 ?�음')
			// ?�션 무효 ??쿠키 ??��
			const invalidResponse = NextResponse.json({ user: null }, { status: 401 })
			invalidResponse.cookies.delete('session')

			// ?�버?�서 보낸 Set-Cookie ?�더가 ?�으�?그�?�??�달
			const setCookieHeader = response.headers.get('set-cookie')
			if (setCookieHeader) {
				invalidResponse.headers.set('set-cookie', setCookieHeader)
			}

			return invalidResponse
		}

		// ?�버?�서 받�? ?�용???�보�??�라?�언???�식?�로 변??
		const user = {
			userId: data.user.userId,
			empNo: data.user.userId,
			name: data.user.userName || '?�용??,
			email: data.user.emailAddr || `${data.user.userId}@buttle.co.kr`,
			department: data.user.deptNm || `부??${data.user.deptCd})`,
			position: data.user.dutyNm || '직급',
			role: data.user.usrRoleId || 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
			needsPasswordChange: false, // ?�션 ?�인 ?�에????�� false�?반환
		}

		console.log('??변?�된 ?�용???�보:', user)

		// ?�공 ?�답?�도 ?�버??Set-Cookie ?�더 ?�달
		const successResponse = NextResponse.json({ user })
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			successResponse.headers.set('set-cookie', setCookieHeader)
		}

		return successResponse
	} catch (error) {
		console.error('???�션 ?�인 API ?�류:', error)
		// ?�류 발생 ??쿠키 ??��
		const errorResponse = NextResponse.json({ user: null }, { status: 500 })
		errorResponse.cookies.delete('session')
		return errorResponse
	}
}


