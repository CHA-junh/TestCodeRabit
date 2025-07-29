export default function PopupLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ko'>
			<head>
				<title>BIST - POPUP</title>
				<meta name='description' content='BIST SYSTEM POPUP' />
			</head>
			<body className='bg-white'>{children}</body>
		</html>
	)
}
