'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import '@/app/common/common.css'

/**
 * COMZ010M00 - 시스템코드관리 화면
 *
 * 주요 기능:
 * - 대분류 코드 관리 (등록/수정/삭제)
 * - 소분류 코드 관리 (등록/수정/삭제)
 * - 코드 중복 체크 및 유효성 검증
 * - 권한별 접근 제어
 *
 * 연관 테이블:
 * - TBL_LRG_CSF_CD (대분류 코드)
 * - TBL_SML_CSF_CD (소분류 코드)
 * - TBL_SYS_CODE (시스템 코드)
 */

// 대분류 코드 타입
interface LargeCode {
	lrgCsfCd: string
	lrgCsfNm: string
	useYn: string
	expl: string
}

// 소분류 코드 타입
interface SmallCode {
	smlCsfCd: string
	smlCsfNm: string
	sortOrd: number
	useYn: string
	expl: string
	linkCd1: string
	linkCd2: string
	linkCd3: string // 추가, 화면에는 숨김
	lrgCsfCd: string
}

const defaultLargeCode: LargeCode = {
	lrgCsfCd: '',
	lrgCsfNm: '',
	useYn: 'Y',
	expl: '',
}

const defaultSmallCode: SmallCode = {
	smlCsfCd: '',
	smlCsfNm: '',
	sortOrd: 1,
	useYn: 'Y',
	expl: '',
	linkCd1: '',
	linkCd2: '',
	linkCd3: '', // 추가, 화면에는 숨김
	lrgCsfCd: '',
}

