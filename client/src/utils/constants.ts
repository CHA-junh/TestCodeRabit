/**
 * 애플리케이션 전역 상수 정의
 * 하드코딩된 값들을 중앙 집중식으로 관리
 */

// 메시지 관련 상수
export const MESSAGE_CONSTANTS = {
	MAX_TABS:
		'최대 5개의 화면만 열 수 있습니다. 다른 화면을 닫고 다시 시도해주세요.',
	LOADING: '로딩 중...',
	UNAUTHORIZED: '인증되지 않은 사용자, 로그인 페이지로 리다이렉트',
} as const

// 라우팅 관련 상수
export const ROUTE_CONSTANTS = {
	LOGIN: '/signin',
	MAINFRAME: '/mainframe',
	DEFAULT: '/',
} as const

// 탭 관련 상수
export const TAB_CONSTANTS = {
	MAX_TABS: 5,
	DEFAULT_TAB_WIDTH: 150,
} as const

// 버튼 관련 상수
export const BUTTON_CONSTANTS = {
	HEIGHT: 26,
	MIN_WIDTH: 64,
	PADDING_X: 12,
	PADDING_Y: 4,
	FONT_SIZE: 14,
} as const

// 입력 필드 관련 상수
export const INPUT_CONSTANTS = {
	HEIGHT: 26,
	PADDING_X: 8,
	PADDING_Y: 2,
	FONT_SIZE: 14,
	CALENDAR_WIDTH: 150,
} as const

// 색상 상수
export const COLORS = {
	PRIMARY: '#58A5EE',
	PRIMARY_HOVER: '#4A8FD8',
	SECONDARY: '#6B7280',
	DANGER: '#EF4444',
	DANGER_HOVER: '#DC2626',
	SUCCESS: '#10B981',
	WARNING: '#F59E0B',
	INFO: '#3B82F6',
	LIGHT: '#F3F4F6',
	DARK: '#1F2937',
	BORDER: '#E5E7EB',
	BORDER_HOVER: '#D1D5DB',
} as const
