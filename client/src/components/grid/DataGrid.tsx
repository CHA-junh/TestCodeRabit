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
	// 그리드 옵션 설정
	const gridOptions: GridOptions = useMemo(
		() => ({
			// 기본 설정
			defaultColDef: {
				sortable: enableSorting,
				filter: enableFiltering,
				resizable: true,
				minWidth: 100,
				flex: 1,
			},

			// 페이지네이션 설정
			pagination: enablePagination,
			paginationPageSize: 20,
			paginationPageSizeSelector: [10, 20, 50, 100],

			// 선택 설정
			rowSelection: enableSelection ? 'multiple' : undefined,
			suppressRowClickSelection: !enableSelection,

			// 애니메이션
			animateRows: true,

			// 도구팁
			tooltipShowDelay: 0,
			tooltipHideDelay: 2000,

			// 성능 최적화
			suppressColumnVirtualisation: false,
			suppressRowVirtualisation: false,
		}),
		[enableSorting, enableFiltering, enablePagination, enableSelection]
	)

	// 행 선택 이벤트 핸들러
	const onSelectionChanged = useCallback(
		(event: SelectionChangedEvent) => {
			if (onRowSelected) {
				const selectedRows = event.api.getSelectedRows()
				onRowSelected(selectedRows)
			}
		},
		[onRowSelected]
	)

	// 그리드 준비 이벤트 핸들러
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
