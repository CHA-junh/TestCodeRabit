import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// Next.js rewrites를 활용하여 상대 경로 사용
		// next.config.mjs에서 /api/:path* -> 백엔드로 프록시 설정됨
		const response = await fetch('/api/sys/menus', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // 세션 쿠키 포함
		})

		if (!response.ok) {
			throw new Error(`Backend API error: ${response.status}`)
		}

		const data = await response.json()

		if (data.success) {
			res.status(200).json(data.data)
		} else {
			res.status(400).json({ error: data.message })
		}
	} catch (error) {
		console.error('Menu API error:', error)
		res.status(500).json({ error: '메뉴 데이터를 가져오는데 실패했습니다.' })
	}
}
