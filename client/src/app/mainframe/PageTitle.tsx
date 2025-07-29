'use client'

import React from 'react'
import Image from 'next/image'

interface Props {
	programId: string
	title: string
	onClose?: () => void
}

export default function PageTitle({ programId, title, onClose }: Props) {
	return (
		<div className='flex justify-between items-center px-2 py-2'>
			<div className='flex items-center gap-2'>
				<Image src='/icon_star.svg' alt='star' width={16} height={16} />
				<span className='text-xs text-gray-400 m-2 ml-auto'>{`[${programId}]`}</span>
				<span className='text-sm font-bold text-gray-800 m-2 ml-auto'>
					{title}
				</span>
			</div>
			<div className='flex items-center gap-2'>
				<button
					onClick={() => {
						if (typeof window !== 'undefined') {
							window.open(
								'',
								'_blank',
								'width=800,height=600,scrollbars=yes,resizable=yes'
							)
						}
					}}
					className='hover:opacity-70 transition-opacity'
					title='개발???�구'
				>
					<Image src='/icon_bug.svg' alt='버그' width={16} height={16} />
				</button>
				<button
					onClick={() => {
						alert(
							`?�로그램 ?�보\n\n?�로그램 ID: ${programId}\n?�로그램�? ${title}`
						)
					}}
					className='hover:opacity-70 transition-opacity'
					title='?�로그램 ?�보'
				>
					<Image src='/icon_infor.svg' alt='?�보' width={16} height={16} />
				</button>
				<button
					onClick={onClose}
					className='hover:opacity-70 transition-opacity'
					title='�??�기'
				>
					<Image src='/icon_close.svg' alt='?�기' width={16} height={16} />
				</button>
			</div>
		</div>
	)
}



