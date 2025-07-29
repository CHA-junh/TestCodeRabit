import dynamic from 'next/dynamic'
import React from 'react'

const FallbackComponent: React.FC = () => (
	<div>업무화면이 준비되지 않았습니다.</div>
)

export function getDynamicProgramComponent(
	programId: string
): React.ComponentType<any> {
	// programId가 M00/P00/D00/R00 등으로 끝나지 않으면 M00을 붙임
	let id = programId
	if (!/M00|P00|D00|R00$/.test(id)) id = id + 'M00'
	try {
		return dynamic(() => import(`src/app/${id}`), {
			ssr: false,
			loading: () => <FallbackComponent />,
		})
	} catch {
		return FallbackComponent
	}
}
