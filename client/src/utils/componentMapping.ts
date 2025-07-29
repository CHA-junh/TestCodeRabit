/**
 * Next.js dynamic importë¥??„í•œ ? í‹¸ë¦¬í‹°
 */

import React from 'react'
import dynamic from 'next/dynamic'

// ì»´í¬?ŒíŠ¸ ìºì‹œ
const componentCache = new Map<string, React.ComponentType<any>>()

/**
 * ?°ì´?°ë² ?´ìŠ¤??LINK_PATHë¥?ê¸°ë°˜?¼ë¡œ ?™ì  ì»´í¬?ŒíŠ¸ë¥??ì„±?©ë‹ˆ??
 * @param linkPath ?°ì´?°ë² ?´ìŠ¤??LINK_PATH
 * @returns ?™ì  ì»´í¬?ŒíŠ¸
 */
export function createDynamicComponent(linkPath: string) {
	if (!linkPath) {
		return null
	}

	// .tsx ?•ì¥???œê±°
	const cleanPath = linkPath.endsWith('.tsx') ? linkPath.slice(0, -4) : linkPath

	// ìºì‹œ??ì»´í¬?ŒíŠ¸ê°€ ?ˆìœ¼ë©?ë°˜í™˜
	if (componentCache.has(cleanPath)) {
		return componentCache.get(cleanPath)!
	}

	// Next.js dynamic???¬ìš©?˜ì—¬ ì»´í¬?ŒíŠ¸ ?ì„±
	// ?ëŸ¬ ì²˜ë¦¬ë¥??¬í•¨???ˆì „???™ì  import
	const DynamicComponent = dynamic(
		() => {
			return import(`@/app/${cleanPath}`).catch((error) => {
				console.error(`ì»´í¬?ŒíŠ¸ ë¡œë“œ ?¤íŒ¨: ${cleanPath}`, error)
				// ?ëŸ¬ê°€ ë°œìƒ?˜ë©´ ê¸°ë³¸ ?ëŸ¬ ì»´í¬?ŒíŠ¸ë¥?ë°˜í™˜
				return Promise.resolve({
					default: () =>
						React.createElement(
							'div',
							{ className: 'error-message-box' },
							React.createElement(
								'div',
								{ className: 'error-message-icon' },
								'? ï¸'
							),
							'?´ë‹¹ ?”ë©´??ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤.',
							React.createElement(
								'div',
								{ className: 'error-message-desc' },
								'ê´€ë¦¬ì?ê²Œ ë¬¸ì˜?˜ì„¸??'
							)
						),
				})
			})
		},
		{
			loading: () => null, // ë¡œë”© ?íƒœ ?œê±°
			ssr: false, // ?´ë¼?´ì–¸???¬ì´?œì—?œë§Œ ?Œë”ë§?
		}
	)

	// ìºì‹œ???€??
	componentCache.set(cleanPath, DynamicComponent)

	return DynamicComponent
}


