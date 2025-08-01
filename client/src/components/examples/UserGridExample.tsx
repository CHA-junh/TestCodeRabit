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

// ?¬μ©???°μ΄?????
interface User {
	id: string
	name: string
	email: string
	department: string
	position: string
	status: string
	createdAt: string
}

// ?ν ?°μ΄??
const sampleUsers: User[] = [
	{
		id: 'U001',
		name: 'κΉμ² μ',
		email: 'kim@company.com',
		department: 'κ°λ°?',
		position: '???,
		status: '?μ±',
		createdAt: '2024-01-15',
	},
	{
		id: 'U002',
		name: '?΄μ??,
		email: 'lee@company.com',
		department: '?μ?Έν?',
		position: '?¬μ',
		status: '?μ±',
		createdAt: '2024-02-20',
	},
	{
		id: 'U003',
		name: 'λ°λ???,
		email: 'park@company.com',
		department: 'κΈ°ν?',
		position: '?λ¦?,
		status: 'λΉν??,
		createdAt: '2024-03-10',
	},
]

// ??©λ ?ν ?°μ΄???μ± ?¨μ
function generateLargeUsers(count = 50000): User[] {
	const arr: User[] = []
	for (let i = 1; i <= count; i++) {
		arr.push({
			id: `U${i.toString().padStart(5, '0')}`,
			name: `?¬μ©??{i}`,
			email: `user${i}@company.com`,
			department: `λΆ??{(i % 10) + 1}`,
			position: ['?¬μ', '?λ¦?, 'κ³Όμ₯', 'μ°¨μ₯', '???][i % 5],
			status: i % 2 === 0 ? '?μ±' : 'λΉν??,
			createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
		})
	}
	return arr
}

// ?ν μ»¬λΌ??cellEditor (getValue κ΅¬ν)
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
			title='?ν ? ν'
		>
			<option value='?μ±'>?μ±</option>
			<option value='λΉν??>λΉν??/option>
		</select>
	)
})

export default function UserGridExample() {
	const [users, setUsers] = useState<User[]>(generateLargeUsers(50000))
	const [selectedUsers, setSelectedUsers] = useState<User[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// xlsx ?΄λ³΄?΄κΈ°
	const handleExportXLSX = () => {
		// users λ°°μ΄???κ? ?€λλ‘?λ³??
		const dataWithKoreanHeader = users.map((user) => {
			const row: Record<string, any> = {}
			Object.keys(user).forEach((key) => {
				if (headerMap[key]) {
					row[headerMap[key]] = (user as any)[key]
				}
			})
			return row
		})
		// ?ν¬?νΈ ?μ±
		const ws = XLSX.utils.json_to_sheet(dataWithKoreanHeader)
		// ?ν¬λΆ??μ±
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, '?¬μ©?λͺ©λ‘?)
		// ?μΌ ?€μ΄λ‘λ
		XLSX.writeFile(wb, 'users.xlsx')
	}

	// xlsx ?λ‘??
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
			// ?κ? ?€λλ₯??λ¬Έ ?λλ‘?λ§€ν
			const mapped = json.map((row) => {
				const newRow: any = {}
				Object.entries(headerMap).forEach(([field, header]) => {
					if (row[header] !== undefined) newRow[field] = row[header]
				})
				return newRow
			})
			// κΈ°μ‘΄ users??append
			setUsers((prev) => [...prev, ...mapped])
		}
		reader.readAsBinaryString(file)
		e.target.value = ''
	}

	// ??  λ²νΌ ?΄λ¦­ ??
	const handleDelete = (userId: string) => {
		setUsers((prev) => prev.filter((u) => u.id !== userId))
	}

	// ?ν μ»¬λΌ???λ??
	const StatusRenderer = (props: any) => {
		const status = props.value
		const color = status === '?μ±' ? '#059669' : '#dc2626'
		return <span style={{ color, fontWeight: 500 }}>{status}</span>
	}

	// ?μ μ»¬λΌ???λ???? λ§?
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
				?? 
			</button>
		)
	}

	// μ»¬λΌ ?μ (?κ? ?€λ λ§€ν??
	const columnDefs: ColDef[] = [
		{
			headerName: '?¬μ©??ID',
			field: 'id',
			width: 120,
			sortable: true,
			filter: true,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			editable: false,
		},
		{
			headerName: '?΄λ¦',
			field: 'name',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?΄λ©??,
			field: 'email',
			width: 200,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: 'λΆ??,
			field: 'department',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: 'μ§κΈ',
			field: 'position',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?ν',
			field: 'status',
			width: 100,
			sortable: true,
			filter: true,
			editable: true,
			cellRenderer: StatusRenderer,
			cellEditor: StatusEditor,
		},
		{
			headerName: '?±λ‘??,
			field: 'createdAt',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?μ',
			width: 100,
			cellRenderer: ActionRenderer,
			editable: false,
		},
	]

	// ?κ? ?€λ λ§€ν??κ°μ²΄ ?μ±
	const headerMap = columnDefs
		.filter((col) => col.field)
		.reduce(
			(acc, col) => {
				acc[col.field as string] = col.headerName
				return acc
			},
			{} as Record<string, string>
		)

	// ??? ν ?Έλ€??
	const handleRowSelected = (selectedRows: User[]) => {
		setSelectedUsers(selectedRows)
	}

	// κ·Έλ¦¬??μ€λΉ??Έλ€??
	const handleGridReady = (params: any) => {
		// ?μ??μΆκ? ?μ
	}

	return (
		<div className='p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>?¬μ©??κ΄λ¦?/h2>
					<p className='text-gray-600'>
						?¬μ©??λͺ©λ‘??μ‘°ν?κ³  κ΄λ¦¬ν  ???μ΅?λ€.
					</p>
				</div>
				<div className='flex gap-2'>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
						onClick={handleExportXLSX}
					>
						?μ? ?΄λ³΄?΄κΈ°
					</button>
					<label className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer'>
						?μ? ?λ‘??
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

			{/* ? ν????ͺ© ?λ³΄ */}
			{selectedUsers.length > 0 && (
				<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
					<p className='text-blue-800'>
						? ν???¬μ©?? {selectedUsers.length}λͺ?
						{selectedUsers.map((user) => user.name).join(', ')}
					</p>
				</div>
			)}

			{/* κ·Έλ¦¬??*/}
			<SearchGrid
				rowData={users}
				columnDefs={columnDefs}
				onRowSelected={handleRowSelected}
				onGridReady={handleGridReady}
				height='500px'
				searchPlaceholder='?¬μ©?λͺ, ?΄λ©?? λΆ?λ‘ κ²??..'
				enableExport={false} // κΈ°μ‘΄ ?΄λ³΄?΄κΈ° λΉν?±ν
			/>
		</div>
	)
}


