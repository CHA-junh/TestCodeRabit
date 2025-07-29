import { useEffect } from 'react'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	useEffect(() => {
		// body???´ëž˜?¤ë? ?„ì „??ë¹„ì?
		document.body.className = ''
	}, [])

	return (
		<div className='min-h-screen h-screen bg-blue-50 flex items-center justify-center'>
			{children}
		</div>
	)
}


