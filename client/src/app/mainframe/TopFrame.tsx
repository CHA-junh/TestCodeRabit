'use client'

import React, { useState } from 'react'
import '../common/common.css'
import { getSystemName } from '../../utils/environment'
import { useToast } from '../../contexts/ToastContext'

interface TopFrameProps {
	userName?: string
	userTeam?: string
	userPosition?: string
	userEmpNo?: string
	notice?: string
}

const TopFrame: React.FC<TopFrameProps> = ({
	userName = '김부뜰',
	userTeam = 'SI 3팀',
	userPosition = '대리',
	userEmpNo = '25',
	notice = '공지사항내용이 표시됩니다.',
}) => {
	const { showToast } = useToast()
	const [searchTerm, setSearchTerm] = useState('')

	// 사용자 정보 표시 형식: "SI 2팀(25) 성지훈 차장"
	const userDisplayName = (() => {
		if (!userTeam || !userName || !userPosition) {
			return userName || '사용자'
		}
		return `${userTeam}(${userEmpNo}) ${userName} ${userPosition}`
	})()

	// 검색 핸들러
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			showToast('KMS 검색 연동 준비중입니다.', 'info')
		}
	}

	// 검색어 입력 핸들러
	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	// 검색 아이콘 클릭 핸들러
	const handleSearchIconClick = () => {
		if (searchTerm.trim()) {
			showToast('KMS 검색 연동 준비중입니다.', 'info')
		}
	}

	return (
		<header className='w-full h-16 bg-[#374151] px-4 flex items-center text-white text-sm min-w-[900px] whitespace-nowrap'>
			{/* 로고 */}
			<div className='flex items-center gap-2 pr-4 w-[230px] h-auto flex-shrink-0'>
				<img src='/logo-top-wh.svg' alt='Logo' className='h-8' />
			</div>
			{/* 구분선 */}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* 프로필 + 이름 */}
			<div className='flex items-center gap-2 pr-4 h-8'>
				<div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center'>
					<img src='/icon_user.svg' alt='user' className='w-4 h-4' />
				</div>
				<div className='text-white text-sm leading-8 font-medium'>
					{userDisplayName}
				</div>
			</div>
			{/* 구분선 */}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* 알림 + 공지 */}
			<div className='flex items-center gap-2 flex-shrink-0 h-8'>
				<div className='w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center'>
					<img src='/icon_notice.svg' alt='notice' className='w-4 h-4' />
				</div>
				<div className='whitespace-nowrap text-white leading-8'>{notice}</div>
			</div>
			{/* 구분선 */}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* 검색창 */}
			<form
				onSubmit={handleSearch}
				className='flex items-center ml-auto bg-[#3f4a5a] rounded px-3 py-1 w-[240px]'
			>
				<input
					type='text'
					placeholder='검색어를 입력하세요'
					value={searchTerm}
					onChange={handleSearchInput}
					className='flex-1 bg-transparent text-white placeholder:text-gray-300 text-sm outline-none'
				/>
				<svg
					className='w-4 h-4 text-gray-300 ml-2 cursor-pointer hover:text-white transition-colors'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					viewBox='0 0 24 24'
					onClick={handleSearchIconClick}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M21 21l-5.2-5.2m0 0A7.5 7.5 0 1010 17.5a7.5 7.5 0 005.8-1.7z'
					/>
				</svg>
			</form>
			{/* 구분선 */}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* 버튼 2개 */}
			<div className='flex items-center gap-2 ml-3'>
				<button
					onClick={() => window.open('https://www.buttle.co.kr/', '_blank')}
					className='bg-[#4b5563] px-3 py-2 rounded text-sm hover:brightness-110 transition-colors'
				>
					부뜰 홈페이지 바로가기
				</button>
				<button
					onClick={() =>
						window.open('https://buttle.daouoffice.com/login', '_blank')
					}
					className='bg-[#4b5563] px-3 py-2 rounded text-sm hover:brightness-110 transition-colors'
				>
					그룹웨어로 바로가기
				</button>
			</div>
		</header>
	)
}

export default TopFrame
