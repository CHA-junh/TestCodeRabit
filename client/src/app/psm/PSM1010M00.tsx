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
 * AS-IS PSM_01_0100.mxml의 사원 리스트 데이터 구조
 * PSM_01_0101_S 프로시저에서 반환되는 데이터와 동일한 구조
 */
interface EmployeeListData {
	LIST_NO?: string // 순번
	EMP_NO?: string // 사원번호
	OWN_OUTS_DIV?: string // 자사/외주 구분명
	OWN_OUTS_DIV_CD?: string // 자사/외주 구분코드 (1:자사, 2:외주)
	EMP_NM?: string // 사원명
	DUTY?: string // 직책명
	DUTY_CD?: string // 직책코드
	HQ_DIV?: string // 본부명
	HQ_DIV_CD?: string // 본부코드
	DEPT_DIV?: string // 부서명
	DEPT_DIV_CD?: string // 부서코드
	CRPN_NM?: string // 업체명 (외주인력용)
	ENTR_NO?: string // 입사번호
	ENTR_DT?: string // 입사일자 (YYYYMMDD)
	WKG_ST_DIV?: string // 근무상태명 (재직/휴직/퇴사)
	WKG_ST_DIV_CD?: string // 근무상태코드 (1:재직, 2:휴직, 3:퇴사)
	LAST_TCN_GRD?: string // 최종기술등급명
	CARR_YM?: string // 경력 (년월)
	CTQL_CD_NM?: string // 자격증명
	CTQL_CD?: string // 자격증코드
	MOB_PHN_NO?: string // 휴대폰번호
	EMAIL_ADDR?: string // 이메일주소
	RETIR_DT?: string // 퇴사일자 (YYYYMMDD)
	LAST_IN_DT?: string // 최종투입일자
	FST_IN_DT?: string // 최초투입일자
	LAST_END_DT?: string // 최종철수일자
	LAST_IN_STRT_DT?: string // 최종투입시작일자
	LAST_IN_END_DT?: string // 최종투입종료일자
	LAST_PRJT?: string // 최종프로젝트명
	RMK?: string // 비고
	EMP_ENG_NM?: string // 영문명
	RES_REG_NO?: string // 주민등록번호
	BIR_YR_MN_DT?: string // 생년월일
	SEX_DIV_CD?: string // 성별코드
	NTLT_DIV_CD?: string // 국적코드
	HOME_TEL?: string // 자택전화번호
	HOME_ZIP_NO?: string // 자택우편번호
	HOME_ADDR?: string // 자택주소
	HOME_DET_ADDR?: string // 자택상세주소
	LAST_SCHL?: string // 최종학력
	MAJR?: string // 전공
	LAST_GRAD_DT?: string // 최종졸업일자
	CTQL_PUR_DT?: string // 자격취득일자
	CARR_MCNT?: string // 경력개월수
}

/**
 * 공통 코드 데이터 구조
 * 대분류 코드 조회 시 사용되는 인터페이스
 */
interface CommonCode {
	data?: string // 코드값
	label?: string // 코드명
	codeId?: string // 코드ID
	codeNm?: string // 코드명
	DATA?: string // 서버 응답용 코드값
	LABEL?: string // 서버 응답용 코드명
}

/**
 * PSM1010M00 - 사원/외주 관리 메인 화면
 *
 * 사원과 외주 인력의 정보를 관리하는 통합 메인 화면입니다.
 * 탭 기반 인터페이스로 여러 관리 기능을 제공하며, 각 탭은 독립적인 컴포넌트로 구성됩니다.
 *
 * 주요 기능:
 * - 사원/외주 리스트 조회 및 검색
 * - 사원 정보 등록/수정 (PSM1020M00)
 * - 인사발령내역 관리 (PSM1030M00)
 * - 인사발령일괄등록 (PSM1040M00)
 * - 프로필내역조회 (PSM0050M00)
 * - 투입현황조회
 *
 * 화면 구성:
 * - 상단: 검색 조건 영역 (사원명, 내부/외주 구분, 근무상태 등)
 * - 중앙: 사원/외주 목록 그리드 (AG Grid)
 * - 하단: 탭 영역 (사원정보, 인사발령, 일괄등록, 프로필)
 *
 * AS-IS: PSM_01_0100.mxml (사원/외주 관리 메인 화면)
 * TO-BE: React 기반 통합 관리 화면
 *
 * 사용 예시:
 * ```tsx
 * // 독립 화면으로 사용
 * <PSM1010M00 />
 *
 * // 메뉴에서 호출
 * globalHandleMenuClick('PSM1010', {});
 * ```
 *
 * @author BIST Development Team
 * @since 2024
 */
