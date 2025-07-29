'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../services/authService'

// ?�용???�보 ?�??
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

// ?�션 ?�보 ?�??(?�거???�환??
interface Session {
	user: User | null
}

// ?�증 컨텍?�트 ?�??
interface AuthContextType {
	user: User | null
	session: Session
	loading: boolean
	isAuthenticated: boolean
	login: (empNo: string, password: string) => Promise<any>
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

// ?�증 컨텍?�트 ?�성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ?�증 ?�로바이??컴포?�트
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// ?�증 ?�태 계산
	const isAuthenticated = !!user

	// ?�션 객체 (?�거???�환??
	const session: Session = { user }

	// ?�션 ?�인
	const checkSession = async () => {
		try {
			const data = await AuthService.checkSession()

			if (data.success && data.user) {
				// ?�버 ?�답???�라?�언??UserInfo�?변??
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
			// 불필?�한 콘솔 ?�러 로그 ?�거 (401 ???�증 ?�패??조용??무시)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// 로그??
	const login = async (empNo: string, password: string) => {
		try {
			const data = await AuthService.login(empNo, password)

			if (data.success && data.user) {
				// ?�버 ?�답???�라?�언??UserInfo�?변??
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
			// 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
			throw error
		}
	}

	// 로그?�웃
	const logout = async () => {
		try {
			console.log('?�� 로그?�웃 ?�작')

			// 즉시 ?�라?�언???�태 초기??
			setUser(null)

			// ?�버 로그?�웃 API ?�출 (?�류 무시)
			AuthService.logout().catch(() => {
				// ?�류 무시 - ?�이지 ?�동?�로 ?�한 ?�상?�인 ?�패
			})

			// 브라?��? 캐시 ?�전 ??��
			if (typeof window !== 'undefined' && 'caches' in window) {
				try {
					const cacheNames = await caches.keys()
					await Promise.all(cacheNames.map((name) => caches.delete(name)))
					console.log('?���?브라?��? 캐시 ??�� ?�료')
				} catch (cacheError) {
					console.log('캐시 ??�� ?�패 (무시??:', cacheError)
				}
			}

			// 강제 ?�이지 ?�동 (replace�??�스?�리 ??��?�기)
			if (typeof window !== 'undefined') {
				console.log('?�� 로그???�이지�??�동 �?..')
				// ?�스?�리 ?�전 초기??
				window.history.pushState(null, '', '/signin')
				window.location.replace('/signin')
			}
		} catch (error) {
			console.error('로그?�웃 ?�류:', error)
			// ?�러가 발생?�도 ?�라?�언???�태??초기??
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.replace('/signin')
			}
		}
	}

	// 초기 ?�션 ?�인
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

// ?�증 ??
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}



