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

// 사용자 데이터 타입
interface User {
	id: string
	name: string
	email: string
	department: string
	position: string
	status: string
	createdAt: string
}

// 샘플 데이터
const sampleUsers: User[] = [
	{
		id: 'U001',
		name: '김철수',
		email: 'kim@company.com',
		department: '개발팀',
		position: '팀장',
		status: '활성',
		createdAt: '2024-01-15',
	},
	{
		id: 'U002',
		name: '이영희',
		email: 'lee@company.com',
		department: '디자인팀',
		position: '사원',
		status: '활성',
		createdAt: '2024-02-20',
	},
	{
		id: 'U003',
		name: '박민수',
		email: 'park@company.com',
		department: '기획팀',
		position: '대리',
		status: '비활성',
		createdAt: '2024-03-10',
	},
]

// 대용량 샘플 데이터 생성 함수
function generateLargeUsers(count = 50000): User[] {
	const arr: User[] = []
	for (let i = 1; i <= count; i++) {
		arr.push({
			id: `U${i.toString().padStart(5, '0')}`,
			name: `사용자${i}`,
			email: `user${i}@company.com`,
			department: `부서${(i % 10) + 1}`,
			position: ['사원', '대리', '과장', '차장', '팀장'][i % 5],
			status: i % 2 === 0 ? '활성' : '비활성',
			createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
		})
	}
	return arr
}

// 상태 컬럼용 cellEditor (getValue 구현)
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
			title='상태 선택'
		>
			<option value='활성'>활성</option>
			<option value='비활성'>비활성</option>
		</select>
	)
})

export default function UserGridExample() {
	const [users, setUsers] = useState<User[]>(generateLargeUsers(50000))
	const [selectedUsers, setSelectedUsers] = useState<User[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// xlsx 내보내기
	const handleExportXLSX = () => {
		// users 배열을 한글 헤더로 변환
		const dataWithKoreanHeader = users.map((user) => {
			const row: Record<string, any> = {}
			Object.keys(user).forEach((key) => {
				if (headerMap[key]) {
					row[headerMap[key]] = (user as any)[key]
				}
			})
			return row
		})
		// 워크시트 생성
		const ws = XLSX.utils.json_to_sheet(dataWithKoreanHeader)
		// 워크북 생성
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, '사용자목록')
		// 파일 다운로드
		XLSX.writeFile(wb, 'users.xlsx')
	}

	// xlsx 업로드
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
			// 한글 헤더를 영문 필드로 매핑
			const mapped = json.map((row) => {
				const newRow: any = {}
				Object.entries(headerMap).forEach(([field, header]) => {
					if (row[header] !== undefined) newRow[field] = row[header]
				})
				return newRow
			})
			// 기존 users에 append
			setUsers((prev) => [...prev, ...mapped])
		}
		reader.readAsBinaryString(file)
		e.target.value = ''
	}

	// 삭제 버튼 클릭 시
	const handleDelete = (userId: string) => {
		setUsers((prev) => prev.filter((u) => u.id !== userId))
	}

	// 상태 컬럼용 렌더러
	const StatusRenderer = (props: any) => {
		const status = props.value
		const color = status === '활성' ? '#059669' : '#dc2626'
		return <span style={{ color, fontWeight: 500 }}>{status}</span>
	}

	// 작업 컬럼용 렌더러(삭제만)
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
				삭제
			</button>
		)
	}

	// 컬럼 정의 (한글 헤더 매핑용)
	const columnDefs: ColDef[] = [
		{
			headerName: '사용자 ID',
			field: 'id',
			width: 120,
			sortable: true,
			filter: true,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			editable: false,
		},
		{
			headerName: '이름',
			field: 'name',
			width: 150,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '이메일',
			field: 'email',
			width: 200,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '부서',
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
			headerName: '상태',
			field: 'status',
			width: 100,
			sortable: true,
			filter: true,
			editable: true,
			cellRenderer: StatusRenderer,
			cellEditor: StatusEditor,
		},
		{
			headerName: '등록일',
			field: 'createdAt',
			width: 120,
			sortable: true,
			filter: true,
			editable: true,
		},
		{
			headerName: '작업',
			width: 100,
			cellRenderer: ActionRenderer,
			editable: false,
		},
	]

	// 한글 헤더 매핑용 객체 생성
	const headerMap = columnDefs
		.filter((col) => col.field)
		.reduce(
			(acc, col) => {
				acc[col.field as string] = col.headerName
				return acc
			},
			{} as Record<string, string>
		)

	// 행 선택 핸들러
	const handleRowSelected = (selectedRows: User[]) => {
		setSelectedUsers(selectedRows)
	}

	// 그리드 준비 핸들러
	const handleGridReady = (params: any) => {
		// 필요시 추가 작업
	}

	return (
		<div className='p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>사용자 관리</h2>
					<p className='text-gray-600'>
						사용자 목록을 조회하고 관리할 수 있습니다.
					</p>
				</div>
				<div className='flex gap-2'>
					<button
						className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
						onClick={handleExportXLSX}
					>
						엑셀 내보내기
					</button>
					<label className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer'>
						엑셀 업로드
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

			{/* 선택된 항목 정보 */}
			{selectedUsers.length > 0 && (
				<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
					<p className='text-blue-800'>
						선택된 사용자: {selectedUsers.length}명
						{selectedUsers.map((user) => user.name).join(', ')}
					</p>
				</div>
			)}

			{/* 그리드 */}
			<SearchGrid
				rowData={users}
				columnDefs={columnDefs}
				onRowSelected={handleRowSelected}
				onGridReady={handleGridReady}
				height='500px'
				searchPlaceholder='사용자명, 이메일, 부서로 검색...'
				enableExport={false} // 기존 내보내기 비활성화
			/>
		</div>
	)
}
