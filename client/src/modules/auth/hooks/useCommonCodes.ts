'use client'

import { useState, useEffect } from 'react'

// 공통 코드 ?�??
interface CommonCode {
	code: string
	name: string
}

// 본�?�?부??목록???�한 ?�??(공통 코드 ?�이�?기반)
export interface DeptByHq {
	code: string // 부?�구분코??
	name: string // 부?�명
}

// 공통 코드 ??반환 ?�??
interface UseCommonCodesReturn {
	hqDivCodes: CommonCode[]
	deptDivCodes: CommonCode[]
	loading: boolean
	error: string | null
	refreshHqDivCodes: () => Promise<void>
	refreshDeptDivCodes: () => Promise<void>
}

/**
 * 공통 코드 조회 ??
 *
 * @description
 * - 본�?구분코드, 부?�구분코????공통 코드�?조회?�는 ??
 * - 캐싱 기능?�로 중복 API ?�출 방�?
 * - ?�러 처리 �?로딩 ?�태 관�?
 *
 * @returns 공통 코드 ?�이?��? 관�??�수??
 *
 * @example
 * ```typescript
 * const { hqDivCodes, deptDivCodes, loading, error } = useCommonCodes();
 *
 * // 본�? 콤보박스 ?�더�?
 * <select>
 *   <option value="">?�체</option>
 *   {hqDivCodes.map(code => (
 *     <option key={code.code} value={code.code}>
 *       {code.name}
 *     </option>
 *   ))}
 * </select>
 * ```
 */
export function useCommonCodes(): UseCommonCodesReturn {
	const [hqDivCodes, setHqDivCodes] = useState<CommonCode[]>([])
	const [deptDivCodes, setDeptDivCodes] = useState<CommonCode[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// API 기본 URL
	const API_BASE_URL =
		process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

	/**
	 * 본�?구분코드 조회
	 */
	const fetchHqDivCodes = async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await fetch(`${API_BASE_URL}/api/common/hq-div-codes`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})

			if (!response.ok) {
				throw new Error(`본�?구분코드 조회 ?�패: ${response.status}`)
			}

			const data = await response.json()
			console.log('??본�?구분코드 조회 ?�료:', data)
			setHqDivCodes(data || [])
		} catch (err) {
			console.error('??본�?구분코드 조회 ?�류:', err)
			setError(
				err instanceof Error
					? err.message
					: '본�?구분코드 조회 �??�류가 발생?�습?�다.'
			)
			setHqDivCodes([])
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 부?�구분코??조회
	 */
	const fetchDeptDivCodes = async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await fetch(
				`${API_BASE_URL}/api/common/dept-div-codes`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			)

			if (!response.ok) {
				throw new Error(`부?�구분코??조회 ?�패: ${response.status}`)
			}

			const data = await response.json()
			console.log('??부?�구분코??조회 ?�료:', data)
			setDeptDivCodes(data || [])
		} catch (err) {
			console.error('??부?�구분코??조회 ?�류:', err)
			setError(
				err instanceof Error
					? err.message
					: '부?�구분코??조회 �??�류가 발생?�습?�다.'
			)
			setDeptDivCodes([])
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 본�?구분코드 ?�로고침
	 */
	const refreshHqDivCodes = async () => {
		await fetchHqDivCodes()
	}

	/**
	 * 부?�구분코???�로고침
	 */
	const refreshDeptDivCodes = async () => {
		await fetchDeptDivCodes()
	}

	// 초기 ?�이??로드
	useEffect(() => {
		fetchHqDivCodes()
		fetchDeptDivCodes()
	}, [])

	return {
		hqDivCodes,
		deptDivCodes,
		loading,
		error,
		refreshHqDivCodes,
		refreshDeptDivCodes,
	}
}

/**
 * 부?�구분코??목록??조회?�는 커스?� ??
 * - 최초 마운????1??API ?�출
 * - ?�패 ??�?배열 반환
 *
 * @returns CommonCode[] 코드 목록
 * @example
 *   const codes = useDeptDivCodes();
 *   // codes: [{ code: '112', name: '부?? }, ...]
 */
export const useDeptDivCodes = () => {
	const [codes, setCodes] = useState<CommonCode[]>([])
	useEffect(() => {
		const fetchCodes = async () => {
			try {
				// 개발/?�영 ?�경???�라 API 주소 ?�동 분기
				const url =
					process.env.NODE_ENV === 'development'
						? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/common/dept-div-codes`
						: '/api/common/dept-div-codes'
				const res = await fetch(url)
				const data = await res.json()
				setCodes(Array.isArray(data) ? data : (data.data ?? []))
			} catch {
				setCodes([])
			}
		}
		fetchCodes()
	}, [])
	return codes
}

/**
 * 본�?�?부??목록??조회?�는 커스?� ??
 *
 * @description
 * - 본�?코드(hqCd) 변�????�동?�로 ?�당 본�???부??목록??조회
 * - TBL_SML_CSF_CD ?�이블의 부?�구분코?�에??LINK_CD1�?본�?�??�터�?
 * - API ?�출 ?�패 ??�?배열 반환?�여 ?�전?�게 처리
 * - 개발/?�영 ?�경???�라 API 주소 ?�동 분기
 *
 * @param hqCd 본�?구분코드 (?? '01', '02', '03', '04')
 *   - '01': 경영지?�본부
 *   - '02': ?�업본�?
 *   - '03': ?�비?�사?�본부
 *   - '04': 개발본�?
 *   - 'ALL': ?�체 (�?배열 반환)
 *
 * @returns DeptByHq[] 부??목록 배열
 *   - code: 부?�구분코??(?? '1101', '1201', '1301')
 *   - name: 부?�명 (?? '경영지?�본부', '?�업본�?', '?�비?�사?�본부')
 *
 * @example
 * ```tsx
 * // ?�비?�사?�본부 부??목록 조회
 * const deptList = useDeptByHq('03');
 *
 * // UI?�서 ?�용
 * {deptList.map((dept) => (
 *   <option key={dept.code} value={dept.code}>
 *     {dept.name}
 *   </option>
 * ))}
 * ```
 *
 * @api
 * - POST /api/common/dept-by-hq
 * - Request: { hqCd: string }
 * - Response: DeptByHq[]
 *
 * @dependencies
 * - OracleService: TBL_SML_CSF_CD ?�이�?조회
 * - CommonService: LINK_CD1 기반 본�?�?부???�터�?로직
 */
export const useDeptByHq = (hqCd: string) => {
	const [depts, setDepts] = useState<DeptByHq[]>([])

	useEffect(() => {
		const fetchDepts = async () => {
			// 본�?코드가 ?�거??'ALL'??경우 �?배열 반환
			if (!hqCd || hqCd === 'ALL') {
				setDepts([])
				return
			}

			try {
				console.log('?�� 본�?�?부??조회 ?�작:', hqCd)

				// 개발/?�영 ?�경???�라 API 주소 ?�동 분기
				const url =
					process.env.NODE_ENV === 'development'
						? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/common/dept-by-hq?hqCd=${hqCd}`
						: `/api/common/dept-by-hq?hqCd=${hqCd}`

				const res = await fetch(url, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})

				if (!res.ok) {
					throw new Error('부??조회 ?�패')
				}

				const data = await res.json()
				const newDepts = Array.isArray(data) ? data : (data.data ?? [])
				setDepts(newDepts)
				console.log('??본�?�?부??조회 ?�료:', newDepts)
			} catch (error) {
				console.error('??본�?�?부??조회 ?�류:', error)
				setDepts([])
			}
		}

		fetchDepts()
	}, [hqCd])

	return depts
}


