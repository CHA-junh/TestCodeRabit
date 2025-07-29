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
 * COMZ060P00 - (??ë¶€?œë²ˆ?¸ê??‰í™”ë©?
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ë¶€?œë²ˆ??ê²€??ë°?? íƒ
 * - ë¶€?œêµ¬ë¶„ë³„ ?„í„°ë§?
 * - ?°ë„ë³?ë¶€??ì¡°íšŒ
 * - ë¶€ëª¨ì°½ ?°ì´???„ë‹¬
 * 
 * ?°ê? ?Œì´ë¸?
 * - TBL_DEPT (ë¶€???•ë³´)
 * - TBL_DEPT_NO (ë¶€?œë²ˆ??
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

	// AG-Grid ì»¬ëŸ¼ ?•ì˜
	const [deptColDefs] = useState<ColDef[]>([
		{
			headerName: 'ë¶€?œë²ˆ??,
			field: 'deptNo',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNo',
		},
		{
			headerName: 'ë¶€?œëª…',
			field: 'deptNm',
			width: 150,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'deptNm',
		},
		{
			headerName: '?œì‘?¼ì',
			field: 'strtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'strtDt',
		},
		{
			headerName: 'ì¢…ë£Œ?¼ì',
			field: 'endDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'endDt',
		},
		{
			headerName: 'ë³¸ë?êµ¬ë¶„',
			field: 'hqDivNm',
			width: 120,
			flex: 0.5,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'hqDivNm',
		},
		{
			headerName: 'ë¶€?œêµ¬ë¶?,
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
				sp: 'COM_02_0301_S', // ?„ë¡œ?œì?ëª?
				param: [
					form.deptNo,      // ë¶€?œë²ˆ??
					form.year,        // ?„ë„
					form.deptDivCd || '', // ë¶€?œêµ¬ë¶„ì½”??
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
			const errorMessage = err.message || '?¤ë¥˜ ë°œìƒ'
			setError(errorMessage)
			console.log('showToast called', errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setLoading(false)
		}
	}

	// ê·¸ë¦¬?????”ë¸”?´ë¦­ ??ë¶€ëª¨ì°½??ê°??„ë‹¬
	const handleRowDoubleClick = (row: DeptNoSearchResult) => {
		if (window.opener) {
			window.opener.postMessage({ type: 'DEPT_SELECT', payload: row }, '*')
		}
		window.close()
	}

	// AG-Grid ì¤€ë¹??„ë£Œ ?´ë²¤??
	const onDeptGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	return (
		<div className='popup-wrapper'>
			{/* ?ë‹¨ ?¤ë” */}
			<div className='popup-header'>
				<h3 className='popup-title'>ë¶€?œë²ˆ??ê²€??/h3>
				{/* ?«ê¸° ë²„íŠ¼?€ ?¤ì œ ?ì—…???„ë‹ˆë¯€ë¡??ëµ ?ëŠ” ?„ìš”??êµ¬í˜„ */}
			</div>
			<div className='popup-body'>
				{/* ì¡°íšŒ?ì—­ */}
				<div className='search-div mb-4'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[70px]'>?„ë„</th>
								<td className='search-td w-[120px]'>
									<input
										type='text'
										name='year'
										className='input-base input-default w-full'
										value={form.year}
										onChange={handleChange}
										aria-label='?„ë„'
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>ë¶€?œë²ˆ??/th>
								<td className='search-td w-[180px]'>
									<input
										type='text'
										name='deptNo'
										className='input-base input-default w-full'
										value={form.deptNo}
										onChange={handleChange}
										aria-label='ë¶€?œë²ˆ??
										onKeyDown={handleKeyDown}
									/>
								</td>
								<th className='search-th w-[92px]'>ë¶€?œêµ¬ë¶?/th>
								<td className='search-td w-[180px]'>
									<select
										name='deptDivCd'
										className='combo-base w-full'
										value={form.deptDivCd}
										onChange={handleChange}
										aria-label='ë¶€?œêµ¬ë¶?
										onKeyDown={handleKeyDown}
									>
										<option value=''>?„ì²´</option>
										{deptDivCodes.map((item, idx) => {
											// @ts-ignore: DB ?‘ë‹µ???€ë¬¸ì ?ì„±?????ˆìŒ
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
										aria-label='ì¡°íšŒ'
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSearch()
										}}
									>
										{loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{/* ?ëŸ¬ ë©”ì‹œì§€ */}
				{error && <div className='text-red-600 mb-2'>{error}</div>}
				{/* ê·¸ë¦¬???ì—­ */}
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
				{/* ì¢…ë£Œ ë²„íŠ¼ (?°ì¸¡ ?•ë ¬) */}
				<div className='flex justify-end'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='ì¢…ë£Œ'
					>
						ì¢…ë£Œ
					</button>
				</div>
			</div>
		</div>
	)
}


