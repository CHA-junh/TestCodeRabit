'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useToast } from '@/contexts/ToastContext'
import '../common/common.css'

/**
 * ?¨ê? ?°ì´???¸í„°?˜ì´??
 * ASIS COM_01_0200.mxml???°ì´??êµ¬ì¡°ë¥?ê¸°ë°˜?¼ë¡œ ?•ì˜
 */
interface UnitPriceData {
	OWN_OUTS_DIV: string // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (1: ?ì‚¬, 2: ?¸ì£¼)
	OWN_OUTS_DIV_NM: string // êµ¬ë¶„ëª?(?ì‚¬/?¸ì£¼)
	YR: string // ?„ë„
	TCN_GRD: string // ê¸°ìˆ ?±ê¸‰ ì½”ë“œ
	TCN_GRD_NM: string // ê¸°ìˆ ?±ê¸‰ëª?(ì´ˆê¸‰/ì¤‘ê¸‰/ê³ ê¸‰)
	DUTY_CD: string // ì§ì±… ì½”ë“œ
	DUTY_NM: string // ì§ì±…ëª?(?¬ì›/?€ë¦?ê³¼ì¥ ??
	UPRC: string // ?¨ê? (??
}

/**
 * ?±ê¸‰ë³??¨ê? ?±ë¡ ?”ë©´
 * ASIS: COM_01_0200.mxml ??TOBE: COMZ020M00.tsx
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * 1. ?±ê¸‰ë³??¨ê? ì¡°íšŒ (COM_01_0201_S)
 * 2. ?±ê¸‰ë³??¨ê? ?±ë¡/?˜ì • (COM_01_0202_T)
 * 3. ?±ê¸‰ë³??¨ê? ?? œ (COM_01_0203_D)
 */
