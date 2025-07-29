/**
 * 범용 팝업 관리 훅 (window.open 기반)
 *
 * 이 모듈은 React 컴포넌트에서 팝업 창을 안전하고 효율적으로 관리할 수 있는
 * 완전한 팝업 관리 시스템을 제공합니다.
 *
 * 주요 기능:
 * - 팝업 열기/닫기/포커스 관리
 * - 다양한 위치와 크기 옵션
 * - 자동 닫힘 감지
 * - postMessage 통신 지원
 * - 에러 처리 및 메모리 누수 방지
 * - POPUP_READY/CHOICE_EMP_INIT 자동화 지원
 *
 * 사용 예시:
 * ```typescript
 * // 부모 컴포넌트에서 팝업 열기
 * const { openPopup } = usePopup();
 * openPopup({
 *   url: '/popup/com/COMZ100P00',
 *   size: 'medium',
 *   position: 'center',
 *   waitForReady: true, // 팝업에서 POPUP_READY 메시지 수신 후 데이터 전송
 *   readyResponseData: {
 *     type: 'CHOICE_EMP_INIT',
 *     data: {
 *       empNm: '홍길동',
 *       empList: [...],
 *     },
 *   },
 * });
 *
 * // 팝업(자식)에서는 useEffect에서 POPUP_READY 메시지 전송
 * useEffect(() => {
 *   if (window.opener && !window.opener.closed) {
 *     window.opener.postMessage({
 *       type: 'POPUP_READY',
 *       source: 'CHILD',
 *       timestamp: new Date().toISOString()
 *     }, '*');
 *   }
 * }, []);
 *
 * // 팝업(자식)에서는 CHOICE_EMP_INIT 메시지 수신 후 데이터 처리
 * useEffect(() => {
 *   const handleMessage = (event: MessageEvent) => {
 *     if (event.data?.type === 'CHOICE_EMP_INIT') {
 *       // 데이터 처리
 *     }
 *   };
 *   window.addEventListener('message', handleMessage);
 *   return () => window.removeEventListener('message', handleMessage);
 * }, []);
 * ```
 */

import React from 'react'

/**
 * 팝업 창의 기본 옵션 설정
 */
export type PopupOptions = {
	width?: number
	height?: number
	top?: number
	left?: number
	features?: string
	name?: string
	scrollbars?: boolean
	resizable?: boolean
	menubar?: boolean
	toolbar?: boolean
	location?: boolean
	status?: boolean
	directories?: boolean
	copyhistory?: boolean
}

/**
 * 팝업 창의 위치 옵션
 */
export type PopupPosition =
	| 'center'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'custom'

/**
 * 팝업 창의 크기 옵션
 */
export type PopupSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom'

/**
 * 팝업 창 설정을 위한 완전한 설정 객체
 */
export interface PopupConfig {
	url: string
	options?: PopupOptions
	position?: PopupPosition
	size?: PopupSize
	onOpen?: (popup: Window | null) => void
	onClose?: () => void
	onError?: (error: Error) => void
	onMessage?: (event: MessageEvent) => void
	checkClosedInterval?: number
	waitForReady?: boolean // 팝업의 준비 완료 메시지를 기다린 후 데이터 전송 여부 (기본값: true)
	readyResponseData?: any // 준비 완료 메시지 응답으로 보낼 데이터
}

/**
 * 팝업 인스턴스 객체
 */
export interface PopupInstance {
	window: Window | null
	isOpen: boolean
	close: () => void
	focus: () => void
	postMessage: (message: any, targetOrigin?: string) => void
}

/**
 * 팝업 크기별 기본 치수
 */
const POPUP_SIZES = {
	small: { width: 400, height: 300 },
	medium: { width: 800, height: 600 },
	large: { width: 1200, height: 800 },
	fullscreen: { width: window.screen.width, height: window.screen.height },
	custom: { width: 0, height: 0 },
}

/**
 * 현재 활성 창이 있는 모니터의 중앙 위치 계산 (듀얼 모니터 환경 최적화)
 */
