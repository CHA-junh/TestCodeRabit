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
 * COMZ050P00 - (???¬μλͺκ??νλ©?
 * 
 * μ£Όμ κΈ°λ₯:
 * - ?¬μλͺ?κ²??λ°?? ν
 * - μ§ν?νλ³??ν°λ§?
 * - ?°λλ³??¬μ μ‘°ν
 * - λΆλͺ¨μ°½ ?°μ΄???λ¬
 * 
 * ?°κ? ?μ΄λΈ?
 * - TBL_BSN_NO_INF (?¬μλ²νΈ ?λ³΄)
 * - TBL_BSN_SCDC (?¬μ?μ??
 */

// DB μ»¬λΌλͺ?κΈ°μ? ????μ
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
	[key: string]: any // ??λ¬Έ???Όμ© ???
}

// μ§ν?ν μ½λ ?μ
const PGRS_STATES = [
	{ code: '001', label: '? κ·' },
	{ code: '002', label: 'μ§ν' },
	{ code: '003', label: '?λ£' },
	{ code: '004', label: 'μ€λ¨' },
	{ code: '005', label: 'μ·¨μ' },
]

// API URL ?κ²½λ³??κΈ°λ° ?€μ 
const getApiUrl = () => {
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
		return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ050P00`
	}
	return '/api/COMZ050P00'
}

const getCurrentYear = () => new Date().getFullYear().toString()

const BusinessNameSearchPopup: React.FC = () => {
	// μΏΌλ¦¬?€νΈλ§??λΌλ―Έν° ?½κΈ°
	const params = useSearchParams()
	const initialBsnNm = params?.get('bsnNm') || ''
	const mode = params?.get('mode') || ''

	// AG-Grid ref
	const businessGridRef = useRef<AgGridReact<BusinessNameSearchResult>>(null);

	// AG-Grid μ»¬λΌ ?μ
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
			headerName: '?¬μλ²νΈ',
			field: 'bsnNo',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNo',
		},
		{
			headerName: '?¬μλͺ?,
			field: 'bsnNm',
			width: 320,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNm',
		},
		{
			headerName: '?μ?Όμ',
			field: 'bsnStrtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnStrtDt',
		},
		{
			headerName: 'μ’λ£?Όμ',
			field: 'bsnEndDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnEndDt',
		},
		{
			headerName: '?¬μλΆ??,
			field: 'pplsDeptNm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pplsDeptNm',
		},
		{
			headerName: '?μ???,
			field: 'bizRepnm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bizRepnm',
		},
		{
			headerName: '?€νλΆ??,
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
			headerName: '?ν',
			field: 'pgrsStDivNm',
			width: 100,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pgrsStDivNm',
		},
	]);

	// ?ν
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

	// ?Έμ?μ λ‘κ·Έ?ΈID κ°?Έμ€κΈ?(?°μ ?μ: userId > empNo > name)
	const loginId =
		session.user?.userId || session.user?.empNo || session.user?.name || ''

	// modeλ³?μ§ν?ν μ²΄ν¬λ°μ€ ?μ΄(?κ±°???Έν)
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

	// ?°λ μ½€λ³΄λ°μ€ ?°μ΄??(μ΅κ·Ό 10??+ ALL)
	useEffect(() => {
		const now = parseInt(getCurrentYear(), 10)
		const years = Array.from({ length: 10 }, (_, i) => (now - i).toString())
		setYearList(['ALL', ...years])
	}, [])

	// λͺ¨λ? ν μ²΄ν¬λ°μ€ ?Έλ€??
	const handleAllCheck = () => {
		if (allChecked) {
			setCheckedStates([])
			setAllChecked(false)
			console.log('? λͺ¨λ? ν ?΄μ :', [])
		} else {
			const allStates = PGRS_STATES.map((s) => s.code)
			setCheckedStates(allStates)
			setAllChecked(true)
			console.log('? λͺ¨λ? ν:', allStates)
		}
	}

	// κ°λ³ ?ν μ²΄ν¬λ°μ€ ?Έλ€??
	const handleStateCheck = (code: string) => {
		let next
		if (checkedStates.includes(code)) {
			next = checkedStates.filter((c) => c !== code)
			console.log('? μ²΄ν¬λ°μ€ ?΄μ :', code, '??, next)
		} else {
			next = [...checkedStates, code]
			console.log('? μ²΄ν¬λ°μ€ ? ν:', code, '??, next)
		}
		setCheckedStates(next)
		setAllChecked(next.length === PGRS_STATES.length)
	}

	// ?°λ μ½€λ³΄λ°μ€ ?Έλ€??
	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStartYear(e.target.value)
	}

	// ?¬μλͺ??λ ₯ ?Έλ€??
	const handleBsnNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBsnNm(e.target.value)
	}

	// ?ν°???Έλ€??
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// μ‘°ν λ²νΌ ?΄λ¦­
	const handleSearch = async () => {
		console.log('? κ²???μ - ?μ¬ ?ν:', {
			bsnNm,
			startYear,
			checkedStates,
			allChecked,
			loginId
		})

		// κ²??μ‘°κ±΄ validation
		if (checkedStates.length === 0) {
			showToast('μ§ν?νλ₯??λ ?΄μ ? ν?΄μ£Ό?Έμ.', 'warning')
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

			console.log('? κ²???μ²­:', searchParams)

			const res = await fetch(getApiUrl() + '/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(searchParams),
			})
			if (!res.ok) throw new Error('API ?μ²­ ?€ν¨')
			const result = await res.json()
			
			// ?λ² ?λ΅ ?μ??λ§κ² μ²λ¦¬
			if (result.success) {
				const data = result.data || []
				setData(data)
				
				console.log('? κ²??κ²°κ³Ό:', data.length, 'κ±?)
				
				// μ‘°ν κ²°κ³Ό???°λ₯Έ ? μ€??λ©μμ§ ?μ
				if (data.length === 0) {
					showToast('μ‘°ν κ²°κ³Όκ° ?μ΅?λ€.', 'info')
				} else {
					showToast(result.message || `${data.length}κ±΄μ ?¬μ??κ²?λ?μ΅?λ€.`, 'info')
				}
			} else {
				throw new Error(result.message || 'μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.')
			}
		} catch (e: any) {
			console.error('? κ²???€λ₯:', e)
			showToast(e.message || 'μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', 'error')
			setData([])
		} finally {
			setLoading(false)
		}
	}

	// μ’λ£ λ²νΌ ?Έλ€??
	const handleClose = () => {
		window.close() // ?μ ?«κΈ°(?€μ  ?κ²½??λ§κ² ?μ )
	}

	// AG-Grid μ€λΉ??λ£ ?΄λ²€??
	const onBusinessGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	// κ·Έλ¦¬???λΈ?΄λ¦­ ??λΆλͺ¨μ°½??κ°?λ°ν
	const handleRowDoubleClick = (item: BusinessNameSearchResult) => {
		if (window.opener) {
			window.opener.postMessage(
				{
					type: 'BSN_SELECT',
					payload: {
						bsnNo: item.bsnNo,
						bsnNm: item.bsnNm,
						// ?μ??μΆκ? ?λ
					},
				},
				'*'
			)
		}
		window.close()
	}

	return (
		<div className='popup-wrapper'>
			{/* ?λ¨ ?€λ */}
			<div className='popup-header'>
				<h3 className='popup-title'>?¬μλͺ?κ²??/h3>
				<button
					className='popup-close'
					type='button'
					aria-label='?μ ?«κΈ°'
					tabIndex={0}
					onClick={handleClose}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleClose()
					}}
				>
					Γ
				</button>
			</div>

			<div className='popup-body'>
				{/* κ²??μ‘°κ±΄ */}
				<div className='search-div'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[100px]'>μ§ν?ν</th>
								<td className='search-td' colSpan={7}>
									<label className='mr-2'>
										<input
											type='checkbox'
											checked={allChecked}
											onChange={handleAllCheck}
											tabIndex={0}
											aria-label='λͺ¨λ? ν'
										/>{' '}
										(λͺ¨λ? ν)
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
								<th className='search-th'>?μ?λ</th>
								<td className='search-td w-[120px]'>
									<select
										className='combo-base !w-[120px]'
										value={startYear}
										onChange={handleYearChange}
										tabIndex={0}
										aria-label='?μ?λ'
									>
										{yearList.map((y) => (
											<option key={y} value={y}>
												{y === 'ALL' ? '?μ²΄' : y}
											</option>
										))}
									</select>
								</td>
								<th className='search-th w-[110px]'>?¬μλͺ?/th>
								<td className='search-td  w-[25%]'>
									<input
										type='text'
										className='input-base input-default w-[200px]'
										value={bsnNm}
										onChange={handleBsnNmChange}
										onKeyDown={handleKeyDown}
										tabIndex={0}
										aria-label='?¬μλͺ?
									/>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search'
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

				{/* ? μ¬?¬μλͺμΉ­ */}
				<div className='clearbox-div mt-4'>
					<table className='clear-table'>
						<tbody>
							<tr className='clear-tr'>
								<th className='clear-th w-[150px]'>? μ¬ ?¬μλͺμΉ­ μ‘°νκ²°κ³Ό </th>
								<td className='clear-td'>
									<input
										type='text'
										className='input-base input-default w-[300px]'
										value={searchKey}
										readOnly
										placeholder='κ²??KEY'
										tabIndex={-1}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* κ²??κ²°κ³Ό κ·Έλ¦¬??*/}
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

				{/* μ’λ£ λ²νΌ */}
				<div className='flex justify-end mt-4'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='μ’λ£'
					>
						μ’λ£
					</button>
				</div>
			</div>
		</div>
	)
}

export default BusinessNameSearchPopup


