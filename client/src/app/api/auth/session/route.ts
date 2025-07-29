import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// 세션 쿠키 확인
		const sessionCookie = request.cookies.get('session')

		if (!sessionCookie) {
			console.log('❌ 세션 쿠키 없음')
			return NextResponse.json({ user: null }, { status: 401 })
		}

		console.log('🍪 세션 쿠키:', sessionCookie.value)

		// 서버의 세션 확인 API 호출
		const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
		const response = await fetch(`${serverUrl}/auth/session`, {
			method: 'GET',
			headers: {
				Cookie: `session=${sessionCookie.value}`,
			},
		})

		console.log('📥 서버 세션 확인 응답 상태:', response.status)

		if (!response.ok) {
			console.log('❌ 서버 세션 확인 실패')
			// 서버 오류 시 쿠키 삭제
			const errorResponse = NextResponse.json({ user: null }, { status: 401 })
			errorResponse.cookies.delete('session')
			return errorResponse
		}

		const data = await response.json()
		console.log('📊 서버 세션 확인 응답 데이터:', data)

		// 서버에서 success: false 또는 user가 null이면 세션 무효
		if (!data.success || !data.user) {
			console.log('❌ 서버에서 사용자 정보 없음')
			// 세션 무효 시 쿠키 삭제
			const invalidResponse = NextResponse.json({ user: null }, { status: 401 })
			invalidResponse.cookies.delete('session')

			// 서버에서 보낸 Set-Cookie 헤더가 있으면 그대로 전달
			const setCookieHeader = response.headers.get('set-cookie')
			if (setCookieHeader) {
				invalidResponse.headers.set('set-cookie', setCookieHeader)
			}

			return invalidResponse
		}

		// 서버에서 받은 사용자 정보를 클라이언트 형식으로 변환
		const user = {
			userId: data.user.userId,
			empNo: data.user.userId,
			name: data.user.userName || '사용자',
			email: data.user.emailAddr || `${data.user.userId}@buttle.co.kr`,
			department: data.user.deptNm || `부서(${data.user.deptCd})`,
			position: data.user.dutyNm || '직급',
			role: data.user.usrRoleId || 'USER',
			permissions: ['read', 'write'],
			lastLoginAt: new Date().toISOString(),
			needsPasswordChange: false, // 세션 확인 시에는 항상 false로 반환
		}

		console.log('✅ 변환된 사용자 정보:', user)

		// 성공 응답에도 서버의 Set-Cookie 헤더 전달
		const successResponse = NextResponse.json({ user })
		const setCookieHeader = response.headers.get('set-cookie')
		if (setCookieHeader) {
			successResponse.headers.set('set-cookie', setCookieHeader)
		}

		return successResponse
	} catch (error) {
		console.error('❌ 세션 확인 API 오류:', error)
		// 오류 발생 시 쿠키 삭제
		const errorResponse = NextResponse.json({ user: null }, { status: 500 })
		errorResponse.cookies.delete('session')
		return errorResponse
	}
}
