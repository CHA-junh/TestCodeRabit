import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// ?Έμ μΏ ν€ ?μΈ
		const sessionCookie = request.cookies.get('session')

		if (!sessionCookie) {
			console.log('???Έμ μΏ ν€ ?μ')
			return NextResponse.json({ user: null }, { status: 401 })
		}

		console.log('?ͺ ?Έμ μΏ ν€:', sessionCookie.value)

		// ?λ²???Έμ ?μΈ API ?ΈμΆ
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		const response = await fetch(`${serverUrl}/auth/session`, {
			method: 'GET',
			headers: {
				Cookie: `session=${sessionCookie.value}`,
			},
		})

		console.log('?₯ ?λ² ?Έμ ?μΈ ?λ΅ ?ν:', response.status)

		if (!response.ok) {
			console.log('???λ² ?Έμ ?μΈ ?€ν¨')
			// ?λ² ?€λ₯ ??μΏ ν€ ?? 
			const errorResponse = NextResponse.json({ user: null }, { status: 401 })
			errorResponse.cookies.delete('session')
			return errorResponse
		}

		const data = await response.json()
		console.log('? ?λ² ?Έμ ?μΈ ?λ΅ ?°μ΄??', data)

		// ?λ²?μ success: false ?λ userκ° null?΄λ©΄ ?Έμ λ¬΄ν¨
		if (!data.success || !data.user) {
			console.log('???λ²?μ ?¬μ©???λ³΄ ?μ')
			// ?Έμ λ¬΄ν¨ ??μΏ ν€ ?? 
			const invalidResponse = NextResponse.json({ user: null }, { status: 401 })
			invalidResponse.cookies.delete('session')

			// ?λ²?μ λ³΄λΈ Set-Cookie ?€λκ° ?μΌλ©?κ·Έλ?λ‘??λ¬
			const setCookieHeader = response.headers.get('set-cookie')
			if (setCookieHeader) {
				invalidResponse.headers.set('set-cookie', setCookieHeader)
			}

			return invalidResponse
		}

		// ?λ²?μ λ°μ? ?¬μ©???λ³΄λ₯??΄λΌ?΄μΈ???μ?Όλ‘ λ³??
		const user = {
			userId: data.user.userId,
			empNo: data.user.userId,
			name: data.user.userName || '?¬μ©??,
			email: data.user.emailAddr || `${data.user.userId}@buttle.co.kr`,
			department: data.user.deptNm || `λΆ??${data.user.deptCd})`,
			position: data.user.dutyNm || 'μ§κΈ',
			role: data.user.usrRoleId || 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
			needsPasswordChange: false, // ?Έμ ?μΈ ?μ???? falseλ‘?λ°ν
		}

		console.log('??λ³?λ ?¬μ©???λ³΄:', user)

		// ?±κ³΅ ?λ΅?λ ?λ²??Set-Cookie ?€λ ?λ¬
		const successResponse = NextResponse.json({ user })
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			successResponse.headers.set('set-cookie', setCookieHeader)
		}

		return successResponse
	} catch (error) {
		console.error('???Έμ ?μΈ API ?€λ₯:', error)
		// ?€λ₯ λ°μ ??μΏ ν€ ?? 
		const errorResponse = NextResponse.json({ user: null }, { status: 500 })
		errorResponse.cookies.delete('session')
		return errorResponse
	}
}


