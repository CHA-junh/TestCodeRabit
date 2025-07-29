'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
	ColDef,
	GridApi,
	GridReadyEvent,
	PaginationChangedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useToast } from '@/contexts/ToastContext'
import '../common/common.css'
import PSM1020M00, { PSM1020M00Ref } from './PSM1020M00'
import PSM1030M00, { PSM1030M00Ref } from './PSM1030M00'
import PSM1040M00 from './PSM1040M00'
import PSM0050M00 from './PSM0050M00'

/**
 * AS-IS PSM_01_0100.mxml???�원 리스???�이??구조
 * PSM_01_0101_S ?�로?��??�서 반환?�는 ?�이?��? ?�일??구조
 */
interface EmployeeListData {
	LIST_NO?: string // ?�번
	EMP_NO?: string // ?�원번호
	OWN_OUTS_DIV?: string // ?�사/?�주 구분�?
	OWN_OUTS_DIV_CD?: string // ?�사/?�주 구분코드 (1:?�사, 2:?�주)
	EMP_NM?: string // ?�원�?
	DUTY?: string // 직책�?
	DUTY_CD?: string // 직책코드
	HQ_DIV?: string // 본�?�?
	HQ_DIV_CD?: string // 본�?코드
	DEPT_DIV?: string // 부?�명
	DEPT_DIV_CD?: string // 부?�코??
	CRPN_NM?: string // ?�체�?(?�주?�력??
	ENTR_NO?: string // ?�사번호
	ENTR_DT?: string // ?�사?�자 (YYYYMMDD)
	WKG_ST_DIV?: string // 근무?�태�?(?�직/?�직/?�사)
	WKG_ST_DIV_CD?: string // 근무?�태코드 (1:?�직, 2:?�직, 3:?�사)
	LAST_TCN_GRD?: string // 최종기술?�급�?
	CARR_YM?: string // 경력 (?�월)
	CTQL_CD_NM?: string // ?�격증명
	CTQL_CD?: string // ?�격증코??
	MOB_PHN_NO?: string // ?��??�번??
	EMAIL_ADDR?: string // ?�메?�주??
	RETIR_DT?: string // ?�사?�자 (YYYYMMDD)
	LAST_IN_DT?: string // 최종?�입?�자
	FST_IN_DT?: string // 최초?�입?�자
	LAST_END_DT?: string // 최종철수?�자
	LAST_IN_STRT_DT?: string // 최종?�입?�작?�자
	LAST_IN_END_DT?: string // 최종?�입종료?�자
	LAST_PRJT?: string // 최종?�로?�트�?
	RMK?: string // 비고
	EMP_ENG_NM?: string // ?�문�?
	RES_REG_NO?: string // 주�??�록번호
	BIR_YR_MN_DT?: string // ?�년?�일
	SEX_DIV_CD?: string // ?�별코드
	NTLT_DIV_CD?: string // �?��코드
	HOME_TEL?: string // ?�택?�화번호
	HOME_ZIP_NO?: string // ?�택?�편번호
	HOME_ADDR?: string // ?�택주소
	HOME_DET_ADDR?: string // ?�택?�세주소
	LAST_SCHL?: string // 최종?�력
	MAJR?: string // ?�공
	LAST_GRAD_DT?: string // 최종졸업?�자
	CTQL_PUR_DT?: string // ?�격취득?�자
	CARR_MCNT?: string // 경력개월??
}

/**
 * 공통 코드 ?�이??구조
 * ?�분류 코드 조회 ???�용?�는 ?�터?�이??
 */
interface CommonCode {
	data?: string // 코드�?
	label?: string // 코드�?
	codeId?: string // 코드ID
	codeNm?: string // 코드�?
	DATA?: string // ?�버 ?�답??코드�?
	LABEL?: string // ?�버 ?�답??코드�?
}

