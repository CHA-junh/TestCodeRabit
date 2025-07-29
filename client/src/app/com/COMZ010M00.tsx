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
 * COMZ010M00 - ?�스?�코?��?�??�면
 *
 * 주요 기능:
 * - ?�분류 코드 관�?(?�록/?�정/??��)
 * - ?�분�?코드 관�?(?�록/?�정/??��)
 * - 코드 중복 체크 �??�효??검�?
 * - 권한�??�근 ?�어
 *
 * ?��? ?�이�?
 * - TBL_LRG_CSF_CD (?�분류 코드)
 * - TBL_SML_CSF_CD (?�분�?코드)
 * - TBL_SYS_CODE (?�스??코드)
 */

// ?�분류 코드 ?�??
interface LargeCode {
	lrgCsfCd: string
	lrgCsfNm: string
	useYn: string
	expl: string
}

// ?�분�?코드 ?�??
interface SmallCode {
	smlCsfCd: string
	smlCsfNm: string
	sortOrd: number
	useYn: string
	expl: string
	linkCd1: string
	linkCd2: string
	linkCd3: string // 추�?, ?�면?�는 ?��?
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
	linkCd3: '', // 추�?, ?�면?�는 ?��?
	lrgCsfCd: '',
}

const COMZ010M00Page = () => {
	// AG-Grid refs
	const largeCodeGridRef = useRef<AgGridReact<LargeCode>>(null)
	const smallCodeGridRef = useRef<AgGridReact<SmallCode>>(null)

	// AG-Grid 컬럼 ?�의
	const [largeCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?�분류코드',
			field: 'lrgCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�분류�?,
			field: 'lrgCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�용?��?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�명',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	const [smallCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?�분류코??,
			field: 'smlCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�분류명',
			field: 'smlCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�렬?�서',
			field: 'sortOrd',
			flex: 1,
			type: 'numericColumn',
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�용?��?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?�명',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	// 검???�태
	const [searchLrgCsfCd, setSearchLrgCsfCd] = useState('')
	const [searchLrgCsfNm, setSearchLrgCsfNm] = useState('')

	// 목록 ?�태
	const [largeCodes, setLargeCodes] = useState<LargeCode[]>([])
	const [smallCodes, setSmallCodes] = useState<SmallCode[]>([])

	// ?�택/???�태
	const [selectedLarge, setSelectedLarge] = useState<LargeCode | null>(null)
	const [largeForm, setLargeForm] = useState<LargeCode>(defaultLargeCode)
	const [smallForm, setSmallForm] = useState<SmallCode>(defaultSmallCode)
	const [isEditMode, setIsEditMode] = useState(false) // ?�분�??�정 모드 ?�태 추�?

	// ?�본 ?�이???�??(변경사??체크??
	const [originalLargeForm, setOriginalLargeForm] =
		useState<LargeCode>(defaultLargeCode)
	const [originalSmallForm, setOriginalSmallForm] =
		useState<SmallCode>(defaultSmallCode)

	// 로딩/?�러 ?�태
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { session } = useAuth()
	const { showToast, showConfirm } = useToast()
	const USER_ID = session.user?.userId || session.user?.empNo || 'SYSTEM'

	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ010M00`
			: '/api/COMZ010M00'

	// ?�력�??�한 ?�규??
	const largeCodeRegex = /^[0-9]{1,4}$/ // ?�분류 코드: ?�자�?1-4??
	const smallCodeRegex = /^[A-Za-z0-9]{1,4}$/ // ?�분�?코드: ?�어+?�자 1-4??
	const numberRegex = /^[0-9]{1,3}$/ // ?�렬?�서: ?�자 1-3??
	const linkCodeRegex = /^[0-9]{0,10}$/ // ?�결코드: ?�자�?0-10??

	// ?�력�?검�??�수
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

	// 변경사??체크 ?�수
	const hasChanges = (current: any, original: any): boolean => {
		return JSON.stringify(current) !== JSON.stringify(original)
	}

	// ?�분류 코드 목록 조회 ?�수
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
			if (!res.ok) throw new Error('조회 ?�패')
			const data = await res.json()
			setLargeCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?�러 발생')
			showToast(e.message || '?�러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?�분�?코드 목록 조회 ?�수
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
			if (!res.ok) throw new Error('?�분�?조회 ?�패')
			const data = await res.json()
			setSmallCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?�러 발생')
			showToast(e.message || '?�러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// 검???�들??
	const handleSearch = () => {
		fetchLargeCodes(searchLrgCsfCd, searchLrgCsfNm)
		setLargeForm(defaultLargeCode) // ?�분류 ?�록 ??초기??
		setSmallForm(defaultSmallCode) // ?�분�??�록 ??초기??
		setSmallCodes([]) // ?�분�?그리??초기??
		setSelectedLarge(null) // ?�분류 ?�택 ?�제
		setOriginalLargeForm(defaultLargeCode)
		setOriginalSmallForm(defaultSmallCode)
	}

	// ?�분류 ???�릭 ???�분�?목록 조회
	const handleLargeRowClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?�본 ?�이???�??
		fetchSmallCodes(row.lrgCsfCd)

		// ?�분류코???�록?�에 ?�택???�분류코드 기입
		setSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
		setOriginalSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
	}

	// AG-Grid ?�분류 ?�택 ?�벤??
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

	// AG-Grid ?�분�??�택 ?�벤??
	const onSmallCodeSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			handleSmallRowClick(row)
		} else {
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ?�규 모드�?변�?
		}
	}

	// AG-Grid 준�??�료 ?�벤??
	const onLargeGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?�렬 방�?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	const onSmallGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?�렬 방�?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	// ?�분류 ???�블?�릭 ?????�커??
	const handleLargeRowDoubleClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?�본 ?�이???�??
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
				?.focus()
		}, 0)
	}
	// ?�분�????�블?�릭 ?????�커??
	const handleSmallRowDoubleClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?�본 ?�이???�??
		setIsEditMode(true) // ?�정 모드�??�정
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

		// ?�력�?검�?
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

	// ?�분류 코드 중복 체크
	const isLargeCodeDuplicate = (code: string) => {
		return largeCodes.some((item) => item.lrgCsfCd === code)
	}
	// ?�분�?코드 중복 체크
	const isSmallCodeDuplicate = (code: string) => {
		return smallCodes.some((item) => item.smlCsfCd === code)
	}

	// ?�분류 ?�???�록/?�정)
	const handleLargeSave = async () => {
		// 모든 ?�수값이 비어?�는지 체크
		if (
			!largeForm.lrgCsfCd.trim() &&
			!largeForm.lrgCsfNm.trim() &&
			!largeForm.expl.trim()
		) {
			showToast('?�분류코드 ?� ?�분류명을 ?�력?�세??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// 변경사??체크
		if (!hasChanges(largeForm, originalLargeForm)) {
			showToast('변경된 ?�용???�습?�다.', 'warning')
			return
		}

		// ?�수�?체크
		if (!largeForm.lrgCsfCd.trim()) {
			setError('?�분류코드�??�력?�세??')
			showToast('?�분류코드�??�력?�세??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!largeForm.lrgCsfNm.trim()) {
			setError('?�분류명을 ?�력?�세??')
			showToast('?�분류명을 ?�력?�세??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ?�규 ?�록 ??중복 체크 (?�정?� ?�용)
		if (!selectedLarge && isLargeCodeDuplicate(largeForm.lrgCsfCd)) {
			setError('?��? 존재?�는 ?�분류코드?�니??')
			showToast('?��? 존재?�는 ?�분류코드?�니??', 'error')
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
			if (!res.ok) throw new Error('?�???�패')
			await fetchLargeCodes()
			setLargeForm(defaultLargeCode)
			setOriginalLargeForm(defaultLargeCode)
			setSelectedLarge(null)
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			showToast('?�분류코드 ?�???�료', 'info')
		} catch (e: any) {
			setError(e.message || '?�러 발생')
			showToast(e.message || '?�러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?�분류 ??��
	const handleLargeDelete = async () => {
		// 그리?�에???�택????��???�으�???�� 불�?
		if (!selectedLarge) {
			showToast('??��???�분류코드�?그리?�에???�택?�세??', 'warning')
			return
		}

		showConfirm({
			message: '?�말 ??��?�시겠습?�까?',
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
					if (!res.ok) throw new Error('??�� ?�패')
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
					showToast('?�분류코드 ??�� ?�료', 'info')
				} catch (e: any) {
					setError(e.message || '?�러 발생')
					showToast(e.message || '?�러 발생', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?�분�????�릭 ?�들??
	const handleSmallRowClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?�본 ?�이???�??
		setIsEditMode(true) // ?�정 모드�??�정
	}

	// ?�분�?관???�들??
	const handleSmallFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// ?�력�?검�?
		if (!validateInput(name, value)) {
			return
		}

		// smallFormLrgCsfCd�?lrgCsfCd�?매핑
		const fieldName = name === 'smallFormLrgCsfCd' ? 'lrgCsfCd' : name

		setSmallForm((prev) => ({ ...prev, [fieldName]: value }))
	}

	const handleSmallNew = () => {
		setSmallForm(defaultSmallCode)
		setOriginalSmallForm(defaultSmallCode)
		setIsEditMode(false) // ?�규 모드�??�정
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

	// ?�분�??�???�록/?�정)
	const handleSmallSave = async () => {
		// 모든 ?�수값이 비어?�는지 체크
		if (
			!smallForm.smlCsfCd.trim() &&
			!smallForm.smlCsfNm.trim() &&
			!smallForm.expl.trim()
		) {
			showToast('?�분류코?��? ?�분류명???�력?�세??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// ?�규 ?�록 모드
		if (!isEditMode) {
			// 중복 체크
			if (isSmallCodeDuplicate(smallForm.smlCsfCd)) {
				setError('?��? 존재?�는 ?�분류코?�입?�다.')
				showToast('?��? 존재?�는 ?�분류코?�입?�다.', 'error')
				setTimeout(() => {
					document
						.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
						?.focus()
				}, 100)
				return
			}
			// ?�록 진행 (return ?�이 ?�래�?
		} else {
			// ?�정 모드: 변경사??체크
			if (!hasChanges(smallForm, originalSmallForm)) {
				showToast('변경된 ?�용???�습?�다.', 'warning')
				return
			}
		}

		// ?�수�?체크
		if (!smallForm.smlCsfCd.trim()) {
			setError('?�분류코?��? ?�력?�세??')
			showToast('?�분류코?��? ?�력?�세??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!smallForm.smlCsfNm.trim()) {
			setError('?�분류명???�력?�세??')
			showToast('?�분류명???�력?�세??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ?�분류코드 검�?
		if (!smallForm.lrgCsfCd.trim()) {
			setError('?�분류코드�??�택?�세??')
			showToast('?�분류코드�??�택?�세??', 'error')
			setTimeout(() => {
				// ?�분류코???�록?�의 ?�분류코드 ?�드�??�커??
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

		// ?�분류코드가 기존??존재?�는지 체크
		const largeCodeExists = largeCodes.some(
			(item) => item.lrgCsfCd === smallForm.lrgCsfCd.trim()
		)
		if (!largeCodeExists) {
			setError('?�분류코드�?먼�? ?�록?�세??')
			showToast('?�분류코드�?먼�? ?�록?�세??', 'error')
			setTimeout(() => {
				// ?�분류코???�록?�의 ?�분류코드 ?�드�??�커??
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
			setError('?�분�?목록???�바르�? ?�습?�다.')
			showToast('?�분�?목록???�바르�? ?�습?�다.', 'error')
			return
		}
		if (!selectedLarge && isSmallCodeDuplicate(smallForm.smlCsfCd)) {
			setError('?��? 존재?�는 ?�분류코?�입?�다.')
			showToast('?��? 존재?�는 ?�분류코?�입?�다.', 'error')
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
				smallForm.linkCd3, // 추�?
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
			if (!res.ok) throw new Error('?�???�패')
			if (smallForm.lrgCsfCd) await fetchSmallCodes(smallForm.lrgCsfCd)
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ?�규 모드�?변�?
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			showToast('?�분류코???�???�료', 'info')
		} catch (e: any) {
			setError(e.message || '?�러 발생')
			showToast(e.message || '?�러 발생', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?�분�???��
	const handleSmallDelete = async () => {
		// ?�정 모드가 ?�니�???�� 불�?
		if (!isEditMode) {
			showToast('??��???�분류코?��? 그리?�에???�택?�세??', 'warning')
			return
		}

		showConfirm({
			message: '?�말 ??��?�시겠습?�까?',
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
					if (!res.ok) throw new Error('??�� ?�패')
					await fetchSmallCodes(smallForm.lrgCsfCd)
					setSmallForm(defaultSmallCode)
					setOriginalSmallForm(defaultSmallCode)
					setIsEditMode(false) // ?�규 모드�?변�?
					setTimeout(() => {
						document
							.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
							?.focus()
					}, 100)
					showToast('?�분류코????�� ?�료', 'info')
				} catch (e: any) {
					setError(e.message || '?�러 발생')
					showToast(e.message || '?�러 발생', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?�분류 코드 ?�력 ???�시�?중복 체크
	const handleLargeCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?�력�?검�?
		if (!validateInput(name, value)) {
			return
		}

		setLargeForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'lrgCsfCd' && isLargeCodeDuplicate(value)) {
			setError('?��? 존재?�는 ?�분류코드?�니??')
		} else {
			setError(null)
		}
	}
	// ?�분�?코드 ?�력 ???�시�?중복 체크
	const handleSmallCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?�력�?검�?
		if (!validateInput(name, value)) {
			return
		}

		setSmallForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'smlCsfCd' && isSmallCodeDuplicate(value)) {
			setError('?��? 존재?�는 ?�분류코?�입?�다.')
		} else {
			setError(null)
		}
	}

	// ?�분류 ?�록 ???�터???�??
	const handleLargeFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleLargeSave()
		}
	}
	// ?�분�??�록 ???�터???�??
	const handleSmallFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleSmallSave()
		}
	}
	// 검??input ?�터??검??
	const handleSearchInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 최초 마운?????�체 조회
	useEffect(() => {
		fetchLargeCodes()
		setSmallCodes([]) // 초기??
	}, [])

	return (
		<div className='mdi'>
			{/* ?�� 조회 ?�역 */}
			<div className='search-div mb-3'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[110px]'>?�분류 코드</th>
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
									aria-label='?�분류코드 검??
								/>
							</td>
							<th className='search-th w-[100px]'>?�분류�?/th>
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
									aria-label='?�분류�?검??
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
				{/* ?�분류 코드 ?�이�?*/}
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
								// ?�렬 변�????�래 ?�서�?복원
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
					{/* ?�분류 ?�록 ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-2'>
							<h4 className='text-sm font-bold'>?�분류코드 ?�록</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleLargeNew}
								tabIndex={0}
								aria-label='?�규'
							>
								?�규
							</button>
						</div>
						<table
							className='form-table w-full mb-4'
							onKeyDown={handleLargeFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?�분류코드</th>
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
											aria-label='?�분류코드 ?�력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?�분류�?/th>
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
											aria-label='?�분류�??�력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?�용?��?</th>
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
											aria-label='?�용?��? ?�택'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?�명</th>
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
											aria-label='?�명 ?�력'
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
								aria-label='??��'
							>
								??��
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleLargeSave}
								tabIndex={0}
								aria-label='?�??
							>
								?�??
							</button>
						</div>
					</div>
				</div>
				{/* ?�분�?코드 ?�이�?*/}
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
								// ?�렬 변�????�래 ?�서�?복원
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
					{/* ?�분�??�록 ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-4'>
							<h4 className='text-sm font-bold'>?�분류코???�록</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleSmallNew}
								tabIndex={0}
								aria-label='?�규'
							>
								?�규
							</button>
						</div>
						<table
							className='form-table w-full mb-2'
							onKeyDown={handleSmallFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?�분류코드</th>
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
											aria-label='?�분류코드 ?�력'
										/>
									</td>
									<th className='form-th w-[120px]'>?�분류코??/th>
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
											aria-label='?�분류코???�력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?�분류명</th>
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
											aria-label='?�분류명 ?�력'
										/>
									</td>
									<th className='form-th'>?�결코드1</th>
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
											aria-label='?�결코드1 ?�력'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?�결코드2</th>
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
											aria-label='?�결코드2 ?�력'
										/>
									</td>
									<th className='form-th'>?�렬?�서</th>
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
											aria-label='?�렬?�서 ?�력'
											min='1'
											max='999'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?�용?��?</th>
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
											aria-label='?�용?��? ?�택'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
									<th className='form-th'>?�명</th>
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
											aria-label='?�명 ?�력'
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
								aria-label='??��'
							>
								??��
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleSmallSave}
								tabIndex={0}
								aria-label='?�??
							>
								?�??
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default COMZ010M00Page


