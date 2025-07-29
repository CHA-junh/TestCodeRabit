'use client'

import React, { useState, useEffect } from 'react'
import '../common/common.css'

interface MenuNode {
	menuSeq: string | number
	menuDspNm: string
	pgmId: string | null
	menuShpDvcd: string
	hgrkMenuSeq: string | number
	flag: number
	menuUseYn: string
	menuLvl: number
	mapTitle: string
	menuPath: string
	children?: MenuNode[]
}

// ?‰ë©´ ë°°ì—´???¸ë¦¬ êµ¬ì¡°ë¡?ë³€?˜í•˜???¨ìˆ˜ ì¶”ê?
function buildMenuTree(flatMenus: MenuNode[]): MenuNode[] {
	const menuMap: { [key: string]: MenuNode } = {}
	const tree: MenuNode[] = []
	// menu ê°ì²´ë¥?ë³µì‚¬?´ì„œ children???ˆë¡œ ? ë‹¹
	const menus = flatMenus.map((menu) => ({ ...menu, children: [] }))
	menus.forEach((menu) => {
		menuMap[String(menu.menuSeq)] = menu
	})
	menus.forEach((menu) => {
		const parentKey = String(menu.hgrkMenuSeq)
		if (parentKey !== '0' && menuMap[parentKey]) {
			menuMap[parentKey].children!.push(menu)
		} else {
			tree.push(menu)
		}
	})
	return tree
}

// API ?‘ë‹µ??camelCaseë¡?ë³€?˜í•˜???¨ìˆ˜ ì¶”ê?
function toCamelCaseMenu(menu: any): MenuNode {
	return {
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
		children: [],
	}
}

// ?œê? ì´ˆì„± ì¶”ì¶œ ?¨ìˆ˜
function getInitials(str: string) {
	const CHO = [
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
		'??,
	]
	return Array.from(str)
		.map((char) => {
			const code = char.charCodeAt(0) - 44032
			if (code >= 0 && code <= 11171) {
				return CHO[Math.floor(code / 588)]
			}
			return char
		})
		.join('')
}

interface MenuTreeProps {
	menuList: MenuNode[]
	onMenuClick?: (pgmId: string) => void
	onLockChange?: (locked: boolean) => void
}

