'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

/**
 * ToastContext?μ ?κ³΅?λ ?¨μ?€μ ????μ
 * - showToast: ? μ€???λ¦Ό???μ?λ ?¨μ
 * - showConfirm: ?μΈ ?€μ΄?Όλ‘κ·Έλ? ?μ?λ ?¨μ
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
 * ?μΈ ?€μ΄?Όλ‘κ·??€μ ???ν ?Έν°?μ΄??
 * - message: ?€μ΄?Όλ‘κ·Έμ ?μ??λ©μμ§
 * - type: ?€μ΄?Όλ‘κ·????(info, warning, error)
 * - onConfirm: ?μΈ λ²νΌ ?΄λ¦­ ???€ν???¨μ
 * - onCancel: μ·¨μ λ²νΌ ?΄λ¦­ ???€ν???¨μ (? ν?¬ν­)
 */
interface ConfirmConfig {
	message: string
	type?: 'info' | 'warning' | 'error'
	onConfirm: () => void
	onCancel?: () => void
	confirmOnly?: boolean
}

// React Context ?μ± (?μ­ ?ν κ΄λ¦¬λ? ?ν μ»¨ν?€νΈ)
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * ToastProvider μ»΄ν¬?νΈ
 *
 * ?? :
 * 1. Toast? ConfirmDialog???μ­ ?ν κ΄λ¦?
 * 2. ?μ­?μ ?¬μ©?????λ showToast, showConfirm ?¨μ ?κ³΅
 * 3. ?€μ  Toast? ConfirmDialog μ»΄ν¬?νΈ ?λλ§?
 *
 * ?¬μ©λ²?
 * - layout.tsx?μ ?μ²΄ ?±μ κ°μΈ??λͺ¨λ  μ»΄ν¬?νΈ?μ ?¬μ© κ°??
 * - useToast() ?μ ?΅ν΄ showToast, showConfirm ?¨μ ?¬μ©
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	/**
	 * Toast ?ν κ΄λ¦?
	 * - message: ? μ€?Έμ ?μ??λ©μμ§
	 * - type: ? μ€?????(info, warning, error)
	 * - isVisible: ? μ€???μ ?¬λ?
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
	 * ConfirmDialog ?ν κ΄λ¦?
	 * - message: ?€μ΄?Όλ‘κ·Έμ ?μ??λ©μμ§
	 * - type: ?€μ΄?Όλ‘κ·????(info, warning, error)
	 * - isVisible: ?€μ΄?Όλ‘κ·??μ ?¬λ?
	 * - onConfirm: ?μΈ λ²νΌ ?΄λ¦­ ???€ν???¨μ
	 * - onCancel: μ·¨μ λ²νΌ ?΄λ¦­ ???€ν???¨μ
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
	 * ? μ€???λ¦Ό???μ?λ ?¨μ
	 *
	 * @param message - ? μ€?Έμ ?μ??λ©μμ§
	 * @param type - ? μ€?????(κΈ°λ³Έκ°? 'info')
	 *
	 * ?¬μ© ?μ:
	 * showToast('??₯λ?μ΅?λ€.', 'info')
	 * showToast('?€λ₯κ° λ°μ?μ΅?λ€.', 'error')
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
	 * ? μ€???λ¦Ό???¨κΈ°???¨μ
	 * - Toast μ»΄ν¬?νΈ?μ ?λ?Όλ‘ ?ΈμΆ??
	 */
	const hideToast = () => {
		setToastConfig((prev) => ({
			...prev,
			isVisible: false,
		}))
	}

	/**
	 * ?μΈ ?€μ΄?Όλ‘κ·Έλ? ?μ?λ ?¨μ
	 *
	 * @param config - ?€μ΄?Όλ‘κ·??€μ  κ°μ²΄
	 *
	 * ?¬μ© ?μ:
	 * showConfirm({
	 *   message: '?λ§ ?? ?μκ² μ΅?κΉ?',
	 *   type: 'warning',
	 *   onConfirm: () => {
	 *     // ??  λ‘μ§
	 *     showToast('?? ?μ?΅λ??', 'info')
	 *   },
	 *   onCancel: () => {
	 *     console.log('μ·¨μ??)
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
	 * ?μΈ ?€μ΄?Όλ‘κ·Έλ? ?¨κΈ°???¨μ
	 * - ?μ¬???¬μ©?μ? ?μ?λ§??₯ν ?μ₯???ν΄ ? μ?
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
			{/* ?μ μ»΄ν¬?νΈ???λλ§?*/}
			{children}

			{/*
			 * Toast μ»΄ν¬?νΈ ?λλ§?
			 * - toastConfig ?ν???°λΌ ?λ?Όλ‘ ?μ/?¨κ?
			 * - 3μ΄????λ?Όλ‘ ?¬λΌμ§?
			 * - ?λ©΄ ?λ¨ μ’μΈ‘??κ³ μ  ?μΉ
			 */}
			<Toast
				message={toastConfig.message}
				type={toastConfig.type}
				isVisible={toastConfig.isVisible}
				onClose={hideToast}
				duration={3000}
			/>

			{/*
			 * ConfirmDialog μ»΄ν¬?νΈ ?λλ§?
			 * - confirmConfig ?ν???°λΌ ?λ?Όλ‘ ?μ/?¨κ?
			 * - ?λ©΄ μ€μ??λͺ¨λ¬ ?νλ‘??μ
			 * - λ°°κ²½ ?€λ²?μ΄ ?¬ν¨
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
 * ToastContext?μ ?κ³΅?λ ?¨μ?€μ ?¬μ©?κΈ° ?ν μ»€μ€? ??
 *
 * @returns {ToastContextType} showToast, showConfirm ?¨μλ₯??¬ν¨??κ°μ²΄
 *
 * ?¬μ© ?μ:
 * const { showToast, showConfirm } = useToast()
 *
 * @throws {Error} ToastProvider ?Έλ??μ ?¬μ©??κ²½μ° ?λ¬ λ°μ
 */
export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}


