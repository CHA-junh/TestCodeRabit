/**
 * λ²μ© ?μ κ΄λ¦???(window.open κΈ°λ°)
 *
 * ??λͺ¨λ? React μ»΄ν¬?νΈ?μ ?μ μ°½μ ?μ ?κ³  ?¨μ¨?μΌλ‘?κ΄λ¦¬ν  ???λ
 * ?μ ???μ κ΄λ¦??μ€?μ ?κ³΅?©λ??
 *
 * μ£Όμ κΈ°λ₯:
 * - ?μ ?΄κΈ°/?«κΈ°/?¬μ»€??κ΄λ¦?
 * - ?€μ???μΉ? ?¬κΈ° ?΅μ
 * - ?λ ?«ν κ°μ?
 * - postMessage ?΅μ  μ§??
 * - ?λ¬ μ²λ¦¬ λ°?λ©λͺ¨λ¦??μ λ°©μ?
 * - POPUP_READY/CHOICE_EMP_INIT ?λ??μ§??
 *
 * ?¬μ© ?μ:
 * ```typescript
 * // λΆλͺ?μ»΄ν¬?νΈ?μ ?μ ?΄κΈ°
 * const { openPopup } = usePopup();
 * openPopup({
 *   url: '/popup/com/COMZ100P00',
 *   size: 'medium',
 *   position: 'center',
 *   waitForReady: true, // ?μ?μ POPUP_READY λ©μμ§ ?μ  ???°μ΄???μ‘
 *   readyResponseData: {
 *     type: 'CHOICE_EMP_INIT',
 *     data: {
 *       empNm: '?κΈΈ??,
 *       empList: [...],
 *     },
 *   },
 * });
 *
 * // ?μ(?μ)?μ??useEffect?μ POPUP_READY λ©μμ§ ?μ‘
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
 * // ?μ(?μ)?μ??CHOICE_EMP_INIT λ©μμ§ ?μ  ???°μ΄??μ²λ¦¬
 * useEffect(() => {
 *   const handleMessage = (event: MessageEvent) => {
 *     if (event.data?.type === 'CHOICE_EMP_INIT') {
 *       // ?°μ΄??μ²λ¦¬
 *     }
 *   };
 *   window.addEventListener('message', handleMessage);
 *   return () => window.removeEventListener('message', handleMessage);
 * }, []);
 * ```
 */

import React from 'react'

/**
 * ?μ μ°½μ κΈ°λ³Έ ?΅μ ?€μ 
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
 * ?μ μ°½μ ?μΉ ?΅μ
 */
export type PopupPosition =
	| 'center'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'custom'

/**
 * ?μ μ°½μ ?¬κΈ° ?΅μ
 */
export type PopupSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom'

/**
 * ?μ μ°??€μ ???ν ?μ ???€μ  κ°μ²΄
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
	waitForReady?: boolean // ?μ??μ€λΉ??λ£ λ©μμ§λ₯?κΈ°λ€λ¦????°μ΄???μ‘ ?¬λ? (κΈ°λ³Έκ°? true)
	readyResponseData?: any // μ€λΉ??λ£ λ©μμ§ ?λ΅?Όλ‘ λ³΄λΌ ?°μ΄??
}

/**
 * ?μ ?Έμ€?΄μ€ κ°μ²΄
 */
export interface PopupInstance {
	window: Window | null
	isOpen: boolean
	close: () => void
	focus: () => void
	postMessage: (message: any, targetOrigin?: string) => void
}

/**
 * ?μ ?¬κΈ°λ³?κΈ°λ³Έ μΉμ
 */
const POPUP_SIZES = {
	small: { width: 400, height: 300 },
	medium: { width: 800, height: 600 },
	large: { width: 1200, height: 800 },
	fullscreen: { width: window.screen.width, height: window.screen.height },
	custom: { width: 0, height: 0 },
}

/**
 * ?μ¬ ?μ± μ°½μ΄ ?λ λͺ¨λ?°μ μ€μ ?μΉ κ³μ° (???λͺ¨λ???κ²½ μ΅μ ??
 */
