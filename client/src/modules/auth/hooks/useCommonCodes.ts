'use client'

import { useState, useEffect } from 'react'

// 공통 코드 타입
interface CommonCode {
	code: string
	name: string
}

// 본부별 부서 목록을 위한 타입 (공통 코드 테이블 기반)
export interface DeptByHq {
	code: string // 부서구분코드
	name: string // 부서명
}

// 공통 코드 훅 반환 타입
interface UseCommonCodesReturn {
	hqDivCodes: CommonCode[]
	deptDivCodes: CommonCode[]
	loading: boolean
	error: string | null
	refreshHqDivCodes: () => Promise<void>
	refreshDeptDivCodes: () => Promise<void>
}

/**
 * 공통 코드 조회 훅
 *
 * @description
 * - 본부구분코드, 부서구분코드 등 공통 코드를 조회하는 훅
 * - 캐싱 기능으로 중복 API 호출 방지
 * - 에러 처리 및 로딩 상태 관리
 *
 * @returns 공통 코드 데이터와 관리 함수들
 *
 * @example
 * ```typescript
 * const { hqDivCodes, deptDivCodes, loading, error } = useCommonCodes();
 *
 * // 본부 콤보박스 렌더링
 * <select>
 *   <option value="">전체</option>
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
	 * 본부구분코드 조회
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
				throw new Error(`본부구분코드 조회 실패: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ 본부구분코드 조회 완료:', data)
			setHqDivCodes(data || [])
		} catch (err) {
			console.error('❌ 본부구분코드 조회 오류:', err)
			setError(
				err instanceof Error
					? err.message
					: '본부구분코드 조회 중 오류가 발생했습니다.'
			)
			setHqDivCodes([])
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 부서구분코드 조회
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
				throw new Error(`부서구분코드 조회 실패: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ 부서구분코드 조회 완료:', data)
			setDeptDivCodes(data || [])
		} catch (err) {
			console.error('❌ 부서구분코드 조회 오류:', err)
			setError(
				err instanceof Error
					? err.message
					: '부서구분코드 조회 중 오류가 발생했습니다.'
			)
			setDeptDivCodes([])
		} finally {
			setLoading(false)
		}
	}

	/**
	 * 본부구분코드 새로고침
	 */
	const refreshHqDivCodes = async () => {
		await fetchHqDivCodes()
	}

	/**
	 * 부서구분코드 새로고침
	 */
	const refreshDeptDivCodes = async () => {
		await fetchDeptDivCodes()
	}

	// 초기 데이터 로드
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
 * 부서구분코드 목록을 조회하는 커스텀 훅
 * - 최초 마운트 시 1회 API 호출
 * - 실패 시 빈 배열 반환
 *
 * @returns CommonCode[] 코드 목록
 * @example
 *   const codes = useDeptDivCodes();
 *   // codes: [{ code: '112', name: '부서' }, ...]
 */
export const useDeptDivCodes = () => {
	const [codes, setCodes] = useState<CommonCode[]>([])
	useEffect(() => {
		const fetchCodes = async () => {
			try {
				// 개발/운영 환경에 따라 API 주소 자동 분기
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
 * 본부별 부서 목록을 조회하는 커스텀 훅
 *
 * @description
 * - 본부코드(hqCd) 변경 시 자동으로 해당 본부의 부서 목록을 조회
 * - TBL_SML_CSF_CD 테이블의 부서구분코드에서 LINK_CD1로 본부별 필터링
 * - API 호출 실패 시 빈 배열 반환하여 안전하게 처리
 * - 개발/운영 환경에 따라 API 주소 자동 분기
 *
 * @param hqCd 본부구분코드 (예: '01', '02', '03', '04')
 *   - '01': 경영지원본부
 *   - '02': 영업본부
 *   - '03': 서비스사업본부
 *   - '04': 개발본부
 *   - 'ALL': 전체 (빈 배열 반환)
 *
 * @returns DeptByHq[] 부서 목록 배열
 *   - code: 부서구분코드 (예: '1101', '1201', '1301')
 *   - name: 부서명 (예: '경영지원본부', '영업본부', '서비스사업본부')
 *
 * @example
 * ```tsx
 * // 서비스사업본부 부서 목록 조회
 * const deptList = useDeptByHq('03');
 *
 * // UI에서 사용
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
 * - OracleService: TBL_SML_CSF_CD 테이블 조회
 * - CommonService: LINK_CD1 기반 본부별 부서 필터링 로직
 */
export const useDeptByHq = (hqCd: string) => {
	const [depts, setDepts] = useState<DeptByHq[]>([])

	useEffect(() => {
		const fetchDepts = async () => {
			// 본부코드가 없거나 'ALL'인 경우 빈 배열 반환
			if (!hqCd || hqCd === 'ALL') {
				setDepts([])
				return
			}

			try {
				console.log('🔍 본부별 부서 조회 시작:', hqCd)

				// 개발/운영 환경에 따라 API 주소 자동 분기
				const url =
					process.env.NODE_ENV === 'development'
						? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/common/dept-by-hq?hqCd=${hqCd}`
						: `/api/common/dept-by-hq?hqCd=${hqCd}`

				const res = await fetch(url, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})

				if (!res.ok) {
					throw new Error('부서 조회 실패')
				}

				const data = await res.json()
				const newDepts = Array.isArray(data) ? data : (data.data ?? [])
				setDepts(newDepts)
				console.log('✅ 본부별 부서 조회 완료:', newDepts)
			} catch (error) {
				console.error('❌ 본부별 부서 조회 오류:', error)
				setDepts([])
			}
		}

		fetchDepts()
	}, [hqCd])

	return depts
}
