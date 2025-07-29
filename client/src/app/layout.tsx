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

	// ?˜ì´ì§€ë³??€?´í? ?¤ì •
	useEffect(() => {
		if (!pathname) return

		let pageTitle = ''

		if (pathname.startsWith('/signin')) {
			pageTitle = 'ë¡œê·¸??
		} else if (pathname.startsWith('/mainframe')) {
			// ë©”ì¸?„ë ˆ?„ì? ?œìŠ¤?œëª…ë§??œì‹œ
			document.title = getSystemName()
			return
		} else if (pathname === '/') {
			pageTitle = '??
		}

		document.title = getPageTitle(pageTitle)
	}, [pathname])

	// WebSocket ?„ì „ ì°¨ë‹¨
	useEffect(() => {
		// WebSocket ?ì„±???„ì „ ì°¨ë‹¨
		const originalWebSocket = (window as any).WebSocket
		;(window as any).WebSocket = function (
			url: string,
			protocols?: string | string[]
		) {
			// webpack-hmr ê´€???°ê²° ?œë„ë§?ì°¨ë‹¨ (ë©”ì‹œì§€ ?†ì´)
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
			// ?¤ë¥¸ WebSocket ?°ê²°?€ ?•ìƒ ì²˜ë¦¬
			return new originalWebSocket(url, protocols)
		}

		// ì»´í¬?ŒíŠ¸ ?¸ë§ˆ?´íŠ¸ ???ëž˜ WebSocket ë³µì›
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




