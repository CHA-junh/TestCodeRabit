'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '@/app/common/common.css'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { useSearchParams } from 'next/navigation'

/**
 * COMZ050P00 - (???�업명�??�화�?
 * 
 * 주요 기능:
 * - ?�업�?검??�??�택
 * - 진행?�태�??�터�?
 * - ?�도�??�업 조회
 * - 부모창 ?�이???�달
 * 
 * ?��? ?�이�?
 * - TBL_BSN_NO_INF (?�업번호 ?�보)
 * - TBL_BSN_SCDC (?�업?�의??
 */

// DB 컬럼�?기�? ?�???�의
interface BusinessNameSearchResult {
	bsnNo: string
	bsnDiv: string
	bsnDivNm: string
	bsnNm: string
	ordPlc: string
	deptNo: string
	saleDiv: string
	saleDivNm: string
	bsnYr: string
	seqNo: string
	pgrsStDiv: string
	pgrsStDivNm: string
	bsnStrtDt: string
	bsnEndDt: string
	bizRepnm: string
	pmNm: string
	ctrDt: string
	pplsDeptNm: string
	pplsDeptCd: string
	pplsHqCd: string
	execDeptNm: string
	execDeptCd: string
	execHqCd: string
	rmk: string
	regDttm: string
	chngDttm: string
	chngrId: string
	[key: string]: any // ?�?�문???�용 ?�??
}

// 진행?�태 코드 ?�의
const PGRS_STATES = [
	{ code: '001', label: '?�규' },
	{ code: '002', label: '진행' },
	{ code: '003', label: '?�료' },
	{ code: '004', label: '중단' },
	{ code: '005', label: '취소' },
]

