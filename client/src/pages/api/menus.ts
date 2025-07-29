import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// Next.js rewritesë¥??œìš©?˜ì—¬ ?ë? ê²½ë¡œ ?¬ìš©
		// next.config.mjs?ì„œ /api/:path* -> ë°±ì—”?œë¡œ ?„ë¡???¤ì •??
		const response = await fetch('/api/sys/menus', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // ?¸ì…˜ ì¿ í‚¤ ?¬í•¨
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
		res.status(500).json({ error: 'ë©”ë‰´ ?°ì´?°ë? ê°€?¸ì˜¤?”ë° ?¤íŒ¨?ˆìŠµ?ˆë‹¤.' })
	}
}