/**
 * PSM1010M00 - ?�원/?�주 관�?메인 ?�면
 *
 * ?�원�??�주 ?�력???�보�?관리하???�합 메인 ?�면?�니??
 * ??기반 ?�터?�이?�로 ?�러 관�?기능???�공?�며, �???? ?�립?�인 컴포?�트�?구성?�니??
 *
 * 주요 기능:
 * - ?�원/?�주 리스??조회 �?검??
 * - ?�원 ?�보 ?�록/?�정 (PSM1020M00)
 * - ?�사발령?�역 관�?(PSM1030M00)
 * - ?�사발령?�괄?�록 (PSM1040M00)
 * - ?�로?�내??��??(PSM0050M00)
 * - ?�입?�황조회
 *
 * ?�면 구성:
 * - ?�단: 검??조건 ?�역 (?�원�? ?��?/?�주 구분, 근무?�태 ??
 * - 중앙: ?�원/?�주 목록 그리??(AG Grid)
 * - ?�단: ???�역 (?�원?�보, ?�사발령, ?�괄?�록, ?�로??
 *
 * AS-IS: PSM_01_0100.mxml (?�원/?�주 관�?메인 ?�면)
 * TO-BE: React 기반 ?�합 관�??�면
 *
 * ?�용 ?�시:
 * ```tsx
 * // ?�립 ?�면?�로 ?�용
 * <PSM1010M00 />
 *
 * // 메뉴?�서 ?�출
 * globalHandleMenuClick('PSM1010', {});
 * ```
 *
 * @author BIST Development Team
 * @since 2024
 */
