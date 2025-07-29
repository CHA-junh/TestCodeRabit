'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import AuthService from '../services/authService'

// 사용자 정보 타입
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

// 세션 정보 타입 (레거시 호환성)
interface Session {
	user: User | null
}

// 인증 컨텍스트 타입
interface AuthContextType {
	user: User | null
	session: Session
	loading: boolean
	isAuthenticated: boolean
	login: (empNo: string, password: string) => Promise<any>
	logout: () => Promise<void>
	checkSession: () => Promise<void>
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 프로바이더 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// 인증 상태 계산
	const isAuthenticated = !!user

	// 세션 객체 (레거시 호환성)
	const session: Session = { user }

	// 세션 확인
	const checkSession = async () => {
		try {
			const data = await AuthService.checkSession()

			if (data.success && data.user) {
				// 서버 응답을 클라이언트 UserInfo로 변환
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
			// 불필요한 콘솔 에러 로그 제거 (401 등 인증 실패는 조용히 무시)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// 로그인
	const login = async (empNo: string, password: string) => {
		try {
			const data = await AuthService.login(empNo, password)

			if (data.success && data.user) {
				// 서버 응답을 클라이언트 UserInfo로 변환
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
			// 로그 완전 제거 - 보안상 민감한 정보 노출 방지
			throw error
		}
	}

	// 로그아웃
	const logout = async () => {
		try {
			console.log('🚪 로그아웃 시작')

			// 즉시 클라이언트 상태 초기화
			setUser(null)

			// 서버 로그아웃 API 호출 (오류 무시)
			AuthService.logout().catch(() => {
				// 오류 무시 - 페이지 이동으로 인한 정상적인 실패
			})

			// 브라우저 캐시 완전 삭제
			if (typeof window !== 'undefined' && 'caches' in window) {
				try {
					const cacheNames = await caches.keys()
					await Promise.all(cacheNames.map((name) => caches.delete(name)))
					console.log('🗑️ 브라우저 캐시 삭제 완료')
				} catch (cacheError) {
					console.log('캐시 삭제 실패 (무시됨):', cacheError)
				}
			}

			// 강제 페이지 이동 (replace로 히스토리 덮어쓰기)
			if (typeof window !== 'undefined') {
				console.log('🔄 로그인 페이지로 이동 중...')
				// 히스토리 완전 초기화
				window.history.pushState(null, '', '/signin')
				window.location.replace('/signin')
			}
		} catch (error) {
			console.error('로그아웃 오류:', error)
			// 에러가 발생해도 클라이언트 상태는 초기화
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.replace('/signin')
			}
		}
	}

	// 초기 세션 확인
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

// 인증 훅
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
