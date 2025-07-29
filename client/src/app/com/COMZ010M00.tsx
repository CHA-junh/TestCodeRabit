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
 * COMZ010M00 - ?œìŠ¤?œì½”?œê?ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?€ë¶„ë¥˜ ì½”ë“œ ê´€ë¦?(?±ë¡/?˜ì •/?? œ)
 * - ?Œë¶„ë¥?ì½”ë“œ ê´€ë¦?(?±ë¡/?˜ì •/?? œ)
 * - ì½”ë“œ ì¤‘ë³µ ì²´í¬ ë°?? íš¨??ê²€ì¦?
 * - ê¶Œí•œë³??‘ê·¼ ?œì–´
 *
 * ?°ê? ?Œì´ë¸?
 * - TBL_LRG_CSF_CD (?€ë¶„ë¥˜ ì½”ë“œ)
 * - TBL_SML_CSF_CD (?Œë¶„ë¥?ì½”ë“œ)
 * - TBL_SYS_CODE (?œìŠ¤??ì½”ë“œ)
 */

// ?€ë¶„ë¥˜ ì½”ë“œ ?€??
interface LargeCode {
	lrgCsfCd: string
	lrgCsfNm: string
	useYn: string
	expl: string
}

// ?Œë¶„ë¥?ì½”ë“œ ?€??
interface SmallCode {
	smlCsfCd: string
	smlCsfNm: string
	sortOrd: number
	useYn: string
	expl: string
	linkCd1: string
	linkCd2: string
	linkCd3: string // ì¶”ê?, ?”ë©´?ëŠ” ?¨ê?
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
	linkCd3: '', // ì¶”ê?, ?”ë©´?ëŠ” ?¨ê?
	lrgCsfCd: '',
}

