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
 * AS-IS PSM_01_0100.mxml???¬ì› ë¦¬ìŠ¤???°ì´??êµ¬ì¡°
 * PSM_01_0101_S ?„ë¡œ?œì??ì„œ ë°˜í™˜?˜ëŠ” ?°ì´?°ì? ?™ì¼??êµ¬ì¡°
 */
interface EmployeeListData {
	LIST_NO?: string // ?œë²ˆ
	EMP_NO?: string // ?¬ì›ë²ˆí˜¸
	OWN_OUTS_DIV?: string // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ëª?
	OWN_OUTS_DIV_CD?: string // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ì½”ë“œ (1:?ì‚¬, 2:?¸ì£¼)
	EMP_NM?: string // ?¬ì›ëª?
	DUTY?: string // ì§ì±…ëª?
	DUTY_CD?: string // ì§ì±…ì½”ë“œ
	HQ_DIV?: string // ë³¸ë?ëª?
	HQ_DIV_CD?: string // ë³¸ë?ì½”ë“œ
	DEPT_DIV?: string // ë¶€?œëª…
	DEPT_DIV_CD?: string // ë¶€?œì½”??
	CRPN_NM?: string // ?…ì²´ëª?(?¸ì£¼?¸ë ¥??
	ENTR_NO?: string // ?…ì‚¬ë²ˆí˜¸
	ENTR_DT?: string // ?…ì‚¬?¼ì (YYYYMMDD)
	WKG_ST_DIV?: string // ê·¼ë¬´?íƒœëª?(?¬ì§/?´ì§/?´ì‚¬)
	WKG_ST_DIV_CD?: string // ê·¼ë¬´?íƒœì½”ë“œ (1:?¬ì§, 2:?´ì§, 3:?´ì‚¬)
	LAST_TCN_GRD?: string // ìµœì¢…ê¸°ìˆ ?±ê¸‰ëª?
	CARR_YM?: string // ê²½ë ¥ (?„ì›”)
	CTQL_CD_NM?: string // ?ê²©ì¦ëª…
	CTQL_CD?: string // ?ê²©ì¦ì½”??
	MOB_PHN_NO?: string // ?´ë??°ë²ˆ??
	EMAIL_ADDR?: string // ?´ë©”?¼ì£¼??
	RETIR_DT?: string // ?´ì‚¬?¼ì (YYYYMMDD)
	LAST_IN_DT?: string // ìµœì¢…?¬ì…?¼ì
	FST_IN_DT?: string // ìµœì´ˆ?¬ì…?¼ì
	LAST_END_DT?: string // ìµœì¢…ì² ìˆ˜?¼ì
	LAST_IN_STRT_DT?: string // ìµœì¢…?¬ì…?œì‘?¼ì
	LAST_IN_END_DT?: string // ìµœì¢…?¬ì…ì¢…ë£Œ?¼ì
	LAST_PRJT?: string // ìµœì¢…?„ë¡œ?íŠ¸ëª?
	RMK?: string // ë¹„ê³ 
	EMP_ENG_NM?: string // ?ë¬¸ëª?
	RES_REG_NO?: string // ì£¼ë??±ë¡ë²ˆí˜¸
	BIR_YR_MN_DT?: string // ?ë…„?”ì¼
	SEX_DIV_CD?: string // ?±ë³„ì½”ë“œ
	NTLT_DIV_CD?: string // êµ? ì½”ë“œ
	HOME_TEL?: string // ?íƒ?„í™”ë²ˆí˜¸
	HOME_ZIP_NO?: string // ?íƒ?°í¸ë²ˆí˜¸
	HOME_ADDR?: string // ?íƒì£¼ì†Œ
	HOME_DET_ADDR?: string // ?íƒ?ì„¸ì£¼ì†Œ
	LAST_SCHL?: string // ìµœì¢…?™ë ¥
	MAJR?: string // ?„ê³µ
	LAST_GRAD_DT?: string // ìµœì¢…ì¡¸ì—…?¼ì
	CTQL_PUR_DT?: string // ?ê²©ì·¨ë“?¼ì
	CARR_MCNT?: string // ê²½ë ¥ê°œì›”??
}

/**
 * ê³µí†µ ì½”ë“œ ?°ì´??êµ¬ì¡°
 * ?€ë¶„ë¥˜ ì½”ë“œ ì¡°íšŒ ???¬ìš©?˜ëŠ” ?¸í„°?˜ì´??
 */
