/**
 * 범용 ?�업 관�???(window.open 기반)
 *
 * ??모듈?� React 컴포?�트?�서 ?�업 창을 ?�전?�고 ?�율?�으�?관리할 ???�는
 * ?�전???�업 관�??�스?�을 ?�공?�니??
 *
 * 주요 기능:
 * - ?�업 ?�기/?�기/?�커??관�?
 * - ?�양???�치?� ?�기 ?�션
 * - ?�동 ?�힘 감�?
 * - postMessage ?�신 지??
 * - ?�러 처리 �?메모�??�수 방�?
 * - POPUP_READY/CHOICE_EMP_INIT ?�동??지??
 *
 * ?�용 ?�시:
 * ```typescript
 * // 부�?컴포?�트?�서 ?�업 ?�기
 * const { openPopup } = usePopup();
 * openPopup({
 *   url: '/popup/com/COMZ100P00',
 *   size: 'medium',
 *   position: 'center',
 *   waitForReady: true, // ?�업?�서 POPUP_READY 메시지 ?�신 ???�이???�송
 *   readyResponseData: {
 *     type: 'CHOICE_EMP_INIT',
 *     data: {
 *       empNm: '?�길??,
 *       empList: [...],
 *     },
 *   },
 * });
 *
 * // ?�업(?�식)?�서??useEffect?�서 POPUP_READY 메시지 ?�송
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
 * // ?�업(?�식)?�서??CHOICE_EMP_INIT 메시지 ?�신 ???�이??처리
 * useEffect(() => {
 *   const handleMessage = (event: MessageEvent) => {
 *     if (event.data?.type === 'CHOICE_EMP_INIT') {
 *       // ?�이??처리
 *     }
 *   };
 *   window.addEventListener('message', handleMessage);
 *   return () => window.removeEventListener('message', handleMessage);
 * }, []);
 * ```
 */

import React from 'react'

/**
 * ?�업 창의 기본 ?�션 ?�정
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
 * ?�업 창의 ?�치 ?�션
 */
export type PopupPosition =
	| 'center'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'custom'

/**
 * ?�업 창의 ?�기 ?�션
 */
export type PopupSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom'

/**
 * ?�업 �??�정???�한 ?�전???�정 객체
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
	waitForReady?: boolean // ?�업??준�??�료 메시지�?기다�????�이???�송 ?��? (기본�? true)
	readyResponseData?: any // 준�??�료 메시지 ?�답?�로 보낼 ?�이??
}

/**
 * ?�업 ?�스?�스 객체
 */
export interface PopupInstance {
	window: Window | null
	isOpen: boolean
	close: () => void
	focus: () => void
	postMessage: (message: any, targetOrigin?: string) => void
}

/**
 * ?�업 ?�기�?기본 치수
 */
const POPUP_SIZES = {
	small: { width: 400, height: 300 },
	medium: { width: 800, height: 600 },
	large: { width: 1200, height: 800 },
	fullscreen: { width: window.screen.width, height: window.screen.height },
	custom: { width: 0, height: 0 },
}

/**
 * ?�재 ?�성 창이 ?�는 모니?�의 중앙 ?�치 계산 (?�??모니???�경 최적??
 */
