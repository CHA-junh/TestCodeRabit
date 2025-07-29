import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ (GET)
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

		// error ?€??ê°€??
		const errorMessage =
			error instanceof Error
				? error.message
				: '?¬ìš©????•  ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}

// ?¬ìš©????•  ?€??(POST)
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
			throw new Error(errorData.message || '?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to save user roles:', error)

		// error ?€??ê°€??
		const errorMessage =
			error instanceof Error
				? error.message
				: '?¬ìš©????•  ?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}


