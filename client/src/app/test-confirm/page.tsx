'use client'

import React from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function TestConfirmPage() {
	const { showToast, showConfirm } = useToast()

	const handleDeleteConfirm = () => {
		showConfirm({
			message: '정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
			type: 'warning',
			onConfirm: () => {
				console.log('삭제 작업 실행')
				showToast('항목이 성공적으로 삭제되었습니다.', 'info')
			},
			onCancel: () => {
				console.log('삭제 취소')
			},
		})
	}

	const handleSaveConfirm = () => {
		showConfirm({
			message: '변경사항을 저장하시겠습니까?',
			type: 'info',
			onConfirm: () => {
				console.log('저장 작업 실행')
				showToast('변경사항이 저장되었습니다.', 'info')
			},
		})
	}

	const handleErrorConfirm = () => {
		showConfirm({
			message: '시스템 오류가 발생했습니다. 계속 진행하시겠습니까?',
			type: 'error',
			onConfirm: () => {
				console.log('오류 상황에서 계속 진행')
				showToast('작업이 계속 진행됩니다.', 'warning')
			},
			onCancel: () => {
				console.log('작업 중단')
			},
		})
	}

	const handleSimpleConfirm = () => {
		showConfirm({
			message: '이 작업을 진행하시겠습니까?',
			type: 'info',
			onConfirm: () => {
				console.log('단순 확인 작업 실행')
			},
		})
	}

	const handleConfirmOnly = () => {
		showConfirm({
			message: '작업이 완료되었습니다. 확인 버튼만 있는 다이얼로그입니다.',
			type: 'info',
			confirmOnly: true,
			onConfirm: () => {
				console.log('확인 버튼만 있는 다이얼로그 확인')
				showToast('확인되었습니다.', 'info')
			},
		})
	}

	const handleToastOnly = () => {
		showToast('이것은 토스트 알림만 표시됩니다.', 'info')
	}

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-8'>
					ConfirmDialog & Toast 테스트
				</h1>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						컨펌 다이얼로그 테스트
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<button
							onClick={handleDeleteConfirm}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							삭제 확인 (Warning)
						</button>
						<button
							onClick={handleSaveConfirm}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							저장 확인 (Info)
						</button>
						<button
							onClick={handleErrorConfirm}
							className='bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							오류 확인 (Error)
						</button>
						<button
							onClick={handleSimpleConfirm}
							className='bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							단순 확인
						</button>
						<button
							onClick={handleConfirmOnly}
							className='bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							확인 버튼만
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						토스트 알림 테스트
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<button
							onClick={() => showToast('정보 메시지입니다.', 'info')}
							className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info 토스트
						</button>
						<button
							onClick={() => showToast('경고 메시지입니다.', 'warning')}
							className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Warning 토스트
						</button>
						<button
							onClick={() => showToast('오류 메시지입니다.', 'error')}
							className='bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Error 토스트
						</button>
						<button
							onClick={() => showToast('정보 메시지입니다.', 'info')}
							className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors'
						>
							Info 토스트
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						사용법 설명 & 개선사항
					</h2>
					<div className='mb-4 p-3 bg-blue-50 rounded-lg'>
						<h3 className='font-semibold text-blue-800 mb-2'>최근 개선사항:</h3>
						<ul className='text-sm text-blue-700 space-y-1'>
							<li>• 배경 클릭으로 다이얼로그 닫기 기능 추가</li>
							<li>• 깜빡임 현상 개선 (부드러운 스케일 애니메이션)</li>
							<li>• ESC 키로 닫기 기능 유지</li>
							<li>• 모달 내부 클릭 시 배경 클릭 이벤트 방지</li>
							<li>• 확인 버튼만 있는 버전 추가 (confirmOnly 옵션)</li>
							<li>• 버튼 순서 변경 (확인 버튼이 오른쪽)</li>
						</ul>
					</div>
					<div className='space-y-4 text-gray-700'>
						<div>
							<h3 className='font-semibold text-gray-900'>컨펌 다이얼로그 사용법:</h3>
							<pre className='bg-gray-100 p-3 rounded text-sm mt-2'>
{`const { showConfirm } = useToast()

showConfirm({
  message: '메시지',
  type: 'warning', // info, warning, error
  onConfirm: () => {
    // 확인 시 실행할 코드
    // 여기서 showToast() 호출 가능
  },
  onCancel: () => {
    // 취소 시 실행할 코드 (선택사항)
  }
})`}
							</pre>
						</div>
						<div>
							<h3 className='font-semibold text-gray-900'>토스트 사용법:</h3>
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