interface CommonCode {
	data?: string // ì½”ë“œê°?
	label?: string // ì½”ë“œëª?
	codeId?: string // ì½”ë“œID
	codeNm?: string // ì½”ë“œëª?
	DATA?: string // ?œë²„ ?‘ë‹µ??ì½”ë“œê°?
	LABEL?: string // ?œë²„ ?‘ë‹µ??ì½”ë“œëª?
}

/**
 * PSM1010M00 - ?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´
 *
 * ?¬ì›ê³??¸ì£¼ ?¸ë ¥???•ë³´ë¥?ê´€ë¦¬í•˜???µí•© ë©”ì¸ ?”ë©´?…ë‹ˆ??
 * ??ê¸°ë°˜ ?¸í„°?˜ì´?¤ë¡œ ?¬ëŸ¬ ê´€ë¦?ê¸°ëŠ¥???œê³µ?˜ë©°, ê°???? ?…ë¦½?ì¸ ì»´í¬?ŒíŠ¸ë¡?êµ¬ì„±?©ë‹ˆ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??ì¡°íšŒ ë°?ê²€??
 * - ?¬ì› ?•ë³´ ?±ë¡/?˜ì • (PSM1020M00)
 * - ?¸ì‚¬ë°œë ¹?´ì—­ ê´€ë¦?(PSM1030M00)
 * - ?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡ (PSM1040M00)
 * - ?„ë¡œ?„ë‚´??¡°??(PSM0050M00)
 * - ?¬ì…?„í™©ì¡°íšŒ
 *
 * ?”ë©´ êµ¬ì„±:
 * - ?ë‹¨: ê²€??ì¡°ê±´ ?ì—­ (?¬ì›ëª? ?´ë?/?¸ì£¼ êµ¬ë¶„, ê·¼ë¬´?íƒœ ??
 * - ì¤‘ì•™: ?¬ì›/?¸ì£¼ ëª©ë¡ ê·¸ë¦¬??(AG Grid)
 * - ?˜ë‹¨: ???ì—­ (?¬ì›?•ë³´, ?¸ì‚¬ë°œë ¹, ?¼ê´„?±ë¡, ?„ë¡œ??
 *
 * AS-IS: PSM_01_0100.mxml (?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´)
 * TO-BE: React ê¸°ë°˜ ?µí•© ê´€ë¦??”ë©´
 *
 * ?¬ìš© ?ˆì‹œ:
 * ```tsx
 * // ?…ë¦½ ?”ë©´?¼ë¡œ ?¬ìš©
 * <PSM1010M00 />
 *
 * // ë©”ë‰´?ì„œ ?¸ì¶œ
 * globalHandleMenuClick('PSM1010', {});
 * ```
 *
 * @author BIST Development Team
 * @since 2024
 */
