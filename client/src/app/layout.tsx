'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AuthProvider } from '../modules/auth/hooks/useAuth'
import { ToastProvider } from '../contexts/ToastContext'
import { getPageTitle, getSystemName } from '../utils/environment'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const isAuthPage =
		pathname?.startsWith('/signin') || pathname?.startsWith('/signup')

	// ?μ΄μ§λ³???΄ν? ?€μ 
	useEffect(() => {
		if (!pathname) return

		let pageTitle = ''

		if (pathname.startsWith('/signin')) {
			pageTitle = 'λ‘κ·Έ??
		} else if (pathname.startsWith('/mainframe')) {
			// λ©μΈ?λ ?μ? ?μ€?λͺλ§??μ
			document.title = getSystemName()
			return
		} else if (pathname === '/') {
			pageTitle = '??
		}

		document.title = getPageTitle(pageTitle)
	}, [pathname])

	// WebSocket ?μ  μ°¨λ¨
	useEffect(() => {
		// WebSocket ?μ±???μ  μ°¨λ¨
		const originalWebSocket = (window as any).WebSocket
		;(window as any).WebSocket = function (
			url: string,
			protocols?: string | string[]
		) {
			// webpack-hmr κ΄???°κ²° ?λλ§?μ°¨λ¨ (λ©μμ§ ?μ΄)
			if (
				url &&
				(url.includes('webpack-hmr') || url.includes('_next/webpack-hmr'))
			) {
				return {
					readyState: 3,
					url: url,
					protocol: protocols || '',
					extensions: '',
					bufferedAmount: 0,
					onopen: null,
					onclose: null,
					onmessage: null,
					onerror: null,
					close: () => {},
					send: () => {},
					addEventListener: () => {},
					removeEventListener: () => {},
					dispatchEvent: () => false,
				}
			}
			// ?€λ₯Έ WebSocket ?°κ²°? ?μ μ²λ¦¬
			return new originalWebSocket(url, protocols)
		}

		// μ»΄ν¬?νΈ ?Έλ§?΄νΈ ???λ WebSocket λ³΅μ
		return () => {
			;(window as any).WebSocket = originalWebSocket
		}
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<html lang='ko'>
				<body
					className={isAuthPage ? '' : 'min-h-screen h-screen overflow-hidden'}
				>
					<AuthProvider>
						<ToastProvider>{children}</ToastProvider>
					</AuthProvider>
				</body>
			</html>
		</QueryClientProvider>
	)
}



