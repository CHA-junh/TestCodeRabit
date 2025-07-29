'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PopupPageProps {
	params: {
		path: string[]
	}
}

export default function PopupPage({ params }: PopupPageProps) {
	const [Component, setComponent] = useState<React.ComponentType | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadComponent = async () => {
			// 경로를 조합하여 컴포넌트 경로 생성
			const componentPath = params.path.join('/')

			try {
				setLoading(true)
				setError(null)

				// console.log('팝업 컴포넌트 로드 시도:', componentPath)

				// 동적 import로 컴포넌트 로드
				const module = await import(`../../${componentPath}`)
				const component = module.default || module

				setComponent(() => component)
			} catch (err) {
				console.error('팝업 컴포넌트 로드 실패:', err)
				setError(`팝업을 불러올 수 없습니다: ${componentPath}`)
			} finally {
				setLoading(false)
			}
		}

		if (params.path && params.path.length > 0) {
			loadComponent()
		}
	}, [params.path])

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>팝업을 불러오는 중...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='text-red-500 text-2xl mb-4'>⚠️</div>
					<p className='text-red-600 mb-4'>{error}</p>
					<button
						onClick={() => window.close()}
						className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						닫기
					</button>
				</div>
			</div>
		)
	}

	if (!Component) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<p className='text-gray-600 mb-4'>컴포넌트를 찾을 수 없습니다.</p>
					<button
						onClick={() => window.close()}
						className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						닫기
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full h-full'>
			<Component />
		</div>
	)
}
