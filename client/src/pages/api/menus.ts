import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// Next.js rewrites�??�용?�여 ?��? 경로 ?�용
		// next.config.mjs?�서 /api/:path* -> 백엔?�로 ?�록???�정??
		const response = await fetch('/api/sys/menus', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // ?�션 쿠키 ?�함
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
		res.status(500).json({ error: '메뉴 ?�이?��? 가?�오?�데 ?�패?�습?�다.' })
	}
}


