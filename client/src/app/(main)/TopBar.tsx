'use client'
import React from 'react'
import { useAuth } from '../../modules/auth/hooks/useAuth'

const TopBar = () => {
	const { user, isAuthenticated, loading } = useAuth()

	console.log('?�� TopBar - ?�용???�보:', user)
	console.log('?�� TopBar - ?�용???�보 ?�세:', {
		userId: user?.userId,
		name: user?.name,
		department: user?.department,
		position: user?.position,
		empNo: user?.empNo,
		email: user?.email,
	})
	console.log('?�� TopBar - department:', user?.department)
	console.log('?�� TopBar - name:', user?.name)
	console.log('?�� TopBar - position:', user?.position)
	console.log('?�� TopBar - ?�증 ?�태:', isAuthenticated)
	console.log('?�� TopBar - 로딩 ?�태:', loading)

	return (
		<header
			className='h-14 flex items-center px-6 border-b border-blue-200'
			style={{ backgroundColor: '#b0c4de' }}
		>
			{/* ?�쪽: ?�사�? |, ?�원?�보, |, 공�??�항 */}
			<div className='flex items-center space-x-4'>
				<div className='flex items-center space-x-2'>
					<img src='/logo_bist.png' alt='로고' className='h-8 w-auto' />
					<span className='text-blue-700 font-bold text-lg'>(�?부?�전??/span>
				</div>
				<span className='mx-4 text-blue-100 text-lg font-bold'>|</span>
				{user && (
					<div className='flex items-center space-x-3'>
						<div className='bg-blue-800 rounded-full w-9 h-9 flex items-center justify-center shadow'>
							<span className='text-white text-xl'>?��</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-blue-700 font-semibold text-base'>
								{user.department} {user.name} {user.position}
							</span>
						</div>
					</div>
				)}
				<span className='mx-4 text-blue-100 text-lg font-bold'>|</span>
				<div className='flex items-center bg-yellow-100 rounded px-3 py-1 text-sm text-blue-700 font-semibold shadow'>
					<span className='mr-2 text-lg'>?��</span> 공�??�항?�용???�시?�니??
				</div>
				<span className='mx-4 text-blue-100 text-lg font-bold'>|</span>
			</div>
			{/* ?�른�? 검?�창 */}
			<div className='relative ml-auto'>
				<input
					className='border border-blue-200 rounded-full px-4 py-1 text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-blue-700'
					placeholder='검??..'
				/>
				<span className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg'>
					?��
				</span>
			</div>
		</header>
	)
}

export default TopBar



