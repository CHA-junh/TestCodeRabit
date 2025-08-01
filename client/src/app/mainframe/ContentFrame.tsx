'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'
import { createDynamicComponent } from '@/utils/componentMapping'

interface ContentFrameProps {
	programId: string
	title: string
	menuPath?: string // menuPath๋ฅ?์ถ๊?๋ก?๋ฐ์
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
			setError('?ด๋น ?๋ฉด??์กด์ฌ?์? ?์ต?๋ค.')
			setDynamicComponent(null)
			return
		}

		setError(null)

		// ?์  ์ปดํฌ?ํธ ?์ฑ ๋ฐ?์ฆ์ ?ค์ 
		const component = createDynamicComponent(menuPath)
		if (component) {
			setDynamicComponent(() => component)
		} else {
			setError('?ด๋น ?๋ฉด??์กด์ฌ?์? ?์ต?๋ค.')
		}
	}, [menuPath])

	// ?๋ฌ๊ฐ ?์ผ๋ฉ??๋ฌ ๋ฉ์์ง ?์
	if (error) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>? ๏ธ</div>
				{error}
				<div className='error-message-desc'>๊ด๋ฆฌ์?๊ฒ ๋ฌธ์?์ธ??</div>
			</div>
		)
	}

	// ์ปดํฌ?ํธ๊ฐ ?์ผ๋ฉ?๋น?div ๋ฐํ (๋ก๋ฉ ์ค?
	if (!DynamicComponent) {
		return <div style={{ display: 'none' }} />
	}

	// ์ปดํฌ?ํธ ?๋๋ง?
	return <DynamicComponent title={title} />
}