function getCurrentMonitorCenter(
	width: number,
	height: number
): { left: number; top: number } {
	// ?μ¬ μ°½μ ?μΉ? ?¬κΈ° ?λ³΄
	const currentWindow = window

	// ?μ¬ μ°½μ μ€μ??κ³μ° (μ°½μ ?€μ  μ€μ)
	const currentCenterX = currentWindow.screenX + currentWindow.outerWidth / 2
	const currentCenterY = currentWindow.screenY + currentWindow.outerHeight / 2

	// ?μ???μ¬ μ°½μ μ€μ??λ°°μΉ
	let left = currentCenterX - width / 2
	let top = currentCenterY - height / 2

	// ???λͺ¨λ???κ²½?μ ?μ¬ λͺ¨λ?°μ κ²½κ³ ?μΈ
	// ?μ¬ μ°½μ΄ ?μΉ??λͺ¨λ?°μ κ²½κ³λ₯?κ³μ°
	const currentMonitorLeft = currentWindow.screenX
	const currentMonitorTop = currentWindow.screenY
	const currentMonitorRight =
		currentMonitorLeft + currentWindow.screen.availWidth
	const currentMonitorBottom =
		currentMonitorTop + currentWindow.screen.availHeight

	// ?μ???μ¬ λͺ¨λ?°λ? λ²μ΄?μ? ?λλ‘?μ‘°μ 
	left = Math.max(
		currentMonitorLeft,
		Math.min(left, currentMonitorRight - width)
	)
	top = Math.max(
		currentMonitorTop,
		Math.min(top, currentMonitorBottom - height)
	)

	// ?λ²κΉμ© λ‘κ·Έ (κ°λ° ?κ²½?μλ§?
	if (process.env.NODE_ENV === 'development') {
		console.log('? ?μ ?μΉ κ³μ°:', {
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
 * ?μ ?μΉ κ³μ° ?¨μ
 */
function calculatePopupPosition(
	position: PopupPosition,
	size: PopupSize,
	customOptions?: PopupOptions
): { left: number; top: number } {
	const { width = 800, height = 600 } = customOptions || POPUP_SIZES[size]

	switch (position) {
		case 'center':
			// ???λͺ¨λ???κ²½??κ³ λ €???μ¬ λͺ¨λ??μ€μ κ³μ°
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
 * ?μ features λ¬Έμ???μ± ?¨μ
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
 * λ²μ© ?μ κ΄λ¦???
 *
 * ?μ μ°½μ ?λͺμ£ΌκΈ°λ₯?κ΄λ¦¬νκ³? postMessage ?΅μ ??μ§?ν©?λ€.
 * κΈ°λ³Έ?μΌλ‘?λͺ¨λ  ?μ?????μ€λΉ??λ£ λ©μμ§λ₯?κΈ°λ€λ¦½λ??
 *
 * @returns ?μ κ΄λ¦??¨μ?€κ³Ό ?ν κ°μ²΄
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
	 * ?μ μ°½μ΄ ?«ν?μ? ?μΈ?λ ?¨μ
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
	 * ?μ μ°½μ ?¬λ ?¨μ
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
					waitForReady = true, // κΈ°λ³Έκ°? μ€λΉ??λ£ λ©μμ§λ₯?κΈ°λ€λ¦?
					readyResponseData,
				} = config

				// κΈ°μ‘΄ ?μ???΄λ €?μΌλ©??«κΈ°
				if (popupInstance?.window && !popupInstance.window.closed) {
					popupInstance.close()
				}

				const features =
					options.features || buildPopupFeatures(size, position, options)
				const popupName = options.name || `popup_${Date.now()}`

				// ?μ μ°??΄κΈ°
				const popup = window.open(url, popupName, features)

				if (!popup) {
					throw new Error(
						'?μ μ°½μ ?????μ΅?λ€. ?μ μ°¨λ¨???μ±?λ???μ ???μ΅?λ€.'
					)
				}

				// ?μ ?Έμ€?΄μ€ ?μ±
				const instance: PopupInstance = {
					window: popup,
					isOpen: true,
					close: () => {
						try {
							popup.close()
						} catch (error) {
							console.warn('?μ ?«κΈ° ?€ν¨:', error)
						}
					},
					focus: () => {
						try {
							popup.focus()
						} catch (error) {
							console.warn('?μ ?¬μ»€???€ν¨:', error)
						}
					},
					postMessage: (message: any, targetOrigin: string = '*') => {
						try {
							popup.postMessage(message, targetOrigin)
						} catch (error) {
							console.warn('λ©μμ§ ?μ‘ ?€ν¨:', error)
						}
					},
				}

				// ?ν ?λ°?΄νΈ
				setPopupInstance(instance)
				setIsOpen(true)

				// κΈ°λ³Έ?μΌλ‘?μ€λΉ??λ£ λ©μμ§λ₯?κΈ°λ€λ¦¬λ λ‘μ§
				if (waitForReady && readyResponseData) {
					console.log('? usePopup - μ€λΉ??λ£ λ©μμ§ ?κΈ??μ:', {
						waitForReady,
						readyResponseData,
						popupUrl: url,
					})

					const handleReadyMessage = (event: MessageEvent) => {
						console.log('?¨ usePopup - λ©μμ§ ?μ :', {
							type: event.data?.type,
							source: event.data?.source,
							data: event.data,
							origin: event.origin,
						})

						// POPUP_READY λ©μμ§ κ°μ?
						const isReadyMessage =
							event.data?.type === 'POPUP_READY' &&
							event.data?.source === 'CHILD'

						console.log('? usePopup - μ€λΉ??λ£ λ©μμ§ μ²΄ν¬:', {
							isReadyMessage,
							messageType: event.data?.type,
							messageSource: event.data?.source,
						})

						if (isReadyMessage) {
							console.log('??usePopup - POPUP_READY ?μ , ?°μ΄???μ‘:', {
								receivedType: event.data.type,
								receivedSource: event.data.source,
								responseData: readyResponseData,
							})
							try {
								popup.postMessage(readyResponseData, '*')
								console.log('??usePopup - ?°μ΄???μ‘ ?±κ³΅')
							} catch (error) {
								console.error('??usePopup - ?°μ΄???μ‘ ?€ν¨:', error)
							}
							window.removeEventListener('message', handleReadyMessage)
						}
					}
					window.addEventListener('message', handleReadyMessage)
				} else {
					console.log('? οΈ usePopup - μ€λΉ??λ£ λ©μμ§ ?κΈ?λΉν?±ν:', {
						waitForReady,
						hasReadyResponseData: !!readyResponseData,
					})
				}

				// ?±κ³΅ μ½λ°± ?ΈμΆ
				onOpen?.(popup)

				return instance
			} catch (error) {
				const errorObj =
					error instanceof Error ? error : new Error('?μ ?΄κΈ° ?€ν¨')
				config.onError?.(errorObj)
				return null
			}
		},
		[popupInstance, checkPopupClosed]
	)

	/**
	 * ?μ¬ ?΄λ¦° ?μ μ°½μ ?«λ ?¨μ
	 */
	const closePopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.close()
		}
	}, [popupInstance])

	/**
	 * ?μ¬ ?΄λ¦° ?μ μ°½μ ?¬μ»€?€λ? μ£Όλ ?¨μ
	 */
	const focusPopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.focus()
		}
	}, [popupInstance])

	/**
	 * ?μ¬ ?΄λ¦° ?μ μ°½μΌλ‘?λ©μμ§λ₯??μ‘?λ ?¨μ
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
	 * μ»΄ν¬?νΈ ?Έλ§?΄νΈ ???λ¦¬ ?μ
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
 * ?¨μ ?μ ?΄κΈ° ?¨μ (usePopup ???μ΄ ?¬μ©)
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
 * ?μ κ΄??? νΈλ¦¬ν° ?¨μ?€μ λͺ¨μ?μ? κ°μ²΄
 *
 * ?μ κ΄λ¦¬μ? κ΄?¨λ ?€μ???¬νΌ ?¨μ?€μ ?κ³΅?©λ??
 */
