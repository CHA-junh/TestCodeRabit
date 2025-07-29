'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'
import { createDynamicComponent } from '@/utils/componentMapping'

interface ContentFrameProps {
	programId: string
	title: string
	menuPath?: string // menuPath�?추�?�?받음
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
			setError('?�당 ?�면??존재?��? ?�습?�다.')
			setDynamicComponent(null)
			return
		}

		setError(null)

		// ?�적 컴포?�트 ?�성 �?즉시 ?�정
		const component = createDynamicComponent(menuPath)
		if (component) {
			setDynamicComponent(() => component)
		} else {
			setError('?�당 ?�면??존재?��? ?�습?�다.')
		}
	}, [menuPath])

	// ?�러가 ?�으�??�러 메시지 ?�시
	if (error) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>?�️</div>
				{error}
				<div className='error-message-desc'>관리자?�게 문의?�세??</div>
			</div>
		)
	}

	// 컴포?�트가 ?�으�?�?div 반환 (로딩 �?
	if (!DynamicComponent) {
		return <div style={{ display: 'none' }} />
	}

	// 컴포?�트 ?�더�?
	return <DynamicComponent title={title} />
}



