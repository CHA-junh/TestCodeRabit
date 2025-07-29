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
	userName = 'ê¹€ë¶€??,
	userTeam = 'SI 3?€',
	userPosition = '?€ë¦?,
	userEmpNo = '25',
	notice = 'ê³µì??¬í•­?´ìš©???œì‹œ?©ë‹ˆ??',
}) => {
	const { showToast } = useToast()
	const [searchTerm, setSearchTerm] = useState('')

	// ?¬ìš©???•ë³´ ?œì‹œ ?•ì‹: "SI 2?€(25) ?±ì???ì°¨ì¥"
	const userDisplayName = (() => {
		if (!userTeam || !userName || !userPosition) {
			return userName || '?¬ìš©??
		}
		return `${userTeam}(${userEmpNo}) ${userName} ${userPosition}`
	})()

	// ê²€???¸ë“¤??
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			showToast('KMS ê²€???°ë™ ì¤€ë¹„ì¤‘?…ë‹ˆ??', 'info')
		}
	}

	// ê²€?‰ì–´ ?…ë ¥ ?¸ë“¤??
	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	// ê²€???„ì´ì½??´ë¦­ ?¸ë“¤??
	const handleSearchIconClick = () => {
		if (searchTerm.trim()) {
			showToast('KMS ê²€???°ë™ ì¤€ë¹„ì¤‘?…ë‹ˆ??', 'info')
		}
	}

	return (
		<header className='w-full h-16 bg-[#374151] px-4 flex items-center text-white text-sm min-w-[900px] whitespace-nowrap'>
			{/* ë¡œê³  */}
			<div className='flex items-center gap-2 pr-4 w-[230px] h-auto flex-shrink-0'>
				<img src='/logo-top-wh.svg' alt='Logo' className='h-8' />
			</div>
			{/* êµ¬ë¶„??*/}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* ?„ë¡œ??+ ?´ë¦„ */}
			<div className='flex items-center gap-2 pr-4 h-8'>
				<div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center'>
					<img src='/icon_user.svg' alt='user' className='w-4 h-4' />
				</div>
				<div className='text-white text-sm leading-8 font-medium'>
					{userDisplayName}
				</div>
			</div>
			{/* êµ¬ë¶„??*/}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* ?Œë¦¼ + ê³µì? */}
			<div className='flex items-center gap-2 flex-shrink-0 h-8'>
				<div className='w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center'>
					<img src='/icon_notice.svg' alt='notice' className='w-4 h-4' />
				</div>
				<div className='whitespace-nowrap text-white leading-8'>{notice}</div>
			</div>
			{/* êµ¬ë¶„??*/}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* ê²€?‰ì°½ */}
			<form
				onSubmit={handleSearch}
				className='flex items-center ml-auto bg-[#3f4a5a] rounded px-3 py-1 w-[240px]'
			>
				<input
					type='text'
					placeholder='ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??
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
			{/* êµ¬ë¶„??*/}
			<div className='h-full w-px bg-gray-600 mx-3' />
			{/* ë²„íŠ¼ 2ê°?*/}
			<div className='flex items-center gap-2 ml-3'>
				<button
					onClick={() => window.open('https://www.buttle.co.kr/', '_blank')}
					className='bg-[#4b5563] px-3 py-2 rounded text-sm hover:brightness-110 transition-colors'
				>
					ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?
				</button>
				<button
					onClick={() =>
						window.open('https://buttle.daouoffice.com/login', '_blank')
					}
					className='bg-[#4b5563] px-3 py-2 rounded text-sm hover:brightness-110 transition-colors'
				>
					ê·¸ë£¹?¨ì–´ë¡?ë°”ë¡œê°€ê¸?
				</button>
			</div>
		</header>
	)
}

export default TopFrame


