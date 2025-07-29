'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

/**
 * ToastContext에서 제공하는 함수들의 타입 정의
 * - showToast: 토스트 알림을 표시하는 함수
 * - showConfirm: 확인 다이얼로그를 표시하는 함수
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
 * 확인 다이얼로그 설정을 위한 인터페이스
 * - message: 다이얼로그에 표시할 메시지
 * - type: 다이얼로그 타입 (info, warning, error)
 * - onConfirm: 확인 버튼 클릭 시 실행할 함수
 * - onCancel: 취소 버튼 클릭 시 실행할 함수 (선택사항)
 */
interface ConfirmConfig {
	message: string
	type?: 'info' | 'warning' | 'error'
	onConfirm: () => void
	onCancel?: () => void
	confirmOnly?: boolean
}

// React Context 생성 (전역 상태 관리를 위한 컨텍스트)
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * ToastProvider 컴포넌트
 *
 * 역할:
 * 1. Toast와 ConfirmDialog의 전역 상태 관리
 * 2. 전역에서 사용할 수 있는 showToast, showConfirm 함수 제공
 * 3. 실제 Toast와 ConfirmDialog 컴포넌트 렌더링
 *
 * 사용법:
 * - layout.tsx에서 전체 앱을 감싸서 모든 컴포넌트에서 사용 가능
 * - useToast() 훅을 통해 showToast, showConfirm 함수 사용
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	/**
	 * Toast 상태 관리
	 * - message: 토스트에 표시할 메시지
	 * - type: 토스트 타입 (info, warning, error)
	 * - isVisible: 토스트 표시 여부
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
	 * ConfirmDialog 상태 관리
	 * - message: 다이얼로그에 표시할 메시지
	 * - type: 다이얼로그 타입 (info, warning, error)
	 * - isVisible: 다이얼로그 표시 여부
	 * - onConfirm: 확인 버튼 클릭 시 실행할 함수
	 * - onCancel: 취소 버튼 클릭 시 실행할 함수
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
	 * 토스트 알림을 표시하는 함수
	 *
	 * @param message - 토스트에 표시할 메시지
	 * @param type - 토스트 타입 (기본값: 'info')
	 *
	 * 사용 예시:
	 * showToast('저장되었습니다.', 'info')
	 * showToast('오류가 발생했습니다.', 'error')
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
	 * 토스트 알림을 숨기는 함수
	 * - Toast 컴포넌트에서 자동으로 호출됨
	 */
	const hideToast = () => {
		setToastConfig((prev) => ({
			...prev,
			isVisible: false,
		}))
	}

	/**
	 * 확인 다이얼로그를 표시하는 함수
	 *
	 * @param config - 다이얼로그 설정 객체
	 *
	 * 사용 예시:
	 * showConfirm({
	 *   message: '정말 삭제하시겠습니까?',
	 *   type: 'warning',
	 *   onConfirm: () => {
	 *     // 삭제 로직
	 *     showToast('삭제되었습니다.', 'info')
	 *   },
	 *   onCancel: () => {
	 *     console.log('취소됨')
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
	 * 확인 다이얼로그를 숨기는 함수
	 * - 현재는 사용되지 않지만 향후 확장을 위해 유지
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
			{/* 자식 컴포넌트들 렌더링 */}
			{children}

			{/*
			 * Toast 컴포넌트 렌더링
			 * - toastConfig 상태에 따라 자동으로 표시/숨김
			 * - 3초 후 자동으로 사라짐
			 * - 화면 하단 좌측에 고정 위치
			 */}
			<Toast
				message={toastConfig.message}
				type={toastConfig.type}
				isVisible={toastConfig.isVisible}
				onClose={hideToast}
				duration={3000}
			/>

			{/*
			 * ConfirmDialog 컴포넌트 렌더링
			 * - confirmConfig 상태에 따라 자동으로 표시/숨김
			 * - 화면 중앙에 모달 형태로 표시
			 * - 배경 오버레이 포함
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
 * useToast 훅
 *
 * ToastContext에서 제공하는 함수들을 사용하기 위한 커스텀 훅
 *
 * @returns {ToastContextType} showToast, showConfirm 함수를 포함한 객체
 *
 * 사용 예시:
 * const { showToast, showConfirm } = useToast()
 *
 * @throws {Error} ToastProvider 외부에서 사용할 경우 에러 발생
 */
export function useToast() {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