export const popupUtils = {
	/**
	 * ?μ??λΈλΌ?°μ????ν΄ μ°¨λ¨?μ?μ? ?μΈ?λ ?¨μ
	 *
	 * ?μ€???μ???΄μ΄??μ°¨λ¨ ?¬λ?λ₯??μΈ?©λ??
	 *
	 * @returns ?μ??μ°¨λ¨?μ?Όλ©΄ true, ?λλ©?false
	 */
	isPopupBlocked: (): boolean => {
		try {
			// 1x1 ?¬κΈ°???μ€???μ ?΄κΈ°
			const testPopup = window.open('', '_blank', 'width=1,height=1')
			if (testPopup) {
				// ?±κ³΅?μΌλ‘??΄λ Έ?Όλ©΄ μ¦μ ?«κΈ°
				testPopup.close()
				return false
			}
			return true
		} catch {
			// ?λ¬ λ°μ ??μ°¨λ¨??κ²μΌλ‘?κ°μ£Ό
			return true
		}
	},

	/**
	 * ?μ μ°¨λ¨ ?λ΄ λ©μμ§λ₯??μ?λ ?¨μ
	 *
	 * ?¬μ©?μκ²??μ μ°¨λ¨ ?΄μ  λ°©λ²???λ΄?©λ??
	 */
	showBlockedMessage: (): void => {
		alert('?μ??μ°¨λ¨?μ?΅λ?? λΈλΌ?°μ? ?€μ ?μ ?μ μ°¨λ¨???΄μ ?΄μ£Ό?Έμ.')
	},

	/**
	 * ?΄λ¦° ?μ μ°½μ ?¬κΈ°λ₯?μ‘°μ ?λ ?¨μ
	 *
	 * @param popup - ?¬κΈ°λ₯?μ‘°μ ???μ μ°?
	 * @param width - ?λ‘???λΉ
	 * @param height - ?λ‘???μ΄
	 */
	resizePopup: (popup: Window, width: number, height: number): void => {
		try {
			popup.resizeTo(width, height)
		} catch (error) {
			console.warn('?μ ?¬κΈ° μ‘°μ  ?€ν¨:', error)
		}
	},

	/**
	 * ?΄λ¦° ?μ μ°½μ ?μΉλ₯??΄λ?λ ?¨μ
	 *
	 * @param popup - ?μΉλ₯??΄λ???μ μ°?
	 * @param left - ?λ‘??X μ’ν
	 * @param top - ?λ‘??Y μ’ν
	 */
	movePopup: (popup: Window, left: number, top: number): void => {
		try {
			popup.moveTo(left, top)
		} catch (error) {
			console.warn('?μ ?μΉ ?΄λ ?€ν¨:', error)
		}
	},
}