// API URL ?�경변??기반 ?�정
const getApiUrl = () => {
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
		return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ050P00`
	}
	return '/api/COMZ050P00'
}

const getCurrentYear = () => new Date().getFullYear().toString()

const BusinessNameSearchPopup: React.FC = () => {
	// 쿼리?�트�??�라미터 ?�기
	const params = useSearchParams()
	const initialBsnNm = params?.get('bsnNm') || ''
	const mode = params?.get('mode') || ''

	// AG-Grid ref
	const businessGridRef = useRef<AgGridReact<BusinessNameSearchResult>>(null);

	// AG-Grid 컬럼 ?�의
	const [businessColDefs] = useState<ColDef[]>([
		{
			headerName: 'No',
			field: 'index',
			width: 70,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1,
		},
		{
			headerName: '?�업번호',
			field: 'bsnNo',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNo',
		},
		{
			headerName: '?�업�?,
			field: 'bsnNm',
			width: 320,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNm',
		},
		{
			headerName: '?�작?�자',
			field: 'bsnStrtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnStrtDt',
		},
		{
			headerName: '종료?�자',
			field: 'bsnEndDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnEndDt',
		},
		{
			headerName: '?�업부??,
			field: 'pplsDeptNm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pplsDeptNm',
		},
		{
			headerName: '?�업?�??,
			field: 'bizRepnm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bizRepnm',
		},
		{
			headerName: '?�행부??,
			field: 'execDeptNm',
			width: 130,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'execDeptNm',
		},
		{
			headerName: 'PM',
			field: 'pmNm',
			width: 80,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pmNm',
		},
		{
			headerName: '?�태',
			field: 'pgrsStDivNm',
			width: 100,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pgrsStDivNm',
		},
	]);

	// ?�태
	const [checkedStates, setCheckedStates] = useState<string[]>(
		PGRS_STATES.map((s) => s.code)
	)
	const [allChecked, setAllChecked] = useState(true)
	const [startYear, setStartYear] = useState('ALL')
	const [yearList, setYearList] = useState<string[]>([])
	const [bsnNm, setBsnNm] = useState(initialBsnNm)
	const [searchKey, setSearchKey] = useState('')
	const [data, setData] = useState<BusinessNameSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const { session } = useAuth()
	const { showToast } = useToast()

	// ?�션?�서 로그?�ID 가?�오�?(?�선?�위: userId > empNo > name)
	const loginId =
		session.user?.userId || session.user?.empNo || session.user?.name || ''

	// mode�?진행?�태 체크박스 ?�어(?�거???�환)
	useEffect(() => {
		if (!mode) return
		if (mode === 'plan') {
			setCheckedStates(['001', '002'])
			setAllChecked(false)
		} else if (mode === 'rsts') {
			setCheckedStates(['003', '004', '005'])
			setAllChecked(false)
		} else if (mode === 'mans') {
			setCheckedStates(['002', '003', '004', '005'])
			setAllChecked(false)
		} else {
			setCheckedStates(PGRS_STATES.map((s) => s.code))
			setAllChecked(true)
		}
	}, [mode])

	// ?�도 콤보박스 ?�이??(최근 10??+ ALL)
	useEffect(() => {
		const now = parseInt(getCurrentYear(), 10)
		const years = Array.from({ length: 10 }, (_, i) => (now - i).toString())
		setYearList(['ALL', ...years])
	}, [])

	// 모두?�택 체크박스 ?�들??
	const handleAllCheck = () => {
		if (allChecked) {
			setCheckedStates([])
			setAllChecked(false)
			console.log('?�� 모두?�택 ?�제:', [])
		} else {
			const allStates = PGRS_STATES.map((s) => s.code)
			setCheckedStates(allStates)
			setAllChecked(true)
			console.log('?�� 모두?�택:', allStates)
		}
	}

	// 개별 ?�태 체크박스 ?�들??
	const handleStateCheck = (code: string) => {
		let next
		if (checkedStates.includes(code)) {
			next = checkedStates.filter((c) => c !== code)
			console.log('?�� 체크박스 ?�제:', code, '??, next)
		} else {
			next = [...checkedStates, code]
			console.log('?�� 체크박스 ?�택:', code, '??, next)
		}
		setCheckedStates(next)
		setAllChecked(next.length === PGRS_STATES.length)
	}

	// ?�도 콤보박스 ?�들??
	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStartYear(e.target.value)
	}

	// ?�업�??�력 ?�들??
	const handleBsnNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBsnNm(e.target.value)
	}

	// ?�터???�들??
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 조회 버튼 ?�릭
	const handleSearch = async () => {
		console.log('?�� 검???�작 - ?�재 ?�태:', {
			bsnNm,
			startYear,
			checkedStates,
			allChecked,
			loginId
		})

		// 검??조건 validation
		if (checkedStates.length === 0) {
			showToast('진행?�태�??�나 ?�상 ?�택?�주?�요.', 'warning')
			return
		}

		setLoading(true)
		setSearchKey(bsnNm)
		try {
			const param = {
				bsnNm: bsnNm || '',
				startYear: startYear,
				progressStateDiv: checkedStates.join(','),
				loginId: loginId
			}

			const searchParams = {
				sp: 'COM_02_0201_S(?, ?, ?, ?, ?)',
				param: JSON.stringify(param)
			}

			console.log('?�� 검???�청:', searchParams)

			const res = await fetch(getApiUrl() + '/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(searchParams),
			})
			if (!res.ok) throw new Error('API ?�청 ?�패')
			const result = await res.json()
			
			// ?�버 ?�답 ?�식??맞게 처리
			if (result.success) {
				const data = result.data || []
				setData(data)
				
				console.log('?�� 검??결과:', data.length, '�?)
				
				// 조회 결과???�른 ?�스??메시지 ?�시
				if (data.length === 0) {
					showToast('조회 결과가 ?�습?�다.', 'info')
				} else {
					showToast(result.message || `${data.length}건의 ?�업??검?�되?�습?�다.`, 'info')
				}
			} else {
				throw new Error(result.message || '조회 �??�류가 발생?�습?�다.')
			}
		} catch (e: any) {
			console.error('?�� 검???�류:', e)
			showToast(e.message || '조회 �??�류가 발생?�습?�다.', 'error')
			setData([])
		} finally {
			setLoading(false)
		}
	}

	// 종료 버튼 ?�들??
	const handleClose = () => {
		window.close() // ?�업 ?�기(?�제 ?�경??맞게 ?�정)
	}

	// AG-Grid 준�??�료 ?�벤??
	const onBusinessGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	// 그리???�블?�릭 ??부모창??�?반환
	const handleRowDoubleClick = (item: BusinessNameSearchResult) => {
		if (window.opener) {
			window.opener.postMessage(
				{
					type: 'BSN_SELECT',
					payload: {
						bsnNo: item.bsnNo,
						bsnNm: item.bsnNm,
						// ?�요??추�? ?�드
					},
				},
				'*'
			)
		}
		window.close()
	}

	return (
		<div className='popup-wrapper'>
			{/* ?�단 ?�더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>?�업�?검??/h3>
				<button
					className='popup-close'
					type='button'
					aria-label='?�업 ?�기'
					tabIndex={0}
					onClick={handleClose}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleClose()
					}}
				>
					×
				</button>
			</div>

			<div className='popup-body'>
				{/* 검??조건 */}
				<div className='search-div'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[100px]'>진행?�태</th>
								<td className='search-td' colSpan={7}>
									<label className='mr-2'>
										<input
											type='checkbox'
											checked={allChecked}
											onChange={handleAllCheck}
											tabIndex={0}
											aria-label='모두?�택'
										/>{' '}
										(모두?�택)
									</label>
									{PGRS_STATES.map((st) => (
										<label className='mr-2' key={st.code}>
											<input
												type='checkbox'
												checked={checkedStates.includes(st.code)}
												onChange={() => handleStateCheck(st.code)}
												tabIndex={0}
												aria-label={st.label}
											/>{' '}
											{st.label}
										</label>
									))}
								</td>
							</tr>
							<tr className='search-tr'>
								<th className='search-th'>?�작?�도</th>
								<td className='search-td w-[120px]'>
									<select
										className='combo-base !w-[120px]'
										value={startYear}
										onChange={handleYearChange}
										tabIndex={0}
										aria-label='?�작?�도'
									>
										{yearList.map((y) => (
											<option key={y} value={y}>
												{y === 'ALL' ? '?�체' : y}
											</option>
										))}
									</select>
								</td>
								<th className='search-th w-[110px]'>?�업�?/th>
								<td className='search-td  w-[25%]'>
									<input
										type='text'
										className='input-base input-default w-[200px]'
										value={bsnNm}
										onChange={handleBsnNmChange}
										onKeyDown={handleKeyDown}
										tabIndex={0}
										aria-label='?�업�?
									/>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search'
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

				{/* ?�사?�업명칭 */}
				<div className='clearbox-div mt-4'>
					<table className='clear-table'>
						<tbody>
							<tr className='clear-tr'>
								<th className='clear-th w-[150px]'>?�사 ?�업명칭 조회결과 </th>
								<td className='clear-td'>
									<input
										type='text'
										className='input-base input-default w-[300px]'
										value={searchKey}
										readOnly
										placeholder='검??KEY'
										tabIndex={-1}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 검??결과 그리??*/}
				<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
					<AgGridReact
						ref={businessGridRef}
						rowData={data}
						columnDefs={businessColDefs}
						defaultColDef={{
							resizable: true,
							sortable: true,
						}}
						rowSelection='single'
						onRowDoubleClicked={(event) => {
							handleRowDoubleClick(event.data);
						}}
						onGridReady={onBusinessGridReady}
						components={{
							agColumnHeader: (props: any) => (
								<div style={{ textAlign: "center", width: "100%" }}>
									{props.displayName}
								</div>
							),
						}}
					/>
				</div>

				{/* 종료 버튼 */}
				<div className='flex justify-end mt-4'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='종료'
					>
						종료
					</button>
				</div>
			</div>
		</div>
	)
}

export default BusinessNameSearchPopup


