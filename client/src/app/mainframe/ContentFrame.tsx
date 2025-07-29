'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'
import { createDynamicComponent } from '@/utils/componentMapping'

interface ContentFrameProps {
	programId: string
	title: string
	menuPath?: string // menuPath를 추가로 받음
}

export default function ContentFrame({
	programId,
	title,
	menuPath,
}: ContentFrameProps) {
	const [DynamicComponent, setDynamicComponent] =
		useState<React.ComponentType<any> | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!menuPath) {
			setError('해당 화면이 존재하지 않습니다.')
			setDynamicComponent(null)
			return
		}

		setError(null)

		// 동적 컴포넌트 생성 및 즉시 설정
		const component = createDynamicComponent(menuPath)
		if (component) {
			setDynamicComponent(() => component)
		} else {
			setError('해당 화면이 존재하지 않습니다.')
		}
	}, [menuPath])

	// 에러가 있으면 에러 메시지 표시
	if (error) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>⚠️</div>
				{error}
				<div className='error-message-desc'>관리자에게 문의하세요.</div>
			</div>
		)
	}

	// 컴포넌트가 없으면 빈 div 반환 (로딩 중)
	if (!DynamicComponent) {
		return <div style={{ display: 'none' }} />
	}

	// 컴포넌트 렌더링
	return <DynamicComponent title={title} />
}