const COMZ010M00Page = () => {
	// AG-Grid refs
	const largeCodeGridRef = useRef<AgGridReact<LargeCode>>(null)
	const smallCodeGridRef = useRef<AgGridReact<SmallCode>>(null)

	// AG-Grid ì»¬ëŸ¼ ?•ì˜
	const [largeCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?€ë¶„ë¥˜ì½”ë“œ',
			field: 'lrgCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?€ë¶„ë¥˜ëª?,
			field: 'lrgCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¬ìš©?¬ë?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¤ëª…',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	const [smallCodeColDefs] = useState<ColDef[]>([
		{
			headerName: '?Œë¶„ë¥˜ì½”??,
			field: 'smlCsfCd',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?Œë¶„ë¥˜ëª…',
			field: 'smlCsfNm',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?•ë ¬?œì„œ',
			field: 'sortOrd',
			flex: 1,
			type: 'numericColumn',
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¬ìš©?¬ë?',
			field: 'useYn',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
		},
		{
			headerName: '?¤ëª…',
			field: 'expl',
			flex: 1,
			sortable: false,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
		},
	])

	// ê²€???íƒœ
	const [searchLrgCsfCd, setSearchLrgCsfCd] = useState('')
	const [searchLrgCsfNm, setSearchLrgCsfNm] = useState('')

	// ëª©ë¡ ?íƒœ
	const [largeCodes, setLargeCodes] = useState<LargeCode[]>([])
	const [smallCodes, setSmallCodes] = useState<SmallCode[]>([])

	// ? íƒ/???íƒœ
	const [selectedLarge, setSelectedLarge] = useState<LargeCode | null>(null)
	const [largeForm, setLargeForm] = useState<LargeCode>(defaultLargeCode)
	const [smallForm, setSmallForm] = useState<SmallCode>(defaultSmallCode)
	const [isEditMode, setIsEditMode] = useState(false) // ?Œë¶„ë¥??˜ì • ëª¨ë“œ ?íƒœ ì¶”ê?

	// ?ë³¸ ?°ì´???€??(ë³€ê²½ì‚¬??ì²´í¬??
	const [originalLargeForm, setOriginalLargeForm] =
		useState<LargeCode>(defaultLargeCode)
	const [originalSmallForm, setOriginalSmallForm] =
		useState<SmallCode>(defaultSmallCode)

	// ë¡œë”©/?ëŸ¬ ?íƒœ
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { session } = useAuth()
	const { showToast, showConfirm } = useToast()
	const USER_ID = session.user?.userId || session.user?.empNo || 'SYSTEM'

	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ010M00`
			: '/api/COMZ010M00'

	// ?…ë ¥ê°??œí•œ ?•ê·œ??
	const largeCodeRegex = /^[0-9]{1,4}$/ // ?€ë¶„ë¥˜ ì½”ë“œ: ?«ìë§?1-4??
	const smallCodeRegex = /^[A-Za-z0-9]{1,4}$/ // ?Œë¶„ë¥?ì½”ë“œ: ?ì–´+?«ì 1-4??
	const numberRegex = /^[0-9]{1,3}$/ // ?•ë ¬?œì„œ: ?«ì 1-3??
	const linkCodeRegex = /^[0-9]{0,10}$/ // ?°ê²°ì½”ë“œ: ?«ìë§?0-10??

	// ?…ë ¥ê°?ê²€ì¦??¨ìˆ˜
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

	// ë³€ê²½ì‚¬??ì²´í¬ ?¨ìˆ˜
	const hasChanges = (current: any, original: any): boolean => {
		return JSON.stringify(current) !== JSON.stringify(original)
	}

	// ?€ë¶„ë¥˜ ì½”ë“œ ëª©ë¡ ì¡°íšŒ ?¨ìˆ˜
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
			if (!res.ok) throw new Error('ì¡°íšŒ ?¤íŒ¨')
			const data = await res.json()
			setLargeCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?ëŸ¬ ë°œìƒ')
			showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?Œë¶„ë¥?ì½”ë“œ ëª©ë¡ ì¡°íšŒ ?¨ìˆ˜
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
			if (!res.ok) throw new Error('?Œë¶„ë¥?ì¡°íšŒ ?¤íŒ¨')
			const data = await res.json()
			setSmallCodes(data.data || [])
		} catch (e: any) {
			setError(e.message || '?ëŸ¬ ë°œìƒ')
			showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ê²€???¸ë“¤??
	const handleSearch = () => {
		fetchLargeCodes(searchLrgCsfCd, searchLrgCsfNm)
		setLargeForm(defaultLargeCode) // ?€ë¶„ë¥˜ ?±ë¡ ??ì´ˆê¸°??
		setSmallForm(defaultSmallCode) // ?Œë¶„ë¥??±ë¡ ??ì´ˆê¸°??
		setSmallCodes([]) // ?Œë¶„ë¥?ê·¸ë¦¬??ì´ˆê¸°??
		setSelectedLarge(null) // ?€ë¶„ë¥˜ ? íƒ ?´ì œ
		setOriginalLargeForm(defaultLargeCode)
		setOriginalSmallForm(defaultSmallCode)
	}

	// ?€ë¶„ë¥˜ ???´ë¦­ ???Œë¶„ë¥?ëª©ë¡ ì¡°íšŒ
	const handleLargeRowClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?ë³¸ ?°ì´???€??
		fetchSmallCodes(row.lrgCsfCd)

		// ?Œë¶„ë¥˜ì½”???±ë¡?¼ì— ? íƒ???€ë¶„ë¥˜ì½”ë“œ ê¸°ì…
		setSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
		setOriginalSmallForm((prev) => ({
			...prev,
			lrgCsfCd: row.lrgCsfCd,
		}))
	}

	// AG-Grid ?€ë¶„ë¥˜ ? íƒ ?´ë²¤??
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

	// AG-Grid ?Œë¶„ë¥?? íƒ ?´ë²¤??
	const onSmallCodeSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			handleSmallRowClick(row)
		} else {
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ? ê·œ ëª¨ë“œë¡?ë³€ê²?
		}
	}

	// AG-Grid ì¤€ë¹??„ë£Œ ?´ë²¤??
	const onLargeGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?•ë ¬ ë°©ì?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	const onSmallGridReady = (params: any) => {
		params.api.sizeColumnsToFit()
		// ?•ë ¬ ë°©ì?
		params.api.applyColumnState({
			defaultState: { sort: null },
		})
	}

	// ?€ë¶„ë¥˜ ???”ë¸”?´ë¦­ ?????¬ì»¤??
	const handleLargeRowDoubleClick = (row: LargeCode) => {
		setSelectedLarge(row)
		setLargeForm(row)
		setOriginalLargeForm(row) // ?ë³¸ ?°ì´???€??
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
				?.focus()
		}, 0)
	}
	// ?Œë¶„ë¥????”ë¸”?´ë¦­ ?????¬ì»¤??
	const handleSmallRowDoubleClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?ë³¸ ?°ì´???€??
		setIsEditMode(true) // ?˜ì • ëª¨ë“œë¡??¤ì •
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

		// ?…ë ¥ê°?ê²€ì¦?
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

	// ?€ë¶„ë¥˜ ì½”ë“œ ì¤‘ë³µ ì²´í¬
	const isLargeCodeDuplicate = (code: string) => {
		return largeCodes.some((item) => item.lrgCsfCd === code)
	}
	// ?Œë¶„ë¥?ì½”ë“œ ì¤‘ë³µ ì²´í¬
	const isSmallCodeDuplicate = (code: string) => {
		return smallCodes.some((item) => item.smlCsfCd === code)
	}

	// ?€ë¶„ë¥˜ ?€???±ë¡/?˜ì •)
	const handleLargeSave = async () => {
		// ëª¨ë“  ?„ìˆ˜ê°’ì´ ë¹„ì–´?ˆëŠ”ì§€ ì²´í¬
		if (
			!largeForm.lrgCsfCd.trim() &&
			!largeForm.lrgCsfNm.trim() &&
			!largeForm.expl.trim()
		) {
			showToast('?€ë¶„ë¥˜ì½”ë“œ ?€ ?€ë¶„ë¥˜ëª…ì„ ?…ë ¥?˜ì„¸??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// ë³€ê²½ì‚¬??ì²´í¬
		if (!hasChanges(largeForm, originalLargeForm)) {
			showToast('ë³€ê²½ëœ ?´ìš©???†ìŠµ?ˆë‹¤.', 'warning')
			return
		}

		// ?„ìˆ˜ê°?ì²´í¬
		if (!largeForm.lrgCsfCd.trim()) {
			setError('?€ë¶„ë¥˜ì½”ë“œë¥??…ë ¥?˜ì„¸??')
			showToast('?€ë¶„ë¥˜ì½”ë“œë¥??…ë ¥?˜ì„¸??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!largeForm.lrgCsfNm.trim()) {
			setError('?€ë¶„ë¥˜ëª…ì„ ?…ë ¥?˜ì„¸??')
			showToast('?€ë¶„ë¥˜ëª…ì„ ?…ë ¥?˜ì„¸??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ? ê·œ ?±ë¡ ??ì¤‘ë³µ ì²´í¬ (?˜ì •?€ ?ˆìš©)
		if (!selectedLarge && isLargeCodeDuplicate(largeForm.lrgCsfCd)) {
			setError('?´ë? ì¡´ì¬?˜ëŠ” ?€ë¶„ë¥˜ì½”ë“œ?…ë‹ˆ??')
			showToast('?´ë? ì¡´ì¬?˜ëŠ” ?€ë¶„ë¥˜ì½”ë“œ?…ë‹ˆ??', 'error')
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
			if (!res.ok) throw new Error('?€???¤íŒ¨')
			await fetchLargeCodes()
			setLargeForm(defaultLargeCode)
			setOriginalLargeForm(defaultLargeCode)
			setSelectedLarge(null)
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="lrgCsfCd"]')
					?.focus()
			}, 100)
			showToast('?€ë¶„ë¥˜ì½”ë“œ ?€???„ë£Œ', 'info')
		} catch (e: any) {
			setError(e.message || '?ëŸ¬ ë°œìƒ')
			showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?€ë¶„ë¥˜ ?? œ
	const handleLargeDelete = async () => {
		// ê·¸ë¦¬?œì—??? íƒ????ª©???†ìœ¼ë©??? œ ë¶ˆê?
		if (!selectedLarge) {
			showToast('?? œ???€ë¶„ë¥˜ì½”ë“œë¥?ê·¸ë¦¬?œì—??? íƒ?˜ì„¸??', 'warning')
			return
		}

		showConfirm({
			message: '?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
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
					if (!res.ok) throw new Error('?? œ ?¤íŒ¨')
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
					showToast('?€ë¶„ë¥˜ì½”ë“œ ?? œ ?„ë£Œ', 'info')
				} catch (e: any) {
					setError(e.message || '?ëŸ¬ ë°œìƒ')
					showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?Œë¶„ë¥????´ë¦­ ?¸ë“¤??
	const handleSmallRowClick = (row: SmallCode) => {
		setSmallForm(row)
		setOriginalSmallForm(row) // ?ë³¸ ?°ì´???€??
		setIsEditMode(true) // ?˜ì • ëª¨ë“œë¡??¤ì •
	}

	// ?Œë¶„ë¥?ê´€???¸ë“¤??
	const handleSmallFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// ?…ë ¥ê°?ê²€ì¦?
		if (!validateInput(name, value)) {
			return
		}

		// smallFormLrgCsfCdë¥?lrgCsfCdë¡?ë§¤í•‘
		const fieldName = name === 'smallFormLrgCsfCd' ? 'lrgCsfCd' : name

		setSmallForm((prev) => ({ ...prev, [fieldName]: value }))
	}

	const handleSmallNew = () => {
		setSmallForm(defaultSmallCode)
		setOriginalSmallForm(defaultSmallCode)
		setIsEditMode(false) // ? ê·œ ëª¨ë“œë¡??¤ì •
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

	// ?Œë¶„ë¥??€???±ë¡/?˜ì •)
	const handleSmallSave = async () => {
		// ëª¨ë“  ?„ìˆ˜ê°’ì´ ë¹„ì–´?ˆëŠ”ì§€ ì²´í¬
		if (
			!smallForm.smlCsfCd.trim() &&
			!smallForm.smlCsfNm.trim() &&
			!smallForm.expl.trim()
		) {
			showToast('?Œë¶„ë¥˜ì½”?œì? ?Œë¶„ë¥˜ëª…???…ë ¥?˜ì„¸??', 'warning')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}

		// ? ê·œ ?±ë¡ ëª¨ë“œ
		if (!isEditMode) {
			// ì¤‘ë³µ ì²´í¬
			if (isSmallCodeDuplicate(smallForm.smlCsfCd)) {
				setError('?´ë? ì¡´ì¬?˜ëŠ” ?Œë¶„ë¥˜ì½”?œì…?ˆë‹¤.')
				showToast('?´ë? ì¡´ì¬?˜ëŠ” ?Œë¶„ë¥˜ì½”?œì…?ˆë‹¤.', 'error')
				setTimeout(() => {
					document
						.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
						?.focus()
				}, 100)
				return
			}
			// ?±ë¡ ì§„í–‰ (return ?†ì´ ?„ë˜ë¡?
		} else {
			// ?˜ì • ëª¨ë“œ: ë³€ê²½ì‚¬??ì²´í¬
			if (!hasChanges(smallForm, originalSmallForm)) {
				showToast('ë³€ê²½ëœ ?´ìš©???†ìŠµ?ˆë‹¤.', 'warning')
				return
			}
		}

		// ?„ìˆ˜ê°?ì²´í¬
		if (!smallForm.smlCsfCd.trim()) {
			setError('?Œë¶„ë¥˜ì½”?œë? ?…ë ¥?˜ì„¸??')
			showToast('?Œë¶„ë¥˜ì½”?œë? ?…ë ¥?˜ì„¸??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			return
		}
		if (!smallForm.smlCsfNm.trim()) {
			setError('?Œë¶„ë¥˜ëª…???…ë ¥?˜ì„¸??')
			showToast('?Œë¶„ë¥˜ëª…???…ë ¥?˜ì„¸??', 'error')
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfNm"]')
					?.focus()
			}, 100)
			return
		}
		// ?€ë¶„ë¥˜ì½”ë“œ ê²€ì¦?
		if (!smallForm.lrgCsfCd.trim()) {
			setError('?€ë¶„ë¥˜ì½”ë“œë¥?? íƒ?˜ì„¸??')
			showToast('?€ë¶„ë¥˜ì½”ë“œë¥?? íƒ?˜ì„¸??', 'error')
			setTimeout(() => {
				// ?Œë¶„ë¥˜ì½”???±ë¡?¼ì˜ ?€ë¶„ë¥˜ì½”ë“œ ?„ë“œë¡??¬ì»¤??
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

		// ?€ë¶„ë¥˜ì½”ë“œê°€ ê¸°ì¡´??ì¡´ì¬?˜ëŠ”ì§€ ì²´í¬
		const largeCodeExists = largeCodes.some(
			(item) => item.lrgCsfCd === smallForm.lrgCsfCd.trim()
		)
		if (!largeCodeExists) {
			setError('?€ë¶„ë¥˜ì½”ë“œë¥?ë¨¼ì? ?±ë¡?˜ì„¸??')
			showToast('?€ë¶„ë¥˜ì½”ë“œë¥?ë¨¼ì? ?±ë¡?˜ì„¸??', 'error')
			setTimeout(() => {
				// ?Œë¶„ë¥˜ì½”???±ë¡?¼ì˜ ?€ë¶„ë¥˜ì½”ë“œ ?„ë“œë¡??¬ì»¤??
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
			setError('?Œë¶„ë¥?ëª©ë¡???¬ë°”ë¥´ì? ?ŠìŠµ?ˆë‹¤.')
			showToast('?Œë¶„ë¥?ëª©ë¡???¬ë°”ë¥´ì? ?ŠìŠµ?ˆë‹¤.', 'error')
			return
		}
		if (!selectedLarge && isSmallCodeDuplicate(smallForm.smlCsfCd)) {
			setError('?´ë? ì¡´ì¬?˜ëŠ” ?Œë¶„ë¥˜ì½”?œì…?ˆë‹¤.')
			showToast('?´ë? ì¡´ì¬?˜ëŠ” ?Œë¶„ë¥˜ì½”?œì…?ˆë‹¤.', 'error')
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
				smallForm.linkCd3, // ì¶”ê?
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
			if (!res.ok) throw new Error('?€???¤íŒ¨')
			if (smallForm.lrgCsfCd) await fetchSmallCodes(smallForm.lrgCsfCd)
			setSmallForm(defaultSmallCode)
			setOriginalSmallForm(defaultSmallCode)
			setIsEditMode(false) // ? ê·œ ëª¨ë“œë¡?ë³€ê²?
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
					?.focus()
			}, 100)
			showToast('?Œë¶„ë¥˜ì½”???€???„ë£Œ', 'info')
		} catch (e: any) {
			setError(e.message || '?ëŸ¬ ë°œìƒ')
			showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
		} finally {
			setLoading(false)
		}
	}

	// ?Œë¶„ë¥??? œ
	const handleSmallDelete = async () => {
		// ?˜ì • ëª¨ë“œê°€ ?„ë‹ˆë©??? œ ë¶ˆê?
		if (!isEditMode) {
			showToast('?? œ???Œë¶„ë¥˜ì½”?œë? ê·¸ë¦¬?œì—??? íƒ?˜ì„¸??', 'warning')
			return
		}

		showConfirm({
			message: '?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
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
					if (!res.ok) throw new Error('?? œ ?¤íŒ¨')
					await fetchSmallCodes(smallForm.lrgCsfCd)
					setSmallForm(defaultSmallCode)
					setOriginalSmallForm(defaultSmallCode)
					setIsEditMode(false) // ? ê·œ ëª¨ë“œë¡?ë³€ê²?
					setTimeout(() => {
						document
							.querySelector<HTMLInputElement>('input[name="smlCsfCd"]')
							?.focus()
					}, 100)
					showToast('?Œë¶„ë¥˜ì½”???? œ ?„ë£Œ', 'info')
				} catch (e: any) {
					setError(e.message || '?ëŸ¬ ë°œìƒ')
					showToast(e.message || '?ëŸ¬ ë°œìƒ', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	// ?€ë¶„ë¥˜ ì½”ë“œ ?…ë ¥ ???¤ì‹œê°?ì¤‘ë³µ ì²´í¬
	const handleLargeCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?…ë ¥ê°?ê²€ì¦?
		if (!validateInput(name, value)) {
			return
		}

		setLargeForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'lrgCsfCd' && isLargeCodeDuplicate(value)) {
			setError('?´ë? ì¡´ì¬?˜ëŠ” ?€ë¶„ë¥˜ì½”ë“œ?…ë‹ˆ??')
		} else {
			setError(null)
		}
	}
	// ?Œë¶„ë¥?ì½”ë“œ ?…ë ¥ ???¤ì‹œê°?ì¤‘ë³µ ì²´í¬
	const handleSmallCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		// ?…ë ¥ê°?ê²€ì¦?
		if (!validateInput(name, value)) {
			return
		}

		setSmallForm((prev) => ({ ...prev, [name]: value }))
		if (name === 'smlCsfCd' && isSmallCodeDuplicate(value)) {
			setError('?´ë? ì¡´ì¬?˜ëŠ” ?Œë¶„ë¥˜ì½”?œì…?ˆë‹¤.')
		} else {
			setError(null)
		}
	}

	// ?€ë¶„ë¥˜ ?±ë¡ ???”í„°???€??
	const handleLargeFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleLargeSave()
		}
	}
	// ?Œë¶„ë¥??±ë¡ ???”í„°???€??
	const handleSmallFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
		if (e.key === 'Enter') {
			handleSmallSave()
		}
	}
	// ê²€??input ?”í„°??ê²€??
	const handleSearchInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// ìµœì´ˆ ë§ˆìš´?????„ì²´ ì¡°íšŒ
	useEffect(() => {
		fetchLargeCodes()
		setSmallCodes([]) // ì´ˆê¸°??
	}, [])

	return (
		<div className='mdi'>
			{/* ?” ì¡°íšŒ ?ì—­ */}
			<div className='search-div mb-3'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[110px]'>?€ë¶„ë¥˜ ì½”ë“œ</th>
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
									aria-label='?€ë¶„ë¥˜ì½”ë“œ ê²€??
								/>
							</td>
							<th className='search-th w-[100px]'>?€ë¶„ë¥˜ëª?/th>
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
									aria-label='?€ë¶„ë¥˜ëª?ê²€??
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search ml-2'
									onClick={handleSearch}
									tabIndex={0}
									aria-label='ì¡°íšŒ'
								>
									ì¡°íšŒ
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='flex gap-4'>
				{/* ?€ë¶„ë¥˜ ì½”ë“œ ?Œì´ë¸?*/}
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
								// ?•ë ¬ ë³€ê²????ë˜ ?œì„œë¡?ë³µì›
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
					{/* ?€ë¶„ë¥˜ ?±ë¡ ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-2'>
							<h4 className='text-sm font-bold'>?€ë¶„ë¥˜ì½”ë“œ ?±ë¡</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleLargeNew}
								tabIndex={0}
								aria-label='? ê·œ'
							>
								? ê·œ
							</button>
						</div>
						<table
							className='form-table w-full mb-4'
							onKeyDown={handleLargeFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?€ë¶„ë¥˜ì½”ë“œ</th>
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
											aria-label='?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?€ë¶„ë¥˜ëª?/th>
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
											aria-label='?€ë¶„ë¥˜ëª??…ë ¥'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?¬ìš©?¬ë?</th>
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
											aria-label='?¬ìš©?¬ë? ? íƒ'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?¤ëª…</th>
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
											aria-label='?¤ëª… ?…ë ¥'
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
								aria-label='?? œ'
							>
								?? œ
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleLargeSave}
								tabIndex={0}
								aria-label='?€??
							>
								?€??
							</button>
						</div>
					</div>
				</div>
				{/* ?Œë¶„ë¥?ì½”ë“œ ?Œì´ë¸?*/}
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
								// ?•ë ¬ ë³€ê²????ë˜ ?œì„œë¡?ë³µì›
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
					{/* ?Œë¶„ë¥??±ë¡ ??*/}
					<div className='border border-stone-300 p-3 rounded'>
						<div className='tit_area flex justify-between items-center mb-4'>
							<h4 className='text-sm font-bold'>?Œë¶„ë¥˜ì½”???±ë¡</h4>
							<button
								className='btn-base btn-etc'
								onClick={handleSmallNew}
								tabIndex={0}
								aria-label='? ê·œ'
							>
								? ê·œ
							</button>
						</div>
						<table
							className='form-table w-full mb-2'
							onKeyDown={handleSmallFormKeyDown}
						>
							<tbody>
								<tr className='form-tr'>
									<th className='form-th w-[120px]'>?€ë¶„ë¥˜ì½”ë“œ</th>
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
											aria-label='?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥'
										/>
									</td>
									<th className='form-th w-[120px]'>?Œë¶„ë¥˜ì½”??/th>
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
											aria-label='?Œë¶„ë¥˜ì½”???…ë ¥'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?Œë¶„ë¥˜ëª…</th>
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
											aria-label='?Œë¶„ë¥˜ëª… ?…ë ¥'
										/>
									</td>
									<th className='form-th'>?°ê²°ì½”ë“œ1</th>
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
											aria-label='?°ê²°ì½”ë“œ1 ?…ë ¥'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?°ê²°ì½”ë“œ2</th>
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
											aria-label='?°ê²°ì½”ë“œ2 ?…ë ¥'
										/>
									</td>
									<th className='form-th'>?•ë ¬?œì„œ</th>
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
											aria-label='?•ë ¬?œì„œ ?…ë ¥'
											min='1'
											max='999'
										/>
									</td>
								</tr>
								<tr className='form-tr'>
									<th className='form-th'>?¬ìš©?¬ë?</th>
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
											aria-label='?¬ìš©?¬ë? ? íƒ'
										>
											<option value='Y'>Yes</option>
											<option value='N'>No</option>
										</select>
									</td>
									<th className='form-th'>?¤ëª…</th>
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
											aria-label='?¤ëª… ?…ë ¥'
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
								aria-label='?? œ'
							>
								?? œ
							</button>
							<button
								className='btn-base btn-act'
								onClick={handleSmallSave}
								tabIndex={0}
								aria-label='?€??
							>
								?€??
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default COMZ010M00Page


