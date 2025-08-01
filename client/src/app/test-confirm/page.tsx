'use client'

import React from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function TestConfirmPage() {
	const { showToast, showConfirm } = useToast()

	const handleDeleteConfirm = () => {
		showConfirm({
			message: '?λ§λ‘?????ͺ©???? ?μκ² μ΅?κΉ? ???μ? ?λλ¦????μ΅?λ€.',
			type: 'warning',
			onConfirm: () => {
				console.log('??  ?μ ?€ν')
				showToast('??ͺ©???±κ³΅?μΌλ‘??? ?μ?΅λ??', 'info')
			},
			onCancel: () => {
				console.log('??  μ·¨μ')
			},
		})
	}

	const handleSaveConfirm = () => {
		showConfirm({
			message: 'λ³κ²½μ¬?? ??₯ν?κ² ?΅λκΉ?',
			type: 'info',
			onConfirm: () => {
				console.log('????μ ?€ν')
				showToast('λ³κ²½μ¬??΄ ??₯λ?μ΅?λ€.', 'info')
			},
		})
	}

	const handleErrorConfirm = () => {
		showConfirm({
			message: '?μ€???€λ₯κ° λ°μ?μ΅?λ€. κ³μ μ§ν?μκ² μ΅?κΉ?',
			type: 'error',
			onConfirm: () => {
				console.log('?€λ₯ ?ν©?μ κ³μ μ§ν')
				showToast('?μ??κ³μ μ§ν?©λ??', 'warning')
			},
			onCancel: () => {
				console.log('?μ μ€λ¨')
			},
		})
	}

	const handleSimpleConfirm = () => {
		showConfirm({
			message: '???μ??μ§ν?μκ² μ΅?κΉ?',
			type: 'info',
			onConfirm: () => {
				console.log('?¨μ ?μΈ ?μ ?€ν')
			},
		})
	}

	const handleConfirmOnly = () => {
		showConfirm({
			message: '?μ???λ£?μ?΅λ?? ?μΈ λ²νΌλ§??λ ?€μ΄?Όλ‘κ·Έμ?λ€.',
			type: 'info',
			confirmOnly: true,
			onConfirm: () => {
				console.log('?μΈ λ²νΌλ§??λ ?€μ΄?Όλ‘κ·??μΈ')
				showToast('?μΈ?μ?΅λ??', 'info')
			},
		})
	}

	const handleToastOnly = () => {
		showToast('?΄κ²? ? μ€???λ¦Όλ§??μ?©λ??', 'info')
	}

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-8'>
					ConfirmDialog & Toast ?μ€??
				</h1>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						μ»¨ν ?€μ΄?Όλ‘κ·??μ€??
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<button
							onClick={handleDeleteConfirm}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							??  ?μΈ (Warning)
						</button>
						<button
							onClick={handleSaveConfirm}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							????μΈ (Info)
						</button>
						<button
							onClick={handleErrorConfirm}
							className='bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?€λ₯ ?μΈ (Error)
						</button>
						<button
							onClick={handleSimpleConfirm}
							className='bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?¨μ ?μΈ
						</button>
						<button
							onClick={handleConfirmOnly}
							className='bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?μΈ λ²νΌλ§?
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						? μ€???λ¦Ό ?μ€??
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<button
							onClick={() => showToast('?λ³΄ λ©μμ§?λ??', 'info')}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info ? μ€??
						</button>
						<button
							onClick={() => showToast('κ²½κ³  λ©μμ§?λ??', 'warning')}
							className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Warning ? μ€??
						</button>
						<button
							onClick={() => showToast('?€λ₯ λ©μμ§?λ??', 'error')}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Error ? μ€??
						</button>
						<button
							onClick={() => showToast('?λ³΄ λ©μμ§?λ??', 'info')}
							className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info ? μ€??
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						?¬μ©λ²??€λͺ & κ°μ ?¬ν­
					</h2>
					<div className='mb-4 p-3 bg-blue-50 rounded-lg'>
						<h3 className='font-semibold text-blue-800 mb-2'>μ΅κ·Ό κ°μ ?¬ν­:</h3>
						<ul className='text-sm text-blue-700 space-y-1'>
							<li>??λ°°κ²½ ?΄λ¦­?Όλ‘ ?€μ΄?Όλ‘κ·??«κΈ° κΈ°λ₯ μΆκ?</li>
							<li>??κΉλΉ‘???μ κ°μ  (λΆ?λ¬???€μ???? λλ©μ΄??</li>
							<li>??ESC ?€λ‘ ?«κΈ° κΈ°λ₯ ? μ?</li>
							<li>??λͺ¨λ¬ ?΄λ? ?΄λ¦­ ??λ°°κ²½ ?΄λ¦­ ?΄λ²€??λ°©μ?</li>
							<li>???μΈ λ²νΌλ§??λ λ²μ  μΆκ? (confirmOnly ?΅μ)</li>
							<li>??λ²νΌ ?μ λ³κ²?(?μΈ λ²νΌ???€λ₯Έμͺ?</li>
						</ul>
					</div>
					<div className='space-y-4 text-gray-700'>
						<div>
							<h3 className='font-semibold text-gray-900'>μ»¨ν ?€μ΄?Όλ‘κ·??¬μ©λ²?</h3>
							<pre className='bg-gray-100 p-3 rounded text-sm mt-2'>
{`const { showConfirm } = useToast()

showConfirm({
  message: 'λ©μμ§',
  type: 'warning', // info, warning, error
  onConfirm: () => {
    // ?μΈ ???€ν??μ½λ
    // ?¬κΈ°??showToast() ?ΈμΆ κ°??
  },
  onCancel: () => {
    // μ·¨μ ???€ν??μ½λ (? ν?¬ν­)
  }
})`}
							</pre>
						</div>
						<div>
							<h3 className='font-semibold text-gray-900'>? μ€???¬μ©λ²?</h3>
							<pre className='bg-gray-100 p-3 rounded text-sm mt-2'>
{`const { showToast } = useToast()

showToast('λ©μμ§', 'info') // info, warning, error`}
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 

