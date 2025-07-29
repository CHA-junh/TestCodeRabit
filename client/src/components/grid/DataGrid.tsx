'use client'

import React, { useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
	ColDef,
	GridOptions,
	GridReadyEvent,
	SelectionChangedEvent,
	RowDoubleClickedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

interface DataGridProps {
	rowData: any[]
	columnDefs: ColDef[]
	onRowSelected?: (selectedRows: any[]) => void
	onGridReady?: (params: GridReadyEvent) => void
	onRowDoubleClicked?: (params: RowDoubleClickedEvent) => void
	height?: string
	className?: string
	enablePagination?: boolean
	enableSorting?: boolean
	enableFiltering?: boolean
	enableSelection?: boolean
	enableExport?: boolean
}

export default function DataGrid({
	rowData,
	columnDefs,
	onRowSelected,
	onGridReady,
	onRowDoubleClicked,
	height = '600px',
	className = '',
	enablePagination = true,
	enableSorting = true,
	enableFiltering = true,
	enableSelection = true,
	enableExport = true,
}: DataGridProps) {
	// 그리???�션 ?�정
	const gridOptions: GridOptions = useMemo(
		() => ({
			// 기본 ?�정
			defaultColDef: {
				sortable: enableSorting,
				filter: enableFiltering,
				resizable: true,
				minWidth: 100,
				flex: 1,
			},

			// ?�이지?�이???�정
			pagination: enablePagination,
			paginationPageSize: 20,
			paginationPageSizeSelector: [10, 20, 50, 100],

			// ?�택 ?�정
			rowSelection: enableSelection ? 'multiple' : undefined,
			suppressRowClickSelection: !enableSelection,

			// ?�니메이??
			animateRows: true,

			// ?�구??
			tooltipShowDelay: 0,
			tooltipHideDelay: 2000,

			// ?�능 최적??
			suppressColumnVirtualisation: false,
			suppressRowVirtualisation: false,
		}),
		[enableSorting, enableFiltering, enablePagination, enableSelection]
	)

	// ???�택 ?�벤???�들??
	const onSelectionChanged = useCallback(
		(event: SelectionChangedEvent) => {
			if (onRowSelected) {
				const selectedRows = event.api.getSelectedRows()
				onRowSelected(selectedRows)
			}
		},
		[onRowSelected]
	)

	// 그리??준�??�벤???�들??
	const onGridReadyHandler = useCallback(
		(params: GridReadyEvent) => {
			if (onGridReady) {
				onGridReady(params)
			}
		},
		[onGridReady]
	)

	return (
		<div
			className={`ag-theme-alpine grid-container ${className}`}
			style={{ height }}
		>
			<AgGridReact
				rowData={rowData}
				columnDefs={columnDefs}
				gridOptions={gridOptions}
				onSelectionChanged={onSelectionChanged}
				onGridReady={onGridReadyHandler}
				onRowDoubleClicked={onRowDoubleClicked}
			/>
		</div>
	)
}



