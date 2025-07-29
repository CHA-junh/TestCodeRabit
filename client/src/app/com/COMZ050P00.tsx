'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, SelectionChangedEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '@/app/common/common.css'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { useSearchParams } from 'next/navigation'

/**
 * COMZ050P00 - (팝)사업명검색화면
 * 
 * 주요 기능:
 * - 사업명 검색 및 선택
 * - 진행상태별 필터링
 * - 연도별 사업 조회
 * - 부모창 데이터 전달
 * 
 * 연관 테이블:
 * - TBL_BSN_NO_INF (사업번호 정보)
 * - TBL_BSN_SCDC (사업품의서)
 */

// DB 컬럼명 기준 타입 정의
interface BusinessNameSearchResult {
	bsnNo: string
	bsnDiv: string
	bsnDivNm: string
	bsnNm: string
	ordPlc: string
	deptNo: string
	saleDiv: string
	saleDivNm: string
	bsnYr: string
	seqNo: string
	pgrsStDiv: string
	pgrsStDivNm: string
	bsnStrtDt: string
	bsnEndDt: string
	bizRepnm: string
	pmNm: string
	ctrDt: string
	pplsDeptNm: string
	pplsDeptCd: string
	pplsHqCd: string
	execDeptNm: string
	execDeptCd: string
	execHqCd: string
	rmk: string
	regDttm: string
	chngDttm: string
	chngrId: string
	[key: string]: any // 대소문자 혼용 대응
}

// 진행상태 코드 정의
const PGRS_STATES = [
	{ code: '001', label: '신규' },
	{ code: '002', label: '진행' },
	{ code: '003', label: '완료' },
	{ code: '004', label: '중단' },
	{ code: '005', label: '취소' },
]

