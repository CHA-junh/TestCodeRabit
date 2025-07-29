import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Context = {
	params: {
		usrRoleId: string;
	};
};

// 역할별 프로그램 그룹 조회 (GET)
export async function GET(request: NextRequest, context: Context) {
	const { usrRoleId } = context.params;

	try {
		// 백엔드의 올바른 API 경로(/api/sys/user-roles/...)로 요청
		const response = await fetch(
			`${API_URL}/api/sys/user-roles/${usrRoleId}/program-groups`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Backend error:", errorText);
			throw new Error(`Server responded with ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(
			`Failed to fetch program groups for role ${usrRoleId}:`,
			error
		);
		return NextResponse.json(
			{ message: "프로그램 그룹 조회에 실패했습니다." },
			{ status: 500 }
		);
	}
}

// 역할별 프로그램 그룹 저장 (POST)
export async function POST(request: NextRequest, context: Context) {
	const { usrRoleId } = context.params;
	const payload = await request.json();

	try {
		const response = await fetch(
			`${API_URL}/api/sys/user-roles/${usrRoleId}/program-groups`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Backend error:", errorText);
			throw new Error(`Server responded with ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(
			`Failed to save program groups for role ${usrRoleId}:`,
			error
		);
		return NextResponse.json(
			{ message: "프로그램 그룹 저장에 실패했습니다." },
			{ status: 500 }
		);
	}
}