export default function EmployeeMainPage() {
	const { showToast, showConfirm } = useToast()

	// 상태 관리
	const [activeTab, setActiveTab] = useState(0) // 현재 활성 탭 인덱스
	const [employeeList, setEmployeeList] = useState<EmployeeListData[]>([]) // 사원 리스트
	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeListData | null>(null) // 선택된 사원
	const [isLoading, setIsLoading] = useState(false) // 로딩 상태
	const [error, setError] = useState<string | null>(null) // 에러 메시지
	const [gridApi, setGridApi] = useState<GridApi | null>(null) // AG Grid API

	// 하위 컴포넌트 ref
	const psm1020M00Ref = useRef<PSM1020M00Ref>(null) // 사원정보등록및수정 탭 ref
	const psm1030M00Ref = useRef<PSM1030M00Ref>(null) // 인사발령내역 탭 ref

	/**
	 * AS-IS 조회 조건 상태
	 * PSM_01_0101_S 프로시저 호출 시 사용되는 파라미터
	 */
	const [searchConditions, setSearchConditions] = useState({
		ownOutsDiv: '1', // 자사/외주 구분 (1:자사, 2:외주)
		empNm: '', // 사원성명
		hqDiv: 'ALL', // 본부/외주업체 (ALL:전체)
		deptDiv: 'ALL', // 부서 (ALL:전체)
		duty: 'ALL', // 직책 (ALL:전체)
		retirYn: 'N', // 퇴사자포함유무 (Y:포함, N:미포함)
	})

	/**
	 * AS-IS 공통 코드 상태
	 * 대분류 코드 조회 결과를 저장
	 */
	const [commonCodes, setCommonCodes] = useState<{
		hqDiv: CommonCode[] // 본부/외주업체 코드 목록
		deptDiv: CommonCode[] // 부서 코드 목록
		duty: CommonCode[] // 직책 코드 목록
	}>({
		hqDiv: [],
		deptDiv: [],
		duty: [],
	})

	/**
	 * 탭 메뉴 정의
	 * AS-IS와 동일한 탭 구성
	 */
	const tabs = [
		'사원정보등록 및 수정',
		'인사발령내역(건별)',
		'인사발령일괄등록',
		'프로필내역조회',
	]

	/**
	 * 퇴사자 여부를 확인하는 함수
	 */
	const isRetiredEmployee = (data: any) => {
		const workStatus = data?.WKG_ST_DIV
		const workStatusCd = data?.WKG_ST_DIV_CD
		return workStatus === '퇴사' || workStatusCd === '3'
	}

	/**
	 * 퇴사자 텍스트를 빨간색으로 렌더링하는 공통 함수
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
	 * AG Grid 컬럼 정의
	 * AS-IS AdvancedDataGrid와 동일한 컬럼 구성
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
				headerName: '사원번호', 
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
				headerName: '성명',
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
				headerName: '본부', 
				field: 'HQ_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '부서', 
				field: 'DEPT_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '업체명', 
				field: 'CRPN_NM', 
				width: 90, 
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '입사일자',
				field: 'ENTR_DT',
				width: 110,
				cellRenderer: (params: any) => {
					// YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
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
				headerName: '상태', 
				field: 'WKG_ST_DIV', 
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '등급', 
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
				headerName: '자격증', 
				field: 'CTQL_CD_NM', 
				width: 130,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '연락처', 
				field: 'MOB_PHN_NO', 
				width: 130, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '퇴사일자',
				field: 'RETIR_DT',
				width: 110,
				hide: false,
				cellRenderer: (params: any) => {
					// YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
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
				headerName: '최종투입일',
				field: 'LAST_IN_STRT_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '최종철수일',
				field: 'LAST_IN_END_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '최종프로젝트',
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
	 * AG Grid 기본 설정
	 * 모든 컬럼에 공통으로 적용되는 속성
	 */
	const defaultColDef = useMemo(
		() => ({
			sortable: true, // 정렬 가능
			filter: true, // 필터 가능
			resizable: true, // 크기 조정 가능
			minWidth: 60, // 최소 너비
			maxWidth: 300, // 최대 너비
		}),
		[]
	)

	/**
	 * 컴포넌트 초기화
	 * AS-IS init() 함수와 동일한 역할
	 */
	useEffect(() => {
		initializeData()
	}, [])

	/**
	 * 초기 데이터 로드
	 * 공통 코드 로드 및 초기 조회 실행
	 */
	const initializeData = async () => {
		try {
			// AS-IS와 동일한 공통 코드 로드
			await loadCommonCodes()

			// AS-IS와 동일한 초기 조회
			await handleSearch()
		} catch (error) {
			console.error('초기화 중 오류:', error)
			setError('초기화 중 오류가 발생했습니다.')
		}
	}

	/**
	 * AS-IS 공통 코드 로드
	 * 대분류 코드 조회 (AS-IS: S_cbHqDiv.setLargeCode2113, S_cbDuty.setLargeCode2 등)
	 */
	const loadCommonCodes = async () => {
		try {
			// 본부 코드 로드 (AS-IS: S_cbHqDiv.setLargeCode2113)
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

			// 부서 코드 로드 (AS-IS: S_cbDeptDiv.setDeptCode3(ALL,'ALL','Y))
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

			// 서버 데이터에서 ALL코드를 제거하고 클라이언트에서 맨 위에 추가
			const filterAndAddAllOption = (data: any[]) => {
				const filteredData = data?.filter((item) => item.codeId !== 'ALL') || []
				return [{ codeId: 'ALL', codeNm: '전체' }, ...filteredData]
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
			console.error('공통 코드 로드 중 오류:', error)
		}
	}

	/**
	 * AS-IS 본부 변경 시 부서 로드
	 * AS-IS: S_cbDeptDiv.setDeptCode3(strS_DeptDiv,strS_HqDiv,"Y")
	 */
	const handleHqDivChange = async (hqDiv: string) => {
		try {
			setSearchConditions((prev) => ({
				...prev,
				hqDiv,
				deptDiv: 'ALL', // 본부 변경 시 부서는 전체로 초기화
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

			// 서버 데이터에서 ALL코드를 제거하고 클라이언트에서 맨 위에 추가
			const filteredDeptData =
				deptData?.filter((item: any) => item.DATA !== 'ALL') || []
			const finalDeptData = [
				{ DATA: 'ALL', LABEL: '전체' },
				...filteredDeptData,
			]

			setCommonCodes((prev) => ({
				...prev,
				deptDiv: finalDeptData,
			}))
		} catch (error) {
			console.error('부서 로드 중 오류:', error)
		}
	}

	/**
	 * AS-IS 자사/외주 구분 변경
	 * 자사면 본부, 외주면 외주업체 코드 로드
	 */
	const handleOwnOutsDivChange = async (ownOutsDiv: string) => {
		setSearchConditions((prev) => ({
			...prev,
			ownOutsDiv,
			hqDiv: 'ALL',
			deptDiv: 'ALL',
		}))

		// AS-IS와 동일한 로직: 자사면 본부, 외주면 외주업체
		if (ownOutsDiv === '1') {
			// 자사: 본부 코드 로드
			await loadCommonCodes()
		} else {
			// 외주: 외주업체 코드 로드 (AS-IS: S_cbHqDiv.setLargeCode2('111','ALL'))
			try {
				const response = await fetch('/api/common/search', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ largeCategoryCode: '111' }), // 외주업체 대분류 코드
				})
				const outsCompanyResult = await response.json()
				const outsCompanyData = outsCompanyResult.data || []

				// 외주업체 목록에 전체션 추가
				const filterAndAddAllOption = (data: any[]) => {
					const filteredData =
						data?.filter((item) => item.codeId !== 'ALL') || []
					return [{ codeId: 'ALL', codeNm: '전체' }, ...filteredData]
				}

				setCommonCodes((prev) => ({
					...prev,
					hqDiv: filterAndAddAllOption(outsCompanyData),
					deptDiv: [{ codeId: 'ALL', codeNm: '전체' }], // 외주는 부서가 없으므로 전체만
					duty: prev.duty, // 직책은 그대로 유지
				}))
			} catch (error) {
				console.error('외주업체 코드 로드 중 오류:', error)
			}
		}
	}

	/**
	 * AS-IS 사원 리스트 조회
	 * PSM_01_0101_S 프로시저 호출
	 */
	const handleSearch = async () => {
		setIsLoading(true)
		setError(null)

		try {
			// AS-IS와 동일한 파라미터 구성
			const params = [
				'ALL', // 사원번호
				searchConditions.empNm, // 사원성명
				searchConditions.ownOutsDiv, // 구분
				searchConditions.hqDiv, // 본부
				searchConditions.deptDiv, // 부서
				searchConditions.duty, // 직책
				searchConditions.retirYn, // 퇴사자포함유무
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
					// 프로시저에서 반환하는 원본 데이터를 그대로 사용
					setEmployeeList(result.data || [])

					// 조회 시 하단 탭들 초기화
					if (psm1020M00Ref.current) {
						psm1020M00Ref.current.initialize()
					}

					if (psm1030M00Ref.current) {
						psm1030M00Ref.current.initialize()
					}

					// 선택된 사원 초기화
					setSelectedEmployee(null)

					// AS-IS와 동일하게 조회 성공 후 그리드 컬럼 변경
					updateGridColumns()
					if (result.data && result.data.length > 0) {
						showToast(
							`${result.data.length}명의 사원이 조회되었습니다.`,
							'info'
						)
					} else {
						showToast('조회된 사원이 없습니다.', 'warning')
					}
				} else {
					setError(result.message || '조회에 실패했습니다.')
					showToast(result.message || '조회에 실패했습니다.', 'error')
				}
			} else {
				throw new Error('조회에 실패했습니다.')
			}
		} catch (error) {
			console.error('사원 리스트 조회 중 오류:', error)
			const errorMessage =
				error instanceof Error ? error.message : '조회 중 오류가 발생했습니다.'
			setError(errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * AS-IS와 동일하게 조회 성공 후 그리드 컬럼 동적 변경
	 * 자사/외주 구분에 따라 컬럼 표시/숨김 처리
	 */
	const updateGridColumns = () => {
		if (!gridApi) return

		const isOwn = searchConditions.ownOutsDiv === '1'
		const isOuts = searchConditions.ownOutsDiv === '2'

		// AS-IS와 동일한 컬럼 visible 처리
		if (isOwn) {
			// 자사 인력 조회 시
			gridApi.setColumnVisible('HQ_DIV', true) // 본부
			gridApi.setColumnVisible('DEPT_DIV', true) // 부서
			gridApi.setColumnVisible('CRPN_NM', false) // 업체명
			gridApi.setColumnVisible('MOB_PHN_NO', true) // 연락처
			gridApi.setColumnVisible('RETIR_DT', true) // 퇴사일자
			gridApi.setColumnVisible('LAST_IN_STRT_DT', false) // 최종투입일
			gridApi.setColumnVisible('LAST_IN_END_DT', false) // 최종철수일
			gridApi.setColumnVisible('LAST_PRJT', false) // 최종프로젝트

			// 컬럼명 변경
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '입사일자'
				gridApi.refreshHeader()
			}
		} else if (isOuts) {
			// 외주 인력 조회 시
			gridApi.setColumnVisible('HQ_DIV', false) // 본부
			gridApi.setColumnVisible('DEPT_DIV', false) // 부서
			gridApi.setColumnVisible('CRPN_NM', true) // 업체명
			gridApi.setColumnVisible('MOB_PHN_NO', false) // 연락처
			gridApi.setColumnVisible('RETIR_DT', false) // 퇴사일자
			gridApi.setColumnVisible('LAST_IN_STRT_DT', true) // 최종투입일
			gridApi.setColumnVisible('LAST_IN_END_DT', true) // 최종철수일
			gridApi.setColumnVisible('LAST_PRJT', true) // 최종프로젝트

			// 컬럼명 변경
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '외주접수일'
				gridApi.refreshHeader()
			}
		}

		// 컬럼 크기를 컨테이너 너비에 맞게 자동 조정
		if (gridApi) {
			// 컬럼 변경 후 크기 조정
			setTimeout(() => {
				// 먼저 모든 컬럼을 내용에 맞게 자동 조정
				gridApi.autoSizeAllColumns()
				// 그 후 전체 너비에 맞게 조정 (비고 컬럼이 남은 공간 차지)
				gridApi.sizeColumnsToFit()
			}, 10)
		}
	}

	/**
	 * AG Grid 이벤트 핸들러
	 * 그리드 초기화 완료 시 호출
	 */
	const onGridReady = (params: GridReadyEvent) => {
		setGridApi(params.api)
	}

	/**
	 * AG Grid 이벤트 핸들러
	 * 데이터가 처음 렌더링된 후 호출
	 */
	const onFirstDataRendered = (params: any) => {
		// 먼저 모든 컬럼을 내용에 맞게 자동 조정
		params.api.autoSizeAllColumns()
		// 그 후 전체 너비에 맞게 조정 (비고 컬럼이 남은 공간 차지)
		setTimeout(() => {
			params.api.sizeColumnsToFit()
		}, 10)
	}

	/**
	 * AG Grid 행 클릭 이벤트
	 * 사원 선택 시 호출
	 */
	const onRowClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AG Grid 행 더블클릭 이벤트
	 * 사원 선택 시 호출 (AS-IS OnDblClickGrdEmpInfoList)
	 */
	const onRowDoubleClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AS-IS 사원 선택 시 탭 변경 로직
	 * 선택된 사원 정보를 하위 탭 컴포넌트에 전달
	 */
	const handleEmployeeSelect = (employee: EmployeeListData) => {
		setSelectedEmployee(employee)

		// 사원 선택 시 모든 탭 초기화
		if (psm1020M00Ref.current) {
			psm1020M00Ref.current.initialize()
		}

		if (psm1030M00Ref.current) {
			psm1030M00Ref.current.initialize()
		}

		// AS-IS와 동일한 탭별 처리 로직
		if (activeTab === 0) {
			// 사원정보등록및수정 탭
		} else if (activeTab === 1) {
			// 인사발령내역(건별) 탭
		} else if (activeTab === 2) {
			// 인사발령일괄등록 탭
		} else if (activeTab === 3) {
			// 프로필내역조회 탭
		}
	}

	/**
	 * selectedEmployee가 변경되고 사원정보등록및수정 탭일 때 handleSearch 호출
	 * 타이밍 이슈 해결을 위한 지연 처리
	 */
	useEffect(() => {
		if (selectedEmployee && activeTab === 0 && psm1020M00Ref.current) {
			// employeeData 설정을 기다린 후 handleSearch 호출
			const timer = setTimeout(() => {
				if (psm1020M00Ref.current) {
					psm1020M00Ref.current.handleSearch()
				}
			}, 100) // 100ms 지연으로 employeeData 설정 완료 보장

			return () => clearTimeout(timer)
		}
	}, [selectedEmployee, activeTab])

	// 윈도우 리사이즈 시에도 컬럼 크기 조정
	useEffect(() => {
		const handleResize = () => {
			if (gridApi) {
				// 리사이즈 후 컬럼 크기 조정
				setTimeout(() => {
					// 먼저 모든 컬럼을 내용에 맞게 자동 조정
					gridApi.autoSizeAllColumns()
					// 그 후 전체 너비에 맞게 조정 (비고 컬럼이 남은 공간 차지)
					gridApi.sizeColumnsToFit()
				}, 10)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [gridApi])

	/**
	 * AS-IS OnDblClickGrdEmpInfoList 함수의 enable/disable 처리 로직
	 * 수정 불가능한 입력 항목 비활성화
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

		// AS-IS와 동일한 로직: 수정 불가능 입력 항목 비활성화
		return {
			empNo: false, // 사원번호 - 수정 불가
			ownOutsDiv: false, // 자사외주구분 - 수정 불가
			hqDiv: false, // 본부 - 수정 불가 (인사발령 등록시에만 가능)
			deptDiv: false, // 부서 - 수정 불가 (인사발령 등록시에만 가능)
			duty: employee.OWN_OUTS_DIV_CD === '1' ? false : true, // 직책 - 자사는 수정 불가, 외주는 수정 가능
			crpnNm: false, // 업체명 - 수정 불가
		}
	}

	/**
	 * AS-IS 투입현황조회 버튼 클릭
	 * BSN_07_0150 팝업 호출 로직 (구현 예정)
	 */
	const handleProjectInquiry = () => {
		if (!selectedEmployee) {
			showToast(
				'사원(외주) 리스트에서 대상자를 선택 클릭해 주십시요.',
				'warning'
			)
			return
		}
		// AS-IS: BSN_07_0150 팝업 호출 로직
		showToast('투입인력현황(BSN0660P00) 화면 개발중입니다.', 'info');
	}

	return (
		<div className='mdi flex flex-col h-[calc(100vh-200px)] overflow-hidden min-w-[1400px]'>
			{/* AS-IS 조회 영역 */}
			<div className='search-div mb-4 shrink-0'>
				<table className='search-table w-full'>
					<tbody>
						<tr>
							<th className='search-th w-[100px]'>자사 외주 구분</th>
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
										<span className='ml-1'>자사</span>
									</label>
									<label className='flex items-center'>
										<input
											type='radio'
											name='ownOutsDiv'
											value='2'
											checked={searchConditions.ownOutsDiv === '2'}
											onChange={(e) => handleOwnOutsDivChange(e.target.value)}
										/>
										<span className='ml-1'>외주</span>
									</label>
								</div>
							</td>
							<th className='search-th w-[80px]'>사원성명</th>
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
									placeholder='사원명 입력'
									title='사원명 입력'
								/>
							</td>
							<th className='search-th w-[60px]'>
								{searchConditions.ownOutsDiv === '2' ? '외주업체' : '본부'}
							</th>
							<td className='search-td w-[150px]'>
								<select
									className='combo-base w-full'
									value={searchConditions.hqDiv}
									onChange={(e) => handleHqDivChange(e.target.value)}
									title={
										searchConditions.ownOutsDiv === '2'
											? '외주업체 선택'
											: '본부 선택'
									}
								>
									{commonCodes.hqDiv.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[60px]'>부서</th>
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
									title='부서 선택'
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
									title='직책 선택'
								>
									{commonCodes.duty.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[80px]'>퇴사자포함</th>
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
									title='퇴사자 포함'
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search'
									onClick={handleSearch}
									disabled={isLoading}
								>
									{isLoading ? '조회중...' : '조회'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* AS-IS 리스트 타이틀 */}
			<div className='tit_area shrink-0'>
				<h3>사원/외주 리스트</h3>
				<div>
					<button className='btn-base btn-etc' onClick={handleProjectInquiry}>
						투입현황조회
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

			{/* AS-IS 탭 전체 영역 */}
			<div className='flex flex-col flex-1 min-h-0'>
				{/* 탭 버튼 */}
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
				{/* 탭 콘텐츠 */}
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
			{/* 에러 메시지 */}
			{error && <div className='text-red-500 text-sm mt-2 px-1'>{error}</div>}
		</div>
	)
}
