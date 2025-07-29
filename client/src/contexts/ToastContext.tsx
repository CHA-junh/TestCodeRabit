'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

/**
 * ToastContext?ì„œ ?œê³µ?˜ëŠ” ?¨ìˆ˜?¤ì˜ ?€???•ì˜
 * - showToast: ? ìŠ¤???Œë¦¼???œì‹œ?˜ëŠ” ?¨ìˆ˜
 * - showConfirm: ?•ì¸ ?¤ì´?¼ë¡œê·¸ë? ?œì‹œ?˜ëŠ” ?¨ìˆ˜
 */
interface ToastContextType {
	showToast: (
		message: string,
		type?: 'success' | 'info' | 'warning' | 'error'
	) => void
	showSuccess: (message: string) => void
	showError: (message: string) => void
	showWarning: (message: string) => void
	showInfo: (message: string) => void
	showConfirm: (config: ConfirmConfig) => void
}

/**
 * ?•ì¸ ?¤ì´?¼ë¡œê·??¤ì •???„í•œ ?¸í„°?˜ì´??
 * - message: ?¤ì´?¼ë¡œê·¸ì— ?œì‹œ??ë©”ì‹œì§€
 * - type: ?¤ì´?¼ë¡œê·??€??(info, warning, error)
 * - onConfirm: ?•ì¸ ë²„íŠ¼ ?´ë¦­ ???¤í–‰???¨ìˆ˜
 * - onCancel: ì·¨ì†Œ ë²„íŠ¼ ?´ë¦­ ???¤í–‰???¨ìˆ˜ (? íƒ?¬í•­)
 */
interface ConfirmConfig {
	message: string
	type?: 'info' | 'warning' | 'error'
	onConfirm: () => void
	onCancel?: () => void
	confirmOnly?: boolean
}

