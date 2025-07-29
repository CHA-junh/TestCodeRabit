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
	searchPlaceholder = 'Í≤Ä?âÏñ¥Î•??ÖÎ†•?òÏÑ∏??..',
	enableExport = true,
}: SearchGridProps) {
	const [searchText, setSearchText] = useState('')
	const [gridApi, setGridApi] = useState<GridApi | null>(null)

	// Í≤Ä???ÑÌÑ∞Îß?
	const filteredData = useCallback(() => {
		if (!searchText) return rowData

		return rowData.filter((row) => {
			return Object.values(row).some((value) =>
				String(value).toLowerCase().includes(searchText.toLowerCase())
			)
		})
	}, [rowData, searchText])

	// Í∑∏Î¶¨??Ï§ÄÎπ??¥Î≤§??
	const handleGridReady = useCallback(
		(params: GridReadyEvent) => {
			setGridApi(params.api)
			if (onGridReady) {
				onGridReady(params)
			}
		},
		[onGridReady]
	)

	// ?ëÏ? ?¥Î≥¥?¥Í∏∞
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
			{/* Í≤Ä??Î∞??ÑÍµ¨ ?ÅÏó≠ */}
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
							?ëÏ? ?¥Î≥¥?¥Í∏∞
						</button>
					)}
				</div>
			</div>

			{/* Í∑∏Î¶¨??*/}
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


