import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		// ?�션 쿠키 ??��
		const response = NextResponse.json({
			success: true,
			message: '로그?�웃 ?�공',
		})

		response.cookies.set('session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0, // 즉시 만료
			path: '/', // 모든 경로?�서 쿠키 ??��
		})

		return response
	} catch (error) {
		console.error('로그?�웃 API ?�류:', error)
		return NextResponse.json(
			{ success: false, message: '로그?�웃 �??�류가 발생?�습?�다.' },
			{ status: 500 }
		)
	}
}


