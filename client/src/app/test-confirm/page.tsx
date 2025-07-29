'use client'

import React from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function TestConfirmPage() {
	const { showToast, showConfirm } = useToast()

	const handleDeleteConfirm = () => {
		showConfirm({
			message: '?�말�?????��????��?�시겠습?�까? ???�업?� ?�돌�????�습?�다.',
			type: 'warning',
			onConfirm: () => {
				console.log('??�� ?�업 ?�행')
				showToast('??��???�공?�으�???��?�었?�니??', 'info')
			},
			onCancel: () => {
				console.log('??�� 취소')
			},
		})
	}

	const handleSaveConfirm = () => {
		showConfirm({
			message: '변경사??�� ?�?�하?�겠?�니�?',
			type: 'info',
			onConfirm: () => {
				console.log('?�???�업 ?�행')
				showToast('변경사??�� ?�?�되?�습?�다.', 'info')
			},
		})
	}

	const handleErrorConfirm = () => {
		showConfirm({
			message: '?�스???�류가 발생?�습?�다. 계속 진행?�시겠습?�까?',
			type: 'error',
			onConfirm: () => {
				console.log('?�류 ?�황?�서 계속 진행')
				showToast('?�업??계속 진행?�니??', 'warning')
			},
			onCancel: () => {
				console.log('?�업 중단')
			},
		})
	}

	const handleSimpleConfirm = () => {
		showConfirm({
			message: '???�업??진행?�시겠습?�까?',
			type: 'info',
			onConfirm: () => {
				console.log('?�순 ?�인 ?�업 ?�행')
			},
		})
	}

	const handleConfirmOnly = () => {
		showConfirm({
			message: '?�업???�료?�었?�니?? ?�인 버튼�??�는 ?�이?�로그입?�다.',
			type: 'info',
			confirmOnly: true,
			onConfirm: () => {
				console.log('?�인 버튼�??�는 ?�이?�로�??�인')
				showToast('?�인?�었?�니??', 'info')
			},
		})
	}

	const handleToastOnly = () => {
		showToast('?�것?� ?�스???�림�??�시?�니??', 'info')
	}

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-8'>
					ConfirmDialog & Toast ?�스??
				</h1>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						컨펌 ?�이?�로�??�스??
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<button
							onClick={handleDeleteConfirm}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							??�� ?�인 (Warning)
						</button>
						<button
							onClick={handleSaveConfirm}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?�???�인 (Info)
						</button>
						<button
							onClick={handleErrorConfirm}
							className='bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?�류 ?�인 (Error)
						</button>
						<button
							onClick={handleSimpleConfirm}
							className='bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?�순 ?�인
						</button>
						<button
							onClick={handleConfirmOnly}
							className='bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							?�인 버튼�?
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						?�스???�림 ?�스??
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<button
							onClick={() => showToast('?�보 메시지?�니??', 'info')}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info ?�스??
						</button>
						<button
							onClick={() => showToast('경고 메시지?�니??', 'warning')}
							className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Warning ?�스??
						</button>
						<button
							onClick={() => showToast('?�류 메시지?�니??', 'error')}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Error ?�스??
						</button>
						<button
							onClick={() => showToast('?�보 메시지?�니??', 'info')}
							className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info ?�스??
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						?�용�??�명 & 개선?�항
					</h2>
					<div className='mb-4 p-3 bg-blue-50 rounded-lg'>
						<h3 className='font-semibold text-blue-800 mb-2'>최근 개선?�항:</h3>
						<ul className='text-sm text-blue-700 space-y-1'>
							<li>??배경 ?�릭?�로 ?�이?�로�??�기 기능 추�?</li>
							<li>??깜빡???�상 개선 (부?�러???��????�니메이??</li>
							<li>??ESC ?�로 ?�기 기능 ?��?</li>
							<li>??모달 ?��? ?�릭 ??배경 ?�릭 ?�벤??방�?</li>
							<li>???�인 버튼�??�는 버전 추�? (confirmOnly ?�션)</li>
							<li>??버튼 ?�서 변�?(?�인 버튼???�른�?</li>
						</ul>
					</div>
					<div className='space-y-4 text-gray-700'>
						<div>
							<h3 className='font-semibold text-gray-900'>컨펌 ?�이?�로�??�용�?</h3>
							<pre className='bg-gray-100 p-3 rounded text-sm mt-2'>
{`const { showConfirm } = useToast()

showConfirm({
  message: '메시지',
  type: 'warning', // info, warning, error
  onConfirm: () => {
    // ?�인 ???�행??코드
    // ?�기??showToast() ?�출 가??
  },
  onCancel: () => {
    // 취소 ???�행??코드 (?�택?�항)
  }
})`}
							</pre>
						</div>
						<div>
							<h3 className='font-semibold text-gray-900'>?�스???�용�?</h3>
							<pre className='bg-gray-100 p-3 rounded text-sm mt-2'>
{`const { showToast } = useToast()

showToast('메시지', 'info') // info, warning, error`}
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 

