'use client'

import React from 'react'

interface Tab {
	id: string // programId?€ ?™ì¼?˜ê²Œ ?¬ìš©
	title: string
}

interface MaintabProps {
	tabs: Tab[]
	activeTab: string
	onTabClick: (id: string) => void
	onTabClose: (id: string) => void
}

export default function Maintab({
	tabs = [],
	activeTab,
	onTabClick,
	onTabClose,
}: MaintabProps) {
	return (
		<div className='flex items-center h-10 px-2 overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-[#cbd5e1] scrollbar-track-transparent mt-1'>
			{tabs.map((tab) => {
				const isActive = tab.id === activeTab
				return (
					<div
						key={tab.id}
						className={`flex items-center px-3 h-8 mx-1 rounded-md cursor-pointer shrink-0
              ${isActive ? 'bg-[#0057B8]' : 'bg-[#E2EFFF]'}`}
						onClick={() => onTabClick(tab.id)}
					>
						<span
							className={`text-sm font-nanum m-2 ${
								isActive ? 'text-white' : 'text-[#798EA2]'
							}`}
						>
							{tab.title}
						</span>
						<button
							onClick={(e) => {
								e.stopPropagation()
								onTabClose(tab.id)
							}}
							className={`ml-1 w-5 h-5 flex items-center justify-center text-lg
                ${isActive ? 'text-white hover:text-slate-100' : 'text-[#798EA2] hover:text-[#4B6A88]'}`}
						>
							Ã—
						</button>
					</div>
				)
			})}
		</div>
	)
}


