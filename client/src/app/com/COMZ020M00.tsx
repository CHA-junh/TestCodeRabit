'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useToast } from '@/contexts/ToastContext'
import '../common/common.css'

/**
 * 단가 데이터 인터페이스
 * ASIS COM_01_0200.mxml의 데이터 구조를 기반으로 정의
 */
interface UnitPriceData {
	OWN_OUTS_DIV: string // 자사/외주 구분 (1: 자사, 2: 외주)
	OWN_OUTS_DIV_NM: string // 구분명 (자사/외주)
	YR: string // 년도
	TCN_GRD: string // 기술등급 코드
	TCN_GRD_NM: string // 기술등급명 (초급/중급/고급)
	DUTY_CD: string // 직책 코드
	DUTY_NM: string // 직책명 (사원/대리/과장 등)
	UPRC: string // 단가 (원)
}

/**
 * 등급별 단가 등록 화면
 * ASIS: COM_01_0200.mxml → TOBE: COMZ020M00.tsx
 *
 * 주요 기능:
 * 1. 등급별 단가 조회 (COM_01_0201_S)
 * 2. 등급별 단가 등록/수정 (COM_01_0202_T)
 * 3. 등급별 단가 삭제 (COM_01_0203_D)
 */
export default function MainPage() {
	/**
	 * 년도 범위 설정
	 * 현재 년도부터 이전 N년까지의 범위를 설정
	 */
	const YEAR_RANGE = 10 // 이전 10년까지

	/**
	 * 조회 조건 상태 관리
	 * 단가 조회 시 사용하는 조건들
	 */
	const [searchCondition, setSearchCondition] = useState({
		type: '1', // 1: 자사, 2: 외주 (ASIS: rdIODiv.selectedValue)
		year: new Date().getFullYear().toString(), // 현재 년도 (ASIS: txtYrNm.text)
	})

	/**
	 *
	 * 폼 데이터 상태 관리
	 * 단가 저장/삭제 시 사용하는 데이터들
	 */
	const [formData, setFormData] = useState({
		type: '1', // 1: 자사, 2: 외주
		year: new Date().getFullYear().toString(), // 년도
		grade: '', // 기술등급 코드 (ASIS: cbTcnGrd.value)
		position: '', // 직책 코드 (ASIS: cbDutyCd.value)
		price: '', // 단가 (ASIS: txtUnitPrice.getValue())
	})

	/**
	 * 그리드 데이터 상태 관리
	 * ASIS: initDG (ArrayCollection)
	 */
	const [rows, setRows] = useState<UnitPriceData[]>([])

	/**
	 * 로딩 상태 관리
	 * API 호출 중 사용자에게 피드백 제공
	 */
	const [loading, setLoading] = useState(false)

	/**
	 * 선택된 행 인덱스
	 * ASIS: grdUntPrc.selectedIndex
	 */
	const [selectedRow, setSelectedRow] = useState<number>(-1)

	/**
	 * 코드 데이터 상태 관리
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const [gradeOptions, setGradeOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])
	const [positionOptions, setPositionOptions] = useState<
		Array<{ codeId: string; codeNm: string }>
	>([])

	const { showToast, showConfirm } = useToast()

	// AG Grid 관련
	const gridRef = useRef<AgGridReact<UnitPriceData>>(null)

	// 컬럼 정의
	const [colDefs] = useState<ColDef[]>([
		{
			headerName: '등급',
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
			headerName: '단가',
			field: 'UPRC',
			type: 'numericColumn',
			flex: 1,
			minWidth: 100,
			cellStyle: { textAlign: 'right' },
			headerClass: 'text-center',
			valueFormatter: (params) => {
				if (params.value) {
					return Number(params.value).toLocaleString() + '원'
				}
				return ''
			},
		},
	])

	/**
	 * 컴포넌트 초기화
	 * ASIS: init() 함수와 동일한 역할
	 */
	useEffect(() => {
		// 페이지 로드 시 코드 데이터 로드 후 자동 조회 실행
		const initializeData = async () => {
			await loadCodeData()
			// 코드 데이터 로드 완료 후 자동 조회 실행
			handleSearch()
		}
		initializeData()
	}, [])

	/**
	 * 코드 조회 함수
	 * @param largeCategoryCode - 대분류 코드
	 * @returns 코드 데이터 배열
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
			console.error(`코드 조회 오류 (${largeCategoryCode}):`, error)
			return []
		}
	}

	/**
	 * 코드 데이터 로드
	 * ASIS: cbTcnGrd.setLargeCode('104', ''), cbDutyCd.setLargeCode('105', '')
	 */
	const loadCodeData = async () => {
		try {
			// 등급 코드와 직책 코드를 병렬로 조회
			const [gradeData, positionData] = await Promise.all([
				fetchCodeData('104'), // 등급 코드 조회
				fetchCodeData('105'), // 직책 코드 조회
			])

			setGradeOptions(gradeData)
			setPositionOptions(positionData)
		} catch (error) {
			console.error('코드 데이터 로드 오류:', error)
		}
	}

	/**
	 * 조회 조건 변경 핸들러
	 * 자사/외주 구분, 년도 변경 시 사용
	 */
	const handleSearchConditionChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setSearchCondition((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * 폼 입력값 변경 핸들러
	 * ASIS: 각 입력 필드의 change 이벤트와 동일
	 */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	/**
	 * 등급별 단가 조회 기능
	 * ASIS: onSearchClick() 함수와 동일한 로직
	 *
	 * 프로시저: COM_01_0201_S(?, ?, ?)
	 * 파라미터: 자사/외주구분, 년도
	 */
	const handleSearch = async () => {
		// ASIS: validation check
		if (!searchCondition.year) {
			showToast('년도를 입력하세요.', 'warning')
			return
		}

		// ASIS: 폼 초기화
		setFormData((prev) => ({
			...prev,
			grade: '',
			position: '',
			price: '',
		}))
		setSelectedRow(-1)
		
		// 그리드 데이터 초기화 (이전 데이터 제거)
		setRows([])

		setLoading(true)
		try {
			const response = await fetch('/api/COMZ030P00/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ownOutsDiv: searchCondition.type, // 자사/외주 구분 (조회조건 사용)
					year: searchCondition.year, // 년도 (조회조건 사용)
				}),
			})

			if (response.ok) {
				const data = await response.json()
				const newRows = data.data || []
				setRows(newRows)

				// ASIS: 조회 후 첫번째 행 클릭한 효과 주기 (새로운 데이터 로드 후)
				if (newRows.length > 0) {
					// 새로운 데이터를 직접 전달
					setTimeout(() => {
						setSelectedRow(0)
						handleRowClick(0, newRows[0]) // 새로운 데이터 직접 전달
					}, 100)
				}
			} else {
				showToast('조회 중 오류가 발생했습니다.', 'error')
			}
		} catch (error) {
			console.error('검색 오류:', error)
			showToast('조회 중 오류가 발생했습니다.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 그리드 행 클릭 이벤트
	 * ASIS: onClickGrid(idx:int) 함수와 동일한 로직
	 *
	 * 선택된 행의 데이터를 폼에 자동 입력
	 */
	const handleRowClick = (index: number, rowData?: UnitPriceData) => {
		setSelectedRow(index)
		// 새로운 데이터가 전달되면 그것을 사용, 없으면 기존 rows에서 가져옴
		const row = rowData || rows[index]
		
		if (row) {
			// ASIS: 폼에 선택된 행 데이터 설정 (검색 조건은 유지)
			setFormData((prev) => ({
				...prev, // 기존 검색 조건 유지 (type, year)
				type: row.OWN_OUTS_DIV, // 자사/외주 구분 (히든값에서 가져옴)
				year: row.YR, // 년도 (히든값에서 가져옴)
				grade: row.TCN_GRD, // 기술등급 코드
				position: row.DUTY_CD, // 직책 코드
				price: String(row.UPRC), // 단가 (문자열로 변환)
			}))
		}
	}

	/**
	 * 단가 저장 기능
	 * ASIS: onSaveClick() 함수와 동일한 로직
	 *
	 * 프로시저: COM_01_0202_T(?, ?, ?, ?, ?, ?)
	 * 파라미터: 자사/외주구분, 년도, 기술등급, 직책, 단가
	 */
	const handleSave = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		if (!formData.price) {
			showToast('단가를 입력하세요.', 'warning')
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
					ownOutsDiv: formData.type, // 자사/외주 구분
					year: formData.year, // 년도
					tcnGrd: formData.grade, // 기술등급
					dutyCd: formData.position, // 직책
					unitPrice: formData.price, // 단가
				}),
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
					// ASIS: 저장 성공 후 메시지 표시
					showToast('저장되었습니다.', 'info')
					handleSearch() // ASIS: 다시 조회
					clearForm() // ASIS: 폼 초기화
				} else {
					// 실패 시 Oracle 에러 메시지 표시
					const errorMessage =
						data.message || data.rtn || '저장 중 오류가 발생했습니다.'
					showToast(`저장 실패: ${errorMessage}`, 'error')
				}
			} else {
				showToast('저장 중 오류가 발생했습니다.', 'error')
			}
		} catch (error) {
			console.error('저장 오류:', error)
			showToast('저장 중 오류가 발생했습니다.', 'error')
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 단가 삭제 기능
	 * ASIS: onDelClick() 함수와 동일한 로직
	 *
	 * 프로시저: COM_01_0203_D(?, ?, ?, ?, ?)
	 * 파라미터: 자사/외주구분, 년도, 기술등급, 직책
	 */
	const handleDelete = async () => {
		// ASIS: validation check
		if (!validateForm()) {
			return
		}

		// ASIS: 사용자 확인
		showConfirm({
			message: '선택한 항목을 삭제하시겠습니까?',
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
							ownOutsDiv: formData.type, // 자사/외주 구분
							year: formData.year, // 년도
							tcnGrd: formData.grade, // 기술등급
							dutyCd: formData.position, // 직책
						}),
					})

					if (response.ok) {
						const data = await response.json()
						if (data.success || data.rtn === 'SUCCESS' || data.rtn === '1') {
							// ASIS: 삭제 성공 후 메시지 표시
							showToast('삭제되었습니다.', 'info')
							handleSearch() // ASIS: 다시 조회
							clearForm() // ASIS: 폼 초기화
						} else {
							// 실패 시 Oracle 에러 메시지 표시
							const errorMessage =
								data.message || data.rtn || '삭제 중 오류가 발생했습니다.'
							showToast(`삭제 실패: ${errorMessage}`, 'error')
						}
					} else {
						showToast('삭제 중 오류가 발생했습니다.', 'error')
					}
				} catch (error) {
					console.error('삭제 오류:', error)
					showToast('삭제 중 오류가 발생했습니다.', 'error')
				} finally {
					setLoading(false)
				}
			},
		})
	}

	/**
	 * 폼 검증 함수
	 * ASIS: chkValidation():Boolean 함수와 동일한 로직
	 *
	 * @returns {boolean} 검증 통과 여부
	 */
	const validateForm = (): boolean => {
		// ASIS: 년도 필수 입력 체크
		if (!formData.year) {
			showToast('년도를 입력하세요.', 'warning')
			return false
		}

		// ASIS: 기술등급 필수 입력 체크
		if (!formData.grade) {
			showToast('기술등급을 입력하세요.', 'warning')
			return false
		}

		// ASIS: 자사인 경우 직책 필수 입력 체크
		if (formData.type === '1' && !formData.position) {
			showToast('직책을 입력하세요.', 'warning')
			return false
		}

		return true
	}

	/**
	 * 폼 초기화 함수
	 * ASIS: 저장/삭제 성공 후 폼 초기화와 동일
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
	 * 키보드 이벤트 처리 함수
	 * ASIS: 키보드 이벤트 처리와 동일
	 * Enter: 검색 실행
	 */
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	/**
	 * 입력 필드 포커스 시 전체 선택
	 */
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select()
	}

	/**
	 * AG Grid 행 선택 핸들러
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
			{/* 검색 영역 */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>자사/외주</th>
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
									자사
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
									외주
								</label>
							</td>
							<th className='search-th w-[80px]'>년도</th>
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
									{loading ? '조회중...' : '조회'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 그리드 영역 */}
			<div className='gridbox-div mb-4' style={{ height: '400px' }}>
				{loading && (
					<div className='flex items-center justify-center h-32 text-gray-500'>
						단가 목록을 불러오는 중...
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
							// 커스텀 헤더 컴포넌트 - 모든 헤더를 가운데 정렬 (임시 스타일)
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

			{/* 등록 영역 */}
			<div className='mb-3'>
				<table className='form-table mb-4'>
					<tbody>
						<tr className='form-tr'>
							<th className='form-th w-[80px]'>등급</th>
							<td className='form-td w-[180px]'>
								<select
									name='grade'
									value={formData.grade}
									onChange={handleChange}
									className='combo-base w-full'
								>
									<option value=''>선택</option>
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
									<option value=''>선택</option>
									{positionOptions.map((option) => (
										<option key={option.codeId} value={option.codeId}>
											{option.codeNm}
										</option>
									))}
								</select>
							</td>

							<th className='form-th w-[80px]'>단가</th>
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
									<span className='m-1'>원</span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 버튼 영역 */}
			<div className='flex justify-end gap-2'>
				<button
					className='btn-base btn-delete'
					onClick={handleDelete}
					disabled={loading}
				>
					삭제
				</button>
				<button
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={loading}
				>
					저장
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
