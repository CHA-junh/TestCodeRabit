'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useToast } from '@/contexts/ToastContext'
import '../common/common.css'

/**
 * ?��? ?�이???�터?�이??
 * ASIS COM_01_0200.mxml???�이??구조�?기반?�로 ?�의
 */
interface UnitPriceData {
	OWN_OUTS_DIV: string // ?�사/?�주 구분 (1: ?�사, 2: ?�주)
	OWN_OUTS_DIV_NM: string // 구분�?(?�사/?�주)
	YR: string // ?�도
	TCN_GRD: string // 기술?�급 코드
	TCN_GRD_NM: string // 기술?�급�?(초급/중급/고급)
	DUTY_CD: string // 직책 코드
	DUTY_NM: string // 직책�?(?�원/?��?과장 ??
	UPRC: string // ?��? (??
}

/**
 * ?�급�??��? ?�록 ?�면
 * ASIS: COM_01_0200.mxml ??TOBE: COMZ020M00.tsx
 *
 * 주요 기능:
 * 1. ?�급�??��? 조회 (COM_01_0201_S)
 * 2. ?�급�??��? ?�록/?�정 (COM_01_0202_T)
 * 3. ?�급�??��? ??�� (COM_01_0203_D)
 */
export default function MainPage() {
	/**
	 * ?�도 범위 ?�정
	 * ?�재 ?�도부???�전 N?�까지??범위�??�정
	 */
	const YEAR_RANGE = 10 // ?�전 10?�까지

	/**
	 * 조회 조건 ?�태 관�?
	 * ?��? 조회 ???�용?�는 조건??
	 */
	const [searchCondition, setSearchCondition] = useState({
		type: '1', // 1: ?�사, 2: ?�주 (ASIS: rdIODiv.selectedValue)
		year: new Date().getFullYear().toString(), // ?�재 ?�도 (ASIS: txtYrNm.text)
	})

	/**
	 *
	 * ???�이???�태 관�?
	 * ?��? ?�????�� ???�용?�는 ?�이?�들
	 */
	const [formData, setFormData] = useState({
		type: '1', // 1: ?�사, 2: ?�주
		year: new Date().getFullYear().toString(), // ?�도
		grade: '', // 기술?�급 코드 (ASIS: cbTcnGrd.value)
		position: '', // 직책 코드 (ASIS: cbDutyCd.value)
		price: '', // ?��? (ASIS: txtUnitPrice.getValue())
	})

	/**
	 * 그리???�이???�태 관�?
	 * ASIS: initDG (ArrayCollection)
	 */
	const [rows, setRows] = useState<UnitPriceData[]>([])

	/**
	 * 로딩 ?�태 관�?
	 * API ?�출 �??�용?�에�??�드�??�공
	 */
	const [loading, setLoading] = useState(false)

	/**
	 * ?�택?????�덱??
	 * ASIS: grdUntPrc.selectedIndex
	 */
	const [selectedRow, setSelectedRow] = useState<number>(-1)

	/**
	 * 코드 ?�이???�태 관�?
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const [gradeOptions, setGradeOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])
	const [positionOptions, setPositionOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])

	const { showToast, showConfirm } = useToast()

	// AG Grid 관??
	const gridRef = useRef<AgGridReact<UnitPriceData>>(null)

	// 컬럼 ?�의
	const [colDefs] = useState<ColDef[]>([
		{
			headerName: '?�급',
			field: 'TCN_GRD_NM',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'center' },
			headerClass: 'text-center',
		},
		{
			headerName: '직책',
			field: 'DUTY_NM',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'center' },
			headerClass: 'text-center',
		},
		{
			headerName: '?��?',
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
	 * 컴포?�트 초기??
	 * ASIS: init() ?�수?� ?�일????��
	 */
	useEffect(() => {
		// ?�이지 로드 ??코드 ?�이??로드 ???�동 조회 ?�행
		const initializeData = async () => {
			await loadCodeData()
			// 코드 ?�이??로드 ?�료 ???�동 조회 ?�행
			handleSearch()
		}
		initializeData()
	}, [])

	/**
	 * 코드 조회 ?�수
	 * @param largeCategoryCode - ?�분류 코드
	 * @returns 코드 ?�이??배열
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
			console.error(`코드 조회 ?�류 (${largeCategoryCode}):`, error)
			return []
		}
	}

	/**
	 * 코드 ?�이??로드
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const loadCodeData = async () => {
		try {
			// ?�급 코드?� 직책 코드�?병렬�?조회
			const [gradeData, positionData] = await Promise.all([
				fetchCodeData('104'), // ?�급 코드 조회
				fetchCodeData('105'), // 직책 코드 조회
			])

			setGradeOptions(gradeData)
			setPositionOptions(positionData)
		} catch (error) {
			console.error('코드 ?�이??로드 ?�류:', error)
		}
	}

	/**
	 * 조회 조건 변�??�들??
	 * ?�사/?�주 구분, ?�도 변�????�용
	 */
	const handleSearchConditionChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setSearchCondition((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * ???�력�?변�??�들??
	 * ASIS: �??�력 ?�드??change ?�벤?��? ?�일
	 */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * ?�급�??��? 조회 기능
	 * ASIS: onSearchClick() ?�수?� ?�일??로직
	 *
	 * ?�로?��?: COM_01_0201_S(?, ?, ?)
	 * ?�라미터: ?�사/?�주구분, ?�도
	 */
	const handleSearch = async () => {
		// ASIS: validation check
		if (!searchCondition.year) {
			showToast('?�도�??�력?�세??', 'warning')
			return
		}

		// ASIS: ??초기??
		setFormData((prev) => ({
			...prev,
			grade: '',
			position: '',
			price: '',
		}))
		setSelectedRow(-1)
		
		// 그리???�이??초기??(?�전 ?�이???�거)
		setRows([])

		setLoading(true)
		try {
			const response = await fetch('/api/COMZ030P00/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ownOutsDiv: searchCondition.type, // ?�사/?�주 구분 (조회조건 ?�용)
					year: searchCondition.year, // ?�도 (조회조건 ?�용)
				}),
			})

			if (response.ok) {
				const data = await response.json()
				const newRows = data.data || []
				setRows(newRows)

				// ASIS: 조회 ??첫번�????�릭???�과 주기 (?�로???�이??로드 ??
				if (newRows.length > 0) {
					// ?�로???�이?��? 직접 ?�달
					setTimeout(() => {
						setSelectedRow(0)
						handleRowClick(0, newRows[0]) // ?�로???�이??직접 ?�달
					}, 100)
				}
			} else {
				showToast('조회 �??�류가 발생?�습?�다.', 'error')
			}
		} catch (error) {
			console.error('검???�류:', error)
			showToast('조회 �??�류가 발생?�습?�다.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 그리?????�릭 ?�벤??
	 * ASIS: onClickGrid(idx:int) ?�수?� ?�일??로직
	 *
	 * ?�택???�의 ?�이?��? ?�에 ?�동 ?�력
	 */
	const handleRowClick = (index: number, rowData?: UnitPriceData) => {
		setSelectedRow(index)
		// ?�로???�이?��? ?�달?�면 그것???�용, ?�으�?기존 rows?�서 가?�옴
		const row = rowData || rows[index]
		
		if (row) {
			// ASIS: ?�에 ?�택?????�이???�정 (검??조건?� ?��?)
			setFormData((prev) => ({
				...prev, // 기존 검??조건 ?��? (type, year)
				type: row.OWN_OUTS_DIV, // ?�사/?�주 구분 (?�든값에??가?�옴)
				year: row.YR, // ?�도 (?�든값에??가?�옴)
				grade: row.TCN_GRD, // 기술?�급 코드
				position: row.DUTY_CD, // 직책 코드
				price: String(row.UPRC), // ?��? (문자?�로 변??
			}))
		}
	}

	/**
	 * ?��? ?�??기능
	 * ASIS: onSaveClick() ?�수?� ?�일??로직
	 *
	 * ?�로?��?: COM_01_0202_T(?, ?, ?, ?, ?, ?)
	 * ?�라미터: ?�사/?�주구분, ?�도, 기술?�급, 직책, ?��?
	 */
	const handleSave = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		if (!formData.price) {
			showToast('?��?�??�력?�세??', 'warning')
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
					ownOutsDiv: formData.type, // ?�사/?�주 구분
					year: formData.year, // ?�도
					tcnGrd: formData.grade, // 기술?�급
					dutyCd: formData.position, // 직책
					unitPrice: formData.price, // ?��?
				}),
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
					// ASIS: ?�???�공 ??메시지 ?�시
					showToast('?�?�되?�습?�다.', 'info')
					handleSearch() // ASIS: ?�시 조회
					clearForm() // ASIS: ??초기??
				} else {
					// ?�패 ??Oracle ?�러 메시지 ?�시
					const errorMessage =
						data.message || data.rtn || '?�??�??�류가 발생?�습?�다.'
					showToast(`?�???�패: ${errorMessage}`, 'error')
				}
			} else {
				showToast('?�??�??�류가 발생?�습?�다.', 'error')
			}
		} catch (error) {
			console.error('?�???�류:', error)
			showToast('?�??�??�류가 발생?�습?�다.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * ?��? ??�� 기능
	 * ASIS: onDelClick() ?�수?� ?�일??로직
	 *
	 * ?�로?��?: COM_01_0203_D(?, ?, ?, ?, ?)
	 * ?�라미터: ?�사/?�주구분, ?�도, 기술?�급, 직책
	 */
	const handleDelete = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		// ASIS: ?�용???�인
		showConfirm({
			message: '?�택????��????��?�시겠습?�까?',
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
							ownOutsDiv: formData.type, // ?�사/?�주 구분
							year: formData.year, // ?�도
							tcnGrd: formData.grade, // 기술?�급
							dutyCd: formData.position, // 직책
						}),
					})

					if (response.ok) {
						const data = await response.json()
						if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
							// ASIS: ??�� ?�공 ??메시지 ?�시
							showToast('??��?�었?�니??', 'info')
							handleSearch() // ASIS: ?�시 조회
							clearForm() // ASIS: ??초기??
						} else {
							// ?�패 ??Oracle ?�러 메시지 ?�시
							const errorMessage =
								data.message || data.rtn || '??�� �??�류가 발생?�습?�다.'
							showToast(`??�� ?�패: ${errorMessage}`, 'error')
						}
					} else {
						showToast('??�� �??�류가 발생?�습?�다.', 'error')
					}
				} catch (error) {
					console.error('??�� ?�류:', error)
					showToast('??�� �??�류가 발생?�습?�다.', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	/**
	 * ??검�??�수
	 * ASIS: chkValidation():Boolean ?�수?� ?�일??로직
	 *
	 * @returns {boolean} 검�??�과 ?��?
	 */
	const validateForm = (): boolean => {
		// ASIS: ?�도 ?�수 ?�력 체크
		if (!formData.year) {
			showToast('?�도�??�력?�세??', 'warning')
			return false
		}

		// ASIS: 기술?�급 ?�수 ?�력 체크
		if (!formData.grade) {
			showToast('기술?�급???�력?�세??', 'warning')
			return false
		}

		// ASIS: ?�사??경우 직책 ?�수 ?�력 체크
		if (formData.type === '1' && !formData.position) {
			showToast('직책???�력?�세??', 'warning')
			return false
		}

		return true
	}

	/**
	 * ??초기???�수
	 * ASIS: ?�????�� ?�공 ????초기?��? ?�일
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
	 * ?�보???�벤??처리 ?�수
	 * ASIS: ?�보???�벤??처리?� ?�일
	 * Enter: 검???�행
	 */
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	/**
	 * ?�력 ?�드 ?�커?????�체 ?�택
	 */
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select()
	}

	/**
	 * AG Grid ???�택 ?�들??
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
			{/* 검???�역 */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>?�사/?�주</th>
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
									?�사
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
									?�주
								</label>
							</td>
							<th className='search-th w-[80px]'>?�도</th>
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
									{loading ? '조회�?..' : '조회'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 그리???�역 */}
			<div className='gridbox-div mb-4' style={{ height: '400px' }}>
				{loading && (
					<div className='flex items-center justify-center h-32 text-gray-500'>
						?��? 목록??불러?�는 �?..
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
							// 커스?� ?�더 컴포?�트 - 모든 ?�더�?가?�데 ?�렬 (?�시 ?��???
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

			{/* ?�록 ?�역 */}
			<div className='mb-3'>
				<table className='form-table mb-4'>
					<tbody>
						<tr className='form-tr'>
							<th className='form-th w-[80px]'>?�급</th>
							<td className='form-td w-[180px]'>
								<select
									name='grade'
									value={formData.grade}
									onChange={handleChange}
									className='combo-base w-full'
								>
									<option value=''>?�택</option>
									{gradeOptions.map((option) => (
										<option key={option.codeId} value={option.codeId}>
											{option.codeNm}
										</option>
									))}
								</select>
							</td>

							<th className='form-th w-[80px]'>직책</th>
							<td className='form-td w-[180px]'>
								<select
									name='position'
									value={formData.position}
									onChange={handleChange}
									className='combo-base w-full'
								>
									<option value=''>?�택</option>
									{positionOptions.map((option) => (
										<option key={option.codeId} value={option.codeId}>
											{option.codeNm}
										</option>
									))}
								</select>
							</td>

							<th className='form-th w-[80px]'>?��?</th>
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

			{/* 버튼 ?�역 */}
			<div className='flex justify-end gap-2'>
				<button
					className='btn-base btn-delete'
					onClick={handleDelete}
					disabled={loading}
				>
					??��
				</button>
				<button
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={loading}
				>
					?�??
				</button>
				<button
					className='btn-base btn-delete'
					onClick={() => window.history.back()}
					disabled={loading}
				>
					종료
				</button>
			</div>
		</div>
	)
}


