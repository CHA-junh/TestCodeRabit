'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

/**
 * ToastContext?�서 ?�공?�는 ?�수?�의 ?�???�의
 * - showToast: ?�스???�림???�시?�는 ?�수
 * - showConfirm: ?�인 ?�이?�로그�? ?�시?�는 ?�수
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
 * ?�인 ?�이?�로�??�정???�한 ?�터?�이??
 * - message: ?�이?�로그에 ?�시??메시지
 * - type: ?�이?�로�??�??(info, warning, error)
 * - onConfirm: ?�인 버튼 ?�릭 ???�행???�수
 * - onCancel: 취소 버튼 ?�릭 ???�행???�수 (?�택?�항)
 */
interface ConfirmConfig {
	message: string
	type?: 'info' | 'warning' | 'error'
	onConfirm: () => void
	onCancel?: () => void
	confirmOnly?: boolean
}

// React Context ?�성 (?�역 ?�태 관리�? ?�한 컨텍?�트)
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * ToastProvider 컴포?�트
 *
 * ??��:
 * 1. Toast?� ConfirmDialog???�역 ?�태 관�?
 * 2. ?�역?�서 ?�용?????�는 showToast, showConfirm ?�수 ?�공
 * 3. ?�제 Toast?� ConfirmDialog 컴포?�트 ?�더�?
 *
 * ?�용�?
 * - layout.tsx?�서 ?�체 ?�을 감싸??모든 컴포?�트?�서 ?�용 가??
 * - useToast() ?�을 ?�해 showToast, showConfirm ?�수 ?�용
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	/**
	 * Toast ?�태 관�?
	 * - message: ?�스?�에 ?�시??메시지
	 * - type: ?�스???�??(info, warning, error)
	 * - isVisible: ?�스???�시 ?��?
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
	 * ConfirmDialog ?�태 관�?
	 * - message: ?�이?�로그에 ?�시??메시지
	 * - type: ?�이?�로�??�??(info, warning, error)
	 * - isVisible: ?�이?�로�??�시 ?��?
	 * - onConfirm: ?�인 버튼 ?�릭 ???�행???�수
	 * - onCancel: 취소 버튼 ?�릭 ???�행???�수
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
	 * ?�스???�림???�시?�는 ?�수
	 *
	 * @param message - ?�스?�에 ?�시??메시지
	 * @param type - ?�스???�??(기본�? 'info')
	 *
	 * ?�용 ?�시:
	 * showToast('?�?�되?�습?�다.', 'info')
	 * showToast('?�류가 발생?�습?�다.', 'error')
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
	 * ?�스???�림???�기???�수
	 * - Toast 컴포?�트?�서 ?�동?�로 ?�출??
	 */
	const hideToast = () => {
		setToastConfig((prev) => ({
			...prev,
			isVisible: false,
		}))
	}

	/**
	 * ?�인 ?�이?�로그�? ?�시?�는 ?�수
	 *
	 * @param config - ?�이?�로�??�정 객체
	 *
	 * ?�용 ?�시:
	 * showConfirm({
	 *   message: '?�말 ??��?�시겠습?�까?',
	 *   type: 'warning',
	 *   onConfirm: () => {
	 *     // ??�� 로직
	 *     showToast('??��?�었?�니??', 'info')
	 *   },
	 *   onCancel: () => {
	 *     console.log('취소??)
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
	 * ?�인 ?�이?�로그�? ?�기???�수
	 * - ?�재???�용?��? ?��?�??�후 ?�장???�해 ?��?
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
			{/* ?�식 컴포?�트???�더�?*/}
			{children}

			{/*
			 * Toast 컴포?�트 ?�더�?
			 * - toastConfig ?�태???�라 ?�동?�로 ?�시/?��?
			 * - 3�????�동?�로 ?�라�?
			 * - ?�면 ?�단 좌측??고정 ?�치
			 */}
			<Toast
				message={toastConfig.message}
				type={toastConfig.type}
				isVisible={toastConfig.isVisible}
				onClose={hideToast}
				duration={3000}
			/>

			{/*
			 * ConfirmDialog 컴포?�트 ?�더�?
			 * - confirmConfig ?�태???�라 ?�동?�로 ?�시/?��?
			 * - ?�면 중앙??모달 ?�태�??�시
			 * - 배경 ?�버?�이 ?�함
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
 * ToastContext?�서 ?�공?�는 ?�수?�을 ?�용?�기 ?�한 커스?� ??
 *
 * @returns {ToastContextType} showToast, showConfirm ?�수�??�함??객체
 *
 * ?�용 ?�시:
 * const { showToast, showConfirm } = useToast()
 *
 * @throws {Error} ToastProvider ?��??�서 ?�용??경우 ?�러 발생
 */
export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}


