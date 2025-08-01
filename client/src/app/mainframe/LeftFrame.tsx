'use client'

import React from 'react'
import '../common/common.css'

interface LeftFrameProps {
	onMenuClick?: () => void
	onLogout?: () => void
	onShortcutClick?: (action: string) => void
}

const menuItems = [
	{ label: '๋ฉ๋ด', icon: '/icon_menu.svg', action: 'menu' },
	{ label: '?ฌ์๊ด๋ฆ?, icon: '/icon_business.svg', action: 'business' },
	{ label: '?๋ก?ํธ', icon: '/icon_project.svg', action: 'project' },
	{ label: '์ถ์ง๋น?, icon: '/icon_cost.svg', action: 'cost' },
	{ label: '?ธ์ฌ๊ด๋ฆ?, icon: '/icon_hr.svg', action: 'hr' },
	{ label: '?์ค??, icon: '/icon_system.svg', action: 'system' },
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
			{/* ?๋จ ๋ฉ๋ด??*/}
			<div className='flex flex-col items-center gap-6 pt-6'>
				{menuItems.map((item, idx) => (
					<button
						key={idx}
						className='flex flex-col items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm'
						onClick={() => handleShortcutClick(item.action)}
					>
						<img
							src={item.icon}
							alt={`${item.label} ?์ด์ฝ?}
							className='w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110'
						/>
						<span className='text-[11px] font-nanum text-[#3B82C4] text-center leading-tight'>
							{item.label}
						</span>
					</button>
				))}
			</div>
			{/* ?๋จ ๋ก๊ทธ?์ */}
			<div className='mt-auto flex flex-col items-center gap-1 pb-6'>
				<button
					className='flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm'
					onClick={onLogout}
				>
					<img
						src='/icon_logout.svg'
						alt='๋ก๊ทธ?์ ?์ด์ฝ?
						className='w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110'
					/>
					<span className='text-[11px] font-nanum text-[#3B82C4] text-center'>
						๋ก๊ทธ?์
					</span>
				</button>
			</div>
		</div>
	)
}

export default LeftFrame


