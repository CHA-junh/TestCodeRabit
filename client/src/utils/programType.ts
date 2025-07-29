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
			// 필요시 dialog, report 등도 추가 가능
		}
	}
	// fallback: 기존 접미사 판별 (하위 호환성 유지)
	if (pgmId.endsWith('M00')) return 'main'
	if (pgmId.endsWith('P00')) return 'popup'
	if (pgmId.endsWith('D00')) return 'dialog'
	if (pgmId.endsWith('R00')) return 'report'
	return 'unknown'
}
