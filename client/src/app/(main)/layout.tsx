'use client'
import React, { useEffect, useState } from 'react'
import SideMenu from '../../components/SideMenu'
import '../globals.css'
import TopBar from './TopBar'
import AuthGuard from '../../modules/auth/components/AuthGuard'
import MainTab from '../mainframe/MainTab'
import PageTitle from '../mainframe/PageTitle'
import ContentFrame from '../mainframe/ContentFrame'
import { getDynamicProgramComponent } from '../../utils/dynamicProgramLoader'

interface TabInfo {
	programId: string
	title: string
}

interface MenuGroup {
	title: string
	children: { programId: string; title: string }[]
}

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// 메뉴 데이터 fetch
	const [menuData, setMenuData] = useState<MenuGroup[]>([])
	useEffect(() => {
		fetch('/api/menu/tree')
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setMenuData(data.data)
				} else {
					console.error('메뉴 데이터 로드 실패:', data.message)
				}
			})
			.catch((error) => {
				console.error('메뉴 API 호출 오류:', error)
			})
	}, [])

	// 탭 상태 관리
	const [tabs, setTabs] = useState<TabInfo[]>([])
	const [activeTab, setActiveTab] = useState<string>('')

	// 메뉴 클릭 시 탭 추가/선택
	const handleMenuClick = (programId: string, title: string) => {
		setTabs((prev) => {
			if (prev.find((t) => t.programId === programId)) return prev
			return [...prev, { programId, title }]
		})
		setActiveTab(programId)
	}

	// 탭 클릭
	const handleTabClick = (programId: string) => {
		setActiveTab(programId)
	}

	// 탭 닫기
	const handleTabClose = (programId: string) => {
		setTabs((prev) => {
			const filtered = prev.filter((t) => t.programId !== programId)
			if (activeTab === programId && filtered.length > 0) {
				setActiveTab(filtered[filtered.length - 1].programId)
			} else if (filtered.length === 0) {
				setActiveTab('')
			}
			return filtered
		})
	}

	// 현재 활성 탭 정보
	const currentTab = tabs.find((t) => t.programId === activeTab)
	const ContentComponent = currentTab
		? getDynamicProgramComponent(currentTab.programId)
		: null

	return (
		<AuthGuard>
			<div className='flex flex-col min-h-screen h-screen'>
				<TopBar />
				<div className='flex flex-1 h-full min-h-0'>
					{/* 메뉴트리 */}
					<SideMenu isOpen={true} onClose={() => {}} />
					<div className='flex-1 flex flex-col h-full min-h-0'>
						{/* 메인탭 */}
						<MainTab
							tabs={tabs.map((tab) => ({
								id: tab.programId,
								title: tab.title,
							}))}
							activeTab={activeTab}
							onTabClick={handleTabClick}
							onTabClose={handleTabClose}
						/>
						{/* 페이지 타이틀 */}
						{currentTab && (
							<PageTitle
								programId={currentTab.programId}
								title={currentTab.title}
							/>
						)}
						{/* 콘텐츠 영역 */}
						<div className='flex-1 p-6 bg-gray-50 rounded-b shadow-inner border border-blue-100 border-t-0 overflow-auto'>
							{currentTab && ContentComponent && (
								<ContentComponent title={currentTab.title} />
							)}
						</div>
					</div>
				</div>
			</div>
		</AuthGuard>
	)
}
