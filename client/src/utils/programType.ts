export type ProgramType = 'main' | 'popup' | 'dialog' | 'report' | 'unknown'

export function getProgramType(
	pgmId?: string | null,
	programList?: any[]
): ProgramType {
	if (typeof pgmId !== 'string') return 'unknown'
	if (programList) {
		const program = programList.find((p) => p.PGM_ID === pgmId)
		if (program) {
			const popType = program.PGM_SCRN_POP_TYPE
			if (popType === '1') return 'main' // MDI
			if (popType === '2') return 'popup' // POPUP
			// ?�요??dialog, report ?�도 추�? 가??
		}
	}
	// fallback: 기존 ?��????�별 (?�위 ?�환???��?)
	if (pgmId.endsWith('M00')) return 'main'
	if (pgmId.endsWith('P00')) return 'popup'
	if (pgmId.endsWith('D00')) return 'dialog'
	if (pgmId.endsWith('R00')) return 'report'
	return 'unknown'
}



