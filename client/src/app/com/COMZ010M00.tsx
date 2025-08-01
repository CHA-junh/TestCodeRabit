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
 * COMZ010M00 - ?μ€?μ½?κ?λ¦??λ©΄
 *
 * μ£Όμ κΈ°λ₯:
 * - ?λΆλ₯ μ½λ κ΄λ¦?(?±λ‘/?μ /?? )
 * - ?λΆλ₯?μ½λ κ΄λ¦?(?±λ‘/?μ /?? )
 * - μ½λ μ€λ³΅ μ²΄ν¬ λ°?? ν¨??κ²μ¦?
 * - κΆνλ³??κ·Ό ?μ΄
 *
 * ?°κ? ?μ΄λΈ?
 * - TBL_LRG_CSF_CD (?λΆλ₯ μ½λ)
 * - TBL_SML_CSF_CD (?λΆλ₯?μ½λ)
 * - TBL_SYS_CODE (?μ€??μ½λ)
 */

// ?λΆλ₯ μ½λ ???
interface LargeCode {
	lrgCsfCd: string
	lrgCsfNm: string
	useYn: string
	expl: string
}

// ?λΆλ₯?μ½λ ???
interface SmallCode {
	smlCsfCd: string
	smlCsfNm: string
	sortOrd: number
	useYn: string
	expl: string
	linkCd1: string
	linkCd2: string
	linkCd3: string // μΆκ?, ?λ©΄?λ ?¨κ?
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
	linkCd3: '', // μΆκ?, ?λ©΄?λ ?¨κ?
	lrgCsfCd: '',
}

