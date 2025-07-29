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
 * COM0000M00 - 메인프레임 화면
 *
 * 주요 기능:
 * - 메뉴 트리 표시 및 네비게이션
 * - 탭 기반 화면 관리 (최대 5개)
 * - 사용자 정보 표시
 * - 로그아웃 처리
 *
 * 연관 컴포넌트:
 * - TopFrame (상단 헤더)
 * - LeftFrame (좌측 아이콘바)
 * - MenuTree (메뉴 트리)
 * - Maintab (탭 관리)
 * - ContentFrame (콘텐츠 영역)
 */

interface TabItem {
	programId: string
	title: string
	menuPath: string
}

// Toast 메시지 상수
const TOAST_MESSAGES = {
	BUSINESS_PREPARING: '사업관리 기능이 준비중입니다.',
	PROJECT_PREPARING: '프로젝트관리 기능이 준비중입니다.',
	COST_PREPARING: '업무추진비 기능이 준비중입니다.',
	PROGRAM_NOT_FOUND: '프로그램을 찾을 수 없습니다.',
} as const

export default function COM0000M00() {
	const { user, session, logout, isAuthenticated } = useAuth()
	const { showToast } = useToast()
	// 메뉴트리 show/hide 상태 (기본값을 false로 변경)
	const [showMenuTree, setShowMenuTree] = useState(false)
	// 메뉴트리 lock 상태
	const [menuTreeLocked, setMenuTreeLocked] = useState(false)
	// 탭 배열 및 활성 탭 상태 추가
	const [tabs, setTabs] = useState<TabItem[]>([])
	const [activeTab, setActiveTab] = useState<string>('')

	// 컴포넌트 마운트 시점 로그

	// 슬라이드 상태 추적 및 강제 동기화

	// 인증되지 않은 경우 아무것도 렌더링하지 않음 (상위 컴포넌트에서 처리)
	if (!isAuthenticated || !user) return null

	const handleMenuClick = (pgmId: string) => {
		// 클릭한 메뉴의 정보 확인
		const menu = (session.user?.menuList || []).find(
			(m: any) => m.PGM_ID === pgmId
		)

		// PGM_ID가 없는 메뉴(폴더)는 처리하지 않음
		if (!menu || !menu.PGM_ID) {
			return
		}

		// 클릭한 메뉴의 pgmId로 programList에서 찾기
		const program = (session.user?.programList || []).find(
			(p: any) => p.PGM_ID === pgmId
		)

		if (!program) {
			return
		}

		// 이미 열린 탭이면 포커스만 이동
		if (tabs.some((tab) => tab.programId === pgmId)) {
			setActiveTab(pgmId)
			if (!menuTreeLocked) {
				setShowMenuTree(false)
				setTimeout(() => setShowMenuTree(false), 0)
			}
			return
		}

		// 탭 개수 제한 체크
		if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
			showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
			return
		}
		const menuPath = program.LINK_PATH
			? program.LINK_PATH.replace(/\.tsx$/i, '')
			: ''
		const title = program.PGM_NM ? program.PGM_NM : pgmId
		// 로그로 데이터 추적 (필요시 주석 해제)
		// console.log('[MenuTree 클릭]', { pgmId, program, menuPath, title })
		// console.log('[handleMenuClick] tabs(before):', tabs)
		// 새 탭 추가
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
			// 닫힌 탭이 활성 탭이면 마지막 탭으로 포커스
			const remain = tabs.filter((tab) => tab.programId !== programId)
			return remain.length > 0 ? remain[remain.length - 1].programId : ''
		})
	}

	// 바로가기 버튼 클릭 핸들러
	const handleShortcutClick = (action: string) => {
		switch (action) {
			case 'menu':
				setShowMenuTree(!showMenuTree)
				break
			case 'business':
				// 사업관리메인(BSN0000) - 준비중 알림
				showToast(TOAST_MESSAGES.BUSINESS_PREPARING, 'info')
				break
			case 'project':
				// 프로젝트관리메인(PRJ0000) - 준비중 알림
				showToast(TOAST_MESSAGES.PROJECT_PREPARING, 'info')
				break
			case 'cost':
				// 업무추진비메인(WPC_00_0000) - 준비중 알림
				showToast(TOAST_MESSAGES.COST_PREPARING, 'info')
				break
			case 'hr':
				// 기본정보등록(개인별) (PSM0010) - 새 탭으로 호출
				const hrPgmId = 'PSM0010' // PSM1010M00 → PSM0010으로 수정
				const hrTitle = '기본정보등록(개인별)'

				const hrProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === hrPgmId
				)

				if (!hrProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// 메뉴 트리와 동일한 방식으로 menuPath 생성
				const hrMenuPath = hrProgram.LINK_PATH
					? hrProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'psm/PSM0010M00'

				// 이미 열린 탭이면 포커스만 이동
				if (tabs.some((tab) => tab.programId === hrPgmId)) {
					setActiveTab(hrPgmId)
					return
				}

				// 탭 개수 제한 체크
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// 새 탭 추가
				const newHrTab: TabItem = {
					programId: hrPgmId,
					title: hrTitle,
					menuPath: hrMenuPath,
				}
				setTabs((prev) => [...prev, newHrTab])
				setActiveTab(hrPgmId)
				break
			case 'system':
				// 사용자관리(USR2010) - 새 탭으로 호출
				const sysPgmId = 'USR2010' // USR2010M00 → USR2010으로 수정
				const sysTitle = '사용자관리'

				const sysProgram = (session.user?.programList || []).find(
					(p: any) => p.PGM_ID === sysPgmId
				)

				if (!sysProgram) {
					showToast(TOAST_MESSAGES.PROGRAM_NOT_FOUND, 'error')
					return
				}

				// 메뉴 트리와 동일한 방식으로 menuPath 생성
				const sysMenuPath = sysProgram.LINK_PATH
					? sysProgram.LINK_PATH.replace(/\.tsx$/i, '')
					: 'usr/USR2010M00'

				// 이미 열린 탭이면 포커스만 이동
				if (tabs.some((tab) => tab.programId === sysPgmId)) {
					setActiveTab(sysPgmId)
					return
				}

				// 탭 개수 제한 체크
				if (tabs.length >= TAB_CONSTANTS.MAX_TABS) {
					showToast(MESSAGE_CONSTANTS.MAX_TABS, 'warning')
					return
				}

				// 새 탭 추가
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

	// 로그아웃 핸들러
	const handleLogout = async () => {
		await logout()
	}

	// lock 상태가 true가 되면 메뉴트리 항상 고정
	if (menuTreeLocked && !showMenuTree) setShowMenuTree(true)

	// 자물쇠 상태 변경 핸들러
	const handleLockChange = (locked: boolean) => {
		setMenuTreeLocked(locked)
	}

	// menuList key mapping (대문자->camelCase)
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
			{/* 상단 고정 헤더 */}
			<TopFrame
				userName={user?.name}
				userTeam={user?.department}
				userPosition={user?.position}
				userEmpNo={user?.empNo}
			/>
			{/* 하단 본문 영역 */}
			<div className='flex flex-1 min-h-0 relative'>
				{/* 좌측 아이콘바: 고정 */}
				<div className='z-30'>
					<LeftFrame
						onMenuClick={() => setShowMenuTree((v) => !v)}
						onLogout={handleLogout}
						onShortcutClick={handleShortcutClick}
					/>
				</div>
				{/* 콘텐츠 라인: relative */}
				<div className='flex-1 flex relative'>
					{/* 메뉴트리: absolute, left-0 (콘텐츠 라인 기준) */}
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
					{/* 실제 콘텐츠: 메뉴트리 width만큼 margin-left */}
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
