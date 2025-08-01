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
 * COMZ060P00 - (??๋ถ?๋ฒ?ธ๊??ํ๋ฉ?
 * 
 * ์ฃผ์ ๊ธฐ๋ฅ:
 * - ๋ถ?๋ฒ??๊ฒ??๋ฐ?? ํ
 * - ๋ถ?๊ตฌ๋ถ๋ณ ?ํฐ๋ง?
 * - ?ฐ๋๋ณ?๋ถ??์กฐํ
 * - ๋ถ๋ชจ์ฐฝ ?ฐ์ด???๋ฌ
 * 
 * ?ฐ๊? ?์ด๋ธ?
 * - TBL_DEPT (๋ถ???๋ณด)
 * - TBL_DEPT_NO (๋ถ?๋ฒ??
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

	// AG-Grid ์ปฌ๋ผ ?์
	const [deptColDefs] = useState<ColDef[]>([
		{
			headerName: '๋ถ?๋ฒ??,
			field: 'deptNo',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNo',
		},
		{
			headerName: '๋ถ?๋ช',
			field: 'deptNm',
			width: 150,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNm',
		},
		{
			headerName: '?์?ผ์',
			field: 'strtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'strtDt',
		},
		{
			headerName: '์ข๋ฃ?ผ์',
			field: 'endDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'endDt',
		},
		{
			headerName: '๋ณธ๋?๊ตฌ๋ถ',
			field: 'hqDivNm',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'hqDivNm',
		},
		{
			headerName: '๋ถ?๊ตฌ๋ถ?,
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
				sp: 'COM_02_0301_S', // ?๋ก?์?๋ช?
				param: [
					form.deptNo,      // ๋ถ?๋ฒ??
					form.year,        // ?๋
					form.deptDivCd || '', // ๋ถ?๊ตฌ๋ถ์ฝ??
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
			const errorMessage = err.message || '?ค๋ฅ ๋ฐ์'
			setError(errorMessage)
			console.log('showToast called', errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setLoading(false)
		}
	}

	// ๊ทธ๋ฆฌ?????๋ธ?ด๋ฆญ ??๋ถ๋ชจ์ฐฝ??๊ฐ??๋ฌ
	const handleRowDoubleClick = (row: DeptNoSearchResult) => {
		if (window.opener) {
			window.opener.postMessage({ type: 'DEPT_SELECT', payload: row }, '*')
		}
		window.close()
	}

	// AG-Grid ์ค๋น??๋ฃ ?ด๋ฒค??
	const onDeptGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	return (
		<div className='popup-wrapper'>
			{/* ?๋จ ?ค๋ */}
			<div className='popup-header'>
				<h3 className='popup-title'>๋ถ?๋ฒ??๊ฒ??/h3>
				{/* ?ซ๊ธฐ ๋ฒํผ? ?ค์  ?์???๋๋ฏ๋ก??๋ต ?๋ ?์??๊ตฌํ */}
			</div>
			<div className='popup-body'>
				{/* ์กฐํ?์ญ */}
				<div className='search-div mb-4'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[70px]'>?๋</th>
								<td className='search-td w-[120px]'>
									<input
										type='text'
										name='year'
										className='input-base input-default w-full'
										value={form.year}
										onChange={handleChange}
										aria-label='?๋'
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>๋ถ?๋ฒ??/th>
								<td className='search-td w-[180px]'>
									<input
										type='text'
										name='deptNo'
										className='input-base input-default w-full'
										value={form.deptNo}
										onChange={handleChange}
										aria-label='๋ถ?๋ฒ??
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>๋ถ?๊ตฌ๋ถ?/th>
								<td className='search-td w-[180px]'>
									<select
										name='deptDivCd'
										className='combo-base w-full'
										value={form.deptDivCd}
										onChange={handleChange}
										aria-label='๋ถ?๊ตฌ๋ถ?
										onKeyDown={handleKeyDown}
									>
										<option value=''>?์ฒด</option>
										{deptDivCodes.map((item, idx) => {
											// @ts-ignore: DB ?๋ต???๋ฌธ์ ?์ฑ?????์
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
										aria-label='์กฐํ'
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSearch()
										}}
									>
										{loading ? '์กฐํ์ค?..' : '์กฐํ'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{/* ?๋ฌ ๋ฉ์์ง */}
				{error && <div className='text-red-600 mb-2'>{error}</div>}
				{/* ๊ทธ๋ฆฌ???์ญ */}
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
				{/* ์ข๋ฃ ๋ฒํผ (?ฐ์ธก ?๋ ฌ) */}
				<div className='flex justify-end'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='์ข๋ฃ'
					>
						์ข๋ฃ
					</button>
				</div>
			</div>
		</div>
	)
}


