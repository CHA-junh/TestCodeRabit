'use client'

import React, { useState } from 'react'
import '../common/common.css'
import TopFrame from './TopFrame'
import LeftFrame from './LeftFrame'
import MenuTree from './MenuTree'
import MainTab from './MainTab'
import PageTitle from './PageTitle'
import ContentFrame from './ContentFrame'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { TAB_CONSTANTS, MESSAGE_CONSTANTS } from '@/utils/constants'

/**
 * COM0000M00 - 메인?�레???�면
 *
 * 주요 기능:
 * - 메뉴 ?�리 ?�시 �??�비게이??
 * - ??기반 ?�면 관�?(최�? 5�?
 * - ?�용???�보 ?�시
 * - 로그?�웃 처리
 *
 * ?��? 컴포?�트:
 * - TopFrame (?�단 ?�더)
 * - LeftFrame (좌측 ?�이콘바)
 * - MenuTree (메뉴 ?�리)
 * - Maintab (??관�?
 * - ContentFrame (콘텐�??�역)
 */

interface TabItem {
	programId: string
	title: string
	menuPath: string
}

// Toast 메시지 ?�수
const TOAST_MESSAGES = {
	BUSINESS_PREPARING: '?�업관�?기능??준비중?�니??',
	PROJECT_PREPARING: '?�로?�트관�?기능??준비중?�니??',
	COST_PREPARING: '?�무추진�?기능??준비중?�니??',
	PROGRAM_NOT_FOUND: '?�로그램??찾을 ???�습?�다.',
} as const

