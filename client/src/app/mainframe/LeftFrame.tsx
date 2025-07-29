'use client'

import React from 'react'
import '../common/common.css'

interface LeftFrameProps {
	onMenuClick?: () => void
	onLogout?: () => void
	onShortcutClick?: (action: string) => void
}

const menuItems = [
	{ label: 'ë©”ë‰´', icon: '/icon_menu.svg', action: 'menu' },
	{ label: '?¬ì—…ê´€ë¦?, icon: '/icon_business.svg', action: 'business' },
	{ label: '?„ë¡œ?íŠ¸', icon: '/icon_project.svg', action: 'project' },
	{ label: 'ì¶”ì§„ë¹?, icon: '/icon_cost.svg', action: 'cost' },
	{ label: '?¸ì‚¬ê´€ë¦?, icon: '/icon_hr.svg', action: 'hr' },
	{ label: '?œìŠ¤??, icon: '/icon_system.svg', action: 'system' },
]

const LeftFrame: React.FC<LeftFrameProps> = ({
	onMenuClick,
	onLogout,
	onShortcutClick,
}) => {
	const handleShortcutClick = (action: string) => {
		onShortcutClick?.(action)
	}

	return (
		<div className='w-20 h-full flex flex-col bg-[#F6FBFF] border-r border-slate-200'>
			{/* ?ë‹¨ ë©”ë‰´??*/}
			<div className='flex flex-col items-center gap-6 pt-6'>
				{menuItems.map((item, idx) => (
					<button
						key={idx}
						className='flex flex-col items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm'
						onClick={() => handleShortcutClick(item.action)}
					>
						<img
							src={item.icon}
							alt={`${item.label} ?„ì´ì½?}
							className='w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110'
						/>
						<span className='text-[11px] font-nanum text-[#3B82C4] text-center leading-tight'>
							{item.label}
						</span>
					</button>
				))}
			</div>
			{/* ?˜ë‹¨ ë¡œê·¸?„ì›ƒ */}
			<div className='mt-auto flex flex-col items-center gap-1 pb-6'>
				<button
					className='flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm'
					onClick={onLogout}
				>
					<img
						src='/icon_logout.svg'
						alt='ë¡œê·¸?„ì›ƒ ?„ì´ì½?
						className='w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110'
					/>
					<span className='text-[11px] font-nanum text-[#3B82C4] text-center'>
						ë¡œê·¸?„ì›ƒ
					</span>
				</button>
			</div>
		</div>
	)
}

export default LeftFrame



