import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MenuTree from './MenuTree'

describe('MenuTree - ë©”ë‰´ ?¸ë¦¬ ì»´í¬?ŒíŠ¸', () => {
	const mockMenuList = [
		{
			menuSeq: '1',
			menuDspNm: '?œìŠ¤??ê´€ë¦?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '?œìŠ¤??ê´€ë¦?,
			menuPath: '/sys',
			children: []
		},
		{
			menuSeq: '2',
			menuDspNm: '?¬ìš©??ê´€ë¦?,
			pgmId: 'USR2010M00',
			menuShpDvcd: 'L',
			hgrkMenuSeq: '1',
			flag: 2,
			menuUseYn: 'Y',
			menuLvl: 2,
			mapTitle: '?¬ìš©??ê´€ë¦?,
			menuPath: '/usr/USR2010M00',
			children: []
		},
		{
			menuSeq: '3',
			menuDspNm: 'ê³µí†µ ê´€ë¦?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: 'ê³µí†µ ê´€ë¦?,
			menuPath: '/com',
			children: []
		}
	]

	const mockOnMenuClick = jest.fn()
	const mockOnLockChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?Œë”ë§??ŒìŠ¤??, () => {
		it('ë©”ë‰´ ?¸ë¦¬ê°€ ?¬ë°”ë¥´ê²Œ ?Œë”ë§ë˜?´ì•¼ ?œë‹¤', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?„ë¡œê·¸ëž¨')).toBeInTheDocument()
			expect(screen.getByPlaceholderText('ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??)).toBeInTheDocument()
		})

		it('ë©”ë‰´ ë¦¬ìŠ¤?¸ê? ?¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?œìŠ¤??ê´€ë¦?)).toBeInTheDocument()
			
			// ?œìŠ¤??ê´€ë¦?ë©”ë‰´ë¥??•ìž¥?˜ì—¬ ?˜ìœ„ ë©”ë‰´ ?œì‹œ
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ìš©??ê´€ë¦?)).toBeInTheDocument()
			})
		})

		it('ë©”ë‰´ê°€ ?†ì„ ???ˆë‚´ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<MenuTree menuList={[]} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('ë©”ë‰´ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
		})
	})

	describe('ë©”ë‰´ ê²€???ŒìŠ¤??, () => {
		it('ê²€?‰ì–´ ?…ë ¥ ???„í„°ë§ì´ ?™ìž‘?´ì•¼ ?œë‹¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??)
			fireEvent.change(searchInput, { target: { value: '?¬ìš©?? } })
			
			await waitFor(() => {
				expect(screen.getByText('?¬ìš©??ê´€ë¦?)).toBeInTheDocument()
				expect(screen.queryByText('ê³µí†µ ê´€ë¦?)).not.toBeInTheDocument()
			})
		})

		it('ê²€?‰ì–´ê°€ 2??ë¯¸ë§Œ?????„í„°ë§ì´ ?™ìž‘?˜ì? ?Šì•„???œë‹¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??)
			fireEvent.change(searchInput, { target: { value: '?? } })
			
			// ?œìŠ¤??ê´€ë¦?ë©”ë‰´ë¥??•ìž¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?œìŠ¤??ê´€ë¦?)).toBeInTheDocument()
				expect(screen.getByText('?¬ìš©??ê´€ë¦?)).toBeInTheDocument()
			})
		})

		it('ê²€?‰ì–´ë¥?ì§€?°ë©´ ?„ì²´ ë©”ë‰´ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??)
			fireEvent.change(searchInput, { target: { value: '' } })
			
			// ?œìŠ¤??ê´€ë¦?ë©”ë‰´ë¥??•ìž¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?œìŠ¤??ê´€ë¦?)).toBeInTheDocument()
				expect(screen.getByText('?¬ìš©??ê´€ë¦?)).toBeInTheDocument()
			})
		})
	})

	describe('ë©”ë‰´ ?´ë¦­ ?ŒìŠ¤??, () => {
		it('?„ë¡œê·¸ëž¨ ë©”ë‰´ ?´ë¦­ ??onMenuClick???¸ì¶œ?˜ì–´???œë‹¤', async () => {
			render(
				<MenuTree 
					menuList={mockMenuList} 
					onMenuClick={mockOnMenuClick} 
				/>
			)
			
			// ?œìŠ¤??ê´€ë¦?ë©”ë‰´ë¥??•ìž¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			const userMenu = await screen.findByText('?¬ìš©??ê´€ë¦?)
			fireEvent.click(userMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).toHaveBeenCalledWith('USR2010M00')
			})
		})

		it('?´ë” ë©”ë‰´ ?´ë¦­ ??onMenuClick???¸ì¶œ?˜ì? ?Šì•„???œë‹¤', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const systemMenu = screen.getByText('?œìŠ¤??ê´€ë¦?)
			fireEvent.click(systemMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).not.toHaveBeenCalled()
			})
		})
	})

	describe('? ê¸ˆ ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
		it('? ê¸ˆ ë²„íŠ¼ ?´ë¦­ ???íƒœê°€ ë³€ê²½ë˜?´ì•¼ ?œë‹¤', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const lockButton = screen.getByAltText('unlock')
			fireEvent.click(lockButton)
			
			await waitFor(() => {
				expect(mockOnLockChange).toHaveBeenCalledWith(true)
			})
		})

		it('? ê¸ˆ ?´ì œ ë²„íŠ¼ ?´ë¦­ ???íƒœê°€ ë³€ê²½ë˜?´ì•¼ ?œë‹¤', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			// ë¨¼ì? ? ê¸ˆ
			const lockButton = screen.getByAltText('unlock')
			fireEvent.click(lockButton)
			
			// ? ê¸ˆ ?´ì œ
			const unlockButton = screen.getByAltText('lock')
			fireEvent.click(unlockButton)
			
			await waitFor(() => {
				expect(mockOnLockChange).toHaveBeenCalledWith(false)
			})
		})
	})

	describe('?„ì²´ ?•ìž¥/ì¶•ì†Œ ?ŒìŠ¤??, () => {
		it('?„ì²´ ?•ìž¥ ë²„íŠ¼ ?´ë¦­ ??ëª¨ë“  ë©”ë‰´ê°€ ?¼ì³?¸ì•¼ ?œë‹¤', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?œìŠ¤??ê´€ë¦?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?œìŠ¤??ê´€ë¦?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?¬ìš©??ê´€ë¦?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?¬ìš©??ê´€ë¦?,
							menuPath: '/usr/USR2010M00',
							children: []
						}
					]
				}
			]

			render(
				<MenuTree
					menuList={treeMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const expandButton = screen.getByAltText('plus')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ìš©??ê´€ë¦?)).toBeInTheDocument()
			})
		})

		it('?„ì²´ ì¶•ì†Œ ë²„íŠ¼ ?´ë¦­ ??ëª¨ë“  ë©”ë‰´ê°€ ?‘í????œë‹¤', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?œìŠ¤??ê´€ë¦?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?œìŠ¤??ê´€ë¦?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?¬ìš©??ê´€ë¦?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?¬ìš©??ê´€ë¦?,
							menuPath: '/usr/USR2010M00',
							children: []
						}
					]
				}
			]

			render(
				<MenuTree
					menuList={treeMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const collapseButton = screen.getByAltText('minus')
			fireEvent.click(collapseButton)
			
			await waitFor(() => {
				expect(screen.queryByText('?¬ìš©??ê´€ë¦?)).not.toBeInTheDocument()
			})
		})
	})

	describe('?¸ë¦¬ êµ¬ì¡° ë³€???ŒìŠ¤??, () => {
		it('?‰ë©´ ë°°ì—´???¸ë¦¬ êµ¬ì¡°ë¡?ë³€?˜í•´???œë‹¤', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			// ìµœìƒ??ë©”ë‰´?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
			expect(screen.getByText('?œìŠ¤??ê´€ë¦?)).toBeInTheDocument()
		})
	})

	describe('?‘ê·¼???ŒìŠ¤??, () => {
		it('ê²€???…ë ¥ ?„ë“œ???ì ˆ??placeholderê°€ ?ˆì–´???œë‹¤', () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const searchInput = screen.getByPlaceholderText('ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??)
			expect(searchInput).toBeInTheDocument()
		})

		it('ë²„íŠ¼?¤ì´ ?ì ˆ??alt ?ìŠ¤?¸ë? ê°€?¸ì•¼ ?œë‹¤', () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			expect(screen.getByAltText('unlock')).toBeInTheDocument()
			expect(screen.getByAltText('plus')).toBeInTheDocument()
			expect(screen.getByAltText('minus')).toBeInTheDocument()
		})
	})
}) 