// React Context ?ì„± (?„ì—­ ?íƒœ ê´€ë¦¬ë? ?„í•œ ì»¨í…?¤íŠ¸)
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * ToastProvider ì»´í¬?ŒíŠ¸
 *
 * ??• :
 * 1. Toast?€ ConfirmDialog???„ì—­ ?íƒœ ê´€ë¦?
 * 2. ?„ì—­?ì„œ ?¬ìš©?????ˆëŠ” showToast, showConfirm ?¨ìˆ˜ ?œê³µ
 * 3. ?¤ì œ Toast?€ ConfirmDialog ì»´í¬?ŒíŠ¸ ?Œë”ë§?
 *
 * ?¬ìš©ë²?
 * - layout.tsx?ì„œ ?„ì²´ ?±ì„ ê°ì‹¸??ëª¨ë“  ì»´í¬?ŒíŠ¸?ì„œ ?¬ìš© ê°€??
 * - useToast() ?…ì„ ?µí•´ showToast, showConfirm ?¨ìˆ˜ ?¬ìš©
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	/**
	 * Toast ?íƒœ ê´€ë¦?
	 * - message: ? ìŠ¤?¸ì— ?œì‹œ??ë©”ì‹œì§€
	 * - type: ? ìŠ¤???€??(info, warning, error)
	 * - isVisible: ? ìŠ¤???œì‹œ ?¬ë?
	 */
	const [toastConfig, setToastConfig] = useState<{
		message: string
		type: 'success' | 'info' | 'warning' | 'error'
		isVisible: boolean
	}>({
		message: '',
		type: 'info',
		isVisible: false,
	})

	/**
	 * ConfirmDialog ?íƒœ ê´€ë¦?
	 * - message: ?¤ì´?¼ë¡œê·¸ì— ?œì‹œ??ë©”ì‹œì§€
	 * - type: ?¤ì´?¼ë¡œê·??€??(info, warning, error)
	 * - isVisible: ?¤ì´?¼ë¡œê·??œì‹œ ?¬ë?
	 * - onConfirm: ?•ì¸ ë²„íŠ¼ ?´ë¦­ ???¤í–‰???¨ìˆ˜
	 * - onCancel: ì·¨ì†Œ ë²„íŠ¼ ?´ë¦­ ???¤í–‰???¨ìˆ˜
	 */
	const [confirmConfig, setConfirmConfig] = useState<{
		message: string
		type: 'info' | 'warning' | 'error'
		isVisible: boolean
		onConfirm: () => void
		onCancel?: () => void
		confirmOnly: boolean
	}>({
		message: '',
		type: 'info',
		isVisible: false,
		onConfirm: () => {},
		confirmOnly: false,
	})

	/**
	 * ? ìŠ¤???Œë¦¼???œì‹œ?˜ëŠ” ?¨ìˆ˜
	 *
	 * @param message - ? ìŠ¤?¸ì— ?œì‹œ??ë©”ì‹œì§€
	 * @param type - ? ìŠ¤???€??(ê¸°ë³¸ê°? 'info')
	 *
	 * ?¬ìš© ?ˆì‹œ:
	 * showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'info')
	 * showToast('?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
	 */
	const showToast = (
		message: string,
		type: 'success' | 'info' | 'warning' | 'error' = 'info'
	) => {
		setToastConfig({
			message,
			type,
			isVisible: true,
		})
	}

	const showSuccess = (message: string) => {
		showToast(message, 'success')
	}

	const showError = (message: string) => {
		showToast(message, 'error')
	}

	const showWarning = (message: string) => {
		showToast(message, 'warning')
	}

	const showInfo = (message: string) => {
		showToast(message, 'info')
	}

	/**
	 * ? ìŠ¤???Œë¦¼???¨ê¸°???¨ìˆ˜
	 * - Toast ì»´í¬?ŒíŠ¸?ì„œ ?ë™?¼ë¡œ ?¸ì¶œ??
	 */
	const hideToast = () => {
		setToastConfig((prev) => ({
			...prev,
			isVisible: false,
		}))
	}

	/**
	 * ?•ì¸ ?¤ì´?¼ë¡œê·¸ë? ?œì‹œ?˜ëŠ” ?¨ìˆ˜
	 *
	 * @param config - ?¤ì´?¼ë¡œê·??¤ì • ê°ì²´
	 *
	 * ?¬ìš© ?ˆì‹œ:
	 * showConfirm({
	 *   message: '?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
	 *   type: 'warning',
	 *   onConfirm: () => {
	 *     // ?? œ ë¡œì§
	 *     showToast('?? œ?˜ì—ˆ?µë‹ˆ??', 'info')
	 *   },
	 *   onCancel: () => {
	 *     console.log('ì·¨ì†Œ??)
	 *   }
	 * })
	 */
	const showConfirm = (config: ConfirmConfig) => {
		setConfirmConfig({
			message: config.message,
			type: config.type || 'info',
			isVisible: true,
			onConfirm: () => {
				config.onConfirm()
				setConfirmConfig((prev) => ({ ...prev, isVisible: false }))
			},
			onCancel: () => {
				config.onCancel?.()
				setConfirmConfig((prev) => ({ ...prev, isVisible: false }))
			},
			confirmOnly: config.confirmOnly || false,
		})
	}

	/**
	 * ?•ì¸ ?¤ì´?¼ë¡œê·¸ë? ?¨ê¸°???¨ìˆ˜
	 * - ?„ì¬???¬ìš©?˜ì? ?Šì?ë§??¥í›„ ?•ì¥???„í•´ ? ì?
	 */
	const hideConfirm = () => {
		setConfirmConfig((prev) => ({ ...prev, isVisible: false }))
	}

	return (
		<ToastContext.Provider value={{ 
			showToast, 
			showSuccess, 
			showError, 
			showWarning, 
			showInfo, 
			showConfirm 
		}}>
			{/* ?ì‹ ì»´í¬?ŒíŠ¸???Œë”ë§?*/}
			{children}

			{/*
			 * Toast ì»´í¬?ŒíŠ¸ ?Œë”ë§?
			 * - toastConfig ?íƒœ???°ë¼ ?ë™?¼ë¡œ ?œì‹œ/?¨ê?
			 * - 3ì´????ë™?¼ë¡œ ?¬ë¼ì§?
			 * - ?”ë©´ ?˜ë‹¨ ì¢Œì¸¡??ê³ ì • ?„ì¹˜
			 */}
			<Toast
				message={toastConfig.message}
				type={toastConfig.type}
				isVisible={toastConfig.isVisible}
				onClose={hideToast}
				duration={3000}
			/>

			{/*
			 * ConfirmDialog ì»´í¬?ŒíŠ¸ ?Œë”ë§?
			 * - confirmConfig ?íƒœ???°ë¼ ?ë™?¼ë¡œ ?œì‹œ/?¨ê?
			 * - ?”ë©´ ì¤‘ì•™??ëª¨ë‹¬ ?•íƒœë¡??œì‹œ
			 * - ë°°ê²½ ?¤ë²„?ˆì´ ?¬í•¨
			 */}
			<ConfirmDialog
				message={confirmConfig.message}
				type={confirmConfig.type}
				isVisible={confirmConfig.isVisible}
				onConfirm={confirmConfig.onConfirm}
				onCancel={confirmConfig.onCancel}
				confirmOnly={confirmConfig.confirmOnly}
			/>
		</ToastContext.Provider>
	)
}

/**
 * useToast ??
 *
 * ToastContext?ì„œ ?œê³µ?˜ëŠ” ?¨ìˆ˜?¤ì„ ?¬ìš©?˜ê¸° ?„í•œ ì»¤ìŠ¤?€ ??
 *
 * @returns {ToastContextType} showToast, showConfirm ?¨ìˆ˜ë¥??¬í•¨??ê°ì²´
 *
 * ?¬ìš© ?ˆì‹œ:
 * const { showToast, showConfirm } = useToast()
 *
 * @throws {Error} ToastProvider ?¸ë??ì„œ ?¬ìš©??ê²½ìš° ?ëŸ¬ ë°œìƒ
 */
export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}


