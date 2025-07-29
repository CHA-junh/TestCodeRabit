import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// 사용자 역할 목록 조회 (GET)
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

		// error 타입 가드
		const errorMessage =
			error instanceof Error
				? error.message
				: '사용자 역할 조회에 실패했습니다.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}

// 사용자 역할 저장 (POST)
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
			throw new Error(errorData.message || '저장에 실패했습니다.')
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to save user roles:', error)

		// error 타입 가드
		const errorMessage =
			error instanceof Error
				? error.message
				: '사용자 역할 저장에 실패했습니다.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}