// API URL 환경변수 기반 설정
const getApiUrl = () => {
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
		return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ050P00`
	}
	return '/api/COMZ050P00'
}

const getCurrentYear = () => new Date().getFullYear().toString()

const BusinessNameSearchPopup: React.FC = () => {
	// 쿼리스트링 파라미터 읽기
	const params = useSearchParams()
	const initialBsnNm = params?.get('bsnNm') || ''
	const mode = params?.get('mode') || ''

	// AG-Grid ref
	const businessGridRef = useRef<AgGridReact<BusinessNameSearchResult>>(null);

	// AG-Grid 컬럼 정의
	const [businessColDefs] = useState<ColDef[]>([
		{
			headerName: 'No',
			field: 'index',
			width: 70,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1,
		},
		{
			headerName: '사업번호',
			field: 'bsnNo',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNo',
		},
		{
			headerName: '사업명',
			field: 'bsnNm',
			width: 320,
			flex: 0.5,
			cellStyle: { textAlign: 'left' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnNm',
		},
		{
			headerName: '시작일자',
			field: 'bsnStrtDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnStrtDt',
		},
		{
			headerName: '종료일자',
			field: 'bsnEndDt',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bsnEndDt',
		},
		{
			headerName: '사업부서',
			field: 'pplsDeptNm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pplsDeptNm',
		},
		{
			headerName: '영업대표',
			field: 'bizRepnm',
			width: 120,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'bizRepnm',
		},
		{
			headerName: '실행부서',
			field: 'execDeptNm',
			width: 130,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'execDeptNm',
		},
		{
			headerName: 'PM',
			field: 'pmNm',
			width: 80,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pmNm',
		},
		{
			headerName: '상태',
			field: 'pgrsStDivNm',
			width: 100,
			flex: 0,
			cellStyle: { textAlign: 'center' },
			headerClass: 'ag-center-header',
			tooltipField: 'pgrsStDivNm',
		},
	]);

	// 상태
	const [checkedStates, setCheckedStates] = useState<string[]>(
		PGRS_STATES.map((s) => s.code)
	)
	const [allChecked, setAllChecked] = useState(true)
	const [startYear, setStartYear] = useState('ALL')
	const [yearList, setYearList] = useState<string[]>([])
	const [bsnNm, setBsnNm] = useState(initialBsnNm)
	const [searchKey, setSearchKey] = useState('')
	const [data, setData] = useState<BusinessNameSearchResult[]>([])
	const [loading, setLoading] = useState(false)
	const { session } = useAuth()
	const { showToast } = useToast()

	// 세션에서 로그인ID 가져오기 (우선순위: userId > empNo > name)
	const loginId =
		session.user?.userId || session.user?.empNo || session.user?.name || ''

	// mode별 진행상태 체크박스 제어(레거시 호환)
	useEffect(() => {
		if (!mode) return
		if (mode === 'plan') {
			setCheckedStates(['001', '002'])
			setAllChecked(false)
		} else if (mode === 'rsts') {
			setCheckedStates(['003', '004', '005'])
			setAllChecked(false)
		} else if (mode === 'mans') {
			setCheckedStates(['002', '003', '004', '005'])
			setAllChecked(false)
		} else {
			setCheckedStates(PGRS_STATES.map((s) => s.code))
			setAllChecked(true)
		}
	}, [mode])

	// 연도 콤보박스 데이터 (최근 10년 + ALL)
	useEffect(() => {
		const now = parseInt(getCurrentYear(), 10)
		const years = Array.from({ length: 10 }, (_, i) => (now - i).toString())
		setYearList(['ALL', ...years])
	}, [])

	// 모두선택 체크박스 핸들러
	const handleAllCheck = () => {
		if (allChecked) {
			setCheckedStates([])
			setAllChecked(false)
			console.log('🔄 모두선택 해제:', [])
		} else {
			const allStates = PGRS_STATES.map((s) => s.code)
			setCheckedStates(allStates)
			setAllChecked(true)
			console.log('🔄 모두선택:', allStates)
		}
	}

	// 개별 상태 체크박스 핸들러
	const handleStateCheck = (code: string) => {
		let next
		if (checkedStates.includes(code)) {
			next = checkedStates.filter((c) => c !== code)
			console.log('🔄 체크박스 해제:', code, '→', next)
		} else {
			next = [...checkedStates, code]
			console.log('🔄 체크박스 선택:', code, '→', next)
		}
		setCheckedStates(next)
		setAllChecked(next.length === PGRS_STATES.length)
	}

	// 연도 콤보박스 핸들러
	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStartYear(e.target.value)
	}

	// 사업명 입력 핸들러
	const handleBsnNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBsnNm(e.target.value)
	}

	// 엔터키 핸들러
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 조회 버튼 클릭
	const handleSearch = async () => {
		console.log('🔍 검색 시작 - 현재 상태:', {
			bsnNm,
			startYear,
			checkedStates,
			allChecked,
			loginId
		})

		// 검색 조건 validation
		if (checkedStates.length === 0) {
			showToast('진행상태를 하나 이상 선택해주세요.', 'warning')
			return
		}

		setLoading(true)
		setSearchKey(bsnNm)
		try {
			const param = {
				bsnNm: bsnNm || '',
				startYear: startYear,
				progressStateDiv: checkedStates.join(','),
				loginId: loginId
			}

			const searchParams = {
				sp: 'COM_02_0201_S(?, ?, ?, ?, ?)',
				param: JSON.stringify(param)
			}

			console.log('🔍 검색 요청:', searchParams)

			const res = await fetch(getApiUrl() + '/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(searchParams),
			})
			if (!res.ok) throw new Error('API 요청 실패')
			const result = await res.json()
			
			// 서버 응답 형식에 맞게 처리
			if (result.success) {
				const data = result.data || []
				setData(data)
				
				console.log('🔍 검색 결과:', data.length, '건')
				
				// 조회 결과에 따른 토스트 메시지 표시
				if (data.length === 0) {
					showToast('조회 결과가 없습니다.', 'info')
				} else {
					showToast(result.message || `${data.length}건의 사업이 검색되었습니다.`, 'info')
				}
			} else {
				throw new Error(result.message || '조회 중 오류가 발생했습니다.')
			}
		} catch (e: any) {
			console.error('🔍 검색 오류:', e)
			showToast(e.message || '조회 중 오류가 발생했습니다.', 'error')
			setData([])
		} finally {
			setLoading(false)
		}
	}

	// 종료 버튼 핸들러
	const handleClose = () => {
		window.close() // 팝업 닫기(실제 환경에 맞게 수정)
	}

	// AG-Grid 준비 완료 이벤트
	const onBusinessGridReady = (params: any) => {
		params.api.sizeColumnsToFit();
	};

	// 그리드 더블클릭 시 부모창에 값 반환
	const handleRowDoubleClick = (item: BusinessNameSearchResult) => {
		if (window.opener) {
			window.opener.postMessage(
				{
					type: 'BSN_SELECT',
					payload: {
						bsnNo: item.bsnNo,
						bsnNm: item.bsnNm,
						// 필요시 추가 필드
					},
				},
				'*'
			)
		}
		window.close()
	}

	return (
		<div className='popup-wrapper'>
			{/* 상단 헤더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>사업명 검색</h3>
				<button
					className='popup-close'
					type='button'
					aria-label='팝업 닫기'
					tabIndex={0}
					onClick={handleClose}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleClose()
					}}
				>
					×
				</button>
			</div>

			<div className='popup-body'>
				{/* 검색 조건 */}
				<div className='search-div'>
					<table className='search-table'>
						<tbody>
							<tr className='search-tr'>
								<th className='search-th w-[100px]'>진행상태</th>
								<td className='search-td' colSpan={7}>
									<label className='mr-2'>
										<input
											type='checkbox'
											checked={allChecked}
											onChange={handleAllCheck}
											tabIndex={0}
											aria-label='모두선택'
										/>{' '}
										(모두선택)
									</label>
									{PGRS_STATES.map((st) => (
										<label className='mr-2' key={st.code}>
											<input
												type='checkbox'
												checked={checkedStates.includes(st.code)}
												onChange={() => handleStateCheck(st.code)}
												tabIndex={0}
												aria-label={st.label}
											/>{' '}
											{st.label}
										</label>
									))}
								</td>
							</tr>
							<tr className='search-tr'>
								<th className='search-th'>시작년도</th>
								<td className='search-td w-[120px]'>
									<select
										className='combo-base !w-[120px]'
										value={startYear}
										onChange={handleYearChange}
										tabIndex={0}
										aria-label='시작년도'
									>
										{yearList.map((y) => (
											<option key={y} value={y}>
												{y === 'ALL' ? '전체' : y}
											</option>
										))}
									</select>
								</td>
								<th className='search-th w-[110px]'>사업명</th>
								<td className='search-td  w-[25%]'>
									<input
										type='text'
										className='input-base input-default w-[200px]'
										value={bsnNm}
										onChange={handleBsnNmChange}
										onKeyDown={handleKeyDown}
										tabIndex={0}
										aria-label='사업명'
									/>
								</td>
								<td className='search-td text-right' colSpan={2}>
									<button
										className='btn-base btn-search'
										onClick={handleSearch}
										tabIndex={0}
										aria-label='조회'
									>
										조회
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 유사사업명칭 */}
				<div className='clearbox-div mt-4'>
					<table className='clear-table'>
						<tbody>
							<tr className='clear-tr'>
								<th className='clear-th w-[150px]'>유사 사업명칭 조회결과 </th>
								<td className='clear-td'>
									<input
										type='text'
										className='input-base input-default w-[300px]'
										value={searchKey}
										readOnly
										placeholder='검색 KEY'
										tabIndex={-1}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* 검색 결과 그리드 */}
				<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
					<AgGridReact
						ref={businessGridRef}
						rowData={data}
						columnDefs={businessColDefs}
						defaultColDef={{
							resizable: true,
							sortable: true,
						}}
						rowSelection='single'
						onRowDoubleClicked={(event) => {
							handleRowDoubleClick(event.data);
						}}
						onGridReady={onBusinessGridReady}
						components={{
							agColumnHeader: (props: any) => (
								<div style={{ textAlign: "center", width: "100%" }}>
									{props.displayName}
								</div>
							),
						}}
					/>
				</div>

				{/* 종료 버튼 */}
				<div className='flex justify-end mt-4'>
					<button
						className='btn-base btn-delete'
						onClick={() => window.close()}
						tabIndex={0}
						aria-label='종료'
					>
						종료
					</button>
				</div>
			</div>
		</div>
	)
}

export default BusinessNameSearchPopup
