/**
 * ë²”ìš© ?ì—… ê´€ë¦???(window.open ê¸°ë°˜)
 *
 * ??ëª¨ë“ˆ?€ React ì»´í¬?ŒíŠ¸?ì„œ ?ì—… ì°½ì„ ?ˆì „?˜ê³  ?¨ìœ¨?ìœ¼ë¡?ê´€ë¦¬í•  ???ˆëŠ”
 * ?„ì „???ì—… ê´€ë¦??œìŠ¤?œì„ ?œê³µ?©ë‹ˆ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?ì—… ?´ê¸°/?«ê¸°/?¬ì»¤??ê´€ë¦?
 * - ?¤ì–‘???„ì¹˜?€ ?¬ê¸° ?µì…˜
 * - ?ë™ ?«í˜ ê°ì?
 * - postMessage ?µì‹  ì§€??
 * - ?ëŸ¬ ì²˜ë¦¬ ë°?ë©”ëª¨ë¦??„ìˆ˜ ë°©ì?
 * - POPUP_READY/CHOICE_EMP_INIT ?ë™??ì§€??
 *
 * ?¬ìš© ?ˆì‹œ:
 * ```typescript
 * // ë¶€ëª?ì»´í¬?ŒíŠ¸?ì„œ ?ì—… ?´ê¸°
 * const { openPopup } = usePopup();
 * openPopup({
 *   url: '/popup/com/COMZ100P00',
 *   size: 'medium',
 *   position: 'center',
 *   waitForReady: true, // ?ì—…?ì„œ POPUP_READY ë©”ì‹œì§€ ?˜ì‹  ???°ì´???„ì†¡
 *   readyResponseData: {
 *     type: 'CHOICE_EMP_INIT',
 *     data: {
 *       empNm: '?ê¸¸??,
 *       empList: [...],
 *     },
 *   },
 * });
 *
 * // ?ì—…(?ì‹)?ì„œ??useEffect?ì„œ POPUP_READY ë©”ì‹œì§€ ?„ì†¡
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
 * // ?ì—…(?ì‹)?ì„œ??CHOICE_EMP_INIT ë©”ì‹œì§€ ?˜ì‹  ???°ì´??ì²˜ë¦¬
 * useEffect(() => {
 *   const handleMessage = (event: MessageEvent) => {
 *     if (event.data?.type === 'CHOICE_EMP_INIT') {
 *       // ?°ì´??ì²˜ë¦¬
 *     }
 *   };
 *   window.addEventListener('message', handleMessage);
 *   return () => window.removeEventListener('message', handleMessage);
 * }, []);
 * ```
 */

import React from 'react'

/**
 * ?ì—… ì°½ì˜ ê¸°ë³¸ ?µì…˜ ?¤ì •
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
 * ?ì—… ì°½ì˜ ?„ì¹˜ ?µì…˜
 */
export type PopupPosition =
	| 'center'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'custom'

/**
 * ?ì—… ì°½ì˜ ?¬ê¸° ?µì…˜
 */
export type PopupSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom'

/**
 * ?ì—… ì°??¤ì •???„í•œ ?„ì „???¤ì • ê°ì²´
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
	waitForReady?: boolean // ?ì—…??ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ë¥?ê¸°ë‹¤ë¦????°ì´???„ì†¡ ?¬ë? (ê¸°ë³¸ê°? true)
	readyResponseData?: any // ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ ?‘ë‹µ?¼ë¡œ ë³´ë‚¼ ?°ì´??
}

/**
 * ?ì—… ?¸ìŠ¤?´ìŠ¤ ê°ì²´
 */
export interface PopupInstance {
	window: Window | null
	isOpen: boolean
	close: () => void
	focus: () => void
	postMessage: (message: any, targetOrigin?: string) => void
}

/**
 * ?ì—… ?¬ê¸°ë³?ê¸°ë³¸ ì¹˜ìˆ˜
 */
const POPUP_SIZES = {
	small: { width: 400, height: 300 },
	medium: { width: 800, height: 600 },
	large: { width: 1200, height: 800 },
	fullscreen: { width: window.screen.width, height: window.screen.height },
	custom: { width: 0, height: 0 },
}

