import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		// 세션 쿠키 삭제
		const response = NextResponse.json({
			success: true,
			message: '로그아웃 성공',
		})

		response.cookies.set('session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0, // 즉시 만료
			path: '/', // 모든 경로에서 쿠키 삭제
		})

		return response
	} catch (error) {
		console.error('로그아웃 API 오류:', error)
		return NextResponse.json(
			{ success: false, message: '로그아웃 중 오류가 발생했습니다.' },
			{ status: 500 }
		)
	}
}
