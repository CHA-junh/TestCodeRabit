/**
 * Next.js dynamic import�??�한 ?�틸리티
 */

import React from 'react'
import dynamic from 'next/dynamic'

// 컴포?�트 캐시
const componentCache = new Map<string, React.ComponentType<any>>()

/**
 * ?�이?�베?�스??LINK_PATH�?기반?�로 ?�적 컴포?�트�??�성?�니??
 * @param linkPath ?�이?�베?�스??LINK_PATH
 * @returns ?�적 컴포?�트
 */
export function createDynamicComponent(linkPath: string) {
	if (!linkPath) {
		return null
	}

	// .tsx ?�장???�거
	const cleanPath = linkPath.endsWith('.tsx') ? linkPath.slice(0, -4) : linkPath

	// 캐시??컴포?�트가 ?�으�?반환
	if (componentCache.has(cleanPath)) {
		return componentCache.get(cleanPath)!
	}

	// Next.js dynamic???�용?�여 컴포?�트 ?�성
	// ?�러 처리�??�함???�전???�적 import
	const DynamicComponent = dynamic(
		() => {
			return import(`@/app/${cleanPath}`).catch((error) => {
				console.error(`컴포?�트 로드 ?�패: ${cleanPath}`, error)
				// ?�러가 발생?�면 기본 ?�러 컴포?�트�?반환
				return Promise.resolve({
					default: () =>
						React.createElement(
							'div',
							{ className: 'error-message-box' },
							React.createElement(
								'div',
								{ className: 'error-message-icon' },
								'?�️'
							),
							'?�당 ?�면??존재?��? ?�습?�다.',
							React.createElement(
								'div',
								{ className: 'error-message-desc' },
								'관리자?�게 문의?�세??'
							)
						),
				})
			})
		},
		{
			loading: () => null, // 로딩 ?�태 ?�거
			ssr: false, // ?�라?�언???�이?�에?�만 ?�더�?
		}
	)

	// 캐시???�??
	componentCache.set(cleanPath, DynamicComponent)

	return DynamicComponent
}