export default function COM0000M00() {
	const { user, session, logout, isAuthenticated } = useAuth()
	const { showToast } = useToast()
	// 메뉴?�리 show/hide ?�태 (기본값을 false�?변�?
	const [showMenuTree, setShowMenuTree] = useState(false)
	// 메뉴?�리 lock ?�태
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	// ??배열 �??�성 ???�태 추�?
	const [tabs, setTabs] = useState<TabItem[]>([])
	const [activeTab, setActiveTab] = useState<string>('')

	// 컴포?�트 마운???�점 로그

	// ?�라?�드 ?�태 추적 �?강제 ?�기??

	// ?�증?��? ?��? 경우 ?�무것도 ?�더링하지 ?�음 (?�위 컴포?�트?�서 처리)
	if (!isAuthenticated || !user) return null

	const handleMenuClick = (pgmId: string) => {
		// ?�릭??메뉴???�보 ?�인
		const menu = (session.user?.menuList || []).find(
			(m: any) => m.PGM_ID === pgmId
		)

		// PGM_ID가 ?�는 메뉴(?�더)??처리?��? ?�음
		if (!menu || !menu.PGM_ID) {
			return
		}

		// ?�릭??메뉴??pgmId�?programList?�서 찾기
		const program = (session.user?.programList || []).find(
			(p: any) => p.PGM_ID === pgmId
		)

		if (!program) {
			return
		}

		// ?��? ?�린 ??���??�커?�만 ?�동
		if (tabs.some((tab) => tab.programId === pgmId)) {
			setActiveTab(pgmId)
			if (!menuTreeLocked) {
				setShowMenuTree(false)
				setTimeout(() => setShowMenuTree(false), 0)
			}
			return
		}

		// ??개수 ?�한 체크
		if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
			showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
			return
		}
		const menuPath = program.LINK_PATH
			? program.LINK_PATH.replace(/\.tsx$/i, '')
			: ''
		const title = program.PGM_NM ? program.PGM_NM : pgmId
		// 로그�??�이??추적 (?�요??주석 ?�제)
		// console.log('[MenuTree ?�릭]', { pgmId, program, menuPath, title })
		// console.log('[handleMenuClick] tabs(before):', tabs)
		// ????추�?
		const newTab: TabItem = { programId: pgmId, title, menuPath }
		setTabs((prev) => {
			const next = [...prev, newTab]
			return next
		})
		setActiveTab(pgmId)
		if (!menuTreeLocked) {
			setShowMenuTree(false)
			setTimeout(() => setShowMenuTree(false), 0)
		}
	}

	const handleTabClick = (programId: string) => setActiveTab(programId)
	const handleTabClose = (programId: string) => {
		setTabs((prev) => prev.filter((tab) => tab.programId !== programId))
		setActiveTab((prev) => {
			if (prev !== programId) return prev
			// ?�힌 ??�� ?�성 ??���?마�?�???���??�커??
			const remain = tabs.filter((tab) => tab.programId !== programId)
			return remain.length > 0 ? remain[remain.length - 1].programId : ''
		})
	}

	// 바로가�?버튼 ?�릭 ?�들??
	const handleShortcutClick = (action: string) => {
		switch (action) {
			case 'menu':
				setShowMenuTree(!showMenuTree)
				break
			case 'business':
				// ?�업관리메??BSN0000) - 준비중 ?�림
				showToast(TOAST_MESSAGES.BUSINESS_PREPARING, 'info')
				break
			case 'project':
				// ?�로?�트관리메??PRJ0000) - 준비중 ?�림
				showToast(TOAST_MESSAGES.PROJECT_PREPARING, 'info')
				break
			case 'cost':
				// ?�무추진비메??WPC_00_0000) - 준비중 ?�림
				showToast(TOAST_MESSAGES.COST_PREPARING, 'info')
				break
			case 'hr':
				// 기본?�보?�록(개인�? (PSM0010) - ????���??�출
				const hrPgmId = 'PSM0010' // PSM1010M00 ??PSM0010?�로 ?�정
				const hrTitle = '기본?�보?�록(개인�?'

				const hrProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === hrPgmId
				)

				if (!hrProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// 메뉴 ?�리?� ?�일??방식?�로 menuPath ?�성
				const hrMenuPath = hrProgram.LINK_PATH
					? hrProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'psm/PSM0010M00'

				// ?��? ?�린 ??���??�커?�만 ?�동
				if (tabs.some((tab) => tab.programId === hrPgmId)) {
					setActiveTab(hrPgmId)
					return
				}

				// ??개수 ?�한 체크
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// ????추�?
				const newHrTab: TabItem = {
					programId: hrPgmId,
					title: hrTitle,
					menuPath: hrMenuPath,
				}
				setTabs((prev) => [...prev, newHrTab])
				setActiveTab(hrPgmId)
				break
			case 'system':
				// ?�용?��?�?USR2010) - ????���??�출
				const sysPgmId = 'USR2010' // USR2010M00 ??USR2010?�로 ?�정
				const sysTitle = '?�용?��?�?

				const sysProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === sysPgmId
				)

				if (!sysProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// 메뉴 ?�리?� ?�일??방식?�로 menuPath ?�성
				const sysMenuPath = sysProgram.LINK_PATH
					? sysProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'usr/USR2010M00'

				// ?��? ?�린 ??���??�커?�만 ?�동
				if (tabs.some((tab) => tab.programId === sysPgmId)) {
					setActiveTab(sysPgmId)
					return
				}

				// ??개수 ?�한 체크
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// ????추�?
				const newSysTab: TabItem = {
					programId: sysPgmId,
					title: sysTitle,
					menuPath: sysMenuPath,
				}
				setTabs((prev) => [...prev, newSysTab])
				setActiveTab(sysPgmId)
				break
			default:
				break
		}
	}

	// 로그?�웃 ?�들??
	const handleLogout = async () => {
		await logout()
	}

	// lock ?�태가 true가 ?�면 메뉴?�리 ??�� 고정
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

	// ?�물???�태 변�??�들??
	const handleLockChange = (locked: boolean) => {
		setMenuTreeLocked(locked)
	}

	// menuList key mapping (?�문자->camelCase)
	const mappedMenuList = (session.user?.menuList || []).map((menu: any) => ({
		menuSeq: menu.MENU_SEQ,
		menuDspNm: menu.MENU_DSP_NM,
		pgmId: menu.PGM_ID,
		menuShpDvcd: menu.MENU_SHP_DVCD,
		hgrkMenuSeq: menu.HGRK_MENU_SEQ,
		flag: menu.FLAG,
		menuUseYn: menu.MENU_USE_YN,
		menuLvl: menu.MENU_LVL,
		mapTitle: menu.MAP_TITLE,
		menuPath: menu.MENU_PATH,
	}))
	// console.log('mappedMenuList:', mappedMenuList)

	return (
		<div className='w-screen h-screen flex flex-col overflow-hidden'>
			{/* ?�단 고정 ?�더 */}
			<TopFrame
				userName={user?.name}
				userTeam={user?.department}
				userPosition={user?.position}
				userEmpNo={user?.empNo}
			/>
			{/* ?�단 본문 ?�역 */}
			<div className='flex flex-1 min-h-0 relative'>
				{/* 좌측 ?�이콘바: 고정 */}
				<div className='z-30'>
					<LeftFrame
						onMenuClick={() => setShowMenuTree((v) => !v)}
						onLogout={handleLogout}
						onShortcutClick={handleShortcutClick}
					/>
				</div>
				{/* 콘텐�??�인: relative */}
				<div className='flex-1 flex relative'>
					{/* 메뉴?�리: absolute, left-0 (콘텐�??�인 기�?) */}
					<div
						className={`absolute left-0 top-0 h-full w-[300px] bg-[#e5e5e5] overflow-y-auto border-r border-stone-300 transition-transform duration-300 z-20 ${
							showMenuTree ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<MenuTree
							menuList={mappedMenuList}
							onMenuClick={(pgmId: string) => handleMenuClick(pgmId)}
							onLockChange={handleLockChange}
						/>
					</div>
					{/* ?�제 콘텐�? 메뉴?�리 width만큼 margin-left */}
					<div
						className={`flex-1 flex flex-col transition-all duration-300 ${showMenuTree ? 'ml-[300px]' : 'ml-0'}`}
					>
						{tabs.length > 0 && activeTab && (
							<>
								<MainTab
									tabs={tabs.map((tab) => ({
										id: tab.programId,
										title: tab.title,
									}))}
									activeTab={activeTab}
									onTabClick={handleTabClick}
									onTabClose={handleTabClose}
								/>
								<PageTitle
									title={
										tabs.find((tab) => tab.programId === activeTab)?.title || ''
									}
									programId={activeTab}
									onClose={() => handleTabClose(activeTab)}
								/>
								<ContentFrame
									programId={activeTab}
									title={
										tabs.find((tab) => tab.programId === activeTab)?.title || ''
									}
									menuPath={
										tabs.find((tab) => tab.programId === activeTab)?.menuPath
									}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}


