'use client'

import React from 'react'

/**
 * DASH0001M00 - ??λ³΄??λ©μΈ ?λ©΄
 * 
 * μ£Όμ κΈ°λ₯:
 * - ?¬μ ?ν© ?μ½ ?μ
 * - ?λ‘?νΈ μ§ν ?ν© ?μ
 * - μΆμ§λΉ??¬μ© ?ν© ?μ
 * - κΆνλ³???λ³΄??κ΅¬μ±
 * 
 * ?°κ? ?μ΄λΈ?
 * - TBL_BSN_NO_INF (?¬μλ²νΈ ?λ³΄)
 * - TBL_BSN_PLAN (?¬μκ³ν)
 * - TBL_PPLCT_USE_SPEC (?λ¬΄μΆμ§λΉ??¬μ© ?΄μ­)
 */

export default function DASH0001M00() {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>??λ³΄??/h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>?¬μ ?ν©</h2>
					<p className='text-gray-600'>?¬μ κ΄λ¦??ν©???μΈ?μΈ??</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>?λ‘?νΈ ?ν©</h2>
					<p className='text-gray-600'>?λ‘?νΈ μ§ν ?ν©???μΈ?μΈ??</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-lg font-semibold mb-2'>μΆμ§λΉ??ν©</h2>
					<p className='text-gray-600'>μΆμ§λΉ??¬μ© ?ν©???μΈ?μΈ??</p>
				</div>
			</div>
		</div>
	)
}


