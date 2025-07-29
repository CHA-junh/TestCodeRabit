'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface SideMenuProps {
	isOpen: boolean
	onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
	const [isLoading, setIsLoading] = useState(false)
	const { user, logout } = useAuth()
	const router = useRouter()

	const handleLogout = async () => {
		try {
			setIsLoading(true)
			await logout()
		} catch (error) {
			console.error('로그아웃 오류:', error)
		} finally {
			setIsLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex'>
			{/* 배경 오버레이 */}
			<div
				className='fixed inset-0 bg-black bg-opacity-50'
				onClick={onClose}
			></div>

			{/* 사이드 메뉴 */}
			<div className='relative w-80 bg-white shadow-xl'>
				{/* 헤더 */}
				<div className='flex items-center justify-between p-4 border-b'>
					<h2 className='text-lg font-semibold'>메뉴</h2>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-full'
						aria-label='메뉴 닫기'
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{/* 사용자 정보 */}
				<div className='p-4 border-b'>
					<div className='flex items-center space-x-3'>
						<div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
							<span className='text-white font-semibold'>
								{user?.name?.charAt(0) || 'U'}
							</span>
						</div>
						<div>
							<p className='font-semibold'>
								{user?.department && user?.empNo && user?.name && user?.position
									? `${user.department}(${user.empNo}) ${user.name} ${user.position}`
									: user?.name || '사용자'}
							</p>
							<p className='text-sm text-gray-600'>
								{user?.department || '부서'}
							</p>
						</div>
					</div>
				</div>

				{/* 메뉴 항목들 */}
				<div className='p-4'>
					<button
						onClick={handleLogout}
						disabled={isLoading}
						className='w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors'
					>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
							/>
						</svg>
						<span>{isLoading ? '로그아웃 중...' : '로그아웃'}</span>
					</button>
				</div>
			</div>
		</div>
	)
}
