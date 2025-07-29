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
 * COM0000M00 - ë©”ì¸?„ë ˆ???”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ë©”ë‰´ ?¸ë¦¬ ?œì‹œ ë°??¤ë¹„ê²Œì´??
 * - ??ê¸°ë°˜ ?”ë©´ ê´€ë¦?(ìµœë? 5ê°?
 * - ?¬ìš©???•ë³´ ?œì‹œ
 * - ë¡œê·¸?„ì›ƒ ì²˜ë¦¬
 *
 * ?°ê? ì»´í¬?ŒíŠ¸:
 * - TopFrame (?ë‹¨ ?¤ë”)
 * - LeftFrame (ì¢Œì¸¡ ?„ì´ì½˜ë°”)
 * - MenuTree (ë©”ë‰´ ?¸ë¦¬)
 * - Maintab (??ê´€ë¦?
 * - ContentFrame (ì½˜í…ì¸??ì—­)
 */

interface TabItem {
	programId: string
	title: string
	menuPath: string
}

// Toast ë©”ì‹œì§€ ?ìˆ˜
const TOAST_MESSAGES = {
	BUSINESS_PREPARING: '?¬ì—…ê´€ë¦?ê¸°ëŠ¥??ì¤€ë¹„ì¤‘?…ë‹ˆ??',
	PROJECT_PREPARING: '?„ë¡œ?íŠ¸ê´€ë¦?ê¸°ëŠ¥??ì¤€ë¹„ì¤‘?…ë‹ˆ??',
	COST_PREPARING: '?…ë¬´ì¶”ì§„ë¹?ê¸°ëŠ¥??ì¤€ë¹„ì¤‘?…ë‹ˆ??',
	PROGRAM_NOT_FOUND: '?„ë¡œê·¸ë¨??ì°¾ì„ ???†ìŠµ?ˆë‹¤.',
} as const

export default function COM0000M00() {
	const { user, session, logout, isAuthenticated } = useAuth()
	const { showToast } = useToast()
	// ë©”ë‰´?¸ë¦¬ show/hide ?íƒœ (ê¸°ë³¸ê°’ì„ falseë¡?ë³€ê²?
	const [showMenuTree, setShowMenuTree] = useState(false)
	// ë©”ë‰´?¸ë¦¬ lock ?íƒœ
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	// ??ë°°ì—´ ë°??œì„± ???íƒœ ì¶”ê?
	const [tabs, setTabs] = useState<TabItem[]>([])
	const [activeTab, setActiveTab] = useState<string>('')

	// ì»´í¬?ŒíŠ¸ ë§ˆìš´???œì  ë¡œê·¸

	// ?¬ë¼?´ë“œ ?íƒœ ì¶”ì  ë°?ê°•ì œ ?™ê¸°??

	// ?¸ì¦?˜ì? ?Šì? ê²½ìš° ?„ë¬´ê²ƒë„ ?Œë”ë§í•˜ì§€ ?ŠìŒ (?ìœ„ ì»´í¬?ŒíŠ¸?ì„œ ì²˜ë¦¬)
	if (!isAuthenticated || !user) return null

	const handleMenuClick = (pgmId: string) => {
		// ?´ë¦­??ë©”ë‰´???•ë³´ ?•ì¸
		const menu = (session.user?.menuList || []).find(
			(m: any) => m.PGM_ID === pgmId
		)

		// PGM_IDê°€ ?†ëŠ” ë©”ë‰´(?´ë”)??ì²˜ë¦¬?˜ì? ?ŠìŒ
		if (!menu || !menu.PGM_ID) {
			return
		}

		// ?´ë¦­??ë©”ë‰´??pgmIdë¡?programList?ì„œ ì°¾ê¸°
		const program = (session.user?.programList || []).find(
			(p: any) => p.PGM_ID === pgmId
		)

		if (!program) {
			return
		}

		// ?´ë? ?´ë¦° ??´ë©??¬ì»¤?¤ë§Œ ?´ë™
		if (tabs.some((tab) => tab.programId === pgmId)) {
			setActiveTab(pgmId)
			if (!menuTreeLocked) {
				setShowMenuTree(false)
				setTimeout(() => setShowMenuTree(false), 0)
			}
			return
		}

		// ??ê°œìˆ˜ ?œí•œ ì²´í¬
		if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
			showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
			return
		}
		const menuPath = program.LINK_PATH
			? program.LINK_PATH.replace(/\.tsx$/i, '')
			: ''
		const title = program.PGM_NM ? program.PGM_NM : pgmId
		// ë¡œê·¸ë¡??°ì´??ì¶”ì  (?„ìš”??ì£¼ì„ ?´ì œ)
		// console.log('[MenuTree ?´ë¦­]', { pgmId, program, menuPath, title })
		// console.log('[handleMenuClick] tabs(before):', tabs)
		// ????ì¶”ê?
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
			// ?«íŒ ??´ ?œì„± ??´ë©?ë§ˆì?ë§???œ¼ë¡??¬ì»¤??
			const remain = tabs.filter((tab) => tab.programId !== programId)
			return remain.length > 0 ? remain[remain.length - 1].programId : ''
		})
	}

	// ë°”ë¡œê°€ê¸?ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
	const handleShortcutClick = (action: string) => {
		switch (action) {
			case 'menu':
				setShowMenuTree(!showMenuTree)
				break
			case 'business':
				// ?¬ì—…ê´€ë¦¬ë©”??BSN0000) - ì¤€ë¹„ì¤‘ ?Œë¦¼
				showToast(TOAST_MESSAGES.BUSINESS_PREPARING, 'info')
				break
			case 'project':
				// ?„ë¡œ?íŠ¸ê´€ë¦¬ë©”??PRJ0000) - ì¤€ë¹„ì¤‘ ?Œë¦¼
				showToast(TOAST_MESSAGES.PROJECT_PREPARING, 'info')
				break
			case 'cost':
				// ?…ë¬´ì¶”ì§„ë¹„ë©”??WPC_00_0000) - ì¤€ë¹„ì¤‘ ?Œë¦¼
				showToast(TOAST_MESSAGES.COST_PREPARING, 'info')
				break
			case 'hr':
				// ê¸°ë³¸?•ë³´?±ë¡(ê°œì¸ë³? (PSM0010) - ????œ¼ë¡??¸ì¶œ
				const hrPgmId = 'PSM0010' // PSM1010M00 ??PSM0010?¼ë¡œ ?˜ì •
				const hrTitle = 'ê¸°ë³¸?•ë³´?±ë¡(ê°œì¸ë³?'

				const hrProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === hrPgmId
				)

				if (!hrProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// ë©”ë‰´ ?¸ë¦¬?€ ?™ì¼??ë°©ì‹?¼ë¡œ menuPath ?ì„±
				const hrMenuPath = hrProgram.LINK_PATH
					? hrProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'psm/PSM0010M00'

				// ?´ë? ?´ë¦° ??´ë©??¬ì»¤?¤ë§Œ ?´ë™
				if (tabs.some((tab) => tab.programId === hrPgmId)) {
					setActiveTab(hrPgmId)
					return
				}

				// ??ê°œìˆ˜ ?œí•œ ì²´í¬
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// ????ì¶”ê?
				const newHrTab: TabItem = {
					programId: hrPgmId,
					title: hrTitle,
					menuPath: hrMenuPath,
				}
				setTabs((prev) => [...prev, newHrTab])
				setActiveTab(hrPgmId)
				break
			case 'system':
				// ?¬ìš©?ê?ë¦?USR2010) - ????œ¼ë¡??¸ì¶œ
				const sysPgmId = 'USR2010' // USR2010M00 ??USR2010?¼ë¡œ ?˜ì •
				const sysTitle = '?¬ìš©?ê?ë¦?

				const sysProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === sysPgmId
				)

				if (!sysProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// ë©”ë‰´ ?¸ë¦¬?€ ?™ì¼??ë°©ì‹?¼ë¡œ menuPath ?ì„±
				const sysMenuPath = sysProgram.LINK_PATH
					? sysProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'usr/USR2010M00'

				// ?´ë? ?´ë¦° ??´ë©??¬ì»¤?¤ë§Œ ?´ë™
				if (tabs.some((tab) => tab.programId === sysPgmId)) {
					setActiveTab(sysPgmId)
					return
				}

				// ??ê°œìˆ˜ ?œí•œ ì²´í¬
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// ????ì¶”ê?
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

	// ë¡œê·¸?„ì›ƒ ?¸ë“¤??
	const handleLogout = async () => {
		await logout()
	}

	// lock ?íƒœê°€ trueê°€ ?˜ë©´ ë©”ë‰´?¸ë¦¬ ??ƒ ê³ ì •
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

	// ?ë¬¼???íƒœ ë³€ê²??¸ë“¤??
	const handleLockChange = (locked: boolean) => {
		setMenuTreeLocked(locked)
	}

	// menuList key mapping (?€ë¬¸ì->camelCase)
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
			{/* ?ë‹¨ ê³ ì • ?¤ë” */}
			<TopFrame
				userName={user?.name}
				userTeam={user?.department}
				userPosition={user?.position}
				userEmpNo={user?.empNo}
			/>
			{/* ?˜ë‹¨ ë³¸ë¬¸ ?ì—­ */}
			<div className='flex flex-1 min-h-0 relative'>
				{/* ì¢Œì¸¡ ?„ì´ì½˜ë°”: ê³ ì • */}
				<div className='z-30'>
					<LeftFrame
						onMenuClick={() => setShowMenuTree((v) => !v)}
						onLogout={handleLogout}
						onShortcutClick={handleShortcutClick}
					/>
				</div>
				{/* ì½˜í…ì¸??¼ì¸: relative */}
				<div className='flex-1 flex relative'>
					{/* ë©”ë‰´?¸ë¦¬: absolute, left-0 (ì½˜í…ì¸??¼ì¸ ê¸°ì?) */}
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
					{/* ?¤ì œ ì½˜í…ì¸? ë©”ë‰´?¸ë¦¬ widthë§Œí¼ margin-left */}
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