function getCurrentMonitorCenter(
	width: number,
	height: number
): { left: number; top: number } {
	// ?�재 창의 ?�치?� ?�기 ?�보
	const currentWindow = window

	// ?�재 창의 중앙??계산 (창의 ?�제 중앙)
	const currentCenterX = currentWindow.screenX + currentWindow.outerWidth / 2
	const currentCenterY = currentWindow.screenY + currentWindow.outerHeight / 2

	// ?�업???�재 창의 중앙??배치
	let left = currentCenterX - width / 2
	let top = currentCenterY - height / 2

	// ?�??모니???�경?�서 ?�재 모니?�의 경계 ?�인
	// ?�재 창이 ?�치??모니?�의 경계�?계산
	const currentMonitorLeft = currentWindow.screenX
	const currentMonitorTop = currentWindow.screenY
	const currentMonitorRight =
		currentMonitorLeft + currentWindow.screen.availWidth
	const currentMonitorBottom =
		currentMonitorTop + currentWindow.screen.availHeight

	// ?�업???�재 모니?��? 벗어?��? ?�도�?조정
	left = Math.max(
		currentMonitorLeft,
		Math.min(left, currentMonitorRight - width)
	)
	top = Math.max(
		currentMonitorTop,
		Math.min(top, currentMonitorBottom - height)
	)

	// ?�버깅용 로그 (개발 ?�경?�서�?
	if (process.env.NODE_ENV === 'development') {
		console.log('?�� ?�업 ?�치 계산:', {
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
 * ?�업 ?�치 계산 ?�수
 */
function calculatePopupPosition(
	position: PopupPosition,
	size: PopupSize,
	customOptions?: PopupOptions
): { left: number; top: number } {
	const { width = 800, height = 600 } = customOptions || POPUP_SIZES[size]

	switch (position) {
		case 'center':
			// ?�??모니???�경??고려???�재 모니??중앙 계산
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
 * ?�업 features 문자???�성 ?�수
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
 * 범용 ?�업 관�???
 *
 * ?�업 창의 ?�명주기�?관리하�? postMessage ?�신??지?�합?�다.
 * 기본?�으�?모든 ?�업???�??준�??�료 메시지�?기다립니??
 *
 * @returns ?�업 관�??�수?�과 ?�태 객체
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
	 * ?�업 창이 ?�혔?��? ?�인?�는 ?�수
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
	 * ?�업 창을 ?�는 ?�수
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
					waitForReady = true, // 기본�? 준�??�료 메시지�?기다�?
					readyResponseData,
				} = config

				// 기존 ?�업???�려?�으�??�기
				if (popupInstance?.window && !popupInstance.window.closed) {
					popupInstance.close()
				}

				const features =
					options.features || buildPopupFeatures(size, position, options)
				const popupName = options.name || `popup_${Date.now()}`

				// ?�업 �??�기
				const popup = window.open(url, popupName, features)

				if (!popup) {
					throw new Error(
						'?�업 창을 ?????�습?�다. ?�업 차단???�성?�되???�을 ???�습?�다.'
					)
				}

				// ?�업 ?�스?�스 ?�성
				const instance: PopupInstance = {
					window: popup,
					isOpen: true,
					close: () => {
						try {
							popup.close()
						} catch (error) {
							console.warn('?�업 ?�기 ?�패:', error)
						}
					},
					focus: () => {
						try {
							popup.focus()
						} catch (error) {
							console.warn('?�업 ?�커???�패:', error)
						}
					},
					postMessage: (message: any, targetOrigin: string = '*') => {
						try {
							popup.postMessage(message, targetOrigin)
						} catch (error) {
							console.warn('메시지 ?�송 ?�패:', error)
						}
					},
				}

				// ?�태 ?�데?�트
				setPopupInstance(instance)
				setIsOpen(true)

				// 기본?�으�?준�??�료 메시지�?기다리는 로직
				if (waitForReady && readyResponseData) {
					console.log('?�� usePopup - 준�??�료 메시지 ?��??�작:', {
						waitForReady,
						readyResponseData,
						popupUrl: url,
					})

					const handleReadyMessage = (event: MessageEvent) => {
						console.log('?�� usePopup - 메시지 ?�신:', {
							type: event.data?.type,
							source: event.data?.source,
							data: event.data,
							origin: event.origin,
						})

						// POPUP_READY 메시지 감�?
						const isReadyMessage =
							event.data?.type === 'POPUP_READY' &&
							event.data?.source === 'CHILD'

						console.log('?�� usePopup - 준�??�료 메시지 체크:', {
							isReadyMessage,
							messageType: event.data?.type,
							messageSource: event.data?.source,
						})

						if (isReadyMessage) {
							console.log('??usePopup - POPUP_READY ?�신, ?�이???�송:', {
								receivedType: event.data.type,
								receivedSource: event.data.source,
								responseData: readyResponseData,
							})
							try {
								popup.postMessage(readyResponseData, '*')
								console.log('??usePopup - ?�이???�송 ?�공')
							} catch (error) {
								console.error('??usePopup - ?�이???�송 ?�패:', error)
							}
							window.removeEventListener('message', handleReadyMessage)
						}
					}
					window.addEventListener('message', handleReadyMessage)
				} else {
					console.log('?�️ usePopup - 준�??�료 메시지 ?��?비활?�화:', {
						waitForReady,
						hasReadyResponseData: !!readyResponseData,
					})
				}

				// ?�공 콜백 ?�출
				onOpen?.(popup)

				return instance
			} catch (error) {
				const errorObj =
					error instanceof Error ? error : new Error('?�업 ?�기 ?�패')
				config.onError?.(errorObj)
				return null
			}
		},
		[popupInstance, checkPopupClosed]
	)

	/**
	 * ?�재 ?�린 ?�업 창을 ?�는 ?�수
	 */
	const closePopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.close()
		}
	}, [popupInstance])

	/**
	 * ?�재 ?�린 ?�업 창에 ?�커?��? 주는 ?�수
	 */
	const focusPopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.focus()
		}
	}, [popupInstance])

	/**
	 * ?�재 ?�린 ?�업 창으�?메시지�??�송?�는 ?�수
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
	 * 컴포?�트 ?�마?�트 ???�리 ?�업
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
 * ?�순 ?�업 ?�기 ?�수 (usePopup ???�이 ?�용)
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
 * ?�업 관???�틸리티 ?�수?�을 모아?��? 객체
 *
 * ?�업 관리�? 관?�된 ?�양???�퍼 ?�수?�을 ?�공?�니??
 */
