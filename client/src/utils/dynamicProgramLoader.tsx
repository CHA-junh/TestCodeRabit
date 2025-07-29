import dynamic from 'next/dynamic'
import React from 'react'

const FallbackComponent: React.FC = () => (
	<div>?�무?�면??준비되지 ?�았?�니??</div>
)

export function getDynamicProgramComponent(
	programId: string
): React.ComponentType<any> {
	// programId가 M00/P00/D00/R00 ?�으�??�나지 ?�으�?M00??붙임
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



