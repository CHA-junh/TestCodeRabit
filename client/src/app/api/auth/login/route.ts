import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { empNo, password } = body

		// 입력 검증
		if (!empNo || !password) {
			return NextResponse.json(
				{ success: false, message: '사원번호와 비밀번호를 입력해주세요.' },
				{ status: 400 }
			)
		}

		// 서버(DB) 인증 요청
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
					message: errorText || '사용자 정보 조회에 실패했습니다.',
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

		// 서버에서 조회한 사용자 정보를 클라이언트 형식으로 변환
		const user = dbData.user

		// 서버에서 설정한 세션 쿠키를 그대로 사용
		const response = NextResponse.json({
			success: true,
			message: '로그인 성공',
			user,
		})

		const setCookieHeader = dbResponse.headers.get('set-cookie')
		if (setCookieHeader) {
			response.headers.set('set-cookie', setCookieHeader)
		}

		return response
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		)
	}
}
