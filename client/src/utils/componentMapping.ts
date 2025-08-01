/**
 * Next.js dynamic importë¥??í ? í¸ë¦¬í°
 */

import React from 'react'
import dynamic from 'next/dynamic'

// ì»´í¬?í¸ ìºì
const componentCache = new Map<string, React.ComponentType<any>>()

/**
 * ?°ì´?°ë² ?´ì¤??LINK_PATHë¥?ê¸°ë°?¼ë¡ ?ì  ì»´í¬?í¸ë¥??ì±?©ë??
 * @param linkPath ?°ì´?°ë² ?´ì¤??LINK_PATH
 * @returns ?ì  ì»´í¬?í¸
 */
export function createDynamicComponent(linkPath: string) {
	if (!linkPath) {
		return null
	}

	// .tsx ?ì¥???ê±°
	const cleanPath = linkPath.endsWith('.tsx') ? linkPath.slice(0, -4) : linkPath

	// ìºì??ì»´í¬?í¸ê° ?ì¼ë©?ë°í
	if (componentCache.has(cleanPath)) {
		return componentCache.get(cleanPath)!
	}

	// Next.js dynamic???¬ì©?ì¬ ì»´í¬?í¸ ?ì±
	// ?ë¬ ì²ë¦¬ë¥??¬í¨???ì ???ì  import
	const DynamicComponent = dynamic(
		() => {
			return import(`@/app/${cleanPath}`).catch((error) => {
				console.error(`ì»´í¬?í¸ ë¡ë ?¤í¨: ${cleanPath}`, error)
				// ?ë¬ê° ë°ì?ë©´ ê¸°ë³¸ ?ë¬ ì»´í¬?í¸ë¥?ë°í
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
							'?´ë¹ ?ë©´??ì¡´ì¬?ì? ?ìµ?ë¤.',
							React.createElement(
								'div',
								{ className: 'error-message-desc' },
								'ê´ë¦¬ì?ê² ë¬¸ì?ì¸??'
							)
						),
				})
			})
		},
		{
			loading: () => null, // ë¡ë© ?í ?ê±°
			ssr: false, // ?´ë¼?´ì¸???¬ì´?ì?ë§ ?ëë§?
		}
	)

	// ìºì?????
	componentCache.set(cleanPath, DynamicComponent)

	return DynamicComponent
}