export default function EmployeeMainPage() {
	const { showToast, showConfirm } = useToast()

	// ?�태 관�?
	const [activeTab, setActiveTab] = useState(0) // ?�재 ?�성 ???�덱??
	const [employeeList, setEmployeeList] = useState<EmployeeListData[]>([]) // ?�원 리스??
	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeListData | null>(null) // ?�택???�원
	const [isLoading, setIsLoading] = useState(false) // 로딩 ?�태
	const [error, setError] = useState<string | null>(null) // ?�러 메시지
	const [gridApi, setGridApi] = useState<GridApi | null>(null) // AG Grid API

	// ?�위 컴포?�트 ref
	const psm1020M00Ref = useRef<PSM1020M00Ref>(null) // ?�원?�보?�록및수????ref
	const psm1030M00Ref = useRef<PSM1030M00Ref>(null) // ?�사발령?�역 ??ref

	/**
	 * AS-IS 조회 조건 ?�태
	 * PSM_01_0101_S ?�로?��? ?�출 ???�용?�는 ?�라미터
	 */
	const [searchConditions, setSearchConditions] = useState({
		ownOutsDiv: '1', // ?�사/?�주 구분 (1:?�사, 2:?�주)
		empNm: '', // ?�원?�명
		hqDiv: 'ALL', // 본�?/?�주?�체 (ALL:?�체)
		deptDiv: 'ALL', // 부??(ALL:?�체)
		duty: 'ALL', // 직책 (ALL:?�체)
		retirYn: 'N', // ?�사?�포?�유�?(Y:?�함, N:미포??
	})

	/**
	 * AS-IS 공통 코드 ?�태
	 * ?�분류 코드 조회 결과�??�??
	 */
	const [commonCodes, setCommonCodes] = useState<{
		hqDiv: CommonCode[] // 본�?/?�주?�체 코드 목록
		deptDiv: CommonCode[] // 부??코드 목록
		duty: CommonCode[] // 직책 코드 목록
	}>({
		hqDiv: [],
		deptDiv: [],
		duty: [],
	})

	/**
	 * ??메뉴 ?�의
	 * AS-IS?� ?�일????구성
	 */
	const tabs = [
		'?�원?�보?�록 �??�정',
		'?�사발령?�역(건별)',
		'?�사발령?�괄?�록',
		'?�로?�내??��??,
	]

	/**
	 * ?�사???��?�??�인?�는 ?�수
	 */
	const isRetiredEmployee = (data: any) => {
		const workStatus = data?.WKG_ST_DIV
		const workStatusCd = data?.WKG_ST_DIV_CD
		return workStatus === '?�사' || workStatusCd === '3'
	}

	/**
	 * ?�사???�스?��? 빨간?�으�??�더링하??공통 ?�수
	 */
	const renderRetiredText = (value: any, data: any) => {
		if (isRetiredEmployee(data)) {
			return React.createElement('span', {
				style: { color: 'red' }
			}, value || '')
		}
		return value || ''
	}

	/**
	 * AG Grid 컬럼 ?�의
	 * AS-IS AdvancedDataGrid?� ?�일??컬럼 구성
	 */
	const columnDefs = useMemo<ColDef[]>(
		() => [
			{
				headerName: 'NO',
				width: 40,
				cellRenderer: (params: any) => {
					const value = params.node.rowIndex + 1
					return renderRetiredText(value, params.data)
				},
				sortable: false,
				filter: false,
			},
			{ 
				headerName: '?�원번호', 
				field: 'EMP_NO', 
				width: 100,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '구분', 
				field: 'OWN_OUTS_DIV', 
				width: 70,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?�명',
				field: 'EMP_NM',
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '직책', 
				field: 'DUTY', 
				width: 70,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '본�?', 
				field: 'HQ_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '부??, 
				field: 'DEPT_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?�체�?, 
				field: 'CRPN_NM', 
				width: 90, 
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?�사?�자',
				field: 'ENTR_DT',
				width: 110,
				cellRenderer: (params: any) => {
					// YYYYMMDD ?�식??YYYY-MM-DD ?�식?�로 변??
					let value = params.value
					if (!value) value = ''
					if (
						typeof value === 'string' &&
						value.length === 8 &&
						/^\d{8}$/.test(value)
					) {
						value = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`
					}
					return renderRetiredText(value, params.data)
				},
			},
			{ 
				headerName: '?�태', 
				field: 'WKG_ST_DIV', 
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?�급', 
				field: 'LAST_TCN_GRD_CD', 
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '경력', 
				field: 'CARR_YM', 
				width: 100,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?�격�?, 
				field: 'CTQL_CD_NM', 
				width: 130,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?�락�?, 
				field: 'MOB_PHN_NO', 
				width: 130, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?�사?�자',
				field: 'RETIR_DT',
				width: 110,
				hide: false,
				cellRenderer: (params: any) => {
					// YYYYMMDD ?�식??YYYY-MM-DD ?�식?�로 변??
					let value = params.value
					if (!value) value = ''
					if (
						typeof value === 'string' &&
						value.length === 8 &&
						/^\d{8}$/.test(value)
					) {
						value = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`
					}
					return renderRetiredText(value, params.data)
				},
			},
			{
				headerName: '최종?�입??,
				field: 'LAST_IN_STRT_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '최종철수??,
				field: 'LAST_IN_END_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '최종?�로?�트',
				field: 'LAST_PRJT',
				width: 150,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '비고', 
				field: 'RMK', 
				flex: 1, 
				minWidth: 200,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
		],
		[]
	)

	/**
	 * AG Grid 기본 ?�정
	 * 모든 컬럼??공통?�로 ?�용?�는 ?�성
	 */
	const defaultColDef = useMemo(
		() => ({
			sortable: true, // ?�렬 가??
			filter: true, // ?�터 가??
			resizable: true, // ?�기 조정 가??
			minWidth: 60, // 최소 ?�비
			maxWidth: 300, // 최�? ?�비
		}),
		[]
	)

	/**
	 * 컴포?�트 초기??
	 * AS-IS init() ?�수?� ?�일????��
	 */
	useEffect(() => {
		initializeData()
	}, [])

	/**
	 * 초기 ?�이??로드
	 * 공통 코드 로드 �?초기 조회 ?�행
	 */
	const initializeData = async () => {
		try {
			// AS-IS?� ?�일??공통 코드 로드
			await loadCommonCodes()

			// AS-IS?� ?�일??초기 조회
			await handleSearch()
		} catch (error) {
			console.error('초기??�??�류:', error)
			setError('초기??�??�류가 발생?�습?�다.')
		}
	}

	/**
	 * AS-IS 공통 코드 로드
	 * ?�분류 코드 조회 (AS-IS: S_cbHqDiv.setLargeCode2113, S_cbDuty.setLargeCode2 ??
	 */
	const loadCommonCodes = async () => {
		try {
			// 본�? 코드 로드 (AS-IS: S_cbHqDiv.setLargeCode2113)
			const hqResponse = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode: '113' }),
			})
			const hqResult = await hqResponse.json()
			const hqData = hqResult.data || []

			// 직책 코드 로드 (AS-IS: S_cbDuty.setLargeCode2)
			const dutyResponse = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode: '116' }),
			})
			const dutyResult = await dutyResponse.json()
			const dutyData = dutyResult.data || []

			// 부??코드 로드 (AS-IS: S_cbDeptDiv.setDeptCode3(ALL,'ALL','Y))
			const deptResponse = await fetch('/api/psm/dept-by-hq', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					searchType: '2',
					includeAll: 'Y',
					hqDivCd: 'ALL',
				}),
			})
			const deptResult = await deptResponse.json()
			const deptData = deptResult.data || []

			// ?�버 ?�이?�에??ALL코드�??�거?�고 ?�라?�언?�에??�??�에 추�?
			const filterAndAddAllOption = (data: any[]) => {
				const filteredData = data?.filter((item) => item.codeId !== 'ALL') || []
				return [{ codeId: 'ALL', codeNm: '?�체' }, ...filteredData]
			}

			const finalHqDiv = filterAndAddAllOption(hqData)
			const finalDeptDiv = filterAndAddAllOption(deptData)
			const finalDuty = filterAndAddAllOption(dutyData)

			setCommonCodes({
				hqDiv: finalHqDiv,
				deptDiv: finalDeptDiv,
				duty: finalDuty,
			})
		} catch (error) {
			console.error('공통 코드 로드 �??�류:', error)
		}
	}

	/**
	 * AS-IS 본�? 변�???부??로드
	 * AS-IS: S_cbDeptDiv.setDeptCode3(strS_DeptDiv,strS_HqDiv,"Y")
	 */
	const handleHqDivChange = async (hqDiv: string) => {
		try {
			setSearchConditions((prev) => ({
				...prev,
				hqDiv,
				deptDiv: 'ALL', // 본�? 변�???부?�는 ?�체�?초기??
			}))

			// AS-IS: S_cbDeptDiv.setDeptCode3(strS_DeptDiv,strS_HqDiv,"Y")
			const response = await fetch('/api/psm/dept-by-hq', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					searchType: '2',
					includeAll: 'Y',
					hqDivCd: hqDiv,
				}),
			})
			const deptResult = await response.json()
			const deptData = deptResult.data || []

			// ?�버 ?�이?�에??ALL코드�??�거?�고 ?�라?�언?�에??�??�에 추�?
			const filteredDeptData =
				deptData?.filter((item: any) => item.DATA !== 'ALL') || []
			const finalDeptData = [
				{ DATA: 'ALL', LABEL: '?�체' },
				...filteredDeptData,
			]

			setCommonCodes((prev) => ({
				...prev,
				deptDiv: finalDeptData,
			}))
		} catch (error) {
			console.error('부??로드 �??�류:', error)
		}
	}

	/**
	 * AS-IS ?�사/?�주 구분 변�?
	 * ?�사�?본�?, ?�주�??�주?�체 코드 로드
	 */
	const handleOwnOutsDivChange = async (ownOutsDiv: string) => {
		setSearchConditions((prev) => ({
			...prev,
			ownOutsDiv,
			hqDiv: 'ALL',
			deptDiv: 'ALL',
		}))

		// AS-IS?� ?�일??로직: ?�사�?본�?, ?�주�??�주?�체
		if (ownOutsDiv === '1') {
			// ?�사: 본�? 코드 로드
			await loadCommonCodes()
		} else {
			// ?�주: ?�주?�체 코드 로드 (AS-IS: S_cbHqDiv.setLargeCode2('111','ALL'))
			try {
				const response = await fetch('/api/common/search', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ largeCategoryCode: '111' }), // ?�주?�체 ?�분류 코드
				})
				const outsCompanyResult = await response.json()
				const outsCompanyData = outsCompanyResult.data || []

				// ?�주?�체 목록???�체??추�?
				const filterAndAddAllOption = (data: any[]) => {
					const filteredData =
						data?.filter((item) => item.codeId !== 'ALL') || []
					return [{ codeId: 'ALL', codeNm: '?�체' }, ...filteredData]
				}

				setCommonCodes((prev) => ({
					...prev,
					hqDiv: filterAndAddAllOption(outsCompanyData),
					deptDiv: [{ codeId: 'ALL', codeNm: '?�체' }], // ?�주??부?��? ?�으므�??�체�?
					duty: prev.duty, // 직책?� 그�?�??��?
				}))
			} catch (error) {
				console.error('?�주?�체 코드 로드 �??�류:', error)
			}
		}
	}

	/**
	 * AS-IS ?�원 리스??조회
	 * PSM_01_0101_S ?�로?��? ?�출
	 */
	const handleSearch = async () => {
		setIsLoading(true)
		setError(null)

		try {
			// AS-IS?� ?�일???�라미터 구성
			const params = [
				'ALL', // ?�원번호
				searchConditions.empNm, // ?�원?�명
				searchConditions.ownOutsDiv, // 구분
				searchConditions.hqDiv, // 본�?
				searchConditions.deptDiv, // 부??
				searchConditions.duty, // 직책
				searchConditions.retirYn, // ?�사?�포?�유�?
			].join('|')

			const response = await fetch('/api/psm/employee/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					empNo: 'ALL',
					empNm: searchConditions.empNm,
					ownOutsDiv: searchConditions.ownOutsDiv,
					hqDivCd: searchConditions.hqDiv,
					deptDivCd: searchConditions.deptDiv,
					dutyCd: searchConditions.duty,
					retirYn: searchConditions.retirYn,
				}),
			})

			if (response.ok) {
				const result = await response.json()

				if (result.success) {
					// ?�로?��??�서 반환?�는 ?�본 ?�이?��? 그�?�??�용
					setEmployeeList(result.data || [])

					// 조회 ???�단 ??�� 초기??
					if (psm1020M00Ref.current) {
						psm1020M00Ref.current.initialize()
					}

					if (psm1030M00Ref.current) {
						psm1030M00Ref.current.initialize()
					}

					// ?�택???�원 초기??
					setSelectedEmployee(null)

					// AS-IS?� ?�일?�게 조회 ?�공 ??그리??컬럼 변�?
					updateGridColumns()
					if (result.data && result.data.length > 0) {
						showToast(
							`${result.data.length}명의 ?�원??조회?�었?�니??`,
							'info'
						)
					} else {
						showToast('조회???�원???�습?�다.', 'warning')
					}
				} else {
					setError(result.message || '조회???�패?�습?�다.')
					showToast(result.message || '조회???�패?�습?�다.', 'error')
				}
			} else {
				throw new Error('조회???�패?�습?�다.')
			}
		} catch (error) {
			console.error('?�원 리스??조회 �??�류:', error)
			const errorMessage =
				error instanceof Error ? error.message : '조회 �??�류가 발생?�습?�다.'
			setError(errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * AS-IS?� ?�일?�게 조회 ?�공 ??그리??컬럼 ?�적 변�?
	 * ?�사/?�주 구분???�라 컬럼 ?�시/?��? 처리
	 */
	const updateGridColumns = () => {
		if (!gridApi) return

		const isOwn = searchConditions.ownOutsDiv === '1'
		const isOuts = searchConditions.ownOutsDiv === '2'

		// AS-IS?� ?�일??컬럼 visible 처리
		if (isOwn) {
			// ?�사 ?�력 조회 ??
			gridApi.setColumnVisible('HQ_DIV', true) // 본�?
			gridApi.setColumnVisible('DEPT_DIV', true) // 부??
			gridApi.setColumnVisible('CRPN_NM', false) // ?�체�?
			gridApi.setColumnVisible('MOB_PHN_NO', true) // ?�락�?
			gridApi.setColumnVisible('RETIR_DT', true) // ?�사?�자
			gridApi.setColumnVisible('LAST_IN_STRT_DT', false) // 최종?�입??
			gridApi.setColumnVisible('LAST_IN_END_DT', false) // 최종철수??
			gridApi.setColumnVisible('LAST_PRJT', false) // 최종?�로?�트

			// 컬럼�?변�?
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '?�사?�자'
				gridApi.refreshHeader()
			}
		} else if (isOuts) {
			// ?�주 ?�력 조회 ??
			gridApi.setColumnVisible('HQ_DIV', false) // 본�?
			gridApi.setColumnVisible('DEPT_DIV', false) // 부??
			gridApi.setColumnVisible('CRPN_NM', true) // ?�체�?
			gridApi.setColumnVisible('MOB_PHN_NO', false) // ?�락�?
			gridApi.setColumnVisible('RETIR_DT', false) // ?�사?�자
			gridApi.setColumnVisible('LAST_IN_STRT_DT', true) // 최종?�입??
			gridApi.setColumnVisible('LAST_IN_END_DT', true) // 최종철수??
			gridApi.setColumnVisible('LAST_PRJT', true) // 최종?�로?�트

			// 컬럼�?변�?
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '?�주?�수??
				gridApi.refreshHeader()
			}
		}

		// 컬럼 ?�기�?컨테?�너 ?�비??맞게 ?�동 조정
		if (gridApi) {
			// 컬럼 변�????�기 조정
			setTimeout(() => {
				// 먼�? 모든 컬럼???�용??맞게 ?�동 조정
				gridApi.autoSizeAllColumns()
				// �????�체 ?�비??맞게 조정 (비고 컬럼???��? 공간 차�?)
				gridApi.sizeColumnsToFit()
			}, 10)
		}
	}

	/**
	 * AG Grid ?�벤???�들??
	 * 그리??초기???�료 ???�출
	 */
	const onGridReady = (params: GridReadyEvent) => {
		setGridApi(params.api)
	}

	/**
	 * AG Grid ?�벤???�들??
	 * ?�이?��? 처음 ?�더링된 ???�출
	 */
	const onFirstDataRendered = (params: any) => {
		// 먼�? 모든 컬럼???�용??맞게 ?�동 조정
		params.api.autoSizeAllColumns()
		// �????�체 ?�비??맞게 조정 (비고 컬럼???��? 공간 차�?)
		setTimeout(() => {
			params.api.sizeColumnsToFit()
		}, 10)
	}

	/**
	 * AG Grid ???�릭 ?�벤??
	 * ?�원 ?�택 ???�출
	 */
	const onRowClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AG Grid ???�블?�릭 ?�벤??
	 * ?�원 ?�택 ???�출 (AS-IS OnDblClickGrdEmpInfoList)
	 */
	const onRowDoubleClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AS-IS ?�원 ?�택 ????변�?로직
	 * ?�택???�원 ?�보�??�위 ??컴포?�트???�달
	 */
	const handleEmployeeSelect = (employee: EmployeeListData) => {
		setSelectedEmployee(employee)

		// ?�원 ?�택 ??모든 ??초기??
		if (psm1020M00Ref.current) {
			psm1020M00Ref.current.initialize()
		}

		if (psm1030M00Ref.current) {
			psm1030M00Ref.current.initialize()
		}

		// AS-IS?� ?�일????�� 처리 로직
		if (activeTab === 0) {
			// ?�원?�보?�록및수????
		} else if (activeTab === 1) {
			// ?�사발령?�역(건별) ??
		} else if (activeTab === 2) {
			// ?�사발령?�괄?�록 ??
		} else if (activeTab === 3) {
			// ?�로?�내??��????
		}
	}

	/**
	 * selectedEmployee가 변경되�??�원?�보?�록및수????�� ??handleSearch ?�출
	 * ?�?�밍 ?�슈 ?�결???�한 지??처리
	 */
	useEffect(() => {
		if (selectedEmployee && activeTab === 0 && psm1020M00Ref.current) {
			// employeeData ?�정??기다�???handleSearch ?�출
			const timer = setTimeout(() => {
				if (psm1020M00Ref.current) {
					psm1020M00Ref.current.handleSearch()
				}
			}, 100) // 100ms 지?�으�?employeeData ?�정 ?�료 보장

			return () => clearTimeout(timer)
		}
	}, [selectedEmployee, activeTab])

	// ?�도??리사?�즈 ?�에??컬럼 ?�기 조정
	useEffect(() => {
		const handleResize = () => {
			if (gridApi) {
				// 리사?�즈 ??컬럼 ?�기 조정
				setTimeout(() => {
					// 먼�? 모든 컬럼???�용??맞게 ?�동 조정
					gridApi.autoSizeAllColumns()
					// �????�체 ?�비??맞게 조정 (비고 컬럼???��? 공간 차�?)
					gridApi.sizeColumnsToFit()
				}, 10)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [gridApi])

	/**
	 * AS-IS OnDblClickGrdEmpInfoList ?�수??enable/disable 처리 로직
	 * ?�정 불�??�한 ?�력 ??�� 비활?�화
	 */
	const getFieldEnableState = (employee: EmployeeListData | null) => {
		if (!employee)
			return {
				empNo: true,
				ownOutsDiv: true,
				hqDiv: true,
				deptDiv: true,
				duty: true,
				crpnNm: true,
			}

		// AS-IS?� ?�일??로직: ?�정 불�????�력 ??�� 비활?�화
		return {
			empNo: false, // ?�원번호 - ?�정 불�?
			ownOutsDiv: false, // ?�사?�주구분 - ?�정 불�?
			hqDiv: false, // 본�? - ?�정 불�? (?�사발령 ?�록?�에�?가??
			deptDiv: false, // 부??- ?�정 불�? (?�사발령 ?�록?�에�?가??
			duty: employee.OWN_OUTS_DIV_CD === '1' ? false : true, // 직책 - ?�사???�정 불�?, ?�주???�정 가??
			crpnNm: false, // ?�체�?- ?�정 불�?
		}
	}

	/**
	 * AS-IS ?�입?�황조회 버튼 ?�릭
	 * BSN_07_0150 ?�업 ?�출 로직 (구현 ?�정)
	 */
	const handleProjectInquiry = () => {
		if (!selectedEmployee) {
			showToast(
				'?�원(?�주) 리스?�에???�?�자�??�택 ?�릭??주십?�요.',
				'warning'
			)
			return
		}
		// AS-IS: BSN_07_0150 ?�업 ?�출 로직
		showToast('?�입?�력?�황(BSN0660P00) ?�면 개발중입?�다.', 'info');
	}

	return (
		<div className='mdi flex flex-col h-[calc(100vh-200px)] overflow-hidden min-w-[1400px]'>
			{/* AS-IS 조회 ?�역 */}
			<div className='search-div mb-4 shrink-0'>
				<table className='search-table w-full'>
					<tbody>
						<tr>
							<th className='search-th w-[100px]'>?�사 ?�주 구분</th>
							<td className='search-td w-[150px]'>
								<div className='flex gap-2'>
									<label className='flex items-center'>
										<input
											type='radio'
											name='ownOutsDiv'
											value='1'
											checked={searchConditions.ownOutsDiv === '1'}
											onChange={(e) => handleOwnOutsDivChange(e.target.value)}
										/>
										<span className='ml-1'>?�사</span>
									</label>
									<label className='flex items-center'>
										<input
											type='radio'
											name='ownOutsDiv'
											value='2'
											checked={searchConditions.ownOutsDiv === '2'}
											onChange={(e) => handleOwnOutsDivChange(e.target.value)}
										/>
										<span className='ml-1'>?�주</span>
									</label>
								</div>
							</td>
							<th className='search-th w-[80px]'>?�원?�명</th>
							<td className='search-td w-[150px]'>
								<input
									type='text'
									className='input-base input-default w-full'
									value={searchConditions.empNm}
									onChange={(e) =>
										setSearchConditions((prev) => ({
											...prev,
											empNm: e.target.value,
										}))
									}
									onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
									placeholder='?�원�??�력'
									title='?�원�??�력'
								/>
							</td>
							<th className='search-th w-[60px]'>
								{searchConditions.ownOutsDiv === '2' ? '?�주?�체' : '본�?'}
							</th>
							<td className='search-td w-[150px]'>
								<select
									className='combo-base w-full'
									value={searchConditions.hqDiv}
									onChange={(e) => handleHqDivChange(e.target.value)}
									title={
										searchConditions.ownOutsDiv === '2'
											? '?�주?�체 ?�택'
											: '본�? ?�택'
									}
								>
									{commonCodes.hqDiv.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[60px]'>부??/th>
							<td className='search-td w-[150px]'>
								<select
									className='combo-base w-full'
									value={searchConditions.deptDiv}
									onChange={(e) =>
										setSearchConditions((prev) => ({
											...prev,
											deptDiv: e.target.value,
										}))
									}
									disabled={searchConditions.ownOutsDiv === '2'}
									title='부???�택'
								>
									{commonCodes.deptDiv.map((code, idx) => (
										<option key={code.DATA || idx} value={code.DATA}>
											{code.LABEL}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[60px]'>직책</th>
							<td className='search-td w-[130px]'>
								<select
									className='combo-base w-full'
									value={searchConditions.duty}
									onChange={(e) =>
										setSearchConditions((prev) => ({
											...prev,
											duty: e.target.value,
										}))
									}
									title='직책 ?�택'
								>
									{commonCodes.duty.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[80px]'>?�사?�포??/th>
							<td className='search-td w-[80px]'>
								<input
									type='checkbox'
									checked={searchConditions.retirYn === 'Y'}
									onChange={(e) =>
										setSearchConditions((prev) => ({
											...prev,
											retirYn: e.target.checked ? 'Y' : 'N',
										}))
									}
									title='?�사???�함'
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search'
									onClick={handleSearch}
									disabled={isLoading}
								>
									{isLoading ? '조회�?..' : '조회'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* AS-IS 리스???�?��? */}
			<div className='tit_area shrink-0'>
				<h3>?�원/?�주 리스??/h3>
				<div>
					<button className='btn-base btn-etc' onClick={handleProjectInquiry}>
						?�입?�황조회
					</button>
				</div>
			</div>

			{/* AG Grid */}
			<div
				className='ag-theme-alpine flex-1 min-h-0'
			>
				<AgGridReact
					columnDefs={columnDefs}
					rowData={employeeList}
					defaultColDef={defaultColDef}
					pagination={true}
					paginationPageSize={20}
					paginationPageSizeSelector={[10, 20, 50, 100]}
					rowSelection='single'
					onGridReady={onGridReady}
					onFirstDataRendered={onFirstDataRendered}
					onRowClicked={onRowClicked}
					onRowDoubleClicked={onRowDoubleClicked}
					getRowClass={(params) => {
						const isSelected = selectedEmployee?.EMP_NO === params.data?.EMP_NO
						let classes = []
						if (isSelected) classes.push('selected-row')
						return classes
					}}
					suppressRowClickSelection={true}
					animateRows={true}
					enableCellTextSelection={true}
					suppressCopyRowsToClipboard={false}
					suppressColumnVirtualisation={false}
					suppressRowVirtualisation={false}
				/>
			</div>

			{/* AS-IS ???�체 ?�역 */}
			<div className='flex flex-col flex-1 min-h-0'>
				{/* ??버튼 */}
				<div className='tab-container shrink-0'>
					{tabs.map((tab, idx) => (
						<button
							key={idx}
							onClick={() => setActiveTab(idx)}
							className={`tab-button ${activeTab === idx ? 'tab-active' : 'tab-inactive'}`}
						>
							{tab}
						</button>
					))}
				</div>
				{/* ??콘텐�?*/}
				<div className='tab-panel flex-1 min-h-0 overflow-auto'>
					{activeTab === 0 && (
						<PSM1020M00
							ref={psm1020M00Ref}
							selectedEmployee={selectedEmployee}
							fieldEnableState={getFieldEnableState(selectedEmployee)}
							onSearchSuccess={handleSearch}
						/>
					)}
					{activeTab === 1 && (
						<PSM1030M00
							ref={psm1030M00Ref}
							selectedEmployee={selectedEmployee}
						/>
					)}
					{activeTab === 2 && (
						<PSM1040M00 selectedEmployee={selectedEmployee} />
					)}
					{activeTab === 3 && (
						<PSM0050M00
							isTabMode={true}
							parentEmpNo={selectedEmployee?.EMP_NO || ''}
							parentEmpNm={selectedEmployee?.EMP_NM || ''}
						/>
					)}
				</div>
			</div>
			{/* ?�러 메시지 */}
			{error && <div className='text-red-500 text-sm mt-2 px-1'>{error}</div>}
		</div>
	)
}