export default function EmployeeMainPage() {
	const { showToast, showConfirm } = useToast()

	// ?íƒœ ê´€ë¦?
	const [activeTab, setActiveTab] = useState(0) // ?„ì¬ ?œì„± ???¸ë±??
	const [employeeList, setEmployeeList] = useState<EmployeeListData[]>([]) // ?¬ì› ë¦¬ìŠ¤??
	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeListData | null>(null) // ? íƒ???¬ì›
	const [isLoading, setIsLoading] = useState(false) // ë¡œë”© ?íƒœ
	const [error, setError] = useState<string | null>(null) // ?ëŸ¬ ë©”ì‹œì§€
	const [gridApi, setGridApi] = useState<GridApi | null>(null) // AG Grid API

	// ?˜ìœ„ ì»´í¬?ŒíŠ¸ ref
	const psm1020M00Ref = useRef<PSM1020M00Ref>(null) // ?¬ì›?•ë³´?±ë¡ë°ìˆ˜????ref
	const psm1030M00Ref = useRef<PSM1030M00Ref>(null) // ?¸ì‚¬ë°œë ¹?´ì—­ ??ref

	/**
	 * AS-IS ì¡°íšŒ ì¡°ê±´ ?íƒœ
	 * PSM_01_0101_S ?„ë¡œ?œì? ?¸ì¶œ ???¬ìš©?˜ëŠ” ?Œë¼ë¯¸í„°
	 */
	const [searchConditions, setSearchConditions] = useState({
		ownOutsDiv: '1', // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (1:?ì‚¬, 2:?¸ì£¼)
		empNm: '', // ?¬ì›?±ëª…
		hqDiv: 'ALL', // ë³¸ë?/?¸ì£¼?…ì²´ (ALL:?„ì²´)
		deptDiv: 'ALL', // ë¶€??(ALL:?„ì²´)
		duty: 'ALL', // ì§ì±… (ALL:?„ì²´)
		retirYn: 'N', // ?´ì‚¬?í¬?¨ìœ ë¬?(Y:?¬í•¨, N:ë¯¸í¬??
	})

	/**
	 * AS-IS ê³µí†µ ì½”ë“œ ?íƒœ
	 * ?€ë¶„ë¥˜ ì½”ë“œ ì¡°íšŒ ê²°ê³¼ë¥??€??
	 */
	const [commonCodes, setCommonCodes] = useState<{
		hqDiv: CommonCode[] // ë³¸ë?/?¸ì£¼?…ì²´ ì½”ë“œ ëª©ë¡
		deptDiv: CommonCode[] // ë¶€??ì½”ë“œ ëª©ë¡
		duty: CommonCode[] // ì§ì±… ì½”ë“œ ëª©ë¡
	}>({
		hqDiv: [],
		deptDiv: [],
		duty: [],
	})

	/**
	 * ??ë©”ë‰´ ?•ì˜
	 * AS-IS?€ ?™ì¼????êµ¬ì„±
	 */
	const tabs = [
		'?¬ì›?•ë³´?±ë¡ ë°??˜ì •',
		'?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„)',
		'?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡',
		'?„ë¡œ?„ë‚´??¡°??,
	]

	/**
	 * ?´ì‚¬???¬ë?ë¥??•ì¸?˜ëŠ” ?¨ìˆ˜
	 */
	const isRetiredEmployee = (data: any) => {
		const workStatus = data?.WKG_ST_DIV
		const workStatusCd = data?.WKG_ST_DIV_CD
		return workStatus === '?´ì‚¬' || workStatusCd === '3'
	}

	/**
	 * ?´ì‚¬???ìŠ¤?¸ë? ë¹¨ê°„?‰ìœ¼ë¡??Œë”ë§í•˜??ê³µí†µ ?¨ìˆ˜
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
	 * AG Grid ì»¬ëŸ¼ ?•ì˜
	 * AS-IS AdvancedDataGrid?€ ?™ì¼??ì»¬ëŸ¼ êµ¬ì„±
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
				headerName: '?¬ì›ë²ˆí˜¸', 
				field: 'EMP_NO', 
				width: 100,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'êµ¬ë¶„', 
				field: 'OWN_OUTS_DIV', 
				width: 70,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?±ëª…',
				field: 'EMP_NM',
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'ì§ì±…', 
				field: 'DUTY', 
				width: 70,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'ë³¸ë?', 
				field: 'HQ_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'ë¶€??, 
				field: 'DEPT_DIV', 
				width: 150, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?…ì²´ëª?, 
				field: 'CRPN_NM', 
				width: 90, 
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?…ì‚¬?¼ì',
				field: 'ENTR_DT',
				width: 110,
				cellRenderer: (params: any) => {
					// YYYYMMDD ?•ì‹??YYYY-MM-DD ?•ì‹?¼ë¡œ ë³€??
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
				headerName: '?íƒœ', 
				field: 'WKG_ST_DIV', 
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?±ê¸‰', 
				field: 'LAST_TCN_GRD_CD', 
				width: 80,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'ê²½ë ¥', 
				field: 'CARR_YM', 
				width: 100,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?ê²©ì¦?, 
				field: 'CTQL_CD_NM', 
				width: 130,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: '?°ë½ì²?, 
				field: 'MOB_PHN_NO', 
				width: 130, 
				hide: false,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: '?´ì‚¬?¼ì',
				field: 'RETIR_DT',
				width: 110,
				hide: false,
				cellRenderer: (params: any) => {
					// YYYYMMDD ?•ì‹??YYYY-MM-DD ?•ì‹?¼ë¡œ ë³€??
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
				headerName: 'ìµœì¢…?¬ì…??,
				field: 'LAST_IN_STRT_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: 'ìµœì¢…ì² ìˆ˜??,
				field: 'LAST_IN_END_DT',
				width: 100,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{
				headerName: 'ìµœì¢…?„ë¡œ?íŠ¸',
				field: 'LAST_PRJT',
				width: 150,
				hide: true,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
			{ 
				headerName: 'ë¹„ê³ ', 
				field: 'RMK', 
				flex: 1, 
				minWidth: 200,
				cellRenderer: (params: any) => renderRetiredText(params.value, params.data),
			},
		],
		[]
	)

	/**
	 * AG Grid ê¸°ë³¸ ?¤ì •
	 * ëª¨ë“  ì»¬ëŸ¼??ê³µí†µ?¼ë¡œ ?ìš©?˜ëŠ” ?ì„±
	 */
	const defaultColDef = useMemo(
		() => ({
			sortable: true, // ?•ë ¬ ê°€??
			filter: true, // ?„í„° ê°€??
			resizable: true, // ?¬ê¸° ì¡°ì • ê°€??
			minWidth: 60, // ìµœì†Œ ?ˆë¹„
			maxWidth: 300, // ìµœë? ?ˆë¹„
		}),
		[]
	)

	/**
	 * ì»´í¬?ŒíŠ¸ ì´ˆê¸°??
	 * AS-IS init() ?¨ìˆ˜?€ ?™ì¼????• 
	 */
	useEffect(() => {
		initializeData()
	}, [])

	/**
	 * ì´ˆê¸° ?°ì´??ë¡œë“œ
	 * ê³µí†µ ì½”ë“œ ë¡œë“œ ë°?ì´ˆê¸° ì¡°íšŒ ?¤í–‰
	 */
	const initializeData = async () => {
		try {
			// AS-IS?€ ?™ì¼??ê³µí†µ ì½”ë“œ ë¡œë“œ
			await loadCommonCodes()

			// AS-IS?€ ?™ì¼??ì´ˆê¸° ì¡°íšŒ
			await handleSearch()
		} catch (error) {
			console.error('ì´ˆê¸°??ì¤??¤ë¥˜:', error)
			setError('ì´ˆê¸°??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.')
		}
	}

	/**
	 * AS-IS ê³µí†µ ì½”ë“œ ë¡œë“œ
	 * ?€ë¶„ë¥˜ ì½”ë“œ ì¡°íšŒ (AS-IS: S_cbHqDiv.setLargeCode2113, S_cbDuty.setLargeCode2 ??
	 */
	const loadCommonCodes = async () => {
		try {
			// ë³¸ë? ì½”ë“œ ë¡œë“œ (AS-IS: S_cbHqDiv.setLargeCode2113)
			const hqResponse = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode: '113' }),
			})
			const hqResult = await hqResponse.json()
			const hqData = hqResult.data || []

			// ì§ì±… ì½”ë“œ ë¡œë“œ (AS-IS: S_cbDuty.setLargeCode2)
			const dutyResponse = await fetch('/api/common/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ largeCategoryCode: '116' }),
			})
			const dutyResult = await dutyResponse.json()
			const dutyData = dutyResult.data || []

			// ë¶€??ì½”ë“œ ë¡œë“œ (AS-IS: S_cbDeptDiv.setDeptCode3(ALL,'ALL','Y))
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

			// ?œë²„ ?°ì´?°ì—??ALLì½”ë“œë¥??œê±°?˜ê³  ?´ë¼?´ì–¸?¸ì—??ë§??„ì— ì¶”ê?
			const filterAndAddAllOption = (data: any[]) => {
				const filteredData = data?.filter((item) => item.codeId !== 'ALL') || []
				return [{ codeId: 'ALL', codeNm: '?„ì²´' }, ...filteredData]
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
			console.error('ê³µí†µ ì½”ë“œ ë¡œë“œ ì¤??¤ë¥˜:', error)
		}
	}

	/**
	 * AS-IS ë³¸ë? ë³€ê²???ë¶€??ë¡œë“œ
	 * AS-IS: S_cbDeptDiv.setDeptCode3(strS_DeptDiv,strS_HqDiv,"Y")
	 */
	const handleHqDivChange = async (hqDiv: string) => {
		try {
			setSearchConditions((prev) => ({
				...prev,
				hqDiv,
				deptDiv: 'ALL', // ë³¸ë? ë³€ê²???ë¶€?œëŠ” ?„ì²´ë¡?ì´ˆê¸°??
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

			// ?œë²„ ?°ì´?°ì—??ALLì½”ë“œë¥??œê±°?˜ê³  ?´ë¼?´ì–¸?¸ì—??ë§??„ì— ì¶”ê?
			const filteredDeptData =
				deptData?.filter((item: any) => item.DATA !== 'ALL') || []
			const finalDeptData = [
				{ DATA: 'ALL', LABEL: '?„ì²´' },
				...filteredDeptData,
			]

			setCommonCodes((prev) => ({
				...prev,
				deptDiv: finalDeptData,
			}))
		} catch (error) {
			console.error('ë¶€??ë¡œë“œ ì¤??¤ë¥˜:', error)
		}
	}

	/**
	 * AS-IS ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²?
	 * ?ì‚¬ë©?ë³¸ë?, ?¸ì£¼ë©??¸ì£¼?…ì²´ ì½”ë“œ ë¡œë“œ
	 */
	const handleOwnOutsDivChange = async (ownOutsDiv: string) => {
		setSearchConditions((prev) => ({
			...prev,
			ownOutsDiv,
			hqDiv: 'ALL',
			deptDiv: 'ALL',
		}))

		// AS-IS?€ ?™ì¼??ë¡œì§: ?ì‚¬ë©?ë³¸ë?, ?¸ì£¼ë©??¸ì£¼?…ì²´
		if (ownOutsDiv === '1') {
			// ?ì‚¬: ë³¸ë? ì½”ë“œ ë¡œë“œ
			await loadCommonCodes()
		} else {
			// ?¸ì£¼: ?¸ì£¼?…ì²´ ì½”ë“œ ë¡œë“œ (AS-IS: S_cbHqDiv.setLargeCode2('111','ALL'))
			try {
				const response = await fetch('/api/common/search', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ largeCategoryCode: '111' }), // ?¸ì£¼?…ì²´ ?€ë¶„ë¥˜ ì½”ë“œ
				})
				const outsCompanyResult = await response.json()
				const outsCompanyData = outsCompanyResult.data || []

				// ?¸ì£¼?…ì²´ ëª©ë¡???„ì²´??ì¶”ê?
				const filterAndAddAllOption = (data: any[]) => {
					const filteredData =
						data?.filter((item) => item.codeId !== 'ALL') || []
					return [{ codeId: 'ALL', codeNm: '?„ì²´' }, ...filteredData]
				}

				setCommonCodes((prev) => ({
					...prev,
					hqDiv: filterAndAddAllOption(outsCompanyData),
					deptDiv: [{ codeId: 'ALL', codeNm: '?„ì²´' }], // ?¸ì£¼??ë¶€?œê? ?†ìœ¼ë¯€ë¡??„ì²´ë§?
					duty: prev.duty, // ì§ì±…?€ ê·¸ë?ë¡?? ì?
				}))
			} catch (error) {
				console.error('?¸ì£¼?…ì²´ ì½”ë“œ ë¡œë“œ ì¤??¤ë¥˜:', error)
			}
		}
	}

	/**
	 * AS-IS ?¬ì› ë¦¬ìŠ¤??ì¡°íšŒ
	 * PSM_01_0101_S ?„ë¡œ?œì? ?¸ì¶œ
	 */
	const handleSearch = async () => {
		setIsLoading(true)
		setError(null)

		try {
			// AS-IS?€ ?™ì¼???Œë¼ë¯¸í„° êµ¬ì„±
			const params = [
				'ALL', // ?¬ì›ë²ˆí˜¸
				searchConditions.empNm, // ?¬ì›?±ëª…
				searchConditions.ownOutsDiv, // êµ¬ë¶„
				searchConditions.hqDiv, // ë³¸ë?
				searchConditions.deptDiv, // ë¶€??
				searchConditions.duty, // ì§ì±…
				searchConditions.retirYn, // ?´ì‚¬?í¬?¨ìœ ë¬?
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
					// ?„ë¡œ?œì??ì„œ ë°˜í™˜?˜ëŠ” ?ë³¸ ?°ì´?°ë? ê·¸ë?ë¡??¬ìš©
					setEmployeeList(result.data || [])

					// ì¡°íšŒ ???˜ë‹¨ ??“¤ ì´ˆê¸°??
					if (psm1020M00Ref.current) {
						psm1020M00Ref.current.initialize()
					}

					if (psm1030M00Ref.current) {
						psm1030M00Ref.current.initialize()
					}

					// ? íƒ???¬ì› ì´ˆê¸°??
					setSelectedEmployee(null)

					// AS-IS?€ ?™ì¼?˜ê²Œ ì¡°íšŒ ?±ê³µ ??ê·¸ë¦¬??ì»¬ëŸ¼ ë³€ê²?
					updateGridColumns()
					if (result.data && result.data.length > 0) {
						showToast(
							`${result.data.length}ëª…ì˜ ?¬ì›??ì¡°íšŒ?˜ì—ˆ?µë‹ˆ??`,
							'info'
						)
					} else {
						showToast('ì¡°íšŒ???¬ì›???†ìŠµ?ˆë‹¤.', 'warning')
					}
				} else {
					setError(result.message || 'ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
					showToast(result.message || 'ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error')
				}
			} else {
				throw new Error('ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (error) {
			console.error('?¬ì› ë¦¬ìŠ¤??ì¡°íšŒ ì¤??¤ë¥˜:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
			setError(errorMessage)
			showToast(errorMessage, 'error')
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * AS-IS?€ ?™ì¼?˜ê²Œ ì¡°íšŒ ?±ê³µ ??ê·¸ë¦¬??ì»¬ëŸ¼ ?™ì  ë³€ê²?
	 * ?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¼ ì»¬ëŸ¼ ?œì‹œ/?¨ê? ì²˜ë¦¬
	 */
	const updateGridColumns = () => {
		if (!gridApi) return

		const isOwn = searchConditions.ownOutsDiv === '1'
		const isOuts = searchConditions.ownOutsDiv === '2'

		// AS-IS?€ ?™ì¼??ì»¬ëŸ¼ visible ì²˜ë¦¬
		if (isOwn) {
			// ?ì‚¬ ?¸ë ¥ ì¡°íšŒ ??
			gridApi.setColumnVisible('HQ_DIV', true) // ë³¸ë?
			gridApi.setColumnVisible('DEPT_DIV', true) // ë¶€??
			gridApi.setColumnVisible('CRPN_NM', false) // ?…ì²´ëª?
			gridApi.setColumnVisible('MOB_PHN_NO', true) // ?°ë½ì²?
			gridApi.setColumnVisible('RETIR_DT', true) // ?´ì‚¬?¼ì
			gridApi.setColumnVisible('LAST_IN_STRT_DT', false) // ìµœì¢…?¬ì…??
			gridApi.setColumnVisible('LAST_IN_END_DT', false) // ìµœì¢…ì² ìˆ˜??
			gridApi.setColumnVisible('LAST_PRJT', false) // ìµœì¢…?„ë¡œ?íŠ¸

			// ì»¬ëŸ¼ëª?ë³€ê²?
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '?…ì‚¬?¼ì'
				gridApi.refreshHeader()
			}
		} else if (isOuts) {
			// ?¸ì£¼ ?¸ë ¥ ì¡°íšŒ ??
			gridApi.setColumnVisible('HQ_DIV', false) // ë³¸ë?
			gridApi.setColumnVisible('DEPT_DIV', false) // ë¶€??
			gridApi.setColumnVisible('CRPN_NM', true) // ?…ì²´ëª?
			gridApi.setColumnVisible('MOB_PHN_NO', false) // ?°ë½ì²?
			gridApi.setColumnVisible('RETIR_DT', false) // ?´ì‚¬?¼ì
			gridApi.setColumnVisible('LAST_IN_STRT_DT', true) // ìµœì¢…?¬ì…??
			gridApi.setColumnVisible('LAST_IN_END_DT', true) // ìµœì¢…ì² ìˆ˜??
			gridApi.setColumnVisible('LAST_PRJT', true) // ìµœì¢…?„ë¡œ?íŠ¸

			// ì»¬ëŸ¼ëª?ë³€ê²?
			const columnApi = gridApi.getColumnDef('ENTR_DT')
			if (columnApi) {
				columnApi.headerName = '?¸ì£¼?‘ìˆ˜??
				gridApi.refreshHeader()
			}
		}

		// ì»¬ëŸ¼ ?¬ê¸°ë¥?ì»¨í…Œ?´ë„ˆ ?ˆë¹„??ë§ê²Œ ?ë™ ì¡°ì •
		if (gridApi) {
			// ì»¬ëŸ¼ ë³€ê²????¬ê¸° ì¡°ì •
			setTimeout(() => {
				// ë¨¼ì? ëª¨ë“  ì»¬ëŸ¼???´ìš©??ë§ê²Œ ?ë™ ì¡°ì •
				gridApi.autoSizeAllColumns()
				// ê·????„ì²´ ?ˆë¹„??ë§ê²Œ ì¡°ì • (ë¹„ê³  ì»¬ëŸ¼???¨ì? ê³µê°„ ì°¨ì?)
				gridApi.sizeColumnsToFit()
			}, 10)
		}
	}

	/**
	 * AG Grid ?´ë²¤???¸ë“¤??
	 * ê·¸ë¦¬??ì´ˆê¸°???„ë£Œ ???¸ì¶œ
	 */
	const onGridReady = (params: GridReadyEvent) => {
		setGridApi(params.api)
	}

	/**
	 * AG Grid ?´ë²¤???¸ë“¤??
	 * ?°ì´?°ê? ì²˜ìŒ ?Œë”ë§ëœ ???¸ì¶œ
	 */
	const onFirstDataRendered = (params: any) => {
		// ë¨¼ì? ëª¨ë“  ì»¬ëŸ¼???´ìš©??ë§ê²Œ ?ë™ ì¡°ì •
		params.api.autoSizeAllColumns()
		// ê·????„ì²´ ?ˆë¹„??ë§ê²Œ ì¡°ì • (ë¹„ê³  ì»¬ëŸ¼???¨ì? ê³µê°„ ì°¨ì?)
		setTimeout(() => {
			params.api.sizeColumnsToFit()
		}, 10)
	}

	/**
	 * AG Grid ???´ë¦­ ?´ë²¤??
	 * ?¬ì› ? íƒ ???¸ì¶œ
	 */
	const onRowClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AG Grid ???”ë¸”?´ë¦­ ?´ë²¤??
	 * ?¬ì› ? íƒ ???¸ì¶œ (AS-IS OnDblClickGrdEmpInfoList)
	 */
	const onRowDoubleClicked = (event: any) => {
		const employee = event.data
		handleEmployeeSelect(employee)
	}

	/**
	 * AS-IS ?¬ì› ? íƒ ????ë³€ê²?ë¡œì§
	 * ? íƒ???¬ì› ?•ë³´ë¥??˜ìœ„ ??ì»´í¬?ŒíŠ¸???„ë‹¬
	 */
	const handleEmployeeSelect = (employee: EmployeeListData) => {
		setSelectedEmployee(employee)

		// ?¬ì› ? íƒ ??ëª¨ë“  ??ì´ˆê¸°??
		if (psm1020M00Ref.current) {
			psm1020M00Ref.current.initialize()
		}

		if (psm1030M00Ref.current) {
			psm1030M00Ref.current.initialize()
		}

		// AS-IS?€ ?™ì¼????³„ ì²˜ë¦¬ ë¡œì§
		if (activeTab === 0) {
			// ?¬ì›?•ë³´?±ë¡ë°ìˆ˜????
		} else if (activeTab === 1) {
			// ?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„) ??
		} else if (activeTab === 2) {
			// ?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡ ??
		} else if (activeTab === 3) {
			// ?„ë¡œ?„ë‚´??¡°????
		}
	}

	/**
	 * selectedEmployeeê°€ ë³€ê²½ë˜ê³??¬ì›?•ë³´?±ë¡ë°ìˆ˜????¼ ??handleSearch ?¸ì¶œ
	 * ?€?´ë° ?´ìŠˆ ?´ê²°???„í•œ ì§€??ì²˜ë¦¬
	 */
	useEffect(() => {
		if (selectedEmployee && activeTab === 0 && psm1020M00Ref.current) {
			// employeeData ?¤ì •??ê¸°ë‹¤ë¦???handleSearch ?¸ì¶œ
			const timer = setTimeout(() => {
				if (psm1020M00Ref.current) {
					psm1020M00Ref.current.handleSearch()
				}
			}, 100) // 100ms ì§€?°ìœ¼ë¡?employeeData ?¤ì • ?„ë£Œ ë³´ì¥

			return () => clearTimeout(timer)
		}
	}, [selectedEmployee, activeTab])

	// ?ˆë„??ë¦¬ì‚¬?´ì¦ˆ ?œì—??ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
	useEffect(() => {
		const handleResize = () => {
			if (gridApi) {
				// ë¦¬ì‚¬?´ì¦ˆ ??ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
				setTimeout(() => {
					// ë¨¼ì? ëª¨ë“  ì»¬ëŸ¼???´ìš©??ë§ê²Œ ?ë™ ì¡°ì •
					gridApi.autoSizeAllColumns()
					// ê·????„ì²´ ?ˆë¹„??ë§ê²Œ ì¡°ì • (ë¹„ê³  ì»¬ëŸ¼???¨ì? ê³µê°„ ì°¨ì?)
					gridApi.sizeColumnsToFit()
				}, 10)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [gridApi])

	/**
	 * AS-IS OnDblClickGrdEmpInfoList ?¨ìˆ˜??enable/disable ì²˜ë¦¬ ë¡œì§
	 * ?˜ì • ë¶ˆê??¥í•œ ?…ë ¥ ??ª© ë¹„í™œ?±í™”
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

		// AS-IS?€ ?™ì¼??ë¡œì§: ?˜ì • ë¶ˆê????…ë ¥ ??ª© ë¹„í™œ?±í™”
		return {
			empNo: false, // ?¬ì›ë²ˆí˜¸ - ?˜ì • ë¶ˆê?
			ownOutsDiv: false, // ?ì‚¬?¸ì£¼êµ¬ë¶„ - ?˜ì • ë¶ˆê?
			hqDiv: false, // ë³¸ë? - ?˜ì • ë¶ˆê? (?¸ì‚¬ë°œë ¹ ?±ë¡?œì—ë§?ê°€??
			deptDiv: false, // ë¶€??- ?˜ì • ë¶ˆê? (?¸ì‚¬ë°œë ¹ ?±ë¡?œì—ë§?ê°€??
			duty: employee.OWN_OUTS_DIV_CD === '1' ? false : true, // ì§ì±… - ?ì‚¬???˜ì • ë¶ˆê?, ?¸ì£¼???˜ì • ê°€??
			crpnNm: false, // ?…ì²´ëª?- ?˜ì • ë¶ˆê?
		}
	}

	/**
	 * AS-IS ?¬ì…?„í™©ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
	 * BSN_07_0150 ?ì—… ?¸ì¶œ ë¡œì§ (êµ¬í˜„ ?ˆì •)
	 */
	const handleProjectInquiry = () => {
		if (!selectedEmployee) {
			showToast(
				'?¬ì›(?¸ì£¼) ë¦¬ìŠ¤?¸ì—???€?ìë¥?? íƒ ?´ë¦­??ì£¼ì‹­?œìš”.',
				'warning'
			)
			return
		}
		// AS-IS: BSN_07_0150 ?ì—… ?¸ì¶œ ë¡œì§
		showToast('?¬ì…?¸ë ¥?„í™©(BSN0660P00) ?”ë©´ ê°œë°œì¤‘ì…?ˆë‹¤.', 'info');
	}

	return (
		<div className='mdi flex flex-col h-[calc(100vh-200px)] overflow-hidden min-w-[1400px]'>
			{/* AS-IS ì¡°íšŒ ?ì—­ */}
			<div className='search-div mb-4 shrink-0'>
				<table className='search-table w-full'>
					<tbody>
						<tr>
							<th className='search-th w-[100px]'>?ì‚¬ ?¸ì£¼ êµ¬ë¶„</th>
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
										<span className='ml-1'>?ì‚¬</span>
									</label>
									<label className='flex items-center'>
										<input
											type='radio'
											name='ownOutsDiv'
											value='2'
											checked={searchConditions.ownOutsDiv === '2'}
											onChange={(e) => handleOwnOutsDivChange(e.target.value)}
										/>
										<span className='ml-1'>?¸ì£¼</span>
									</label>
								</div>
							</td>
							<th className='search-th w-[80px]'>?¬ì›?±ëª…</th>
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
									placeholder='?¬ì›ëª??…ë ¥'
									title='?¬ì›ëª??…ë ¥'
								/>
							</td>
							<th className='search-th w-[60px]'>
								{searchConditions.ownOutsDiv === '2' ? '?¸ì£¼?…ì²´' : 'ë³¸ë?'}
							</th>
							<td className='search-td w-[150px]'>
								<select
									className='combo-base w-full'
									value={searchConditions.hqDiv}
									onChange={(e) => handleHqDivChange(e.target.value)}
									title={
										searchConditions.ownOutsDiv === '2'
											? '?¸ì£¼?…ì²´ ? íƒ'
											: 'ë³¸ë? ? íƒ'
									}
								>
									{commonCodes.hqDiv.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[60px]'>ë¶€??/th>
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
									title='ë¶€??? íƒ'
								>
									{commonCodes.deptDiv.map((code, idx) => (
										<option key={code.DATA || idx} value={code.DATA}>
											{code.LABEL}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[60px]'>ì§ì±…</th>
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
									title='ì§ì±… ? íƒ'
								>
									{commonCodes.duty.map((code, idx) => (
										<option key={code.codeId || idx} value={code.codeId}>
											{code.codeNm}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[80px]'>?´ì‚¬?í¬??/th>
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
									title='?´ì‚¬???¬í•¨'
								/>
							</td>
							<td className='search-td text-right'>
								<button
									className='btn-base btn-search'
									onClick={handleSearch}
									disabled={isLoading}
								>
									{isLoading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* AS-IS ë¦¬ìŠ¤???€?´í? */}
			<div className='tit_area shrink-0'>
				<h3>?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??/h3>
				<div>
					<button className='btn-base btn-etc' onClick={handleProjectInquiry}>
						?¬ì…?„í™©ì¡°íšŒ
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

			{/* AS-IS ???„ì²´ ?ì—­ */}
			<div className='flex flex-col flex-1 min-h-0'>
				{/* ??ë²„íŠ¼ */}
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
				{/* ??ì½˜í…ì¸?*/}
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
			{/* ?ëŸ¬ ë©”ì‹œì§€ */}
			{error && <div className='text-red-500 text-sm mt-2 px-1'>{error}</div>}
		</div>
	)
}