function getCurrentMonitorCenter(
	width: number,
	height: number
): { left: number; top: number } {
	// 현재 창의 위치와 크기 정보
	const currentWindow = window

	// 현재 창의 중앙점 계산 (창의 실제 중앙)
	const currentCenterX = currentWindow.screenX + currentWindow.outerWidth / 2
	const currentCenterY = currentWindow.screenY + currentWindow.outerHeight / 2

	// 팝업을 현재 창의 중앙에 배치
	let left = currentCenterX - width / 2
	let top = currentCenterY - height / 2

	// 듀얼 모니터 환경에서 현재 모니터의 경계 확인
	// 현재 창이 위치한 모니터의 경계를 계산
	const currentMonitorLeft = currentWindow.screenX
	const currentMonitorTop = currentWindow.screenY
	const currentMonitorRight =
		currentMonitorLeft + currentWindow.screen.availWidth
	const currentMonitorBottom =
		currentMonitorTop + currentWindow.screen.availHeight

	// 팝업이 현재 모니터를 벗어나지 않도록 조정
	left = Math.max(
		currentMonitorLeft,
		Math.min(left, currentMonitorRight - width)
	)
	top = Math.max(
		currentMonitorTop,
		Math.min(top, currentMonitorBottom - height)
	)

	// 디버깅용 로그 (개발 환경에서만)
	if (process.env.NODE_ENV === 'development') {
		console.log('🔍 팝업 위치 계산:', {
			windowScreenX: currentWindow.screenX,
			windowScreenY: currentWindow.screenY,
			windowOuterWidth: currentWindow.outerWidth,
			windowOuterHeight: currentWindow.outerHeight,
			currentCenterX,
			currentCenterY,
			popupWidth: width,
			popupHeight: height,
			calculatedLeft: left,
			calculatedTop: top,
			monitorBounds: {
				left: currentMonitorLeft,
				top: currentMonitorTop,
				right: currentMonitorRight,
				bottom: currentMonitorBottom,
			},
		})
	}

	return { left, top }
}

/**
 * 팝업 위치 계산 함수
 */
function calculatePopupPosition(
	position: PopupPosition,
	size: PopupSize,
	customOptions?: PopupOptions
): { left: number; top: number } {
	const { width = 800, height = 600 } = customOptions || POPUP_SIZES[size]

	switch (position) {
		case 'center':
			// 듀얼 모니터 환경을 고려한 현재 모니터 중앙 계산
			return getCurrentMonitorCenter(width, height)
		case 'top-left':
			return { left: 0, top: 0 }
		case 'top-right':
			return { left: window.screen.availWidth - width, top: 0 }
		case 'bottom-left':
			return { left: 0, top: window.screen.availHeight - height }
		case 'bottom-right':
			return {
				left: window.screen.availWidth - width,
				top: window.screen.availHeight - height,
			}
		case 'custom':
			return {
				left: customOptions?.left || 0,
				top: customOptions?.top || 0,
			}
		default:
			return { left: 0, top: 0 }
	}
}

/**
 * 팝업 features 문자열 생성 함수
 */
function buildPopupFeatures(
	size: PopupSize,
	position: PopupPosition,
	options: PopupOptions = {}
): string {
	const { width, height } =
		options.width && options.height
			? { width: options.width, height: options.height }
			: POPUP_SIZES[size]

	const { left, top } = calculatePopupPosition(position, size, options)

	const features = [
		`width=${width}`,
		`height=${height}`,
		`left=${left}`,
		`top=${top}`,
		`scrollbars=${options.scrollbars !== false ? 'yes' : 'no'}`,
		`resizable=${options.resizable !== false ? 'yes' : 'no'}`,
		`menubar=${options.menubar ? 'yes' : 'no'}`,
		`toolbar=${options.toolbar ? 'yes' : 'no'}`,
		`location=${options.location ? 'yes' : 'no'}`,
		`status=${options.status ? 'yes' : 'no'}`,
		`directories=${options.directories ? 'yes' : 'no'}`,
		`copyhistory=${options.copyhistory ? 'yes' : 'no'}`,
	]

	return features.join(',')
}

