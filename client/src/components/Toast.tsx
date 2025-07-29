'use client'

import React, { useEffect } from 'react'

interface ToastProps {
	message: string
	type?: 'success' | 'info' | 'warning' | 'error'
	isVisible: boolean
	onClose: () => void
	duration?: number
}

export default function Toast({
	message,
	type = 'info',
	isVisible,
	onClose,
	duration = 3000,
}: ToastProps) {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose()
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [isVisible, duration, onClose])

	if (!isVisible) return null

	const bgColor = {
		success: 'bg-[#E8F5E8] border-[#4CAF50] text-[#2A2A2A]',
		info: 'bg-[#F2F8FF] border-[#BDD6EE] text-[#2A2A2A]',
		warning: 'bg-[#FFF8E1] border-[#FFD54F] text-[#2A2A2A]',
		error: 'bg-[#FFEBEE] border-[#EF5350] text-[#2A2A2A]',
	}[type]

	const icon = {
		success: '✅',
		info: '💡',
		warning: '⚠️',
		error: '❌',
	}[type]

	return (
		<div className='fixed bottom-4 left-4 z-50 animate-fade-in'>
			<div
				className={`${bgColor} border rounded-[8px] px-4 py-3 shadow-sm flex items-center gap-3 min-w-[320px] max-w-[400px]`}
			>
				<span className='text-base flex-shrink-0'>{icon}</span>
				<span className='flex-1 text-sm font-normal leading-relaxed'>
					{message}
				</span>
				<button
					onClick={onClose}
					className='text-gray-500 hover:text-gray-700 text-lg font-bold flex-shrink-0 ml-2'
				>
					×
				</button>
			</div>
		</div>
	)
}