const MenuTree: React.FC<MenuTreeProps> = ({
	menuList,
	onMenuClick,
	onLockChange,
}) => {
	const [menuTree, setMenuTree] = useState<MenuNode[]>([])
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
	const [selectedMenu, setSelectedMenu] = useState<string>('')
	const [locked, setLocked] = useState(false)
	const [search, setSearch] = useState('')
	const [searching, setSearching] = useState(false)
	const [allMenus, setAllMenus] = useState<MenuNode[]>([])

	// locked ?íƒœ ë³€ê²???ë¶€ëª?ì»´í¬?ŒíŠ¸???Œë¦¼
	useEffect(() => {
		if (onLockChange) {
			onLockChange(locked)
		}
	}, [locked, onLockChange])

	// menuListê°€ ë³€ê²½ë  ?Œë§ˆ???¸ë¦¬ êµ¬ì¡°ë¡?ë³€??
	useEffect(() => {
		if (menuList && Array.isArray(menuList)) {
			setAllMenus(menuList)
			const isFlat = menuList.every(
				(item: any) => !item.children || item.children.length === 0
			)
			const tree = isFlat ? buildMenuTree(menuList) : menuList
			setMenuTree(tree)
		}
	}, [menuList])

	// toggleMenu ?¨ìˆ˜ ?˜ì •
	const toggleMenu = (menuSeq: string | number) => {
		setOpenMenus((prev) => ({
			...prev,
			[String(menuSeq)]: !prev[String(menuSeq)],
		}))
	}

	const handleLockClick = () => {
		setLocked((prev) => !prev)
	}

	// ?„ì²´ ë©”ë‰´ ìµœë???
	const expandAll = () => {
		const allOpen: { [key: string]: boolean } = {}
		const traverse = (nodes: MenuNode[]) => {
			nodes.forEach((node) => {
				allOpen[node.menuSeq] = true
				if (node.children) traverse(node.children)
			})
		}
		traverse(menuTree)
		setOpenMenus(allOpen)
	}
	// ?„ì²´ ë©”ë‰´ ìµœì†Œ??
	const collapseAll = () => {
		setOpenMenus({})
	}

	// handleSearchChange: allMenus?ì„œ ì§ì ‘ ?„í„°ë§?
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearch(value)
		if (value.length >= 2) {
			setSearching(true)
			const keywordInitials = getInitials(value)
			const filtered = allMenus.filter((menu: any) => {
				const name = menu.menuDspNm || ''
				const initials = getInitials(name)
				return (
					name.includes(value) ||
					initials.includes(keywordInitials) ||
					name.replace(/\s/g, '').includes(value.replace(/\s/g, ''))
				)
			})
			const isFlat = filtered.every(
				(item: any) => !item.children || item.children.length === 0
			)
			const tree = isFlat ? buildMenuTree(filtered) : filtered
			setMenuTree(tree)
			setSearching(false)
		} else if (value.length === 0) {
			// ê²€?‰ì–´ê°€ ì§€?Œì?ë©??„ì²´ ?¸ë¦¬ ë³µì›
			setSearching(false)
			const isFlat = allMenus.every(
				(item: any) => !item.children || item.children.length === 0
			)
			const tree = isFlat ? buildMenuTree(allMenus) : allMenus
			setMenuTree(tree)
		}
	}

	// ?¸ë¦¬ ?Œë”ë§??¨ìˆ˜
	const renderTree = (nodes: MenuNode[]) => {
		return Array.isArray(nodes)
			? nodes
					.filter((node) => node.menuSeq !== undefined && node.menuSeq !== null)
					.map((node) => {
						// leaf(?…ë¬´?”ë©´) ë©”ë‰´
						if (!node.children || node.children.length === 0) {
							return node.pgmId ? (
								<div
									key={`${node.menuPath || ''}-${node.menuSeq}`}
									className={`flex items-center gap-2 px-2 py-1 rounded pl-6 cursor-pointer ${selectedMenu === node.pgmId ? 'text-[#0071DB] font-bold bg-blue-50' : 'text-stone-700 hover:text-[#0071DB]'}`}
									onClick={() => {
										setSelectedMenu(String(node.menuSeq))
										// console.log('[MenuTree ?´ë? ?´ë¦­]', node)
										onMenuClick && onMenuClick(String(node.pgmId))
									}}
								>
									<span className='leading-none inline-block m-2'>
										{node.menuDspNm}
									</span>
								</div>
							) : null
						}
						// ?´ë”(?ìœ„) ë©”ë‰´
						return (
							<div key={`${node.menuPath || ''}-${node.menuSeq}`}>
								<div
									className='flex items-center gap-2 px-2 pt-[4px] pb-[6px] cursor-pointer rounded border-b border-dashed text-stone-700 hover:text-[#0071DB]'
									onClick={() => toggleMenu(node.menuSeq)}
								>
									{node.children && node.children.length > 0 && (
										<img
											src='/icon_plus.svg'
											alt='expand'
											className='w-4 h-4 pl-1 shrink-0'
										/>
									)}
									<span className='leading-none inline-block m-2'>
										{node.menuDspNm}
									</span>
								</div>
								{openMenus[String(node.menuSeq)] &&
									Array.isArray(node.children) &&
									node.children.length > 0 && (
										<div className='space-y-1 pl-4'>
											{renderTree(node.children)}
										</div>
									)}
							</div>
						)
					})
			: null
	}

	return (
		<div className='w-full h-full bg-white text-sm font-nanum flex flex-col'>
			{/* ?ë‹¨: ?€?´í? */}
			<div className='flex items-center gap-2 px-4 py-2 border-b border-stone-300 bg-gray-50 shrink-0'>
				<button
					type='button'
					className='p-0 m-0 bg-transparent border-none focus:outline-none'
					onClick={handleLockClick}
				>
					<img
						src={locked ? '/icon_lock.svg' : '/icon_unlock.svg'}
						alt={locked ? 'lock' : 'unlock'}
						className='w-4 h-4 select-none'
					/>
				</button>
				<span className='text-stone-700 text-base font-semibold m-1'>
					?„ë¡œê·¸ë¨
				</span>
			</div>
			{/* ê²€???ì—­ */}
			<div className='flex items-center justify-between px-2 py-1 border-b border-stone-200 bg-white shrink-0'>
				<input
					type='text'
					placeholder='ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??
					className='w-full px-2 py-1 border border-stone-200 rounded text-sm text-stone-700 bg-white focus:outline-none focus:border-blue-400'
					value={search}
					onChange={handleSearchChange}
				/>
				<div className='w-auto h-4 flex gap-2 ml-2'>
					<img
						src='/icon_plus.svg'
						alt='plus'
						className='w-4 h-4 cursor-pointer'
						onClick={expandAll}
					/>
					<img
						src='/icon_minus.svg'
						alt='minus'
						className='w-4 h-4 cursor-pointer'
						onClick={collapseAll}
					/>
				</div>
			</div>
			{/* ë©”ë‰´ ë¦¬ìŠ¤?? ?¤í¬ë¡??€???ì—­ */}
			<div className='flex-1 overflow-y-auto py-1 space-y-1 scroll-area'>
				{menuTree.length === 0 ? (
					<div className='text-center text-gray-400 py-8'>ë©”ë‰´ê°€ ?†ìŠµ?ˆë‹¤.</div>
				) : (
					renderTree(menuTree)
				)}
			</div>
		</div>
	)
}

export default MenuTree



