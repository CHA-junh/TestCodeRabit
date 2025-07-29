import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface RouteParams {
	params: {
		usrRoleId: string
	}
}

// 역할 복사 (POST)
export async function POST(request: NextRequest, { params }: RouteParams) {
	const { usrRoleId } = params
	try {
		const response = await fetch(
			`${API_URL}/sys/user-roles/${usrRoleId}/copy`,
			{
				method: 'POST',
			}
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || '역할 복사에 실패했습니다.')
		}
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to copy user role:', error)

		// error 타입 가드
		const errorMessage =
			error instanceof Error ? error.message : '역할 복사에 실패했습니다.'

		return NextResponse.json({ message: errorMessage }, { status: 500 })
	}
}
