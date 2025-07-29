import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MenuTree from './MenuTree'

describe('MenuTree - 메뉴 트리 컴포넌트', () => {
	const mockMenuList = [
		{
			menuSeq: '1',
			menuDspNm: '시스템 관리',
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '시스템 관리',
			menuPath: '/sys',
			children: []
		},
		{
			menuSeq: '2',
			menuDspNm: '사용자 관리',
			pgmId: 'USR2010M00',
			menuShpDvcd: 'L',
			hgrkMenuSeq: '1',
			flag: 2,
			menuUseYn: 'Y',
			menuLvl: 2,
			mapTitle: '사용자 관리',
			menuPath: '/usr/USR2010M00',
			children: []
		},
		{
			menuSeq: '3',
			menuDspNm: '공통 관리',
			pgmId: null,
			menuShpDvcd: 'F',
			hgrkMenuSeq: '0',
			flag: 1,
			menuUseYn: 'Y',
			menuLvl: 1,
			mapTitle: '공통 관리',
			menuPath: '/com',
			children: []
		}
	]

	const mockOnMenuClick = jest.fn()
	const mockOnLockChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('렌더링 테스트', () => {
		it('메뉴 트리가 올바르게 렌더링되어야 한다', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('프로그램')).toBeInTheDocument()
			expect(screen.getByPlaceholderText('메뉴명을 입력 해 주세요')).toBeInTheDocument()
		})

		it('메뉴 리스트가 올바르게 표시되어야 한다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('시스템 관리')).toBeInTheDocument()
			
			// 시스템 관리 메뉴를 확장하여 하위 메뉴 표시
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('사용자 관리')).toBeInTheDocument()
			})
		})

		it('메뉴가 없을 때 안내 메시지가 표시되어야 한다', () => {
			render(<MenuTree menuList={[]} onMenuClick={mockOnMenuClick} />)
			
			expect(screen.getByText('메뉴가 없습니다.')).toBeInTheDocument()
		})
	})

	describe('메뉴 검색 테스트', () => {
		it('검색어 입력 시 필터링이 동작해야 한다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 입력 해 주세요')
			fireEvent.change(searchInput, { target: { value: '사용자' } })
			
			await waitFor(() => {
				expect(screen.getByText('사용자 관리')).toBeInTheDocument()
				expect(screen.queryByText('공통 관리')).not.toBeInTheDocument()
			})
		})

		it('검색어가 2자 미만일 때 필터링이 동작하지 않아야 한다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 입력 해 주세요')
			fireEvent.change(searchInput, { target: { value: '시' } })
			
			// 시스템 관리 메뉴를 확장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('시스템 관리')).toBeInTheDocument()
				expect(screen.getByText('사용자 관리')).toBeInTheDocument()
			})
		})

		it('검색어를 지우면 전체 메뉴가 표시되어야 한다', async () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 입력 해 주세요')
			fireEvent.change(searchInput, { target: { value: '' } })
			
			// 시스템 관리 메뉴를 확장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			await waitFor(() => {
				expect(screen.getByText('시스템 관리')).toBeInTheDocument()
				expect(screen.getByText('사용자 관리')).toBeInTheDocument()
			})
		})
	})

	describe('메뉴 클릭 테스트', () => {
		it('프로그램 메뉴 클릭 시 onMenuClick이 호출되어야 한다', async () => {
			render(
				<MenuTree 
					menuList={mockMenuList} 
					onMenuClick={mockOnMenuClick} 
				/>
			)
			
			// 시스템 관리 메뉴를 확장
			const expandButton = screen.getByAltText('expand')
			fireEvent.click(expandButton)
			
			const userMenu = await screen.findByText('사용자 관리')
			fireEvent.click(userMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).toHaveBeenCalledWith('USR2010M00')
			})
		})

		it('폴더 메뉴 클릭 시 onMenuClick이 호출되지 않아야 한다', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const systemMenu = screen.getByText('시스템 관리')
			fireEvent.click(systemMenu)
			
			await waitFor(() => {
				expect(mockOnMenuClick).not.toHaveBeenCalled()
			})
		})
	})

	describe('잠금 기능 테스트', () => {
		it('잠금 버튼 클릭 시 상태가 변경되어야 한다', async () => {
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

		it('잠금 해제 버튼 클릭 시 상태가 변경되어야 한다', async () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			// 먼저 잠금
			const lockButton = screen.getByAltText('unlock')
			fireEvent.click(lockButton)
			
			// 잠금 해제
			const unlockButton = screen.getByAltText('lock')
			fireEvent.click(unlockButton)
			
			await waitFor(() => {
				expect(mockOnLockChange).toHaveBeenCalledWith(false)
			})
		})
	})

	describe('전체 확장/축소 테스트', () => {
		it('전체 확장 버튼 클릭 시 모든 메뉴가 펼쳐져야 한다', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '시스템 관리',
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '시스템 관리',
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '사용자 관리',
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '사용자 관리',
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
				expect(screen.getByText('사용자 관리')).toBeInTheDocument()
			})
		})

		it('전체 축소 버튼 클릭 시 모든 메뉴가 접혀야 한다', async () => {
			const treeMenuList = [
				{
					menuSeq: '1',
					menuDspNm: '시스템 관리',
					pgmId: null,
					menuShpDvcd: 'F',
					hgrkMenuSeq: '0',
					flag: 1,
					menuUseYn: 'Y',
					menuLvl: 1,
					mapTitle: '시스템 관리',
					menuPath: '/sys',
					children: [
						{
							menuSeq: '2',
							menuDspNm: '사용자 관리',
							pgmId: 'USR2010M00',
							menuShpDvcd: 'L',
							hgrkMenuSeq: '1',
							flag: 2,
							menuUseYn: 'Y',
							menuLvl: 2,
							mapTitle: '사용자 관리',
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
				expect(screen.queryByText('사용자 관리')).not.toBeInTheDocument()
			})
		})
	})

	describe('트리 구조 변환 테스트', () => {
		it('평면 배열을 트리 구조로 변환해야 한다', () => {
			render(<MenuTree menuList={mockMenuList} onMenuClick={mockOnMenuClick} />)
			
			// 최상위 메뉴들이 표시되는지 확인
			expect(screen.getByText('시스템 관리')).toBeInTheDocument()
		})
	})

	describe('접근성 테스트', () => {
		it('검색 입력 필드에 적절한 placeholder가 있어야 한다', () => {
			render(
				<MenuTree
					menuList={mockMenuList}
					onMenuClick={mockOnMenuClick}
					onLockChange={mockOnLockChange}
				/>
			)
			
			const searchInput = screen.getByPlaceholderText('메뉴명을 입력 해 주세요')
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼들이 적절한 alt 텍스트를 가져야 한다', () => {
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