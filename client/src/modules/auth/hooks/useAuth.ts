'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../services/authService'

// ?¬ìš©???•ë³´ ?€??
interface User {
	userId: string
	empNo: string
	name: string
	email: string
	department: string
	position: string
	role: string
	permissions: string[]
	lastLoginAt: string
	menuList: any[]
	programList: any[]
	needsPasswordChange?: boolean
	deptDivCd?: string
	hqDivCd?: string
	hqDivNm?: string
	deptTp?: string
	dutyDivCd?: string
	authCd?: string
}

// ?¸ì…˜ ?•ë³´ ?€??(?ˆê±°???¸í™˜??
interface Session {
	user: User | null
}

// ?¸ì¦ ì»¨í…?¤íŠ¸ ?€??
interface AuthContextType {
	user: User | null
	session: Session
	loading: boolean
	isAuthenticated: boolean
	login: (empNo: string, password: string) => Promise<any>
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

// ?¸ì¦ ì»¨í…?¤íŠ¸ ?ì„±
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ?¸ì¦ ?„ë¡œë°”ì´??ì»´í¬?ŒíŠ¸
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// ?¸ì¦ ?íƒœ ê³„ì‚°
	const isAuthenticated = !!user

	// ?¸ì…˜ ê°ì²´ (?ˆê±°???¸í™˜??
	const session: Session = { user }

	// ?¸ì…˜ ?•ì¸
	const checkSession = async () => {
		try {
			const data = await AuthService.checkSession()

			if (data.success && data.user) {
				// ?œë²„ ?‘ë‹µ???´ë¼?´ì–¸??UserInfoë¡?ë³€??
				const plainUser = JSON.parse(JSON.stringify(data.user))

				const userInfo: User = {
					userId: plainUser.userId ?? '',
					empNo: plainUser.empNo ?? plainUser.userId ?? '',
					name: plainUser.userName ?? plainUser.name ?? '',
					email: plainUser.email ?? plainUser.emailAddr ?? '',
					department: plainUser.deptNm ?? '',
					position: plainUser.dutyNm ?? '',
					role:
						plainUser.role ?? (plainUser.authCd === '30' ? 'ADMIN' : 'USER'),
					permissions: plainUser.permissions ?? ['read', 'write'],
					lastLoginAt: plainUser.lastLoginAt ?? new Date().toISOString(),
					menuList: plainUser.menuList ?? [],
					programList: plainUser.programList ?? [],
					needsPasswordChange: plainUser.needsPasswordChange ?? false,
					deptDivCd: plainUser.deptDivCd ?? '',
					hqDivCd: plainUser.hqDivCd ?? '',
					hqDivNm: plainUser.hqDivNm ?? '',
					deptTp: plainUser.deptTp ?? '',
					dutyDivCd: plainUser.dutyDivCd ?? '',
					authCd: plainUser.authCd ?? '',
				}

				setUser(userInfo)
			} else {
				setUser(null)
			}
		} catch (error) {
			// ë¶ˆí•„?”í•œ ì½˜ì†” ?ëŸ¬ ë¡œê·¸ ?œê±° (401 ???¸ì¦ ?¤íŒ¨??ì¡°ìš©??ë¬´ì‹œ)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// ë¡œê·¸??
	const login = async (empNo: string, password: string) => {
		try {
			const data = await AuthService.login(empNo, password)

			if (data.success && data.user) {
				// ?œë²„ ?‘ë‹µ???´ë¼?´ì–¸??UserInfoë¡?ë³€??
				const plainUser = JSON.parse(JSON.stringify(data.user))
				const userInfo: User = {
					userId: plainUser.userId ?? '',
					empNo: plainUser.empNo ?? plainUser.userId ?? '',
					name: plainUser.userName ?? plainUser.name ?? '',
					email: plainUser.email ?? plainUser.emailAddr ?? '',
					department: plainUser.deptNm ?? '',
					position: plainUser.dutyNm ?? '',
					role:
						plainUser.role ?? (plainUser.authCd === '30' ? 'ADMIN' : 'USER'),
					permissions: plainUser.permissions ?? ['read', 'write'],
					lastLoginAt: plainUser.lastLoginAt ?? new Date().toISOString(),
					menuList: plainUser.menuList ?? [],
					programList: plainUser.programList ?? [],
					needsPasswordChange: plainUser.needsPasswordChange ?? false,
					deptDivCd: plainUser.deptDivCd ?? '',
					hqDivCd: plainUser.hqDivCd ?? '',
					hqDivNm: plainUser.hqDivNm ?? '',
					deptTp: plainUser.deptTp ?? '',
					dutyDivCd: plainUser.dutyDivCd ?? '',
					authCd: plainUser.authCd ?? '',
				}

				setUser(userInfo)
			}

			return data
		} catch (error) {
			// ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
			throw error
		}
	}

	// ë¡œê·¸?„ì›ƒ
	const logout = async () => {
		try {
			console.log('?šª ë¡œê·¸?„ì›ƒ ?œì‘')

			// ì¦‰ì‹œ ?´ë¼?´ì–¸???íƒœ ì´ˆê¸°??
			setUser(null)

			// ?œë²„ ë¡œê·¸?„ì›ƒ API ?¸ì¶œ (?¤ë¥˜ ë¬´ì‹œ)
			AuthService.logout().catch(() => {
				// ?¤ë¥˜ ë¬´ì‹œ - ?˜ì´ì§€ ?´ë™?¼ë¡œ ?¸í•œ ?•ìƒ?ì¸ ?¤íŒ¨
			})

			// ë¸Œë¼?°ì? ìºì‹œ ?„ì „ ?? œ
			if (typeof window !== 'undefined' && 'caches' in window) {
				try {
					const cacheNames = await caches.keys()
					await Promise.all(cacheNames.map((name) => caches.delete(name)))
					console.log('?—‘ï¸?ë¸Œë¼?°ì? ìºì‹œ ?? œ ?„ë£Œ')
				} catch (cacheError) {
					console.log('ìºì‹œ ?? œ ?¤íŒ¨ (ë¬´ì‹œ??:', cacheError)
				}
			}

			// ê°•ì œ ?˜ì´ì§€ ?´ë™ (replaceë¡??ˆìŠ¤? ë¦¬ ??–´?°ê¸°)
			if (typeof window !== 'undefined') {
				console.log('?”„ ë¡œê·¸???˜ì´ì§€ë¡??´ë™ ì¤?..')
				// ?ˆìŠ¤? ë¦¬ ?„ì „ ì´ˆê¸°??
				window.history.pushState(null, '', '/signin')
				window.location.replace('/signin')
			}
		} catch (error) {
			console.error('ë¡œê·¸?„ì›ƒ ?¤ë¥˜:', error)
			// ?ëŸ¬ê°€ ë°œìƒ?´ë„ ?´ë¼?´ì–¸???íƒœ??ì´ˆê¸°??
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.replace('/signin')
			}
		}
	}

	// ì´ˆê¸° ?¸ì…˜ ?•ì¸
	useEffect(() => {
		checkSession()
	}, [])

	const value = {
		user,
		session,
		loading,
		isAuthenticated,
		login,
		logout,
		checkSession,
	}

	return React.createElement(AuthContext.Provider, { value }, children)
}

// ?¸ì¦ ??
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}



