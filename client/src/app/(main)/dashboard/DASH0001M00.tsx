'use client'

import React from 'react'

/**
 * DASH0001M00 - 대시보드 메인 화면
 * 
 * 주요 기능:
 * - 사업 현황 요약 표시
 * - 프로젝트 진행 상황 표시
 * - 추진비 사용 현황 표시
 * - 권한별 대시보드 구성
 * 
 * 연관 테이블:
 * - TBL_BSN_NO_INF (사업번호 정보)
 * - TBL_BSN_PLAN (사업계획)
 * - TBL_PPLCT_USE_SPEC (업무추진비 사용 내역)
 */

export default function DASH0001M00() {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>대시보드</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>사업 현황</h2>
					<p className='text-gray-600'>사업 관리 현황을 확인하세요.</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>프로젝트 현황</h2>
					<p className='text-gray-600'>프로젝트 진행 상황을 확인하세요.</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>추진비 현황</h2>
					<p className='text-gray-600'>추진비 사용 현황을 확인하세요.</p>
				</div>
			</div>
		</div>
	)
}
