'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../services/authService'

// ?¬ì©???ë³´ ???
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

// ?¸ì ?ë³´ ???(?ê±°???¸í??
interface Session {
	user: User | null
}

// ?¸ì¦ ì»¨í?¤í¸ ???
interface AuthContextType {
	user: User | null
	session: Session
	loading: boolean
	isAuthenticated: boolean
	login: (empNo: string, password: string) => Promise<any>
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

// ?¸ì¦ ì»¨í?¤í¸ ?ì±
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ?¸ì¦ ?ë¡ë°ì´??ì»´í¬?í¸
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// ?¸ì¦ ?í ê³ì°
	const isAuthenticated = !!user

	// ?¸ì ê°ì²´ (?ê±°???¸í??
	const session: Session = { user }

	// ?¸ì ?ì¸
	const checkSession = async () => {
		try {
			const data = await AuthService.checkSession()

			if (data.success && data.user) {
				// ?ë² ?ëµ???´ë¼?´ì¸??UserInfoë¡?ë³??
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
			// ë¶í?í ì½ì ?ë¬ ë¡ê·¸ ?ê±° (401 ???¸ì¦ ?¤í¨??ì¡°ì©??ë¬´ì)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// ë¡ê·¸??
	const login = async (empNo: string, password: string) => {
		try {
			const data = await AuthService.login(empNo, password)

			if (data.success && data.user) {
				// ?ë² ?ëµ???´ë¼?´ì¸??UserInfoë¡?ë³??
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
			// ë¡ê·¸ ?ì  ?ê±° - ë³´ì??ë¯¼ê°???ë³´ ?¸ì¶ ë°©ì?
			throw error
		}
	}

	// ë¡ê·¸?ì
	const logout = async () => {
		try {
			console.log('?ª ë¡ê·¸?ì ?ì')

			// ì¦ì ?´ë¼?´ì¸???í ì´ê¸°??
			setUser(null)

			// ?ë² ë¡ê·¸?ì API ?¸ì¶ (?¤ë¥ ë¬´ì)
			AuthService.logout().catch(() => {
				// ?¤ë¥ ë¬´ì - ?ì´ì§ ?´ë?¼ë¡ ?¸í ?ì?ì¸ ?¤í¨
			})

			// ë¸ë¼?°ì? ìºì ?ì  ?? 
			if (typeof window !== 'undefined' && 'caches' in window) {
				try {
					const cacheNames = await caches.keys()
					await Promise.all(cacheNames.map((name) => caches.delete(name)))
					console.log('?ï¸?ë¸ë¼?°ì? ìºì ??  ?ë£')
				} catch (cacheError) {
					console.log('ìºì ??  ?¤í¨ (ë¬´ì??:', cacheError)
				}
			}

			// ê°ì  ?ì´ì§ ?´ë (replaceë¡??ì¤? ë¦¬ ??´?°ê¸°)
			if (typeof window !== 'undefined') {
				console.log('? ë¡ê·¸???ì´ì§ë¡??´ë ì¤?..')
				// ?ì¤? ë¦¬ ?ì  ì´ê¸°??
				window.history.pushState(null, '', '/signin')
				window.location.replace('/signin')
			}
		} catch (error) {
			console.error('ë¡ê·¸?ì ?¤ë¥:', error)
			// ?ë¬ê° ë°ì?´ë ?´ë¼?´ì¸???í??ì´ê¸°??
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.replace('/signin')
			}
		}
	}

	// ì´ê¸° ?¸ì ?ì¸
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