/**
 * ?„ì¬ ?œì„± ì°½ì´ ?ˆëŠ” ëª¨ë‹ˆ?°ì˜ ì¤‘ì•™ ?„ì¹˜ ê³„ì‚° (?€??ëª¨ë‹ˆ???˜ê²½ ìµœì ??
 */
function getCurrentMonitorCenter(
	width: number,
	height: number
): { left: number; top: number } {
	// ?„ì¬ ì°½ì˜ ?„ì¹˜?€ ?¬ê¸° ?•ë³´
	const currentWindow = window

	// ?„ì¬ ì°½ì˜ ì¤‘ì•™??ê³„ì‚° (ì°½ì˜ ?¤ì œ ì¤‘ì•™)
	const currentCenterX = currentWindow.screenX + currentWindow.outerWidth / 2
	const currentCenterY = currentWindow.screenY + currentWindow.outerHeight / 2

	// ?ì—…???„ì¬ ì°½ì˜ ì¤‘ì•™??ë°°ì¹˜
	let left = currentCenterX - width / 2
	let top = currentCenterY - height / 2

	// ?€??ëª¨ë‹ˆ???˜ê²½?ì„œ ?„ì¬ ëª¨ë‹ˆ?°ì˜ ê²½ê³„ ?•ì¸
	// ?„ì¬ ì°½ì´ ?„ì¹˜??ëª¨ë‹ˆ?°ì˜ ê²½ê³„ë¥?ê³„ì‚°
	const currentMonitorLeft = currentWindow.screenX
	const currentMonitorTop = currentWindow.screenY
	const currentMonitorRight =
		currentMonitorLeft + currentWindow.screen.availWidth
	const currentMonitorBottom =
		currentMonitorTop + currentWindow.screen.availHeight

	// ?ì—…???„ì¬ ëª¨ë‹ˆ?°ë? ë²—ì–´?˜ì? ?Šë„ë¡?ì¡°ì •
	left = Math.max(
		currentMonitorLeft,
		Math.min(left, currentMonitorRight - width)
	)
	top = Math.max(
		currentMonitorTop,
		Math.min(top, currentMonitorBottom - height)
	)

	// ?”ë²„ê¹…ìš© ë¡œê·¸ (ê°œë°œ ?˜ê²½?ì„œë§?
	if (process.env.NODE_ENV === 'development') {
		console.log('?” ?ì—… ?„ì¹˜ ê³„ì‚°:', {
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
 * ?ì—… ?„ì¹˜ ê³„ì‚° ?¨ìˆ˜
 */
function calculatePopupPosition(
	position: PopupPosition,
	size: PopupSize,
	customOptions?: PopupOptions
): { left: number; top: number } {
	const { width = 800, height = 600 } = customOptions || POPUP_SIZES[size]

	switch (position) {
		case 'center':
			// ?€??ëª¨ë‹ˆ???˜ê²½??ê³ ë ¤???„ì¬ ëª¨ë‹ˆ??ì¤‘ì•™ ê³„ì‚°
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
 * ?ì—… features ë¬¸ì???ì„± ?¨ìˆ˜
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
 * ë²”ìš© ?ì—… ê´€ë¦???
 *
 * ?ì—… ì°½ì˜ ?ëª…ì£¼ê¸°ë¥?ê´€ë¦¬í•˜ê³? postMessage ?µì‹ ??ì§€?í•©?ˆë‹¤.
 * ê¸°ë³¸?ìœ¼ë¡?ëª¨ë“  ?ì—…???€??ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ë¥?ê¸°ë‹¤ë¦½ë‹ˆ??
 *
 * @returns ?ì—… ê´€ë¦??¨ìˆ˜?¤ê³¼ ?íƒœ ê°ì²´
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
	 * ?ì—… ì°½ì´ ?«í˜”?”ì? ?•ì¸?˜ëŠ” ?¨ìˆ˜
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
	 * ?ì—… ì°½ì„ ?¬ëŠ” ?¨ìˆ˜
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
					waitForReady = true, // ê¸°ë³¸ê°? ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ë¥?ê¸°ë‹¤ë¦?
					readyResponseData,
				} = config

				// ê¸°ì¡´ ?ì—…???´ë ¤?ˆìœ¼ë©??«ê¸°
				if (popupInstance?.window && !popupInstance.window.closed) {
					popupInstance.close()
				}

				const features =
					options.features || buildPopupFeatures(size, position, options)
				const popupName = options.name || `popup_${Date.now()}`

				// ?ì—… ì°??´ê¸°
				const popup = window.open(url, popupName, features)

				if (!popup) {
					throw new Error(
						'?ì—… ì°½ì„ ?????†ìŠµ?ˆë‹¤. ?ì—… ì°¨ë‹¨???œì„±?”ë˜???ˆì„ ???ˆìŠµ?ˆë‹¤.'
					)
				}

				// ?ì—… ?¸ìŠ¤?´ìŠ¤ ?ì„±
				const instance: PopupInstance = {
					window: popup,
					isOpen: true,
					close: () => {
						try {
							popup.close()
						} catch (error) {
							console.warn('?ì—… ?«ê¸° ?¤íŒ¨:', error)
						}
					},
					focus: () => {
						try {
							popup.focus()
						} catch (error) {
							console.warn('?ì—… ?¬ì»¤???¤íŒ¨:', error)
						}
					},
					postMessage: (message: any, targetOrigin: string = '*') => {
						try {
							popup.postMessage(message, targetOrigin)
						} catch (error) {
							console.warn('ë©”ì‹œì§€ ?„ì†¡ ?¤íŒ¨:', error)
						}
					},
				}

				// ?íƒœ ?…ë°?´íŠ¸
				setPopupInstance(instance)
				setIsOpen(true)

				// ê¸°ë³¸?ìœ¼ë¡?ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ë¥?ê¸°ë‹¤ë¦¬ëŠ” ë¡œì§
				if (waitForReady && readyResponseData) {
					console.log('?”„ usePopup - ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ ?€ê¸??œì‘:', {
						waitForReady,
						readyResponseData,
						popupUrl: url,
					})

					const handleReadyMessage = (event: MessageEvent) => {
						console.log('?“¨ usePopup - ë©”ì‹œì§€ ?˜ì‹ :', {
							type: event.data?.type,
							source: event.data?.source,
							data: event.data,
							origin: event.origin,
						})

						// POPUP_READY ë©”ì‹œì§€ ê°ì?
						const isReadyMessage =
							event.data?.type === 'POPUP_READY' &&
							event.data?.source === 'CHILD'

						console.log('?” usePopup - ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ ì²´í¬:', {
							isReadyMessage,
							messageType: event.data?.type,
							messageSource: event.data?.source,
						})

						if (isReadyMessage) {
							console.log('??usePopup - POPUP_READY ?˜ì‹ , ?°ì´???„ì†¡:', {
								receivedType: event.data.type,
								receivedSource: event.data.source,
								responseData: readyResponseData,
							})
							try {
								popup.postMessage(readyResponseData, '*')
								console.log('??usePopup - ?°ì´???„ì†¡ ?±ê³µ')
							} catch (error) {
								console.error('??usePopup - ?°ì´???„ì†¡ ?¤íŒ¨:', error)
							}
							window.removeEventListener('message', handleReadyMessage)
						}
					}
					window.addEventListener('message', handleReadyMessage)
				} else {
					console.log('? ï¸ usePopup - ì¤€ë¹??„ë£Œ ë©”ì‹œì§€ ?€ê¸?ë¹„í™œ?±í™”:', {
						waitForReady,
						hasReadyResponseData: !!readyResponseData,
					})
				}

				// ?±ê³µ ì½œë°± ?¸ì¶œ
				onOpen?.(popup)

				return instance
			} catch (error) {
				const errorObj =
					error instanceof Error ? error : new Error('?ì—… ?´ê¸° ?¤íŒ¨')
				config.onError?.(errorObj)
				return null
			}
		},
		[popupInstance, checkPopupClosed]
	)

	/**
	 * ?„ì¬ ?´ë¦° ?ì—… ì°½ì„ ?«ëŠ” ?¨ìˆ˜
	 */
	const closePopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.close()
		}
	}, [popupInstance])

	/**
	 * ?„ì¬ ?´ë¦° ?ì—… ì°½ì— ?¬ì»¤?¤ë? ì£¼ëŠ” ?¨ìˆ˜
	 */
	const focusPopup = React.useCallback(() => {
		if (popupInstance?.window) {
			popupInstance.focus()
		}
	}, [popupInstance])

	/**
	 * ?„ì¬ ?´ë¦° ?ì—… ì°½ìœ¼ë¡?ë©”ì‹œì§€ë¥??„ì†¡?˜ëŠ” ?¨ìˆ˜
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
	 * ì»´í¬?ŒíŠ¸ ?¸ë§ˆ?´íŠ¸ ???•ë¦¬ ?‘ì—…
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
 * ?¨ìˆœ ?ì—… ?´ê¸° ?¨ìˆ˜ (usePopup ???†ì´ ?¬ìš©)
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
 * ?ì—… ê´€??? í‹¸ë¦¬í‹° ?¨ìˆ˜?¤ì„ ëª¨ì•„?“ì? ê°ì²´
 *
 * ?ì—… ê´€ë¦¬ì? ê´€?¨ëœ ?¤ì–‘???¬í¼ ?¨ìˆ˜?¤ì„ ?œê³µ?©ë‹ˆ??
 */
