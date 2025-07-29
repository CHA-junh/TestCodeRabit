import { useEffect } from 'react'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	useEffect(() => {
		// body의 클래스를 완전히 비움
		document.body.className = ''
	}, [])

	return (
		<div className='min-h-screen h-screen bg-blue-50 flex items-center justify-center'>
			{children}
		</div>
	)
}
