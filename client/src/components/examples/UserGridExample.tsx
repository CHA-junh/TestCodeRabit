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

// ?¬ìš©???°ì´???€??
interface User {
	id: string
	name: string
	email: string
	department: string
	position: string
	status: string
	createdAt: string
}

// ?˜í”Œ ?°ì´??
const sampleUsers: User[] = [
	{
		id: 'U001',
		name: 'ê¹€ì² ìˆ˜',
		email: 'kim@company.com',
		department: 'ê°œë°œ?€',
		position: '?€??,
		status: '?œì„±',
		createdAt: '2024-01-15',
	},
	{
		id: 'U002',
		name: '?´ì˜??,
		email: 'lee@company.com',
		department: '?”ì?¸í?',
		position: '?¬ì›',
		status: '?œì„±',
		createdAt: '2024-02-20',
	},
	{
		id: 'U003',
		name: 'ë°•ë???,
		email: 'park@company.com',
		department: 'ê¸°íš?€',
		position: '?€ë¦?,
		status: 'ë¹„í™œ??,
		createdAt: '2024-03-10',
	},
]

// ?€?©ëŸ‰ ?˜í”Œ ?°ì´???ì„± ?¨ìˆ˜
function generateLargeUsers(count = 50000): User[] {
	const arr: User[] = []
	for (let i = 1; i <= count; i++) {
		arr.push({
			id: `U${i.toString().padStart(5, '0')}`,
			name: `?¬ìš©??{i}`,
			email: `user${i}@company.com`,
			department: `ë¶€??{(i % 10) + 1}`,
			position: ['?¬ì›', '?€ë¦?, 'ê³¼ì¥', 'ì°¨ì¥', '?€??][i % 5],
			status: i % 2 === 0 ? '?œì„±' : 'ë¹„í™œ??,
			createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
		})
	}
	return arr
}

// ?íƒœ ì»¬ëŸ¼??cellEditor (getValue êµ¬í˜„)
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
			title='?íƒœ ? íƒ'
		>
			<option value='?œì„±'>?œì„±</option>
			<option value='ë¹„í™œ??>ë¹„í™œ??/option>
		</select>
	)
})

export default function UserGridExample() {
	const [users, setUsers] = useState<User[]>(generateLargeUsers(50000))
	const [selectedUsers, setSelectedUsers] = useState<User[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// xlsx ?´ë³´?´ê¸°
	const handleExportXLSX = () => {
		// users ë°°ì—´???œê? ?¤ë”ë¡?ë³€??
		const dataWithKoreanHeader = users.map((user) => {
			const row: Record<string, any> = {}
			Object.keys(user).forEach((key) => {
				if (headerMap[key]) {
					row[headerMap[key]] = (user as any)[key]
				}
			})
			return row
		})
		// ?Œí¬?œíŠ¸ ?ì„±
		const ws = XLSX.utils.json_to_sheet(dataWithKoreanHeader)
		// ?Œí¬ë¶??ì„±
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, '?¬ìš©?ëª©ë¡?)
		// ?Œì¼ ?¤ìš´ë¡œë“œ
		XLSX.writeFile(wb, 'users.xlsx')
	}

	// xlsx ?…ë¡œ??
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
			// ?œê? ?¤ë”ë¥??ë¬¸ ?„ë“œë¡?ë§¤í•‘
			const mapped = json.map((row) => {
				const newRow: any = {}
				Object.entries(headerMap).forEach(([field, header]) => {
					if (row[header] !== undefined) newRow[field] = row[header]
				})
				return newRow
			})
			// ê¸°ì¡´ users??append
			setUsers((prev) => [...prev, ...mapped])
		}
		reader.readAsBinaryString(file)
		e.target.value = ''
	}

	// ?? œ ë²„íŠ¼ ?´ë¦­ ??
	const handleDelete = (userId: string) => {
		setUsers((prev) => prev.filter((u) => u.id !== userId))
	}

	// ?íƒœ ì»¬ëŸ¼???Œë”??
	const StatusRenderer = (props: any) => {
		const status = props.value
		const color = status === '?œì„±' ? '#059669' : '#dc2626'
		return <span style={{ color, fontWeight: 500 }}>{status}</span>
	}

	// ?‘ì—… ì»¬ëŸ¼???Œë”???? œë§?
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
				?? œ
			</button>
		)
	}

	// ì»¬ëŸ¼ ?•ì˜ (?œê? ?¤ë” ë§¤í•‘??
	const columnDefs: ColDef[] = [
		{
			headerName: '?¬ìš©??ID',
			field: 'id',
			width: 120,
			sortable: true,
			filter: true,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			editable: false,
		},
		{
			headerName: '?´ë¦„',
			field: 'name',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?´ë©”??,
			field: 'email',
			width: 200,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: 'ë¶€??,
			field: 'department',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: 'ì§ê¸‰',
			field: 'position',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?íƒœ',
			field: 'status',
			width: 100,
			sortable: true,
			filter: true,
			editable: true,
			cellRenderer: StatusRenderer,
			cellEditor: StatusEditor,
		},
		{
			headerName: '?±ë¡??,
			field: 'createdAt',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '?‘ì—…',
			width: 100,
			cellRenderer: ActionRenderer,
			editable: false,
		},
	]

	// ?œê? ?¤ë” ë§¤í•‘??ê°ì²´ ?ì„±
	const headerMap = columnDefs
		.filter((col) => col.field)
		.reduce(
			(acc, col) => {
				acc[col.field as string] = col.headerName
				return acc
			},
			{} as Record<string, string>
		)

	// ??? íƒ ?¸ë“¤??
	const handleRowSelected = (selectedRows: User[]) => {
		setSelectedUsers(selectedRows)
	}

	// ê·¸ë¦¬??ì¤€ë¹??¸ë“¤??
	const handleGridReady = (params: any) => {
		// ?„ìš”??ì¶”ê? ?‘ì—…
	}

	return (
		<div className='p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>?¬ìš©??ê´€ë¦?/h2>
					<p className='text-gray-600'>
						?¬ìš©??ëª©ë¡??ì¡°íšŒ?˜ê³  ê´€ë¦¬í•  ???ˆìŠµ?ˆë‹¤.
					</p>
				</div>
				<div className='flex gap-2'>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
						onClick={handleExportXLSX}
					>
						?‘ì? ?´ë³´?´ê¸°
					</button>
					<label className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer'>
						?‘ì? ?…ë¡œ??
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

			{/* ? íƒ????ª© ?•ë³´ */}
			{selectedUsers.length > 0 && (
				<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
					<p className='text-blue-800'>
						? íƒ???¬ìš©?? {selectedUsers.length}ëª?
						{selectedUsers.map((user) => user.name).join(', ')}
					</p>
				</div>
			)}

			{/* ê·¸ë¦¬??*/}
			<SearchGrid
				rowData={users}
				columnDefs={columnDefs}
				onRowSelected={handleRowSelected}
				onGridReady={handleGridReady}
				height='500px'
				searchPlaceholder='?¬ìš©?ëª…, ?´ë©”?? ë¶€?œë¡œ ê²€??..'
				enableExport={false} // ê¸°ì¡´ ?´ë³´?´ê¸° ë¹„í™œ?±í™”
			/>
		</div>
	)
}