/**
 * 범용 팝업 관리 훅
 *
 * 팝업 창의 생명주기를 관리하고, postMessage 통신을 지원합니다.
 * 기본적으로 모든 팝업에 대해 준비 완료 메시지를 기다립니다.
 *
 * @returns 팝업 관리 함수들과 상태 객체
 */
export function usePopup() {
	const [popupInstance, setPopupInstance] =
		React.useState<PopupInstance | null>(null)
	const [isOpen, setIsOpen] = React.useState(false)
	const checkClosedIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
	const messageListenerRef = React.useRef<
		((event: MessageEvent) => void) | null
	>(null)

	/**
	 * 팝업 창이 닫혔는지 확인하는 함수
	 */
	const checkPopupClosed = React.useCallback((popup: Window) => {
		try {
			if (popup.closed) {
				setIsOpen(false)
				setPopupInstance(null)

				if (checkClosedIntervalRef.current) {
					clearInterval(checkClosedIntervalRef.current)
					checkClosedIntervalRef.current = null
				}
				return true
			}
			return false
		} catch (error) {
			setIsOpen(false)
			setPopupInstance(null)

			if (checkClosedIntervalRef.current) {
				clearInterval(checkClosedIntervalRef.current)
				checkClosedIntervalRef.current = null
			}
			return true
		}
	}, [])

	/**
	 * 팝업 창을 여는 함수
	 */
	const openPopup = React.useCallback(
		(config: PopupConfig): PopupInstance | null => {
			try {
				const {
					url,
					options = {},
					position = 'center',
					size = 'medium',
					onOpen,
					onClose,
					onError,
					onMessage,
					checkClosedInterval = 500,
					waitForReady = true, // 기본값: 준비 완료 메시지를 기다림
					readyResponseData,
				} = config

				// 기존 팝업이 열려있으면 닫기
				if (popupInstance?.window && !popupInstance.window.closed) {
					popupInstance.close()
				}

				const features =
					options.features || buildPopupFeatures(size, position, options)
				const popupName = options.name || `popup_${Date.now()}`

				// 팝업 창 열기
				const popup = window.open(url, popupName, features)

				if (!popup) {
					throw new Error(
						'팝업 창을 열 수 없습니다. 팝업 차단이 활성화되어 있을 수 있습니다.'
					)
				}

				// 팝업 인스턴스 생성
				const instance: PopupInstance = {
					window: popup,
					isOpen: true,
					close: () => {
						try {
							popup.close()
						} catch (error) {
							console.warn('팝업 닫기 실패:', error)
						}
					},
					focus: () => {
						try {
							popup.focus()
						} catch (error) {
							console.warn('팝업 포커스 실패:', error)
						}
					},
					postMessage: (message: any, targetOrigin: string = '*') => {
						try {
							popup.postMessage(message, targetOrigin)
						} catch (error) {
							console.warn('메시지 전송 실패:', error)
						}
					},
				}

				// 상태 업데이트
				setPopupInstance(instance)
				setIsOpen(true)

				// 기본적으로 준비 완료 메시지를 기다리는 로직
				if (waitForReady && readyResponseData) {
					console.log('🔄 usePopup - 준비 완료 메시지 대기 시작:', {
						waitForReady,
						readyResponseData,
						popupUrl: url,
					})

					const handleReadyMessage = (event: MessageEvent) => {
						console.log('📨 usePopup - 메시지 수신:', {
							type: event.data?.type,
							source: event.data?.source,
							data: event.data,
							origin: event.origin,
						})

						// POPUP_READY 메시지 감지
						const isReadyMessage =
							event.data?.type === 'POPUP_READY' &&
							event.data?.source === 'CHILD'

						console.log('🔍 usePopup - 준비 완료 메시지 체크:', {
							isReadyMessage,
							messageType: event.data?.type,
							messageSource: event.data?.source,
						})

						if (isReadyMessage) {
							console.log('✅ usePopup - POPUP_READY 수신, 데이터 전송:', {
								receivedType: event.data.type,
								receivedSource: event.data.source,
								responseData: readyResponseData,
							})
							try {
								popup.postMessage(readyResponseData, '*')
								console.log('✅ usePopup - 데이터 전송 성공')
							} catch (error) {
								console.error('❌ usePopup - 데이터 전송 실패:', error)
							}
							window.removeEventListener('message', handleReadyMessage)
						}
					}
					window.addEventListener('message', handleReadyMessage)
				} else {
					console.log('⚠️ usePopup - 준비 완료 메시지 대기 비활성화:', {
						waitForReady,
						hasReadyResponseData: !!readyResponseData,
					})
				}

				// 성공 콜백 호출
				onOpen?.(popup)

				return instance
			} catch (error) {
				const errorObj =
					error instanceof Error ? error : new Error('팝업 열기 실패')
				config.onError?.(errorObj)
				return null
			}
		},
		[popupInstance, checkPopupClosed]
	)

	/**
	 * 현재 열린 팝업 창을 닫는 함수
	 */
	const closePopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.close()
		}
	}, [popupInstance])

	/**
	 * 현재 열린 팝업 창에 포커스를 주는 함수
	 */
	const focusPopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.focus()
		}
	}, [popupInstance])

	/**
	 * 현재 열린 팝업 창으로 메시지를 전송하는 함수
	 */
	const postMessage = React.useCallback(
		(message: any, targetOrigin: string = '*') => {
			if (popupInstance?.window) {
				popupInstance.postMessage(message, targetOrigin)
			}
		},
		[popupInstance]
	)

	/**
	 * 컴포넌트 언마운트 시 정리 작업
	 */
	React.useEffect(() => {
		return () => {
			if (checkClosedIntervalRef.current) {
				clearInterval(checkClosedIntervalRef.current)
			}

			if (messageListenerRef.current) {
				window.removeEventListener('message', messageListenerRef.current)
			}
		}
	}, [])

	return {
		openPopup,
		closePopup,
		focusPopup,
		postMessage,
		isOpen,
		popupInstance,
	}
}

