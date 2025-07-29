'use client'
import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useDeptDivCodes } from '@/modules/auth/hooks/useCommonCodes'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import '@/app/common/common.css'

/**
 * COMZ060P00 - (??부?�번?��??�화�?
 * 
 * 주요 기능:
 * - 부?�번??검??�??�택
 * - 부?�구분별 ?�터�?
 * - ?�도�?부??조회
 * - 부모창 ?�이???�달
 * 
 * ?��? ?�이�?
 * - TBL_DEPT (부???�보)
 * - TBL_DEPT_NO (부?�번??
 */

interface DeptNoSearchResult {
	deptNo: string
	deptNm: string
	strtDt: string
	endDt: string
	deptDivCd: string
	deptDivNm: string
	hqDivCd: string
	hqDivNm: string
	bsnDeptKb: string
}

const apiUrl =
	typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
		? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ060P00`
		: '/api/COMZ060P00'

export default function DeptNumberSearchPopup() {
	const params = useSearchParams()
	const initialDeptNo = params?.get('deptNo') || ''
	const { showToast } = useToast()
	
	// AG-Grid ref
	const deptGridRef = useRef<AgGridReact<DeptNoSearchResult>>(null);

	// AG-Grid 컬럼 ?�의
	const [deptColDefs] = useState<ColDef[]>([
		{
			headerName: '부?�번??,
			field: 'deptNo',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNo',
		},
		{
			headerName: '부?�명',
			field: 'deptNm',
			width: 150,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNm',
		},
		{
			headerName: '?�작?�자',
			field: 'strtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'strtDt',
		},
		{
			headerName: '종료?�자',
			field: 'endDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'endDt',
		},
		{
			headerName: '본�?구분',
			field: 'hqDivNm',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'hqDivNm',
		},
		{
			headerName: '부?�구�?,
			field: 'deptDivNm',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptDivNm',
		},
	]);

	const [form, setForm] = useState({
		deptNo: initialDeptNo,
		year: new Date().getFullYear().toString(),
		deptDivCd: '',
	})
	const [results, setResults] = useState<DeptNoSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const deptDivCodes = useDeptDivCodes()

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	const handleSearch = async () => {
		setLoading(true)
		setError('')
		setResults([])
		try {
			const requestBody = {
				sp: 'COM_02_0301_S', // ?�로?��?�?
				param: [
					form.deptNo,      // 부?�번??
					form.year,        // ?�도
					form.deptDivCd || '', // 부?�구분코??
				]
			}
			
			const res = await fetch(apiUrl + '/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			console.log('fetch response:', res)
			console.log('res.ok:', res.ok, 'res.status:', res.status, 'res.statusText:', res.statusText)
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			
			const data = await res.json()
			const results = Array.isArray(data) ? data : (data.data ?? [])
			setResults(results)
		} catch (err: any) {
			const errorMessage = err.message || '?�류 발생'
			setError(errorMessage)
			console.log('showToast called', errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setLoading(false)
		}
	}

	// 그리?????�블?�릭 ??부모창??�??�달
	const handleRowDoubleClick = (row: DeptNoSearchResult) => {
		if (window.opener) {
			window.opener.postMessage({ type: 'DEPT_SELECT', payload: row }, '*')
		}
		window.close()
	}

	// AG-Grid 준�??�료 ?�벤??
	const onDeptGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	return (
		<div className='popup-wrapper'>
			{/* ?�단 ?�더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>부?�번??검??/h3>
				{/* ?�기 버튼?� ?�제 ?�업???�니므�??�략 ?�는 ?�요??구현 */}
			</div>
			<div className='popup-body'>
				{/* 조회?�역 */}
				<div className='search-div mb-4'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[70px]'>?�도</th>
								<td className='search-td w-[120px]'>
									<input
										type='text'
										name='year'
										className='input-base input-default w-full'
										value={form.year}
										onChange={handleChange}
										aria-label='?�도'
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>부?�번??/th>
								<td className='search-td w-[180px]'>
									<input
										type='text'
										name='deptNo'
										className='input-base input-default w-full'
										value={form.deptNo}
										onChange={handleChange}
										aria-label='부?�번??
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>부?�구�?/th>
								<td className='search-td w-[180px]'>
									<select
										name='deptDivCd'
										className='combo-base w-full'
										value={form.deptDivCd}
										onChange={handleChange}
										aria-label='부?�구�?
										onKeyDown={handleKeyDown}
									>
										<option value=''>?�체</option>
										{deptDivCodes.map((item, idx) => {
											// @ts-ignore: DB ?�답???�문자 ?�성?????�음
											const code = item.code || item.CODE
											// @ts-ignore
											const name = item.name || item.NAME
											return (
												<option key={code || idx} value={code}>
													{name}
												</option>
											)
										})}
									</select>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search mr-2'
										onClick={handleSearch}
										tabIndex={0}
										aria-label='조회'
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSearch()
										}}
									>
										{loading ? '조회�?..' : '조회'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{/* ?�러 메시지 */}
				{error && <div className='text-red-600 mb-2'>{error}</div>}
				{/* 그리???�역 */}
				<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
					<AgGridReact
						ref={deptGridRef}
						rowData={results}
						columnDefs={deptColDefs}
						defaultColDef={{
							resizable: true,
							sortable: true,
						}}
						rowSelection='single'
						onRowDoubleClicked={(event) => {
							handleRowDoubleClick(event.data);
						}}
						onGridReady={onDeptGridReady}
						components={{
							agColumnHeader: (props: any) => (
								<div style={{ textAlign: "center", width: "100%" }}>
									{props.displayName}
								</div>
							),
						}}
					/>
				</div>
				{/* 종료 버튼 (?�측 ?�렬) */}
				<div className='flex justify-end'>
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


