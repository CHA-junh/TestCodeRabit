import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ?ฌ์ฉ????  ๋ชฉ๋ก ์กฐํ (GET)
export async function GET() {
	try {
		const response = await fetch(`${API_URL}/api/sys/user-roles`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`Server responded with ${response.status}`)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch user roles:', error)

		// error ???๊ฐ??
		const errorMessage =
			error instanceof Error
				? error.message
				: '?ฌ์ฉ????  ์กฐํ???คํจ?์ต?๋ค.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}

// ?ฌ์ฉ????  ???(POST)
export async function POST(request: NextRequest) {
	try {
		const payload = await request.json()
		const response = await fetch(`${API_URL}/api/sys/user-roles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || '??ฅ์ ?คํจ?์ต?๋ค.')
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to save user roles:', error)

		// error ???๊ฐ??
		const errorMessage =
			error instanceof Error
				? error.message
				: '?ฌ์ฉ????  ??ฅ์ ?คํจ?์ต?๋ค.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}


