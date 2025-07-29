'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'
import { createDynamicComponent } from '@/utils/componentMapping'

interface ContentFrameProps {
	programId: string
	title: string
	menuPath?: string // menuPathë¥?ì¶”ê?ë¡?ë°›ìŒ
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
			setError('?´ë‹¹ ?”ë©´??ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤.')
			setDynamicComponent(null)
			return
		}

		setError(null)

		// ?™ì  ì»´í¬?ŒíŠ¸ ?ì„± ë°?ì¦‰ì‹œ ?¤ì •
		const component = createDynamicComponent(menuPath)
		if (component) {
			setDynamicComponent(() => component)
		} else {
			setError('?´ë‹¹ ?”ë©´??ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤.')
		}
	}, [menuPath])

	// ?ëŸ¬ê°€ ?ˆìœ¼ë©??ëŸ¬ ë©”ì‹œì§€ ?œì‹œ
	if (error) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>? ï¸</div>
				{error}
				<div className='error-message-desc'>ê´€ë¦¬ì?ê²Œ ë¬¸ì˜?˜ì„¸??</div>
			</div>
		)
	}

	// ì»´í¬?ŒíŠ¸ê°€ ?†ìœ¼ë©?ë¹?div ë°˜í™˜ (ë¡œë”© ì¤?
	if (!DynamicComponent) {
		return <div style={{ display: 'none' }} />
	}

	// ì»´í¬?ŒíŠ¸ ?Œë”ë§?
	return <DynamicComponent title={title} />
}