/**
 * 단순 팝업 열기 함수 (usePopup 훅 없이 사용)
 */
export function openPopup(
	url: string,
	options: PopupOptions = {}
): Window | null {
	const { openPopup: openPopupHook } = usePopup()

	return (
		openPopupHook({
			url,
			options,
			position: 'center',
			size: 'medium',
		})?.window || null
	)
}

/**
 * 팝업 관련 유틸리티 함수들을 모아놓은 객체
 *
 * 팝업 관리와 관련된 다양한 헬퍼 함수들을 제공합니다.
 */
export const popupUtils = {
	/**
	 * 팝업이 브라우저에 의해 차단되었는지 확인하는 함수
	 *
	 * 테스트 팝업을 열어서 차단 여부를 확인합니다.
	 *
	 * @returns 팝업이 차단되었으면 true, 아니면 false
	 */
	isPopupBlocked: (): boolean => {
		try {
			// 1x1 크기의 테스트 팝업 열기
			const testPopup = window.open('', '_blank', 'width=1,height=1')
			if (testPopup) {
				// 성공적으로 열렸으면 즉시 닫기
				testPopup.close()
				return false
			}
			return true
		} catch {
			// 에러 발생 시 차단된 것으로 간주
			return true
		}
	},

	/**
	 * 팝업 차단 안내 메시지를 표시하는 함수
	 *
	 * 사용자에게 팝업 차단 해제 방법을 안내합니다.
	 */
	showBlockedMessage: (): void => {
		alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.')
	},

	/**
	 * 열린 팝업 창의 크기를 조정하는 함수
	 *
	 * @param popup - 크기를 조정할 팝업 창
	 * @param width - 새로운 너비
	 * @param height - 새로운 높이
	 */
	resizePopup: (popup: Window, width: number, height: number): void => {
		try {
			popup.resizeTo(width, height)
		} catch (error) {
			console.warn('팝업 크기 조정 실패:', error)
		}
	},

	/**
	 * 열린 팝업 창의 위치를 이동하는 함수
	 *
	 * @param popup - 위치를 이동할 팝업 창
	 * @param left - 새로운 X 좌표
	 * @param top - 새로운 Y 좌표
	 */
	movePopup: (popup: Window, left: number, top: number): void => {
		try {
			popup.moveTo(left, top)
		} catch (error) {
			console.warn('팝업 위치 이동 실패:', error)
		}
	},
}
