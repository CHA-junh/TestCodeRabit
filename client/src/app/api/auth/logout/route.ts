import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		// ?ธ์ ์ฟ ํค ?? 
		const response = NextResponse.json({
			success: true,
			message: '๋ก๊ทธ?์ ?ฑ๊ณต',
		})

		response.cookies.set('session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0, // ์ฆ์ ๋ง๋ฃ
			path: '/', // ๋ชจ๋  ๊ฒฝ๋ก?์ ์ฟ ํค ?? 
		})

		return response
	} catch (error) {
		console.error('๋ก๊ทธ?์ API ?ค๋ฅ:', error)
		return NextResponse.json(
			{ success: false, message: '๋ก๊ทธ?์ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.' },
			{ status: 500 }
		)
	}
}