const COMZ010M00Page = () => {
	// AG-Grid refs
	const largeCodeGridRef = useRef<AgGridReact<LargeCode>>(null)
	const smallCodeGridRef = useRef<AgGridReact<SmallCode>>(null)

	// AG-Grid 컬럼 정의
	const [largeCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '대분류코드',
			field: 'lrgCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '대분류명',
			field: 'lrgCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '사용여부',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '설명',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	const [smallCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '소분류코드',
			field: 'smlCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '소분류명',
			field: 'smlCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '정렬순서',
			field: 'sortOrd',
			flex: 1,
			type: 'numericColumn',
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '사용여부',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '설명',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	// 검색 상태
	const [searchLrgCsfCd, setSearchLrgCsfCd] = useState('')
	const [searchLrgCsfNm, setSearchLrgCsfNm] = useState('')

	// 목록 상태
	const [largeCodes, setLargeCodes] = useState<LargeCode[]>([])
	const [smallCodes, setSmallCodes] = useState<SmallCode[]>([])

	// 선택/폼 상태
	const [selectedLarge, setSelectedLarge] = useState<LargeCode | null>(null)
	const [largeForm, setLargeForm] = useState<LargeCode>(defaultLargeCode)
	const [smallForm, setSmallForm] = useState<SmallCode>(defaultSmallCode)
	const [isEditMode, setIsEditMode] = useState(false) // 소분류 수정 모드 상태 추가

	// 원본 데이터 저장 (변경사항 체크용)
	const [originalLargeForm, setOriginalLargeForm] =
		useState<LargeCode>(defaultLargeCode)
	const [originalSmallForm, setOriginalSmallForm] =
		useState<SmallCode>(defaultSmallCode)

	// 로딩/에러 상태
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { session } = useAuth()
	const { showToast, showConfirm } = useToast()
	const USER_ID = session.user?.userId || session.user?.empNo || 'SYSTEM'

	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ010M00`
			: '/api/COMZ010M00'

	// 입력값 제한 정규식
	const largeCodeRegex = /^[0-9]{1,4}$/ // 대분류 코드: 숫자만 1-4자
	const smallCodeRegex = /^[A-Za-z0-9]{1,4}$/ // 소분류 코드: 영어+숫자 1-4자
	const numberRegex = /^[0-9]{1,3}$/ // 정렬순서: 숫자 1-3자
	const linkCodeRegex = /^[0-9]{0,10}$/ // 연결코드: 숫자만 0-10자

	// 입력값 검증 함수
	const validateInput = (name: string, value: string): boolean => {
		switch (name) {
			case 'lrgCsfCd':
				return largeCodeRegex.test(value) || value === ''
			case 'smlCsfCd':
				return smallCodeRegex.test(value) || value === ''
			case 'lrgCsfNm':
			case 'smlCsfNm':
				return value.length <= 50 || value === ''
			case 'sortOrd':
				return numberRegex.test(value) || value === ''
			case 'linkCd1':
			case 'linkCd2':
			case 'linkCd3':
				return linkCodeRegex.test(value) || value === ''
			default:
				return true
		}
	}

	// 변경사항 체크 함수
	const hasChanges = (current: any, original: any): boolean => {
		return JSON.stringify(current) !== JSON.stringify(original)
	}

	// 대분류 코드 목록 조회 함수
	const fetchLargeCodes = async (lrgCsfCd = '', lrgCsfNm = '') => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(apiUrl + '/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					SP: 'COM_01_0101_S(?,?)',
					PARAM: `${lrgCsfCd}|${lrgCsfNm}`,
				}),
			})
			if (!res.ok) throw new Error('조회 실패')
			const data = await res.json()
			setLargeCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '에러 발생')
			showToast(e.message || '에러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// 소분류 코드 목록 조회 함수
	const fetchSmallCodes = async (LRG_CSF_CD: string) => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(apiUrl + '/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					SP: 'COM_01_0104_S(?)',
					PARAM: LRG_CSF_CD,
				}),
			})
			if (!res.ok) throw new Error('소분류 조회 실패')
			const data = await res.json()
			setSmallCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '에러 발생')
			showToast(e.message || '에러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// 검색 핸들러
	const handleSearch = () => {
		fetchLargeCodes(searchLrgCsfCd, searchLrgCsfNm)
		setLargeForm(defaultLargeCode) // 대분류 등록 폼 초기화
		setSmallForm(defaultSmallCode) // 소분류 등록 폼 초기화
		setSmallCodes([]) // 소분류 그리드 초기화
		setSelectedLarge(null) // 대분류 선택 해제
		setOriginalLargeForm(defaultLargeCode)
		setOriginalSmallForm(defaultSmallCode)
	}

	// 대분류 행 클릭 시 소분류 목록 조회
	const handleLargeRowClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // 원본 데이터 저장
		fetchSmallCodes(row.lrgCsfCd)

		// 소분류코드 등록폼에 선택한 대분류코드 기입
		setSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
		setOriginalSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
	}

	// AG-Grid 대분류 선택 이벤트
	const onLargeCodeSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			handleLargeRowClick(row)
		} else {
			setSelectedLarge(null)
			setLargeForm(defaultLargeCode)
			setOriginalLargeForm(defaultLargeCode)
			setSmallCodes([])
		}
	}

	// AG-Grid 소분류 선택 이벤트
	const onSmallCodeSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			handleSmallRowClick(row)
		} else {
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // 신규 모드로 변경
		}
	}

	// AG-Grid 준비 완료 이벤트
	const onLargeGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// 정렬 방지
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	const onSmallGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// 정렬 방지
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	// 대분류 행 더블클릭 시 폼 포커스
	const handleLargeRowDoubleClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // 원본 데이터 저장
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
				?.focus()
		}, 0)
	}
	// 소분류 행 더블클릭 시 폼 포커스
	const handleSmallRowDoubleClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // 원본 데이터 저장
		setIsEditMode(true) // 수정 모드로 설정
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
				?.focus()
		}, 0)
	}

	const handleLargeFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// 입력값 검증
		if (!validateInput(name, value)) {
			return
		}

		setLargeForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleLargeNew = () => {
		setLargeForm(defaultLargeCode)
		setOriginalLargeForm(defaultLargeCode)
		setSelectedLarge(null)
	}

	// 대분류 코드 중복 체크
	const isLargeCodeDuplicate = (code: string) => {
		return largeCodes.some((item) => item.lrgCsfCd === code)
	}
	// 소분류 코드 중복 체크
	const isSmallCodeDuplicate = (code: string) => {
		return smallCodes.some((item) => item.smlCsfCd === code)
	}

	// 대분류 저장(등록/수정)
	const handleLargeSave = async () => {
		// 모든 필수값이 비어있는지 체크
		if (
			!largeForm.lrgCsfCd.trim() &&
			!largeForm.lrgCsfNm.trim() &&
			!largeForm.expl.trim()
		) {
			showToast('대분류코드 와 대분류명을 입력하세요.', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// 변경사항 체크
		if (!hasChanges(largeForm, originalLargeForm)) {
			showToast('변경된 내용이 없습니다.', 'warning')
			return
		}

		// 필수값 체크
		if (!largeForm.lrgCsfCd.trim()) {
			setError('대분류코드를 입력하세요.')
			showToast('대분류코드를 입력하세요.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!largeForm.lrgCsfNm.trim()) {
			setError('대분류명을 입력하세요.')
			showToast('대분류명을 입력하세요.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// 신규 등록 시 중복 체크 (수정은 허용)
		if (!selectedLarge && isLargeCodeDuplicate(largeForm.lrgCsfCd)) {
			setError('이미 존재하는 대분류코드입니다.')
			showToast('이미 존재하는 대분류코드입니다.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		setLoading(true)
		setError(null)
		try {
			const param = [
				largeForm.lrgCsfCd,
				largeForm.lrgCsfNm,
				largeForm.useYn,
				largeForm.expl,
				USER_ID,
			].join('|')
			const res = await fetch(apiUrl + '/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					SP: 'COM_01_0102_T(?,?,?,?,?,?)',
					PARAM: param,
				}),
			})
			if (!res.ok) throw new Error('저장 실패')
			await fetchLargeCodes()
			setLargeForm(defaultLargeCode)
			setOriginalLargeForm(defaultLargeCode)
			setSelectedLarge(null)
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			showToast('대분류코드 저장 완료', 'info')
		} catch (e: any) {
			setError(e.message || '에러 발생')
			showToast(e.message || '에러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// 대분류 삭제
	const handleLargeDelete = async () => {
		// 그리드에서 선택된 항목이 없으면 삭제 불가
		if (!selectedLarge) {
			showToast('삭제할 대분류코드를 그리드에서 선택하세요.', 'warning')
			return
		}

		showConfirm({
			message: '정말 삭제하시겠습니까?',
			type: 'warning',
			onConfirm: async () => {
				setLoading(true)
				setError(null)
				try {
					const param = [selectedLarge.lrgCsfCd].join('|')
					const res = await fetch(apiUrl + '/delete', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							SP: 'COM_01_0103_D(?,?)',
							PARAM: param,
						}),
					})
					if (!res.ok) throw new Error('삭제 실패')
					await fetchLargeCodes()
					setLargeForm(defaultLargeCode)
					setOriginalLargeForm(defaultLargeCode)
					setSelectedLarge(null)
					setSmallCodes([])
					setTimeout(() => {
						document
							.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
							?.focus()
					}, 100)
					showToast('대분류코드 삭제 완료', 'info')
				} catch (e: any) {
					setError(e.message || '에러 발생')
					showToast(e.message || '에러 발생', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// 소분류 행 클릭 핸들러
	const handleSmallRowClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // 원본 데이터 저장
		setIsEditMode(true) // 수정 모드로 설정
	}

	// 소분류 관련 핸들러
	const handleSmallFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// 입력값 검증
		if (!validateInput(name, value)) {
			return
		}

		// smallFormLrgCsfCd를 lrgCsfCd로 매핑
		const fieldName = name === 'smallFormLrgCsfCd' ? 'lrgCsfCd' : name

		setSmallForm((prev) => ({ ...prev, [fieldName]: value }))
	}

	const handleSmallNew = () => {
		setSmallForm(defaultSmallCode)
		setOriginalSmallForm(defaultSmallCode)
		setIsEditMode(false) // 신규 모드로 설정
		if (selectedLarge) {
			setSmallForm((prev) => ({
				...prev,
				lrgCsfCd: selectedLarge.lrgCsfCd,
			}))
			setOriginalSmallForm((prev) => ({
				...prev,
				lrgCsfCd: selectedLarge.lrgCsfCd,
			}))
		}
	}

	// 소분류 저장(등록/수정)
	const handleSmallSave = async () => {
		// 모든 필수값이 비어있는지 체크
		if (
			!smallForm.smlCsfCd.trim() &&
			!smallForm.smlCsfNm.trim() &&
			!smallForm.expl.trim()
		) {
			showToast('소분류코드와 소분류명을 입력하세요.', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// 신규 등록 모드
		if (!isEditMode) {
			// 중복 체크
			if (isSmallCodeDuplicate(smallForm.smlCsfCd)) {
				setError('이미 존재하는 소분류코드입니다.')
				showToast('이미 존재하는 소분류코드입니다.', 'error')
				setTimeout(() => {
					document
						.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
						?.focus()
				}, 100)
				return
			}
			// 등록 진행 (return 없이 아래로)
		} else {
			// 수정 모드: 변경사항 체크
			if (!hasChanges(smallForm, originalSmallForm)) {
				showToast('변경된 내용이 없습니다.', 'warning')
				return
			}
		}

		// 필수값 체크
		if (!smallForm.smlCsfCd.trim()) {
			setError('소분류코드를 입력하세요.')
			showToast('소분류코드를 입력하세요.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!smallForm.smlCsfNm.trim()) {
			setError('소분류명을 입력하세요.')
			showToast('소분류명을 입력하세요.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// 대분류코드 검증
		if (!smallForm.lrgCsfCd.trim()) {
			setError('대분류코드를 선택하세요.')
			showToast('대분류코드를 선택하세요.', 'error')
			setTimeout(() => {
				// 소분류코드 등록폼의 대분류코드 필드로 포커스
				const smallFormLargeCodeInput =
					document.querySelector<HTMLInputElement>(
						'input[name="smallFormLrgCsfCd"]'
					)
				if (smallFormLargeCodeInput) {
					smallFormLargeCodeInput.focus()
				}
			}, 100)
			return
		}

		// 대분류코드가 기존에 존재하는지 체크
		const largeCodeExists = largeCodes.some(
			(item) => item.lrgCsfCd === smallForm.lrgCsfCd.trim()
		)
		if (!largeCodeExists) {
			setError('대분류코드를 먼저 등록하세요.')
			showToast('대분류코드를 먼저 등록하세요.', 'error')
			setTimeout(() => {
				// 소분류코드 등록폼의 대분류코드 필드로 포커스
				const smallFormLargeCodeInput =
					document.querySelector<HTMLInputElement>(
						'input[name="smallFormLrgCsfCd"]'
					)
				if (smallFormLargeCodeInput) {
					smallFormLargeCodeInput.focus()
				}
			}, 100)
			return
		}

		if (!smallCodes || !Array.isArray(smallCodes)) {
			setError('소분류 목록이 올바르지 않습니다.')
			showToast('소분류 목록이 올바르지 않습니다.', 'error')
			return
		}
		if (!selectedLarge && isSmallCodeDuplicate(smallForm.smlCsfCd)) {
			setError('이미 존재하는 소분류코드입니다.')
			showToast('이미 존재하는 소분류코드입니다.', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		setLoading(true)
		setError(null)
		try {
			const param = [
				smallForm.lrgCsfCd,
				smallForm.smlCsfCd,
				smallForm.smlCsfNm,
				smallForm.linkCd1,
				smallForm.linkCd2,
				smallForm.linkCd3, // 추가
				smallForm.sortOrd,
				smallForm.useYn,
				smallForm.expl,
				USER_ID,
			].join('|')
			const fetchBody = {
				SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
				PARAM: param,
			}
			const res = await fetch(apiUrl + '/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(fetchBody),
			})
			let data = null
			try {
				data = await res.json()
			} catch (jsonErr) {}
			if (!res.ok) throw new Error('저장 실패')
			if (smallForm.lrgCsfCd) await fetchSmallCodes(smallForm.lrgCsfCd)
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // 신규 모드로 변경
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			showToast('소분류코드 저장 완료', 'info')
		} catch (e: any) {
			setError(e.message || '에러 발생')
			showToast(e.message || '에러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// 소분류 삭제
	const handleSmallDelete = async () => {
		// 수정 모드가 아니면 삭제 불가
		if (!isEditMode) {
			showToast('삭제할 소분류코드를 그리드에서 선택하세요.', 'warning')
			return
		}

		showConfirm({
			message: '정말 삭제하시겠습니까?',
			type: 'warning',
			onConfirm: async () => {
				setLoading(true)
				setError(null)
				try {
					const param = [
						smallForm.lrgCsfCd,
						smallForm.smlCsfCd,
					].join('|')
					const res = await fetch(apiUrl + '/delete', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							SP: 'COM_01_0106_D(?,?,?)',
							PARAM: param,
						}),
					})
					if (!res.ok) throw new Error('삭제 실패')
					await fetchSmallCodes(smallForm.lrgCsfCd)
					setSmallForm(defaultSmallCode)
					setOriginalSmallForm(defaultSmallCode)
					setIsEditMode(false) // 신규 모드로 변경
					setTimeout(() => {
						document
							.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
							?.focus()
					}, 100)
					showToast('소분류코드 삭제 완료', 'info')
				} catch (e: any) {
					setError(e.message || '에러 발생')
					showToast(e.message || '에러 발생', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// 대분류 코드 입력 시 실시간 중복 체크
	const handleLargeCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// 입력값 검증
		if (!validateInput(name, value)) {
			return
		}

		setLargeForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'lrgCsfCd' && isLargeCodeDuplicate(value)) {
			setError('이미 존재하는 대분류코드입니다.')
		} else {
			setError(null)
		}
	}
	// 소분류 코드 입력 시 실시간 중복 체크
	const handleSmallCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// 입력값 검증
		if (!validateInput(name, value)) {
			return
		}

		setSmallForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'smlCsfCd' && isSmallCodeDuplicate(value)) {
			setError('이미 존재하는 소분류코드입니다.')
		} else {
			setError(null)
		}
	}

	// 대분류 등록 폼 엔터키 저장
	const handleLargeFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleLargeSave()
		}
	}
	// 소분류 등록 폼 엔터키 저장
	const handleSmallFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleSmallSave()
		}
	}
	// 검색 input 엔터키 검색
	const handleSearchInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 최초 마운트 시 전체 조회
	useEffect(() => {
		fetchLargeCodes()
		setSmallCodes([]) // 초기화
	}, [])

	return (
		<div className='mdi'>
			{/* 🔍 조회 영역 */}
			<div className='search-div mb-3'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[110px]'>대분류 코드</th>
							<td className='search-td w-[15%]'>
								<input
									type='text'
									className='input-base input-default w-full'
									name='searchLrgCsfCd'
									value={searchLrgCsfCd}
									onChange={(e) => setSearchLrgCsfCd(e.target.value)}
									onKeyDown={handleSearchInputKeyDown}
									onCompositionStart={() => {}}
									onCompositionUpdate={() => {}}
									onCompositionEnd={() => {}}
									tabIndex={0}
									aria-label='대분류코드 검색'
								/>
							</td>
							<th className='search-th w-[100px]'>대분류명</th>
							<td className='search-td  w-[20%]'>
								<input
									type='text'
									className='input-base input-default w-full'
									name='searchLrgCsfNm'
									value={searchLrgCsfNm}
									onChange={(e) => setSearchLrgCsfNm(e.target.value)}
									onKeyDown={handleSearchInputKeyDown}
									onCompositionStart={() => {}}
									onCompositionUpdate={() => {}}
									onCompositionEnd={() => {}}
									tabIndex={0}
									aria-label='대분류명 검색'
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search ml-2'
									onClick={handleSearch}
									tabIndex={0}
									aria-label='조회'
								>
									조회
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='flex gap-4'>
				{/* 대분류 코드 테이블 */}
				<div className='flex-1'>
					<div
						className='ag-theme-alpine'
						style={{ height: 400, width: '100%' }}
					>
						<AgGridReact
							ref={largeCodeGridRef}
							rowData={largeCodes}
							columnDefs={largeCodeColDefs}
							defaultColDef={{
								resizable: true,
								sortable: false,
							}}
							rowSelection='single'
							onSelectionChanged={onLargeCodeSelectionChanged}
							onRowDoubleClicked={(event) => {
								handleLargeRowDoubleClick(event.data)
							}}
							onGridReady={onLargeGridReady}
							onSortChanged={(event) => {
								// 정렬 변경 시 원래 순서로 복원
								event.api.applyColumnState({
									defaultState: { sort: null },
								})
							}}
							suppressCellFocus={true}
							suppressRowClickSelection={false}
							suppressColumnMoveAnimation={true}
							components={{
								agColumnHeader: (props: any) => (
									<div style={{ textAlign: 'center', width: '100%' }}>
										{props.displayName}
									</div>
								),
							}}
						/>
					</div>
					{/* 대분류 등록 폼 */}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-2'>
							<h4 className='text-sm font-bold'>대분류코드 등록</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleLargeNew}
								tabIndex={0}
								aria-label='신규'
							>
								신규
							</button>
						</div>
						<table
							className='form-table w-full mb-4'
							onKeyDown={handleLargeFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>대분류코드</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='lrgCsfCd'
											value={largeForm.lrgCsfCd || ''}
											onChange={handleLargeCodeChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='대분류코드 입력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>대분류명</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='lrgCsfNm'
											value={largeForm.lrgCsfNm || ''}
											onChange={handleLargeFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='대분류명 입력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>사용여부</th>
									<td className='form-td'>
										<select
											className='input-base input-default w-full'
											name='useYn'
											value={largeForm.useYn || ''}
											onChange={handleLargeFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='사용여부 선택'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>설명</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='expl'
											value={largeForm.expl || ''}
											onChange={handleLargeFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='설명 입력'
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<div className='flex justify-end gap-2'>
							<button
								className='btn-base btn-delete'
								onClick={handleLargeDelete}
								tabIndex={0}
								aria-label='삭제'
							>
								삭제
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleLargeSave}
								tabIndex={0}
								aria-label='저장'
							>
								저장
							</button>
						</div>
					</div>
				</div>
				{/* 소분류 코드 테이블 */}
				<div className='flex-1'>
					<div
						className='ag-theme-alpine'
						style={{ height: 400, width: '100%' }}
					>
						<AgGridReact
							ref={smallCodeGridRef}
							rowData={smallCodes}
							columnDefs={smallCodeColDefs}
							defaultColDef={{
								resizable: true,
								sortable: false,
							}}
							rowSelection='single'
							onSelectionChanged={onSmallCodeSelectionChanged}
							onRowDoubleClicked={(event) => {
								handleSmallRowDoubleClick(event.data)
							}}
							onGridReady={onSmallGridReady}
							onSortChanged={(event) => {
								// 정렬 변경 시 원래 순서로 복원
								event.api.applyColumnState({
									defaultState: { sort: null },
								})
							}}
							suppressCellFocus={true}
							suppressRowClickSelection={false}
							suppressColumnMoveAnimation={true}
							components={{
								agColumnHeader: (props: any) => (
									<div style={{ textAlign: 'center', width: '100%' }}>
										{props.displayName}
									</div>
								),
							}}
						/>
					</div>
					{/* 소분류 등록 폼 */}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-4'>
							<h4 className='text-sm font-bold'>소분류코드 등록</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleSmallNew}
								tabIndex={0}
								aria-label='신규'
							>
								신규
							</button>
						</div>
						<table
							className='form-table w-full mb-2'
							onKeyDown={handleSmallFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>대분류코드</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='smallFormLrgCsfCd'
											value={smallForm.lrgCsfCd || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='대분류코드 입력'
										/>
									</td>
									<th className='form-th w-[120px]'>소분류코드</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='smlCsfCd'
											value={smallForm.smlCsfCd || ''}
											onChange={handleSmallCodeChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='소분류코드 입력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>소분류명</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='smlCsfNm'
											value={smallForm.smlCsfNm || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='소분류명 입력'
										/>
									</td>
									<th className='form-th'>연결코드1</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='linkCd1'
											value={smallForm.linkCd1 || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='연결코드1 입력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>연결코드2</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='linkCd2'
											value={smallForm.linkCd2 || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='연결코드2 입력'
										/>
									</td>
									<th className='form-th'>정렬순서</th>
									<td className='form-td'>
										<input
											type='number'
											className='input-base input-default w-full'
											name='sortOrd'
											value={smallForm.sortOrd || 0}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='정렬순서 입력'
											min='1'
											max='999'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>사용여부</th>
									<td className='form-td'>
										<select
											className='input-base input-default w-full'
											name='useYn'
											value={smallForm.useYn || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='사용여부 선택'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
									<th className='form-th'>설명</th>
									<td className='form-td'>
										<input
											type='text'
											className='input-base input-default w-full'
											name='expl'
											value={smallForm.expl || ''}
											onChange={handleSmallFormChange}
											onCompositionStart={() => {}}
											onCompositionUpdate={() => {}}
											onCompositionEnd={() => {}}
											tabIndex={0}
											aria-label='설명 입력'
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<div className='flex justify-end gap-2'>
							<button
								className='btn-base btn-delete'
								onClick={handleSmallDelete}
								tabIndex={0}
								aria-label='삭제'
							>
								삭제
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleSmallSave}
								tabIndex={0}
								aria-label='저장'
							>
								저장
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default COMZ010M00Page
