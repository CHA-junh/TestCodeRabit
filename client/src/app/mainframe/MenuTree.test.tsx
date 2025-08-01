import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MenuTree from './MenuTree'

describe('MenuTree - ë©ë´ ?¸ë¦¬ ì»´í¬?í¸', () => {
	const mockMenuList = [
		{
			menuSeq: '1',
			menuDspNm: '?ì¤??ê´ë¦?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '?ì¤??ê´ë¦?,
			menuPath: '/sys',
			children: []
		},
		{
			menuSeq: '2',
			menuDspNm: '?¬ì©??ê´ë¦?,
			pgmId: 'USR2010M00',
			menuShpDvcd: 'L',
			hgrkMenuSeq: '1',
			flag: 2,
			menuUseYn: 'Y',
			menuLvl: 2,
			mapTitle: '?¬ì©??ê´ë¦?,
			menuPath: '/usr/USR2010M00',
			children: []
		},
		{
			menuSeq: '3',
			menuDspNm: 'ê³µíµ ê´ë¦?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: 'ê³µíµ ê´ë¦?,
			menuPath: '/com',
			children: []
		}
	]

	const mockOnMenuClick = jest.fn()
	const mockOnLockChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?ëë§??ì¤??, () => {
		it('ë©ë´ ?¸ë¦¬ê° ?¬ë°ë¥´ê² ?ëë§ë?´ì¼ ?ë¤', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?ë¡ê·¸ë¨')).toBeInTheDocument()
			expect(screen.getByPlaceholderText('ë©ë´ëªì ?ë ¥ ??ì£¼ì¸??)).toBeInTheDocument()
		})

		it('ë©ë´ ë¦¬ì¤?¸ê? ?¬ë°ë¥´ê² ?ì?ì´???ë¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?ì¤??ê´ë¦?)).toBeInTheDocument()
			
			// ?ì¤??ê´ë¦?ë©ë´ë¥??ì¥?ì¬ ?ì ë©ë´ ?ì
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ì©??ê´ë¦?)).toBeInTheDocument()
			})
		})

		it('ë©ë´ê° ?ì ???ë´ ë©ìì§ê° ?ì?ì´???ë¤', () => {
			render(<MenuTree menuList={[]} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('ë©ë´ê° ?ìµ?ë¤.')).toBeInTheDocument()
		})
	})

	describe('ë©ë´ ê²???ì¤??, () => {
		it('ê²?ì´ ?ë ¥ ???í°ë§ì´ ?ì?´ì¼ ?ë¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©ë´ëªì ?ë ¥ ??ì£¼ì¸??)
			fireEvent.change(searchInput, { target: { value: '?¬ì©?? } })
			
			await waitFor(() => {
				expect(screen.getByText('?¬ì©??ê´ë¦?)).toBeInTheDocument()
				expect(screen.queryByText('ê³µíµ ê´ë¦?)).not.toBeInTheDocument()
			})
		})

		it('ê²?ì´ê° 2??ë¯¸ë§?????í°ë§ì´ ?ì?ì? ?ì???ë¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©ë´ëªì ?ë ¥ ??ì£¼ì¸??)
			fireEvent.change(searchInput, { target: { value: '?? } })
			
			// ?ì¤??ê´ë¦?ë©ë´ë¥??ì¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?ì¤??ê´ë¦?)).toBeInTheDocument()
				expect(screen.getByText('?¬ì©??ê´ë¦?)).toBeInTheDocument()
			})
		})

		it('ê²?ì´ë¥?ì§?°ë©´ ?ì²´ ë©ë´ê° ?ì?ì´???ë¤', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('ë©ë´ëªì ?ë ¥ ??ì£¼ì¸??)
			fireEvent.change(searchInput, { target: { value: '' } })
			
			// ?ì¤??ê´ë¦?ë©ë´ë¥??ì¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?ì¤??ê´ë¦?)).toBeInTheDocument()
				expect(screen.getByText('?¬ì©??ê´ë¦?)).toBeInTheDocument()
			})
		})
	})

	describe('ë©ë´ ?´ë¦­ ?ì¤??, () => {
		it('?ë¡ê·¸ë¨ ë©ë´ ?´ë¦­ ??onMenuClick???¸ì¶?ì´???ë¤', async () => {
			render(
				<MenuTree 
					menuList={mockMenuList} 
					onMenuClick={mockOnMenuClick} 
				/>
			)
			
			// ?ì¤??ê´ë¦?ë©ë´ë¥??ì¥
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			const userMenu = await screen.findByText('?¬ì©??ê´ë¦?)
			fireEvent.click(userMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).toHaveBeenCalledWith('USR2010M00')
			})
		})

		it('?´ë ë©ë´ ?´ë¦­ ??onMenuClick???¸ì¶?ì? ?ì???ë¤', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const systemMenu = screen.getByText('?ì¤??ê´ë¦?)
			fireEvent.click(systemMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).not.toHaveBeenCalled()
			})
		})
	})

	describe('? ê¸ ê¸°ë¥ ?ì¤??, () => {
		it('? ê¸ ë²í¼ ?´ë¦­ ???íê° ë³ê²½ë?´ì¼ ?ë¤', async () => {
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

		it('? ê¸ ?´ì  ë²í¼ ?´ë¦­ ???íê° ë³ê²½ë?´ì¼ ?ë¤', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			// ë¨¼ì? ? ê¸
			const lockButton = screen.getByAltText('unlock')
			fireEvent.click(lockButton)
			
			// ? ê¸ ?´ì 
			const unlockButton = screen.getByAltText('lock')
			fireEvent.click(unlockButton)
			
			await waitFor(() => {
				expect(mockOnLockChange).toHaveBeenCalledWith(false)
			})
		})
	})

	describe('?ì²´ ?ì¥/ì¶ì ?ì¤??, () => {
		it('?ì²´ ?ì¥ ë²í¼ ?´ë¦­ ??ëª¨ë  ë©ë´ê° ?¼ì³?¸ì¼ ?ë¤', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?ì¤??ê´ë¦?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?ì¤??ê´ë¦?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?¬ì©??ê´ë¦?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?¬ì©??ê´ë¦?,
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
				expect(screen.getByText('?¬ì©??ê´ë¦?)).toBeInTheDocument()
			})
		})

		it('?ì²´ ì¶ì ë²í¼ ?´ë¦­ ??ëª¨ë  ë©ë´ê° ?í????ë¤', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?ì¤??ê´ë¦?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?ì¤??ê´ë¦?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?¬ì©??ê´ë¦?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?¬ì©??ê´ë¦?,
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
				expect(screen.queryByText('?¬ì©??ê´ë¦?)).not.toBeInTheDocument()
			})
		})
	})

	describe('?¸ë¦¬ êµ¬ì¡° ë³???ì¤??, () => {
		it('?ë©´ ë°°ì´???¸ë¦¬ êµ¬ì¡°ë¡?ë³?í´???ë¤', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			// ìµì??ë©ë´?¤ì´ ?ì?ëì§ ?ì¸
			expect(screen.getByText('?ì¤??ê´ë¦?)).toBeInTheDocument()
		})
	})

	describe('?ê·¼???ì¤??, () => {
		it('ê²???ë ¥ ?ë???ì ??placeholderê° ?ì´???ë¤', () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const searchInput = screen.getByPlaceholderText('ë©ë´ëªì ?ë ¥ ??ì£¼ì¸??)
			expect(searchInput).toBeInTheDocument()
		})

		it('ë²í¼?¤ì´ ?ì ??alt ?ì¤?¸ë? ê°?¸ì¼ ?ë¤', () => {
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