export const popupUtils = {
	/**
	 * ?ì—…??ë¸Œë¼?°ì????˜í•´ ì°¨ë‹¨?˜ì—ˆ?”ì? ?•ì¸?˜ëŠ” ?¨ìˆ˜
	 *
	 * ?ŒìŠ¤???ì—…???´ì–´??ì°¨ë‹¨ ?¬ë?ë¥??•ì¸?©ë‹ˆ??
	 *
	 * @returns ?ì—…??ì°¨ë‹¨?˜ì—ˆ?¼ë©´ true, ?„ë‹ˆë©?false
	 */
	isPopupBlocked: (): boolean => {
		try {
			// 1x1 ?¬ê¸°???ŒìŠ¤???ì—… ?´ê¸°
			const testPopup = window.open('', '_blank', 'width=1,height=1')
			if (testPopup) {
				// ?±ê³µ?ìœ¼ë¡??´ë ¸?¼ë©´ ì¦‰ì‹œ ?«ê¸°
				testPopup.close()
				return false
			}
			return true
		} catch {
			// ?ëŸ¬ ë°œìƒ ??ì°¨ë‹¨??ê²ƒìœ¼ë¡?ê°„ì£¼
			return true
		}
	},

	/**
	 * ?ì—… ì°¨ë‹¨ ?ˆë‚´ ë©”ì‹œì§€ë¥??œì‹œ?˜ëŠ” ?¨ìˆ˜
	 *
	 * ?¬ìš©?ì—ê²??ì—… ì°¨ë‹¨ ?´ì œ ë°©ë²•???ˆë‚´?©ë‹ˆ??
	 */
	showBlockedMessage: (): void => {
		alert('?ì—…??ì°¨ë‹¨?˜ì—ˆ?µë‹ˆ?? ë¸Œë¼?°ì? ?¤ì •?ì„œ ?ì—… ì°¨ë‹¨???´ì œ?´ì£¼?¸ìš”.')
	},

	/**
	 * ?´ë¦° ?ì—… ì°½ì˜ ?¬ê¸°ë¥?ì¡°ì •?˜ëŠ” ?¨ìˆ˜
	 *
	 * @param popup - ?¬ê¸°ë¥?ì¡°ì •???ì—… ì°?
	 * @param width - ?ˆë¡œ???ˆë¹„
	 * @param height - ?ˆë¡œ???’ì´
	 */
	resizePopup: (popup: Window, width: number, height: number): void => {
		try {
			popup.resizeTo(width, height)
		} catch (error) {
			console.warn('?ì—… ?¬ê¸° ì¡°ì • ?¤íŒ¨:', error)
		}
	},

	/**
	 * ?´ë¦° ?ì—… ì°½ì˜ ?„ì¹˜ë¥??´ë™?˜ëŠ” ?¨ìˆ˜
	 *
	 * @param popup - ?„ì¹˜ë¥??´ë™???ì—… ì°?
	 * @param left - ?ˆë¡œ??X ì¢Œí‘œ
	 * @param top - ?ˆë¡œ??Y ì¢Œí‘œ
	 */
	movePopup: (popup: Window, left: number, top: number): void => {
		try {
			popup.moveTo(left, top)
		} catch (error) {
			console.warn('?ì—… ?„ì¹˜ ?´ë™ ?¤íŒ¨:', error)
		}
	},
}