const COMZ010M00Page = () => {
	// AG-Grid refs
	const largeCodeGridRef = useRef<AgGridReact<LargeCode>>(null)
	const smallCodeGridRef = useRef<AgGridReact<SmallCode>>(null)

	// AG-Grid μ»¬λΌ ?μ
	const [largeCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?λΆλ₯μ½λ',
			field: 'lrgCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?λΆλ₯λͺ?,
			field: 'lrgCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¬μ©?¬λ?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?€λͺ',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	const [smallCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?λΆλ₯μ½??,
			field: 'smlCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?λΆλ₯λͺ',
			field: 'smlCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?λ ¬?μ',
			field: 'sortOrd',
			flex: 1,
			type: 'numericColumn',
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¬μ©?¬λ?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?€λͺ',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	// κ²???ν
	const [searchLrgCsfCd, setSearchLrgCsfCd] = useState('')
	const [searchLrgCsfNm, setSearchLrgCsfNm] = useState('')

	// λͺ©λ‘ ?ν
	const [largeCodes, setLargeCodes] = useState<LargeCode[]>([])
	const [smallCodes, setSmallCodes] = useState<SmallCode[]>([])

	// ? ν/???ν
	const [selectedLarge, setSelectedLarge] = useState<LargeCode | null>(null)
	const [largeForm, setLargeForm] = useState<LargeCode>(defaultLargeCode)
	const [smallForm, setSmallForm] = useState<SmallCode>(defaultSmallCode)
	const [isEditMode, setIsEditMode] = useState(false) // ?λΆλ₯??μ  λͺ¨λ ?ν μΆκ?

	// ?λ³Έ ?°μ΄?????(λ³κ²½μ¬??μ²΄ν¬??
	const [originalLargeForm, setOriginalLargeForm] =
		useState<LargeCode>(defaultLargeCode)
	const [originalSmallForm, setOriginalSmallForm] =
		useState<SmallCode>(defaultSmallCode)

	// λ‘λ©/?λ¬ ?ν
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { session } = useAuth()
	const { showToast, showConfirm } = useToast()
	const USER_ID = session.user?.userId || session.user?.empNo || 'SYSTEM'

	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ010M00`
			: '/api/COMZ010M00'

	// ?λ ₯κ°??ν ?κ·??
	const largeCodeRegex = /^[0-9]{1,4}$/ // ?λΆλ₯ μ½λ: ?«μλ§?1-4??
	const smallCodeRegex = /^[A-Za-z0-9]{1,4}$/ // ?λΆλ₯?μ½λ: ?μ΄+?«μ 1-4??
	const numberRegex = /^[0-9]{1,3}$/ // ?λ ¬?μ: ?«μ 1-3??
	const linkCodeRegex = /^[0-9]{0,10}$/ // ?°κ²°μ½λ: ?«μλ§?0-10??

	// ?λ ₯κ°?κ²μ¦??¨μ
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

	// λ³κ²½μ¬??μ²΄ν¬ ?¨μ
	const hasChanges = (current: any, original: any): boolean => {
		return JSON.stringify(current) !== JSON.stringify(original)
	}

	// ?λΆλ₯ μ½λ λͺ©λ‘ μ‘°ν ?¨μ
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
			if (!res.ok) throw new Error('μ‘°ν ?€ν¨')
			const data = await res.json()
			setLargeCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?λ¬ λ°μ')
			showToast(e.message || '?λ¬ λ°μ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?λΆλ₯?μ½λ λͺ©λ‘ μ‘°ν ?¨μ
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
			if (!res.ok) throw new Error('?λΆλ₯?μ‘°ν ?€ν¨')
			const data = await res.json()
			setSmallCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?λ¬ λ°μ')
			showToast(e.message || '?λ¬ λ°μ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// κ²???Έλ€??
	const handleSearch = () => {
		fetchLargeCodes(searchLrgCsfCd, searchLrgCsfNm)
		setLargeForm(defaultLargeCode) // ?λΆλ₯ ?±λ‘ ??μ΄κΈ°??
		setSmallForm(defaultSmallCode) // ?λΆλ₯??±λ‘ ??μ΄κΈ°??
		setSmallCodes([]) // ?λΆλ₯?κ·Έλ¦¬??μ΄κΈ°??
		setSelectedLarge(null) // ?λΆλ₯ ? ν ?΄μ 
		setOriginalLargeForm(defaultLargeCode)
		setOriginalSmallForm(defaultSmallCode)
	}

	// ?λΆλ₯ ???΄λ¦­ ???λΆλ₯?λͺ©λ‘ μ‘°ν
	const handleLargeRowClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?λ³Έ ?°μ΄?????
		fetchSmallCodes(row.lrgCsfCd)

		// ?λΆλ₯μ½???±λ‘?Όμ ? ν???λΆλ₯μ½λ κΈ°μ
		setSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
		setOriginalSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
	}

	// AG-Grid ?λΆλ₯ ? ν ?΄λ²€??
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

	// AG-Grid ?λΆλ₯?? ν ?΄λ²€??
	const onSmallCodeSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			handleSmallRowClick(row)
		} else {
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ? κ· λͺ¨λλ‘?λ³κ²?
		}
	}

	// AG-Grid μ€λΉ??λ£ ?΄λ²€??
	const onLargeGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?λ ¬ λ°©μ?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	const onSmallGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?λ ¬ λ°©μ?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	// ?λΆλ₯ ???λΈ?΄λ¦­ ?????¬μ»€??
	const handleLargeRowDoubleClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?λ³Έ ?°μ΄?????
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
				?.focus()
		}, 0)
	}
	// ?λΆλ₯????λΈ?΄λ¦­ ?????¬μ»€??
	const handleSmallRowDoubleClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?λ³Έ ?°μ΄?????
		setIsEditMode(true) // ?μ  λͺ¨λλ‘??€μ 
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

		// ?λ ₯κ°?κ²μ¦?
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

	// ?λΆλ₯ μ½λ μ€λ³΅ μ²΄ν¬
	const isLargeCodeDuplicate = (code: string) => {
		return largeCodes.some((item) => item.lrgCsfCd === code)
	}
	// ?λΆλ₯?μ½λ μ€λ³΅ μ²΄ν¬
	const isSmallCodeDuplicate = (code: string) => {
		return smallCodes.some((item) => item.smlCsfCd === code)
	}

	// ?λΆλ₯ ????±λ‘/?μ )
	const handleLargeSave = async () => {
		// λͺ¨λ  ?μκ°μ΄ λΉμ΄?λμ§ μ²΄ν¬
		if (
			!largeForm.lrgCsfCd.trim() &&
			!largeForm.lrgCsfNm.trim() &&
			!largeForm.expl.trim()
		) {
			showToast('?λΆλ₯μ½λ ? ?λΆλ₯λͺμ ?λ ₯?μΈ??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// λ³κ²½μ¬??μ²΄ν¬
		if (!hasChanges(largeForm, originalLargeForm)) {
			showToast('λ³κ²½λ ?΄μ©???μ΅?λ€.', 'warning')
			return
		}

		// ?μκ°?μ²΄ν¬
		if (!largeForm.lrgCsfCd.trim()) {
			setError('?λΆλ₯μ½λλ₯??λ ₯?μΈ??')
			showToast('?λΆλ₯μ½λλ₯??λ ₯?μΈ??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!largeForm.lrgCsfNm.trim()) {
			setError('?λΆλ₯λͺμ ?λ ₯?μΈ??')
			showToast('?λΆλ₯λͺμ ?λ ₯?μΈ??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ? κ· ?±λ‘ ??μ€λ³΅ μ²΄ν¬ (?μ ? ?μ©)
		if (!selectedLarge && isLargeCodeDuplicate(largeForm.lrgCsfCd)) {
			setError('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½λ?λ??')
			showToast('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½λ?λ??', 'error')
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
			if (!res.ok) throw new Error('????€ν¨')
			await fetchLargeCodes()
			setLargeForm(defaultLargeCode)
			setOriginalLargeForm(defaultLargeCode)
			setSelectedLarge(null)
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			showToast('?λΆλ₯μ½λ ????λ£', 'info')
		} catch (e: any) {
			setError(e.message || '?λ¬ λ°μ')
			showToast(e.message || '?λ¬ λ°μ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?λΆλ₯ ?? 
	const handleLargeDelete = async () => {
		// κ·Έλ¦¬?μ??? ν????ͺ©???μΌλ©???  λΆκ?
		if (!selectedLarge) {
			showToast('?? ???λΆλ₯μ½λλ₯?κ·Έλ¦¬?μ??? ν?μΈ??', 'warning')
			return
		}

		showConfirm({
			message: '?λ§ ?? ?μκ² μ΅?κΉ?',
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
					if (!res.ok) throw new Error('??  ?€ν¨')
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
					showToast('?λΆλ₯μ½λ ??  ?λ£', 'info')
				} catch (e: any) {
					setError(e.message || '?λ¬ λ°μ')
					showToast(e.message || '?λ¬ λ°μ', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?λΆλ₯????΄λ¦­ ?Έλ€??
	const handleSmallRowClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?λ³Έ ?°μ΄?????
		setIsEditMode(true) // ?μ  λͺ¨λλ‘??€μ 
	}

	// ?λΆλ₯?κ΄???Έλ€??
	const handleSmallFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// ?λ ₯κ°?κ²μ¦?
		if (!validateInput(name, value)) {
			return
		}

		// smallFormLrgCsfCdλ₯?lrgCsfCdλ‘?λ§€ν
		const fieldName = name === 'smallFormLrgCsfCd' ? 'lrgCsfCd' : name

		setSmallForm((prev) => ({ ...prev, [fieldName]: value }))
	}

	const handleSmallNew = () => {
		setSmallForm(defaultSmallCode)
		setOriginalSmallForm(defaultSmallCode)
		setIsEditMode(false) // ? κ· λͺ¨λλ‘??€μ 
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

	// ?λΆλ₯?????±λ‘/?μ )
	const handleSmallSave = async () => {
		// λͺ¨λ  ?μκ°μ΄ λΉμ΄?λμ§ μ²΄ν¬
		if (
			!smallForm.smlCsfCd.trim() &&
			!smallForm.smlCsfNm.trim() &&
			!smallForm.expl.trim()
		) {
			showToast('?λΆλ₯μ½?μ? ?λΆλ₯λͺ???λ ₯?μΈ??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// ? κ· ?±λ‘ λͺ¨λ
		if (!isEditMode) {
			// μ€λ³΅ μ²΄ν¬
			if (isSmallCodeDuplicate(smallForm.smlCsfCd)) {
				setError('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½?μ?λ€.')
				showToast('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½?μ?λ€.', 'error')
				setTimeout(() => {
					document
						.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
						?.focus()
				}, 100)
				return
			}
			// ?±λ‘ μ§ν (return ?μ΄ ?λλ‘?
		} else {
			// ?μ  λͺ¨λ: λ³κ²½μ¬??μ²΄ν¬
			if (!hasChanges(smallForm, originalSmallForm)) {
				showToast('λ³κ²½λ ?΄μ©???μ΅?λ€.', 'warning')
				return
			}
		}

		// ?μκ°?μ²΄ν¬
		if (!smallForm.smlCsfCd.trim()) {
			setError('?λΆλ₯μ½?λ? ?λ ₯?μΈ??')
			showToast('?λΆλ₯μ½?λ? ?λ ₯?μΈ??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!smallForm.smlCsfNm.trim()) {
			setError('?λΆλ₯λͺ???λ ₯?μΈ??')
			showToast('?λΆλ₯λͺ???λ ₯?μΈ??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ?λΆλ₯μ½λ κ²μ¦?
		if (!smallForm.lrgCsfCd.trim()) {
			setError('?λΆλ₯μ½λλ₯?? ν?μΈ??')
			showToast('?λΆλ₯μ½λλ₯?? ν?μΈ??', 'error')
			setTimeout(() => {
				// ?λΆλ₯μ½???±λ‘?Όμ ?λΆλ₯μ½λ ?λλ‘??¬μ»€??
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

		// ?λΆλ₯μ½λκ° κΈ°μ‘΄??μ‘΄μ¬?λμ§ μ²΄ν¬
		const largeCodeExists = largeCodes.some(
			(item) => item.lrgCsfCd === smallForm.lrgCsfCd.trim()
		)
		if (!largeCodeExists) {
			setError('?λΆλ₯μ½λλ₯?λ¨Όμ? ?±λ‘?μΈ??')
			showToast('?λΆλ₯μ½λλ₯?λ¨Όμ? ?±λ‘?μΈ??', 'error')
			setTimeout(() => {
				// ?λΆλ₯μ½???±λ‘?Όμ ?λΆλ₯μ½λ ?λλ‘??¬μ»€??
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
			setError('?λΆλ₯?λͺ©λ‘???¬λ°λ₯΄μ? ?μ΅?λ€.')
			showToast('?λΆλ₯?λͺ©λ‘???¬λ°λ₯΄μ? ?μ΅?λ€.', 'error')
			return
		}
		if (!selectedLarge && isSmallCodeDuplicate(smallForm.smlCsfCd)) {
			setError('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½?μ?λ€.')
			showToast('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½?μ?λ€.', 'error')
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
				smallForm.linkCd3, // μΆκ?
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
			if (!res.ok) throw new Error('????€ν¨')
			if (smallForm.lrgCsfCd) await fetchSmallCodes(smallForm.lrgCsfCd)
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ? κ· λͺ¨λλ‘?λ³κ²?
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			showToast('?λΆλ₯μ½??????λ£', 'info')
		} catch (e: any) {
			setError(e.message || '?λ¬ λ°μ')
			showToast(e.message || '?λ¬ λ°μ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?λΆλ₯??? 
	const handleSmallDelete = async () => {
		// ?μ  λͺ¨λκ° ?λλ©???  λΆκ?
		if (!isEditMode) {
			showToast('?? ???λΆλ₯μ½?λ? κ·Έλ¦¬?μ??? ν?μΈ??', 'warning')
			return
		}

		showConfirm({
			message: '?λ§ ?? ?μκ² μ΅?κΉ?',
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
					if (!res.ok) throw new Error('??  ?€ν¨')
					await fetchSmallCodes(smallForm.lrgCsfCd)
					setSmallForm(defaultSmallCode)
					setOriginalSmallForm(defaultSmallCode)
					setIsEditMode(false) // ? κ· λͺ¨λλ‘?λ³κ²?
					setTimeout(() => {
						document
							.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
							?.focus()
					}, 100)
					showToast('?λΆλ₯μ½????  ?λ£', 'info')
				} catch (e: any) {
					setError(e.message || '?λ¬ λ°μ')
					showToast(e.message || '?λ¬ λ°μ', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?λΆλ₯ μ½λ ?λ ₯ ???€μκ°?μ€λ³΅ μ²΄ν¬
	const handleLargeCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?λ ₯κ°?κ²μ¦?
		if (!validateInput(name, value)) {
			return
		}

		setLargeForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'lrgCsfCd' && isLargeCodeDuplicate(value)) {
			setError('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½λ?λ??')
		} else {
			setError(null)
		}
	}
	// ?λΆλ₯?μ½λ ?λ ₯ ???€μκ°?μ€λ³΅ μ²΄ν¬
	const handleSmallCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?λ ₯κ°?κ²μ¦?
		if (!validateInput(name, value)) {
			return
		}

		setSmallForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'smlCsfCd' && isSmallCodeDuplicate(value)) {
			setError('?΄λ? μ‘΄μ¬?λ ?λΆλ₯μ½?μ?λ€.')
		} else {
			setError(null)
		}
	}

	// ?λΆλ₯ ?±λ‘ ???ν°?????
	const handleLargeFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleLargeSave()
		}
	}
	// ?λΆλ₯??±λ‘ ???ν°?????
	const handleSmallFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleSmallSave()
		}
	}
	// κ²??input ?ν°??κ²??
	const handleSearchInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// μ΅μ΄ λ§μ΄?????μ²΄ μ‘°ν
	useEffect(() => {
		fetchLargeCodes()
		setSmallCodes([]) // μ΄κΈ°??
	}, [])

	return (
		<div className='mdi'>
			{/* ? μ‘°ν ?μ­ */}
			<div className='search-div mb-3'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[110px]'>?λΆλ₯ μ½λ</th>
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
									aria-label='?λΆλ₯μ½λ κ²??
								/>
							</td>
							<th className='search-th w-[100px]'>?λΆλ₯λͺ?/th>
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
									aria-label='?λΆλ₯λͺ?κ²??
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search ml-2'
									onClick={handleSearch}
									tabIndex={0}
									aria-label='μ‘°ν'
								>
									μ‘°ν
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='flex gap-4'>
				{/* ?λΆλ₯ μ½λ ?μ΄λΈ?*/}
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
								// ?λ ¬ λ³κ²????λ ?μλ‘?λ³΅μ
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
					{/* ?λΆλ₯ ?±λ‘ ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-2'>
							<h4 className='text-sm font-bold'>?λΆλ₯μ½λ ?±λ‘</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleLargeNew}
								tabIndex={0}
								aria-label='? κ·'
							>
								? κ·
							</button>
						</div>
						<table
							className='form-table w-full mb-4'
							onKeyDown={handleLargeFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?λΆλ₯μ½λ</th>
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
											aria-label='?λΆλ₯μ½λ ?λ ₯'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?λΆλ₯λͺ?/th>
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
											aria-label='?λΆλ₯λͺ??λ ₯'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?¬μ©?¬λ?</th>
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
											aria-label='?¬μ©?¬λ? ? ν'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?€λͺ</th>
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
											aria-label='?€λͺ ?λ ₯'
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
								aria-label='?? '
							>
								?? 
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleLargeSave}
								tabIndex={0}
								aria-label='???
							>
								???
							</button>
						</div>
					</div>
				</div>
				{/* ?λΆλ₯?μ½λ ?μ΄λΈ?*/}
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
								// ?λ ¬ λ³κ²????λ ?μλ‘?λ³΅μ
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
					{/* ?λΆλ₯??±λ‘ ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-4'>
							<h4 className='text-sm font-bold'>?λΆλ₯μ½???±λ‘</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleSmallNew}
								tabIndex={0}
								aria-label='? κ·'
							>
								? κ·
							</button>
						</div>
						<table
							className='form-table w-full mb-2'
							onKeyDown={handleSmallFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?λΆλ₯μ½λ</th>
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
											aria-label='?λΆλ₯μ½λ ?λ ₯'
										/>
									</td>
									<th className='form-th w-[120px]'>?λΆλ₯μ½??/th>
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
											aria-label='?λΆλ₯μ½???λ ₯'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?λΆλ₯λͺ</th>
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
											aria-label='?λΆλ₯λͺ ?λ ₯'
										/>
									</td>
									<th className='form-th'>?°κ²°μ½λ1</th>
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
											aria-label='?°κ²°μ½λ1 ?λ ₯'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?°κ²°μ½λ2</th>
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
											aria-label='?°κ²°μ½λ2 ?λ ₯'
										/>
									</td>
									<th className='form-th'>?λ ¬?μ</th>
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
											aria-label='?λ ¬?μ ?λ ₯'
											min='1'
											max='999'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?¬μ©?¬λ?</th>
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
											aria-label='?¬μ©?¬λ? ? ν'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
									<th className='form-th'>?€λͺ</th>
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
											aria-label='?€λͺ ?λ ₯'
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
								aria-label='?? '
							>
								?? 
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleSmallSave}
								tabIndex={0}
								aria-label='???
							>
								???
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default COMZ010M00Page