export default function MainPage() {
	/**
	 * ?„ë„ ë²”ìœ„ ?¤ì •
	 * ?„ì¬ ?„ë„ë¶€???´ì „ N?„ê¹Œì§€??ë²”ìœ„ë¥??¤ì •
	 */
	const YEAR_RANGE = 10 // ?´ì „ 10?„ê¹Œì§€

	/**
	 * ì¡°íšŒ ì¡°ê±´ ?íƒœ ê´€ë¦?
	 * ?¨ê? ì¡°íšŒ ???¬ìš©?˜ëŠ” ì¡°ê±´??
	 */
	const [searchCondition, setSearchCondition] = useState({
		type: '1', // 1: ?ì‚¬, 2: ?¸ì£¼ (ASIS: rdIODiv.selectedValue)
		year: new Date().getFullYear().toString(), // ?„ì¬ ?„ë„ (ASIS: txtYrNm.text)
	})

	/**
	 *
	 * ???°ì´???íƒœ ê´€ë¦?
	 * ?¨ê? ?€???? œ ???¬ìš©?˜ëŠ” ?°ì´?°ë“¤
	 */
	const [formData, setFormData] = useState({
		type: '1', // 1: ?ì‚¬, 2: ?¸ì£¼
		year: new Date().getFullYear().toString(), // ?„ë„
		grade: '', // ê¸°ìˆ ?±ê¸‰ ì½”ë“œ (ASIS: cbTcnGrd.value)
		position: '', // ì§ì±… ì½”ë“œ (ASIS: cbDutyCd.value)
		price: '', // ?¨ê? (ASIS: txtUnitPrice.getValue())
	})

	/**
	 * ê·¸ë¦¬???°ì´???íƒœ ê´€ë¦?
	 * ASIS: initDG (ArrayCollection)
	 */
	const [rows, setRows] = useState<UnitPriceData[]>([])

	/**
	 * ë¡œë”© ?íƒœ ê´€ë¦?
	 * API ?¸ì¶œ ì¤??¬ìš©?ì—ê²??¼ë“œë°??œê³µ
	 */
	const [loading, setLoading] = useState(false)

	/**
	 * ? íƒ?????¸ë±??
	 * ASIS: grdUntPrc.selectedIndex
	 */
	const [selectedRow, setSelectedRow] = useState<number>(-1)

	/**
	 * ì½”ë“œ ?°ì´???íƒœ ê´€ë¦?
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const [gradeOptions, setGradeOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])
	const [positionOptions, setPositionOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])

	const { showToast, showConfirm } = useToast()

	// AG Grid ê´€??
	const gridRef = useRef<AgGridReact<UnitPriceData>>(null)

	// ì»¬ëŸ¼ ?•ì˜
	const [colDefs] = useState<ColDef[]>([
		{
			headerName: '?±ê¸‰',
			field: 'TCN_GRD_NM',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'center' },
			headerClass: 'text-center',
		},
		{
			headerName: 'ì§ì±…',
			field: 'DUTY_NM',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'center' },
			headerClass: 'text-center',
		},
		{
			headerName: '?¨ê?',
			field: 'UPRC',
			type: 'numericColumn',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'right' },
			headerClass: 'text-center',
			valueFormatter: (params) => {
				if (params.value) {
					return Number(params.value).toLocaleString() + '??
				}
				return ''
			},
		},
	])

	/**
	 * ì»´í¬?ŒíŠ¸ ì´ˆê¸°??
	 * ASIS: init() ?¨ìˆ˜?€ ?™ì¼????• 
	 */
	useEffect(() => {
		// ?˜ì´ì§€ ë¡œë“œ ??ì½”ë“œ ?°ì´??ë¡œë“œ ???ë™ ì¡°íšŒ ?¤í–‰
		const initializeData = async () => {
			await loadCodeData()
			// ì½”ë“œ ?°ì´??ë¡œë“œ ?„ë£Œ ???ë™ ì¡°íšŒ ?¤í–‰
			handleSearch()
		}
		initializeData()
	}, [])

	/**
	 * ì½”ë“œ ì¡°íšŒ ?¨ìˆ˜
	 * @param largeCategoryCode - ?€ë¶„ë¥˜ ì½”ë“œ
	 * @returns ì½”ë“œ ?°ì´??ë°°ì—´
	 */
	const fetchCodeData = async (
		largeCategoryCode: string
	): Promise<Array<{ codeId: string; codeNm: string }>> => {
		try {
			const response = await fetch('/api/code/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					largeCategoryCode: largeCategoryCode,
				}),
			})

			if (response.ok) {
				const result = await response.json()
				return result.data || []
			}
			return []
		} catch (error) {
			console.error(`ì½”ë“œ ì¡°íšŒ ?¤ë¥˜ (${largeCategoryCode}):`, error)
			return []
		}
	}

	/**
	 * ì½”ë“œ ?°ì´??ë¡œë“œ
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const loadCodeData = async () => {
		try {
			// ?±ê¸‰ ì½”ë“œ?€ ì§ì±… ì½”ë“œë¥?ë³‘ë ¬ë¡?ì¡°íšŒ
			const [gradeData, positionData] = await Promise.all([
				fetchCodeData('104'), // ?±ê¸‰ ì½”ë“œ ì¡°íšŒ
				fetchCodeData('105'), // ì§ì±… ì½”ë“œ ì¡°íšŒ
			])

			setGradeOptions(gradeData)
			setPositionOptions(positionData)
		} catch (error) {
			console.error('ì½”ë“œ ?°ì´??ë¡œë“œ ?¤ë¥˜:', error)
		}
	}

	/**
	 * ì¡°íšŒ ì¡°ê±´ ë³€ê²??¸ë“¤??
	 * ?ì‚¬/?¸ì£¼ êµ¬ë¶„, ?„ë„ ë³€ê²????¬ìš©
	 */
	const handleSearchConditionChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setSearchCondition((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * ???…ë ¥ê°?ë³€ê²??¸ë“¤??
	 * ASIS: ê°??…ë ¥ ?„ë“œ??change ?´ë²¤?¸ì? ?™ì¼
	 */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * ?±ê¸‰ë³??¨ê? ì¡°íšŒ ê¸°ëŠ¥
	 * ASIS: onSearchClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
	 *
	 * ?„ë¡œ?œì?: COM_01_0201_S(?, ?, ?)
	 * ?Œë¼ë¯¸í„°: ?ì‚¬/?¸ì£¼êµ¬ë¶„, ?„ë„
	 */
	const handleSearch = async () => {
		// ASIS: validation check
		if (!searchCondition.year) {
			showToast('?„ë„ë¥??…ë ¥?˜ì„¸??', 'warning')
			return
		}

		// ASIS: ??ì´ˆê¸°??
		setFormData((prev) => ({
			...prev,
			grade: '',
			position: '',
			price: '',
		}))
		setSelectedRow(-1)
		
		// ê·¸ë¦¬???°ì´??ì´ˆê¸°??(?´ì „ ?°ì´???œê±°)
		setRows([])

		setLoading(true)
		try {
			const response = await fetch('/api/COMZ030P00/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ownOutsDiv: searchCondition.type, // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (ì¡°íšŒì¡°ê±´ ?¬ìš©)
					year: searchCondition.year, // ?„ë„ (ì¡°íšŒì¡°ê±´ ?¬ìš©)
				}),
			})

			if (response.ok) {
				const data = await response.json()
				const newRows = data.data || []
				setRows(newRows)

				// ASIS: ì¡°íšŒ ??ì²«ë²ˆì§????´ë¦­???¨ê³¼ ì£¼ê¸° (?ˆë¡œ???°ì´??ë¡œë“œ ??
				if (newRows.length > 0) {
					// ?ˆë¡œ???°ì´?°ë? ì§ì ‘ ?„ë‹¬
					setTimeout(() => {
						setSelectedRow(0)
						handleRowClick(0, newRows[0]) // ?ˆë¡œ???°ì´??ì§ì ‘ ?„ë‹¬
					}, 100)
				}
			} else {
				showToast('ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
			}
		} catch (error) {
			console.error('ê²€???¤ë¥˜:', error)
			showToast('ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * ê·¸ë¦¬?????´ë¦­ ?´ë²¤??
	 * ASIS: onClickGrid(idx:int) ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
	 *
	 * ? íƒ???‰ì˜ ?°ì´?°ë? ?¼ì— ?ë™ ?…ë ¥
	 */
	const handleRowClick = (index: number, rowData?: UnitPriceData) => {
		setSelectedRow(index)
		// ?ˆë¡œ???°ì´?°ê? ?„ë‹¬?˜ë©´ ê·¸ê²ƒ???¬ìš©, ?†ìœ¼ë©?ê¸°ì¡´ rows?ì„œ ê°€?¸ì˜´
		const row = rowData || rows[index]
		
		if (row) {
			// ASIS: ?¼ì— ? íƒ?????°ì´???¤ì • (ê²€??ì¡°ê±´?€ ? ì?)
			setFormData((prev) => ({
				...prev, // ê¸°ì¡´ ê²€??ì¡°ê±´ ? ì? (type, year)
				type: row.OWN_OUTS_DIV, // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (?ˆë“ ê°’ì—??ê°€?¸ì˜´)
				year: row.YR, // ?„ë„ (?ˆë“ ê°’ì—??ê°€?¸ì˜´)
				grade: row.TCN_GRD, // ê¸°ìˆ ?±ê¸‰ ì½”ë“œ
				position: row.DUTY_CD, // ì§ì±… ì½”ë“œ
				price: String(row.UPRC), // ?¨ê? (ë¬¸ì?´ë¡œ ë³€??
			}))
		}
	}

	/**
	 * ?¨ê? ?€??ê¸°ëŠ¥
	 * ASIS: onSaveClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
	 *
	 * ?„ë¡œ?œì?: COM_01_0202_T(?, ?, ?, ?, ?, ?)
	 * ?Œë¼ë¯¸í„°: ?ì‚¬/?¸ì£¼êµ¬ë¶„, ?„ë„, ê¸°ìˆ ?±ê¸‰, ì§ì±…, ?¨ê?
	 */
	const handleSave = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		if (!formData.price) {
			showToast('?¨ê?ë¥??…ë ¥?˜ì„¸??', 'warning')
			return
		}

		setLoading(true)
		try {
			const response = await fetch('/api/COMZ020M00/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ownOutsDiv: formData.type, // ?ì‚¬/?¸ì£¼ êµ¬ë¶„
					year: formData.year, // ?„ë„
					tcnGrd: formData.grade, // ê¸°ìˆ ?±ê¸‰
					dutyCd: formData.position, // ì§ì±…
					unitPrice: formData.price, // ?¨ê?
				}),
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
					// ASIS: ?€???±ê³µ ??ë©”ì‹œì§€ ?œì‹œ
					showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'info')
					handleSearch() // ASIS: ?¤ì‹œ ì¡°íšŒ
					clearForm() // ASIS: ??ì´ˆê¸°??
				} else {
					// ?¤íŒ¨ ??Oracle ?ëŸ¬ ë©”ì‹œì§€ ?œì‹œ
					const errorMessage =
						data.message || data.rtn || '?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
					showToast(`?€???¤íŒ¨: ${errorMessage}`, 'error')
				}
			} else {
				showToast('?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
			}
		} catch (error) {
			console.error('?€???¤ë¥˜:', error)
			showToast('?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * ?¨ê? ?? œ ê¸°ëŠ¥
	 * ASIS: onDelClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
	 *
	 * ?„ë¡œ?œì?: COM_01_0203_D(?, ?, ?, ?, ?)
	 * ?Œë¼ë¯¸í„°: ?ì‚¬/?¸ì£¼êµ¬ë¶„, ?„ë„, ê¸°ìˆ ?±ê¸‰, ì§ì±…
	 */
	const handleDelete = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		// ASIS: ?¬ìš©???•ì¸
		showConfirm({
			message: '? íƒ????ª©???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
			type: 'warning',
			onConfirm: async () => {
				setLoading(true)
				try {
					const response = await fetch('/api/COMZ020M00/delete', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							ownOutsDiv: formData.type, // ?ì‚¬/?¸ì£¼ êµ¬ë¶„
							year: formData.year, // ?„ë„
							tcnGrd: formData.grade, // ê¸°ìˆ ?±ê¸‰
							dutyCd: formData.position, // ì§ì±…
						}),
					})

					if (response.ok) {
						const data = await response.json()
						if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
							// ASIS: ?? œ ?±ê³µ ??ë©”ì‹œì§€ ?œì‹œ
							showToast('?? œ?˜ì—ˆ?µë‹ˆ??', 'info')
							handleSearch() // ASIS: ?¤ì‹œ ì¡°íšŒ
							clearForm() // ASIS: ??ì´ˆê¸°??
						} else {
							// ?¤íŒ¨ ??Oracle ?ëŸ¬ ë©”ì‹œì§€ ?œì‹œ
							const errorMessage =
								data.message || data.rtn || '?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
							showToast(`?? œ ?¤íŒ¨: ${errorMessage}`, 'error')
						}
					} else {
						showToast('?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
					}
				} catch (error) {
					console.error('?? œ ?¤ë¥˜:', error)
					showToast('?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	/**
	 * ??ê²€ì¦??¨ìˆ˜
	 * ASIS: chkValidation():Boolean ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
	 *
	 * @returns {boolean} ê²€ì¦??µê³¼ ?¬ë?
	 */
	const validateForm = (): boolean => {
		// ASIS: ?„ë„ ?„ìˆ˜ ?…ë ¥ ì²´í¬
		if (!formData.year) {
			showToast('?„ë„ë¥??…ë ¥?˜ì„¸??', 'warning')
			return false
		}

		// ASIS: ê¸°ìˆ ?±ê¸‰ ?„ìˆ˜ ?…ë ¥ ì²´í¬
		if (!formData.grade) {
			showToast('ê¸°ìˆ ?±ê¸‰???…ë ¥?˜ì„¸??', 'warning')
			return false
		}

		// ASIS: ?ì‚¬??ê²½ìš° ì§ì±… ?„ìˆ˜ ?…ë ¥ ì²´í¬
		if (formData.type === '1' && !formData.position) {
			showToast('ì§ì±…???…ë ¥?˜ì„¸??', 'warning')
			return false
		}

		return true
	}

	/**
	 * ??ì´ˆê¸°???¨ìˆ˜
	 * ASIS: ?€???? œ ?±ê³µ ????ì´ˆê¸°?”ì? ?™ì¼
	 */
	const clearForm = () => {
		setFormData((prev) => ({
			...prev,
			grade: '',
			position: '',
			price: '',
		}))
		setSelectedRow(-1)
	}

	/**
	 * ?¤ë³´???´ë²¤??ì²˜ë¦¬ ?¨ìˆ˜
	 * ASIS: ?¤ë³´???´ë²¤??ì²˜ë¦¬?€ ?™ì¼
	 * Enter: ê²€???¤í–‰
	 */
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	/**
	 * ?…ë ¥ ?„ë“œ ?¬ì»¤?????„ì²´ ? íƒ
	 */
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select()
	}

	/**
	 * AG Grid ??? íƒ ?¸ë“¤??
	 */
	const onSelectionChanged = (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows()
		if (selectedRows.length > 0) {
			const row = selectedRows[0]
			setSelectedRow(rows.findIndex((r) => r === row))
			handleRowClick(rows.findIndex((r) => r === row))
		} else {
			setSelectedRow(-1)
		}
	}

	return (
		<div className='mdi'>
			{/* ê²€???ì—­ */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>?ì‚¬/?¸ì£¼</th>
							<td className='search-td w-[120px]'>
								<label className='mr-3'>
									<input
										type='radio'
										name='type'
										value='1'
										checked={searchCondition.type === '1'}
										onChange={handleSearchConditionChange}
										className='mr-1'
									/>
									?ì‚¬
								</label>
								<label>
									<input
										type='radio'
										name='type'
										value='2'
										checked={searchCondition.type === '2'}
										onChange={handleSearchConditionChange}
										className='mr-1'
									/>
									?¸ì£¼
								</label>
							</td>
							<th className='search-th w-[80px]'>?„ë„</th>
							<td className='search-td w-[150px]'>
								<select
									name='year'
									value={searchCondition.year}
									onChange={handleSearchConditionChange}
									onKeyDown={handleKeyDown}
									className='combo-base w-[80px] mr-2'
								>
									{(() => {
										const currentYear = new Date().getFullYear()
										const years = []
										for (let i = 0; i <= YEAR_RANGE; i++) {
											const year = currentYear - i
											years.push(
												<option key={year} value={year.toString()}>
													{year}
												</option>
											)
										}
										return years
									})()}
								</select>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search'
									onClick={handleSearch}
									disabled={loading}
								>
									{loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* ê·¸ë¦¬???ì—­ */}
			<div className='gridbox-div mb-4' style={{ height: '400px' }}>
				{loading && (
					<div className='flex items-center justify-center h-32 text-gray-500'>
						?¨ê? ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ” ì¤?..
					</div>
				)}
				{!loading && (
					<div
						className='ag-theme-alpine w-full h-full'
						style={{
							height: '100%',
							width: '100%',
							border: '1px solid #d1d5db',
							borderRadius: '6px',
							overflow: 'hidden',
						}}
					>
						<AgGridReact
							ref={gridRef}
							rowData={rows}
							columnDefs={colDefs}
							defaultColDef={{
								resizable: true,
								sortable: true,
								filter: true,
								suppressSizeToFit: false,
							}}
							rowSelection='single'
							onSelectionChanged={onSelectionChanged}
							getRowId={(params) =>
								params.data.OWN_OUTS_DIV +
								params.data.YR +
								params.data.TCN_GRD +
								params.data.DUTY_CD
							}
							domLayout='normal'
							onGridReady={(params) => {
								params.api.sizeColumnsToFit()
							}}
							// ì»¤ìŠ¤?€ ?¤ë” ì»´í¬?ŒíŠ¸ - ëª¨ë“  ?¤ë”ë¥?ê°€?´ë° ?•ë ¬ (?„ì‹œ ?¤í???
							components={{
								agColumnHeader: (props: { displayName: string }) => {
									return (
										<div style={{ textAlign: 'center', width: '100%' }}>
											{props.displayName}
										</div>
									)
								},
							}}
						/>
					</div>
				)}
			</div>

			{/* ?±ë¡ ?ì—­ */}
			<div className='mb-3'>
				<table className='form-table mb-4'>
					<tbody>
						<tr className='form-tr'>
							<th className='form-th w-[80px]'>?±ê¸‰</th>
							<td className='form-td w-[180px]'>
								<select
									name='grade'
									value={formData.grade}
									onChange={handleChange}
									className='combo-base w-full'
								>
									<option value=''>? íƒ</option>
									{gradeOptions.map((option) => (
										<option key={option.codeId} value={option.codeId}>
											{option.codeNm}
										</option>
									))}
								</select>
							</td>

							<th className='form-th w-[80px]'>ì§ì±…</th>
							<td className='form-td w-[180px]'>
								<select
									name='position'
									value={formData.position}
									onChange={handleChange}
									className='combo-base w-full'
								>
									<option value=''>? íƒ</option>
									{positionOptions.map((option) => (
										<option key={option.codeId} value={option.codeId}>
											{option.codeNm}
										</option>
									))}
								</select>
							</td>

							<th className='form-th w-[80px]'>?¨ê?</th>
							<td className='form-td w-[180px]'>
								<div className='flex items-center gap-1'>
									<input
										type='number'
										name='price'
										value={formData.price}
										onChange={handleChange}
										onFocus={handleFocus}
										className='input-base input-default w-full text-right-align'
										placeholder='0'
									/>
									<span className='m-1'>??/span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* ë²„íŠ¼ ?ì—­ */}
			<div className='flex justify-end gap-2'>
				<button
					className='btn-base btn-delete'
					onClick={handleDelete}
					disabled={loading}
				>
					?? œ
				</button>
				<button
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={loading}
				>
					?€??
				</button>
				<button
					className='btn-base btn-delete'
					onClick={() => window.history.back()}
					disabled={loading}
				>
					ì¢…ë£Œ
				</button>
			</div>
		</div>
	)
}


