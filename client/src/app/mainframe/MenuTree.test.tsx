import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MenuTree from './MenuTree'

describe('MenuTree - 메뉴 ?�리 컴포?�트', () => {
	const mockMenuList = [
		{
			menuSeq: '1',
			menuDspNm: '?�스??관�?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '?�스??관�?,
			menuPath: '/sys',
			children: []
		},
		{
			menuSeq: '2',
			menuDspNm: '?�용??관�?,
			pgmId: 'USR2010M00',
			menuShpDvcd: 'L',
			hgrkMenuSeq: '1',
			flag: 2,
			menuUseYn: 'Y',
			menuLvl: 2,
			mapTitle: '?�용??관�?,
			menuPath: '/usr/USR2010M00',
			children: []
		},
		{
			menuSeq: '3',
			menuDspNm: '공통 관�?,
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '공통 관�?,
			menuPath: '/com',
			children: []
		}
	]

	const mockOnMenuClick = jest.fn()
	const mockOnLockChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?�더�??�스??, () => {
		it('메뉴 ?�리가 ?�바르게 ?�더링되?�야 ?�다', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?�로그램')).toBeInTheDocument()
			expect(screen.getByPlaceholderText('메뉴명을 ?�력 ??주세??)).toBeInTheDocument()
		})

		it('메뉴 리스?��? ?�바르게 ?�시?�어???�다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('?�스??관�?)).toBeInTheDocument()
			
			// ?�스??관�?메뉴�??�장?�여 ?�위 메뉴 ?�시
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�용??관�?)).toBeInTheDocument()
			})
		})

		it('메뉴가 ?�을 ???�내 메시지가 ?�시?�어???�다', () => {
			render(<MenuTree menuList={[]} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('메뉴가 ?�습?�다.')).toBeInTheDocument()
		})
	})

	describe('메뉴 검???�스??, () => {
		it('검?�어 ?�력 ???�터링이 ?�작?�야 ?�다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 ?�력 ??주세??)
			fireEvent.change(searchInput, { target: { value: '?�용?? } })
			
			await waitFor(() => {
				expect(screen.getByText('?�용??관�?)).toBeInTheDocument()
				expect(screen.queryByText('공통 관�?)).not.toBeInTheDocument()
			})
		})

		it('검?�어가 2??미만?????�터링이 ?�작?��? ?�아???�다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 ?�력 ??주세??)
			fireEvent.change(searchInput, { target: { value: '?? } })
			
			// ?�스??관�?메뉴�??�장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�스??관�?)).toBeInTheDocument()
				expect(screen.getByText('?�용??관�?)).toBeInTheDocument()
			})
		})

		it('검?�어�?지?�면 ?�체 메뉴가 ?�시?�어???�다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 ?�력 ??주세??)
			fireEvent.change(searchInput, { target: { value: '' } })
			
			// ?�스??관�?메뉴�??�장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�스??관�?)).toBeInTheDocument()
				expect(screen.getByText('?�용??관�?)).toBeInTheDocument()
			})
		})
	})

	describe('메뉴 ?�릭 ?�스??, () => {
		it('?�로그램 메뉴 ?�릭 ??onMenuClick???�출?�어???�다', async () => {
			render(
				<MenuTree 
					menuList={mockMenuList} 
					onMenuClick={mockOnMenuClick} 
				/>
			)
			
			// ?�스??관�?메뉴�??�장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			const userMenu = await screen.findByText('?�용??관�?)
			fireEvent.click(userMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).toHaveBeenCalledWith('USR2010M00')
			})
		})

		it('?�더 메뉴 ?�릭 ??onMenuClick???�출?��? ?�아???�다', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const systemMenu = screen.getByText('?�스??관�?)
			fireEvent.click(systemMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).not.toHaveBeenCalled()
			})
		})
	})

	describe('?�금 기능 ?�스??, () => {
		it('?�금 버튼 ?�릭 ???�태가 변경되?�야 ?�다', async () => {
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

		it('?�금 ?�제 버튼 ?�릭 ???�태가 변경되?�야 ?�다', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			// 먼�? ?�금
			const lockButton = screen.getByAltText('unlock')
			fireEvent.click(lockButton)
			
			// ?�금 ?�제
			const unlockButton = screen.getByAltText('lock')
			fireEvent.click(unlockButton)
			
			await waitFor(() => {
				expect(mockOnLockChange).toHaveBeenCalledWith(false)
			})
		})
	})

	describe('?�체 ?�장/축소 ?�스??, () => {
		it('?�체 ?�장 버튼 ?�릭 ??모든 메뉴가 ?�쳐?�야 ?�다', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?�스??관�?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?�스??관�?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?�용??관�?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?�용??관�?,
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
				expect(screen.getByText('?�용??관�?)).toBeInTheDocument()
			})
		})

		it('?�체 축소 버튼 ?�릭 ??모든 메뉴가 ?��????�다', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '?�스??관�?,
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '?�스??관�?,
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '?�용??관�?,
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '?�용??관�?,
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
				expect(screen.queryByText('?�용??관�?)).not.toBeInTheDocument()
			})
		})
	})

	describe('?�리 구조 변???�스??, () => {
		it('?�면 배열???�리 구조�?변?�해???�다', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			// 최상??메뉴?�이 ?�시?�는지 ?�인
			expect(screen.getByText('?�스??관�?)).toBeInTheDocument()
		})
	})

	describe('?�근???�스??, () => {
		it('검???�력 ?�드???�절??placeholder가 ?�어???�다', () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 ?�력 ??주세??)
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼?�이 ?�절??alt ?�스?��? 가?�야 ?�다', () => {
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

