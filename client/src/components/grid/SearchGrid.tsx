'use client'

import React, { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community'
import DataGrid from './DataGrid'

interface SearchGridProps {
	rowData: any[]
	columnDefs: ColDef[]
	onRowSelected?: (selectedRows: any[]) => void
	onGridReady?: (params: GridReadyEvent) => void
	height?: string
	className?: string
	searchPlaceholder?: string
	enableExport?: boolean
}

export default function SearchGrid({
	rowData,
	columnDefs,
	onRowSelected,
	onGridReady,
	height = '600px',
	className = '',
	searchPlaceholder = '검색어를 입력하세요...',
	enableExport = true,
}: SearchGridProps) {
	const [searchText, setSearchText] = useState('')
	const [gridApi, setGridApi] = useState<GridApi | null>(null)

	// 검색 필터링
	const filteredData = useCallback(() => {
		if (!searchText) return rowData

		return rowData.filter((row) => {
			return Object.values(row).some((value) =>
				String(value).toLowerCase().includes(searchText.toLowerCase())
			)
		})
	}, [rowData, searchText])

	// 그리드 준비 이벤트
	const handleGridReady = useCallback(
		(params: GridReadyEvent) => {
			setGridApi(params.api)
			if (onGridReady) {
				onGridReady(params)
			}
		},
		[onGridReady]
	)

	// 엑셀 내보내기
	const handleExport = useCallback(() => {
		if (gridApi) {
			gridApi.exportDataAsCsv({
				fileName: 'export.csv',
				processCellCallback: (params) => {
					return params.value
				},
			})
		}
	}, [gridApi])

	return (
		<div className={`space-y-4 ${className}`}>
			{/* 검색 및 도구 영역 */}
			<div className='flex justify-between items-center'>
				<div className='flex-1 max-w-md'>
					<input
						type='text'
						placeholder={searchPlaceholder}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
				</div>

				<div className='flex space-x-2'>
					{enableExport && (
						<button
							onClick={handleExport}
							className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
						>
							엑셀 내보내기
						</button>
					)}
				</div>
			</div>

			{/* 그리드 */}
			<div style={{ height }}>
				<DataGrid
					rowData={filteredData()}
					columnDefs={columnDefs}
					onRowSelected={onRowSelected}
					onGridReady={handleGridReady}
					height='100%'
					enablePagination={true}
					enableSorting={true}
					enableFiltering={true}
					enableSelection={true}
				/>
			</div>
		</div>
	)
}
