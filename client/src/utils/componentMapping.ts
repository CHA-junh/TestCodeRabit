/**
 * Next.js dynamic import를 위한 유틸리티
 */

import React from 'react'
import dynamic from 'next/dynamic'

// 컴포넌트 캐시
const componentCache = new Map<string, React.ComponentType<any>>()

/**
 * 데이터베이스의 LINK_PATH를 기반으로 동적 컴포넌트를 생성합니다.
 * @param linkPath 데이터베이스의 LINK_PATH
 * @returns 동적 컴포넌트
 */
export function createDynamicComponent(linkPath: string) {
	if (!linkPath) {
		return null
	}

	// .tsx 확장자 제거
	const cleanPath = linkPath.endsWith('.tsx') ? linkPath.slice(0, -4) : linkPath

	// 캐시된 컴포넌트가 있으면 반환
	if (componentCache.has(cleanPath)) {
		return componentCache.get(cleanPath)!
	}

	// Next.js dynamic을 사용하여 컴포넌트 생성
	// 에러 처리를 포함한 안전한 동적 import
	const DynamicComponent = dynamic(
		() => {
			return import(`@/app/${cleanPath}`).catch((error) => {
				console.error(`컴포넌트 로드 실패: ${cleanPath}`, error)
				// 에러가 발생하면 기본 에러 컴포넌트를 반환
				return Promise.resolve({
					default: () =>
						React.createElement(
							'div',
							{ className: 'error-message-box' },
							React.createElement(
								'div',
								{ className: 'error-message-icon' },
								'⚠️'
							),
							'해당 화면이 존재하지 않습니다.',
							React.createElement(
								'div',
								{ className: 'error-message-desc' },
								'관리자에게 문의하세요.'
							)
						),
				})
			})
		},
		{
			loading: () => null, // 로딩 상태 제거
			ssr: false, // 클라이언트 사이드에서만 렌더링
		}
	)

	// 캐시에 저장
	componentCache.set(cleanPath, DynamicComponent)

	return DynamicComponent
}
