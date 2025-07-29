import dynamic from 'next/dynamic'
import React from 'react'

const FallbackComponent: React.FC = () => (
	<div>?…ë¬´?”ë©´??ì¤€ë¹„ë˜ì§€ ?Šì•˜?µë‹ˆ??</div>
)

export function getDynamicProgramComponent(
	programId: string
): React.ComponentType<any> {
	// programIdê°€ M00/P00/D00/R00 ?±ìœ¼ë¡??ë‚˜ì§€ ?Šìœ¼ë©?M00??ë¶™ì„
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



