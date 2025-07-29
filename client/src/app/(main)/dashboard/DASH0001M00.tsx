'use client'

import React from 'react'

/**
 * DASH0001M00 - ?�?�보??메인 ?�면
 * 
 * 주요 기능:
 * - ?�업 ?�황 ?�약 ?�시
 * - ?�로?�트 진행 ?�황 ?�시
 * - 추진�??�용 ?�황 ?�시
 * - 권한�??�?�보??구성
 * 
 * ?��? ?�이�?
 * - TBL_BSN_NO_INF (?�업번호 ?�보)
 * - TBL_BSN_PLAN (?�업계획)
 * - TBL_PPLCT_USE_SPEC (?�무추진�??�용 ?�역)
 */

export default function DASH0001M00() {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>?�?�보??/h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>?�업 ?�황</h2>
					<p className='text-gray-600'>?�업 관�??�황???�인?�세??</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>?�로?�트 ?�황</h2>
					<p className='text-gray-600'>?�로?�트 진행 ?�황???�인?�세??</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>추진�??�황</h2>
					<p className='text-gray-600'>추진�??�용 ?�황???�인?�세??</p>
				</div>
			</div>
		</div>
	)
}