export const popupUtils = {
	/**
	 * ?�업??브라?��????�해 차단?�었?��? ?�인?�는 ?�수
	 *
	 * ?�스???�업???�어??차단 ?��?�??�인?�니??
	 *
	 * @returns ?�업??차단?�었?�면 true, ?�니�?false
	 */
	isPopupBlocked: (): boolean => {
		try {
			// 1x1 ?�기???�스???�업 ?�기
			const testPopup = window.open('', '_blank', 'width=1,height=1')
			if (testPopup) {
				// ?�공?�으�??�렸?�면 즉시 ?�기
				testPopup.close()
				return false
			}
			return true
		} catch {
			// ?�러 발생 ??차단??것으�?간주
			return true
		}
	},

	/**
	 * ?�업 차단 ?�내 메시지�??�시?�는 ?�수
	 *
	 * ?�용?�에�??�업 차단 ?�제 방법???�내?�니??
	 */
	showBlockedMessage: (): void => {
		alert('?�업??차단?�었?�니?? 브라?��? ?�정?�서 ?�업 차단???�제?�주?�요.')
	},

	/**
	 * ?�린 ?�업 창의 ?�기�?조정?�는 ?�수
	 *
	 * @param popup - ?�기�?조정???�업 �?
	 * @param width - ?�로???�비
	 * @param height - ?�로???�이
	 */
	resizePopup: (popup: Window, width: number, height: number): void => {
		try {
			popup.resizeTo(width, height)
		} catch (error) {
			console.warn('?�업 ?�기 조정 ?�패:', error)
		}
	},

	/**
	 * ?�린 ?�업 창의 ?�치�??�동?�는 ?�수
	 *
	 * @param popup - ?�치�??�동???�업 �?
	 * @param left - ?�로??X 좌표
	 * @param top - ?�로??Y 좌표
	 */
	movePopup: (popup: Window, left: number, top: number): void => {
		try {
			popup.moveTo(left, top)
		} catch (error) {
			console.warn('?�업 ?�치 ?�동 ?�패:', error)
		}
	},
}


