import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// Next.js API ?„ë¡?œë? ?œìš©?˜ì—¬ ?ë? ê²½ë¡œ ?¬ìš©
		// next.config.mjs??rewrites ?¤ì •???˜í•´ ?ë™?¼ë¡œ ë°±ì—”?œë¡œ ?„ë¡?œë¨
		const backendResponse = await fetch(`http://localhost:8080/api/sys/menus`, {
			method: 'GET',
			headers: request.headers,
		})

		if (!backendResponse.ok) {
			const errorText = await backendResponse.text()
			console.error(
				`Error from backend: ${backendResponse.status} ${backendResponse.statusText}`,
				errorText
			)
			return NextResponse.json(
				{ error: 'Failed to fetch menus from backend' },
				{ status: backendResponse.status }
			)
		}

		const data = await backendResponse.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error in menus GET handler:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}


