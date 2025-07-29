'use client'

import React, {
	useRef,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react'
import { ColDef, ICellEditorParams } from 'ag-grid-community'
import SearchGrid from '../grid/SearchGrid'
import * as XLSX from 'xlsx'

// ?�용???�이???�??
interface User {
	id: string
	name: string
	email: string
	department: string
	position: string
	status: string
	createdAt: string
}

// ?�플 ?�이??
const sampleUsers: User[] = [
	{
		id: 'U001',
		name: '김철수',
		email: 'kim@company.com',
		department: '개발?�',
		position: '?�??,
		status: '?�성',
		createdAt: '2024-01-15',
	},
	{
		id: 'U002',
		name: '?�영??,
		email: 'lee@company.com',
		department: '?�자?��?',
		position: '?�원',
		status: '?�성',
		createdAt: '2024-02-20',
	},
	{
		id: 'U003',
		name: '박�???,
		email: 'park@company.com',
		department: '기획?�',
		position: '?��?,
		status: '비활??,
		createdAt: '2024-03-10',
	},
]

// ?�?�량 ?�플 ?�이???�성 ?�수
function generateLargeUsers(count = 50000): User[] {
	const arr: User[] = []
	for (let i = 1; i <= count; i++) {
		arr.push({
			id: `U${i.toString().padStart(5, '0')}`,
			name: `?�용??{i}`,
			email: `user${i}@company.com`,
			department: `부??{(i % 10) + 1}`,
			position: ['?�원', '?��?, '과장', '차장', '?�??][i % 5],
			status: i % 2 === 0 ? '?�성' : '비활??,
			createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
		})
	}
	return arr
}

// ?�태 컬럼??cellEditor (getValue 구현)
const StatusEditor = forwardRef((props: ICellEditorParams, ref) => {
	const [value, setValue] = useState(props.value)
	const inputRef = useRef<HTMLSelectElement>(null)
	useEffect(() => {
		setTimeout(() => inputRef.current?.focus(), 0)
	}, [])

	useImperativeHandle(ref, () => ({
		getValue: () => value,
	}))

	return (
		<select
			ref={inputRef}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			style={{ minWidth: 70 }}
			title='?�태 ?�택'
		>
			<option value='?�성'>?�성</option>
			<option value='비활??>비활??/option>
		</select>
	)
})

export default function UserGridExample() {
	const [users, setUsers] = useState<User[]>(generateLargeUsers(50000))
	const [selectedUsers, setSelectedUsers] = useState<User[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// xlsx ?�보?�기
	const handleExportXLSX = () => {
		// users 배열???��? ?�더�?변??
		const dataWithKoreanHeader = users.map((user) => {
			const row: Record<string, any> = {}
			Object.keys(user).forEach((key) => {
				if (headerMap[key]) {
					row[headerMap[key]] = (user as any)[key]
				}
			})
			return row
		})
		// ?�크?�트 ?�성
		const ws = XLSX.utils.json_to_sheet(dataWithKoreanHeader)
		// ?�크�??�성
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, '?�용?�목�?)
		// ?�일 ?�운로드
		XLSX.writeFile(wb, 'users.xlsx')
	}

	// xlsx ?�로??
	const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (evt) => {
			const data = evt.target?.result
			if (!data) return
			const workbook = XLSX.read(data, { type: 'binary' })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const json: any[] = XLSX.utils.sheet_to_json(worksheet)
			// ?��? ?�더�??�문 ?�드�?매핑
			const mapped = json.map((row) => {
				const newRow: any = {}
				Object.entries(headerMap).forEach(([field, header]) => {
					if (row[header] !== undefined) newRow[field] = row[header]
				})
				return newRow
			})
			// 기존 users??append
			setUsers((prev) => [...prev, ...mapped])
		}
		reader.readAsBinaryString(file)
		e.target.value = ''
	}

	// ??�� 버튼 ?�릭 ??
	const handleDelete = (userId: string) => {
		setUsers((prev) => prev.filter((u) => u.id !== userId))
	}

	// ?�태 컬럼???�더??
	const StatusRenderer = (props: any) => {
		const status = props.value
		const color = status === '?�성' ? '#059669' : '#dc2626'
		return <span style={{ color, fontWeight: 500 }}>{status}</span>
	}

	// ?�업 컬럼???�더????���?
	const ActionRenderer = (props: any) => {
		return (
			<button
				style={{
					padding: '4px 8px',
					background: '#ef4444',
					color: '#fff',
					fontSize: 12,
					borderRadius: 4,
					border: 'none',
					cursor: 'pointer',
				}}
				onClick={() => handleDelete(props.data.id)}
			>
				??��
			</button>
		)
	}

	// 컬럼 ?�의 (?��? ?�더 매핑??
	const columnDefs: ColDef[] = [
		{
			headerName: '?�용??ID',
			field: 'id',
			width: 120,
			sortable: true,
			filter: true,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			editable: false,
		},
		{
			headerName: '?�름',
			field: 'name',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?�메??,
			field: 'email',
			width: 200,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '부??,
			field: 'department',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '직급',
			field: 'position',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?�태',
			field: 'status',
			width: 100,
			sortable: true,
			filter: true,
			editable: true,
			cellRenderer: StatusRenderer,
			cellEditor: StatusEditor,
		},
		{
			headerName: '?�록??,
			field: 'createdAt',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?�업',
			width: 100,
			cellRenderer: ActionRenderer,
			editable: false,
		},
	]

	// ?��? ?�더 매핑??객체 ?�성
	const headerMap = columnDefs
		.filter((col) => col.field)
		.reduce(
			(acc, col) => {
				acc[col.field as string] = col.headerName
				return acc
			},
			{} as Record<string, string>
		)

	// ???�택 ?�들??
	const handleRowSelected = (selectedRows: User[]) => {
		setSelectedUsers(selectedRows)
	}

	// 그리??준�??�들??
	const handleGridReady = (params: any) => {
		// ?�요??추�? ?�업
	}

	return (
		<div className='p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>?�용??관�?/h2>
					<p className='text-gray-600'>
						?�용??목록??조회?�고 관리할 ???�습?�다.
					</p>
				</div>
				<div className='flex gap-2'>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
						onClick={handleExportXLSX}
					>
						?��? ?�보?�기
					</button>
					<label className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer'>
						?��? ?�로??
						<input
							type='file'
							accept='.xlsx, .xls'
							ref={fileInputRef}
							onChange={handleImportXLSX}
							style={{ display: 'none' }}
						/>
					</label>
				</div>
			</div>

			{/* ?�택????�� ?�보 */}
			{selectedUsers.length > 0 && (
				<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
					<p className='text-blue-800'>
						?�택???�용?? {selectedUsers.length}�?
						{selectedUsers.map((user) => user.name).join(', ')}
					</p>
				</div>
			)}

			{/* 그리??*/}
			<SearchGrid
				rowData={users}
				columnDefs={columnDefs}
				onRowSelected={handleRowSelected}
				onGridReady={handleGridReady}
				height='500px'
				searchPlaceholder='?�용?�명, ?�메?? 부?�로 검??..'
				enableExport={false} // 기존 ?�보?�기 비활?�화
			/>
		</div>
	)
}


