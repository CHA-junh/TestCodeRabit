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
	// ê·¸ë¦¬???µì…˜ ?¤ì •
	const gridOptions: GridOptions = useMemo(
		() => ({
			// ê¸°ë³¸ ?¤ì •
			defaultColDef: {
				sortable: enableSorting,
				filter: enableFiltering,
				resizable: true,
				minWidth: 100,
				flex: 1,
			},

			// ?˜ì´ì§€?¤ì´???¤ì •
			pagination: enablePagination,
			paginationPageSize: 20,
			paginationPageSizeSelector: [10, 20, 50, 100],

			// ? íƒ ?¤ì •
			rowSelection: enableSelection ? 'multiple' : undefined,
			suppressRowClickSelection: !enableSelection,

			// ? ë‹ˆë©”ì´??
			animateRows: true,

			// ?„êµ¬??
			tooltipShowDelay: 0,
			tooltipHideDelay: 2000,

			// ?±ëŠ¥ ìµœì ??
			suppressColumnVirtualisation: false,
			suppressRowVirtualisation: false,
		}),
		[enableSorting, enableFiltering, enablePagination, enableSelection]
	)

	// ??? íƒ ?´ë²¤???¸ë“¤??
	const onSelectionChanged = useCallback(
		(event: SelectionChangedEvent) => {
			if (onRowSelected) {
				const selectedRows = event.api.getSelectedRows()
				onRowSelected(selectedRows)
			}
		},
		[onRowSelected]
	)

	// ê·¸ë¦¬??ì¤€ë¹??´ë²¤???¸ë“¤??
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



