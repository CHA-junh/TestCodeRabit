'use client'

import React, { useEffect } from 'react'

interface ConfirmDialogProps {
	message: string
	type?: 'info' | 'warning' | 'error'
	isVisible: boolean
	onConfirm: () => void
	onCancel?: () => void
	confirmOnly?: boolean
}

export default function ConfirmDialog({
	message,
	type = 'info',
	isVisible,
	onConfirm,
	onCancel,
	confirmOnly = false,
}: ConfirmDialogProps) {
	useEffect(() => {
		if (isVisible) {
			// ESC ?дыбЬ ?лъ╕░
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onCancel?.()
				}
			}

			document.addEventListener('keydown', handleEscape)
			// ?дэБмыб?ы░йь?
			document.body.style.overflow = 'hidden'

			return () => {
				document.removeEventListener('keydown', handleEscape)
				document.body.style.overflow = 'unset'
			}
		}
	}, [isVisible, onCancel])

	if (!isVisible) return null

	const bgColor = {
		info: 'bg-[#F2F8FF] border-[#BDD6EE] text-[#2A2A2A]',
		warning: 'bg-[#FFF8E1] border-[#FFD54F] text-[#2A2A2A]',
		error: 'bg-[#FFEBEE] border-[#EF5350] text-[#2A2A2A]',
	}[type]

	const icon = {
		info: '?Тб',
		warning: '?ая╕П',
		error: '??,
	}[type]

	const buttonColor = {
		info: 'bg-blue-500 hover:bg-blue-600',
		warning: 'bg-yellow-500 hover:bg-yellow-600',
		error: 'bg-red-500 hover:bg-red-600',
	}[type]

	const handleConfirm = () => {
		onConfirm()
	}

	return (
		<>
			{/* ы░░ъ▓╜ ?ды▓Д?ИьЭ┤?А ыкиыЛм ь╗иэЕМ?┤ыДИые??ШыВШыб??йь╣и */}
			<div 
				className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
				onClick={() => onCancel?.()}
			>
				<div 
					className='bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in'
					onClick={(e) => e.stopPropagation()}
				>
					{/* ?дыНФ */}
					<div className={`${bgColor} px-6 py-4 rounded-t-lg flex items-center gap-3`}>
						<span className='text-xl flex-shrink-0'>{icon}</span>
						<h3 className='text-lg font-semibold flex-1'>?ХьЭ╕</h3>
						<button
							onClick={onCancel}
							className='text-gray-500 hover:text-gray-700 text-xl font-bold flex-shrink-0'
						>
							├Ч
						</button>
					</div>

					{/* ыйФьЛЬьзА */}
					<div className='px-6 py-4'>
						<p className='text-gray-700 leading-relaxed'>{message}</p>
					</div>

					{/* ы▓ДэК╝ */}
					<div className='px-6 py-4 flex gap-3 justify-end border-t border-gray-200'>
						{!confirmOnly && (
							<button
								onClick={onCancel}
								className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors'
							>
								ь╖иьЖМ
							</button>
						)}
						<button
							onClick={handleConfirm}
							className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${buttonColor}`}
						>
							?ХьЭ╕
						</button>
					</div>
				</div>
			</div>
		</>
	)
} 


