/**
 * SYS1003M00 - 사용자 역할 관리 화면
 *
 * 주요 기능:
 * - 사용자 역할 목록 조회 및 검색
 * - 사용자 역할 신규 등록 및 수정
 * - 사용자 역할별 프로그램 그룹 연결 관리
 * - 사용자 역할 복사 기능
 * - 메뉴 정보 조회
 *
 * API 연동:
 * - GET /api/sys/user-roles/menus - 메뉴 목록 조회
 * - GET /api/sys/user-roles/user-roles - 사용자 역할 목록 조회
 * - POST /api/sys/user-roles/user-roles - 사용자 역할 저장
 * - GET /api/sys/user-roles/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 조회
 * - GET /api/sys/user-roles/program-groups - 전체 프로그램 그룹 조회
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 저장
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/copy - 사용자 역할 복사
 *
 * 상태 관리:
 * - 사용자 역할 목록 및 선택된 역할
 * - 폼 데이터 (신규/수정용)
 * - 프로그램 그룹 목록 및 선택 상태
 * - 메뉴 정보
 * - 로딩 상태 및 에러 처리
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (역할ID/명, 사용여부)
 * - 사용자 역할 목록 테이블 (선택 가능)
 * - 사용자 역할 정보 입력 폼 (신규/수정)
 * - 프로그램 그룹 관리 그리드 (체크박스)
 * - 메뉴 정보 표시
 * - 저장/초기화/복사/삭제 버튼
 *
 * 연관 화면:
 * - USR2010M00: 사용자 관리 (역할 정보 연동)
 *
 * 데이터 구조:
 * - TblUserRole: 사용자 역할 정보 (usrRoleId, usrRoleNm, athrGrdCd, orgInqRngCd, menuId, useYn)
 * - TblUserRolePgmGrp: 사용자 역할별 프로그램 그룹 연결 (usrRoleId, pgmGrpId, useYn)
 * - TblPgmGrpInf: 프로그램 그룹 정보 (pgmGrpId, pgmGrpNm, useYn)
 * - TblMenuInf: 메뉴 정보 (menuId, menuNm, useYn)
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { ColDef, SelectionChangedEvent } from "ag-grid-community"; // ColDef 타입 import
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/app/common/common.css"; // 공통 CSS 경로로 수정

// 사용자 역할 정보 타입
interface TblUserRole {
	usrRoleId: string;
	usrRoleNm: string;
	athrGrdCd: string;
	orgInqRngCd: string;
	menuId: string;
	useYn: string;
	baseOutputScrnPgmIdCtt?: string;
	baseOutputScrnPgmNmCtt?: string;
	[key: string]: any;
}

// 프로그램 그룹 정보 타입
interface ProgramGroupData {
	pgmGrpId: string;
	pgmGrpNm: string;
	pgmGrpUseYn: string;
	cnt: number;
	[key: string]: any;
}

// 메뉴 정보 타입
interface TblMenuInf {
	menuId: string;
	menuNm: string;
	useYn: string;
	[key: string]: any;
}

import {
	fetchUserRoles,
	saveUserRoles,
	fetchProgramGroups,
	fetchAllProgramGroups,
	saveProgramGroups,
	copyUserRole,
	fetchMenus,
} from "../../modules/sys/services"; // 서비스 import
import { usrApiService } from "../../modules/usr/services/usr-api.service"; // 공통코드 API 서비스
import { useToast } from "@/contexts/ToastContext";
import { usePopup } from "@/modules/com/hooks/usePopup";

/**
 * SYS1003M00 - 사용자역할 관리 화면
 *
 * 주요 기능:
 * - 사용자 역할 등록/수정/삭제
 * - 프로그램 그룹 권한 관리
 * - 역할 복사 기능
 * - 메뉴별 권한 설정
 *
 * 연관 테이블:
 * - TBL_USER_ROLE (사용자 역할)
 * - TBL_USER_ROLE_PGM_GRP (사용자 역할 프로그램 그룹)
 * - TBL_MENU_INF (메뉴 정보)
 * - TBL_PGM_GRP (프로그램 그룹)
 */

// 공통코드 타입 정의
interface CodeData {
	data: string;
	label: string;
}

// API 응답을 CodeData로 매핑하는 유틸리티 함수
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

// 백엔드에서 camelCase로 변환된 데이터 구조에 맞는 타입 정의
type PgmGrpRow = ProgramGroupData;

export default function RoleManagementPage() {
	const { showToast, showConfirm } = useToast();

	// 사용자 역할 목록 상태 관리 (ASIS: grdUserRole.dataProvider)
	// useState<ProgramGroupData[]> 등에서 타입 충돌이 발생하지 않도록, 상단에 직접 정의한 타입만 사용하도록 명시적으로 타입 선언
	const [rowData, setRowData] = useState<TblUserRole[]>([]);
	// 선택된 사용자 역할 상태 관리 (ASIS: grdUserRole.selectedItem)
	const [selectedRole, setSelectedRole] = useState<TblUserRole | null>(null);
	// 프로그램 그룹 목록 상태 관리 (ASIS: grdPgmGrp.dataProvider)
	const [pgmGrpRowData, setPgmGrpRowData] = useState<ProgramGroupData[]>([]);
	// 메뉴 목록 상태 관리 (ASIS: cboMenu.dataProvider)
	const [menuList, setMenuList] = useState<TblMenuInf[]>([]);

	// 팝업 관리 훅 (ASIS: PopUpManager와 동일한 역할)
	const { openPopup } = usePopup();

	// 신규 모드 상태 관리 (ASIS: isNewMode 변수와 동일)
	const [isNewMode, setIsNewMode] = useState(false);
	// 역할복사 버튼 활성화 상태 관리 (ASIS: btnCopy.enabled)
	const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(false);

	// 조회 조건 상태 관리 (ASIS: txtUsrRoleId.text, cboUseYn.selectedItem)
	const [searchConditions, setSearchConditions] = useState({
		usrRoleId: "", // 사용자역할코드/명 검색어
		useYn: "", // 사용여부 필터
	});

	// 공통코드 API 호출 (ASIS: COM_03_0101_S 프로시저로 조회)
	const { data: useYnApiData } = useQuery({
		queryKey: ["useYnCodes"],
		queryFn: () => usrApiService.getCodes("300"), // 사용여부 코드 (대분류: 300)
	});

	const { data: athrGrdApiData } = useQuery({
		queryKey: ["athrGrdCodes"],
		queryFn: () => usrApiService.getCodes("301"), // 권한등급 코드 (대분류: 301)
	});

	const { data: orgInqRngApiData } = useQuery({
		queryKey: ["orgInqRngCodes"],
		queryFn: () => usrApiService.getCodes("302"), // 조직조회범위 코드 (대분류: 302)
	});

	// API 응답을 CodeData로 매핑
	const useYnData = useYnApiData ? mapCodeApiToCodeData(useYnApiData) : [];
	const athrGrdData = athrGrdApiData
		? mapCodeApiToCodeData(athrGrdApiData)
		: [];
	const orgInqRngData = orgInqRngApiData
		? mapCodeApiToCodeData(orgInqRngApiData)
		: [];

	/**
	 * 조회 조건 변경 핸들러
	 * ASIS: txtUsrRoleId_change(), cboUseYn_change() 함수와 동일한 역할
	 * 검색 조건 입력 시 상태를 업데이트
	 * @param e 입력 이벤트
	 */
	const handleSearchChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setSearchConditions((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	/**
	 * 엔터키 입력 시 자동조회 핸들러
	 * ASIS: 키보드 이벤트 처리와 동일
	 * Enter 키 입력 시 자동으로 조회 실행
	 * @param e 키보드 이벤트
	 */
	const handleKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (e.key === "Enter") {
			loadData();
		}
	};

	const userRoleGridRef = useRef<AgGridReact<TblUserRole>>(null);
	const pgmGrpGridRef = useRef<AgGridReact<ProgramGroupData>>(null);

	const [colDefs] = useState<ColDef[]>([
		// 사용자역할코드 (코드/ID) - 가운데 정렬
		{
			headerName: "사용자역할코드",
			field: "usrRoleId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// 사용자역할명 (텍스트/이름) - 왼쪽 정렬
		{
			headerName: "사용자역할명",
			field: "usrRoleNm",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// 메뉴 (텍스트/이름) - 왼쪽 정렬
		{
			headerName: "메뉴",
			field: "menuNm",
			width: 120,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// 사용여부 (체크박스/아이콘) - 가운데 정렬
		{
			headerName: "사용여부",
			field: "useYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// 사용자수 (숫자형) - 오른쪽 정렬
		{
			headerName: "사용자수",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	const [pgmGrpColDefs] = useState<ColDef[]>([
		// 체크박스 컬럼 - 가운데 정렬
		{
			headerName: " ",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 50,
			flex: 0,
			suppressHeaderMenuButton: true,
			sortable: false,
			filter: false,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// 프로그램그룹 코드 (코드/ID) - 가운데 정렬
		{
			headerName: "프로그램그룹 코드",
			field: "pgmGrpId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// 프로그램그룹명 (텍스트/이름) - 왼쪽 정렬
		{
			headerName: "프로그램그룹명",
			field: "pgmGrpNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// 사용여부 (체크박스/아이콘) - 가운데 정렬
		{
			headerName: "사용여부",
			field: "pgmGrpUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// 사용자수 (숫자형) - 오른쪽 정렬
		{
			headerName: "사용자수",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	/**
	 * 사용자 역할 목록 조회 함수
	 * ASIS: fn_srch() 함수와 동일한 역할
	 * 검색 조건에 따라 사용자 역할 목록을 조회하고 화면에 표시
	 * 기존 시스템과 동일하게 조회 시에도 프로그램 그룹 목록을 함께 조회
	 */
	const loadData = async () => {
		try {
			// 사용자 역할 목록 조회 (ASIS: USR_02_0101_S 프로시저 호출)
			const data = await fetchUserRoles(searchConditions);
			setRowData((data as any[]).map((item) => ({ ...item })));

			// 기존 시스템과 동일하게 조회 시에도 프로그램 그룹 목록 조회
			try {
				const allPgmGrps = await fetchAllProgramGroups();
				setPgmGrpRowData((allPgmGrps as any[]).map((item) => ({ ...item })));
			} catch (error) {
				console.error(error);
				setPgmGrpRowData([]);
			}
		} catch (error) {
			console.error(error);
			showConfirm({
				message: "데이터를 불러오는 중 오류가 발생했습니다.",
				type: "error",
				onConfirm: () => {},
				confirmOnly: true,
			});
		}
	};

	useEffect(() => {
		loadData();
		// 메뉴 목록 조회
		const loadMenus = async () => {
			try {
				const menus = await fetchMenus();
				setMenuList(menus);
			} catch (error) {
				console.error(error);
				showConfirm({
					message: "메뉴 목록을 불러오는 중 오류가 발생했습니다.",
					type: "error",
					onConfirm: () => {},
					confirmOnly: true,
				});
			}
		};
		loadMenus();
	}, []);

	// postMessage 이벤트 리스너 추가
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "SELECTED_PROGRAMS") {
				const { data: selectedPrograms, PGM_ID } = event.data;
				if (selectedPrograms && selectedPrograms.length > 0) {
					const selectedProgram = selectedPrograms[0];
					setSelectedRole((prev) => ({
						...prev!,
						baseOutputScrnPgmIdCtt:
							selectedProgram.PGM_ID ||
							selectedProgram.pgmId ||
							selectedProgram.id ||
							"",
						baseOutputScrnPgmNmCtt:
							selectedProgram.PGM_NM ||
							selectedProgram.pgmNm ||
							selectedProgram.name ||
							"",
					}));
				}
			}
		};
		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	useEffect(() => {
		if (pgmGrpGridRef.current && pgmGrpGridRef.current.api) {
			pgmGrpGridRef.current.api.forEachNode((node) => {
				if (node.data && node.data.usrRoleId) node.setSelected(true);
				else node.setSelected(false);
			});
		}
	}, [pgmGrpRowData]);

	const handleSave = async () => {
		if (!selectedRole) {
			showConfirm({
				message: "저장할 역할을 선택해주세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// 유효성 검사
		if (!selectedRole.usrRoleNm || selectedRole.usrRoleNm.trim() === "") {
			showConfirm({
				message: "사용자역할명을 입력해주세요.",
				type: "warning",
				onConfirm: () => {
					// 사용자역할명 입력 필드에 포커스
					const usrRoleNmInput = document.getElementById(
						"usrRoleNm"
					) as HTMLInputElement;
					if (usrRoleNmInput) {
						usrRoleNmInput.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}
		if (!selectedRole.useYn || selectedRole.useYn.trim() === "") {
			showConfirm({
				message: "사용여부를 선택해주세요.",
				type: "warning",
				onConfirm: () => {
					// 사용여부 선택 필드에 포커스
					const useYnSelect = document.getElementById(
						"useYn"
					) as HTMLSelectElement;
					if (useYnSelect) {
						useYnSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}
		if (!selectedRole.menuId || selectedRole.menuId.trim() === "") {
			showConfirm({
				message: "메뉴를 선택해주세요.",
				type: "warning",
				onConfirm: () => {
					// 메뉴 선택 필드에 포커스
					const menuIdSelect = document.getElementById(
						"menuId"
					) as HTMLSelectElement;
					if (menuIdSelect) {
						menuIdSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}
		if (!selectedRole.athrGrdCd || selectedRole.athrGrdCd.trim() === "") {
			showConfirm({
				message: "등급을 선택해주세요.",
				type: "warning",
				onConfirm: () => {
					// 등급 선택 필드에 포커스
					const athrGrdCdSelect = document.getElementById(
						"athrGrdCd"
					) as HTMLSelectElement;
					if (athrGrdCdSelect) {
						athrGrdCdSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}
		if (!selectedRole.orgInqRngCd || selectedRole.orgInqRngCd.trim() === "") {
			showConfirm({
				message: "조직조회범위를 선택해주세요.",
				type: "warning",
				onConfirm: () => {
					// 조직조회범위 선택 필드에 포커스
					const orgInqRngCdSelect = document.getElementById(
						"orgInqRngCd"
					) as HTMLSelectElement;
					if (orgInqRngCdSelect) {
						orgInqRngCdSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}

		// 저장 확인 메시지
		showConfirm({
			message: "저장하시겠습니까?",
			type: "info",
			onConfirm: async () => {
				// 저장 로직을 여기로 이동
				if (!selectedRole) return;

				try {
					// 1. 역할 상세 정보 저장
					// usrRoleId가 빈 문자열이면 신규 저장, 아니면 수정
					const isNewRole =
						!selectedRole.usrRoleId || selectedRole.usrRoleId.trim() === "";

					const saveResult = await saveUserRoles({
						createdRows: isNewRole ? [selectedRole] : [],
						updatedRows: isNewRole ? [] : [selectedRole],
						deletedRows: [],
					});

					// 2. 프로그램 그룹 정보 저장
					if (pgmGrpGridRef.current?.api) {
						const selectedPgmGrps = pgmGrpGridRef.current.api
							.getSelectedRows()
							.map((row) => ({
								usrRoleId: selectedRole.usrRoleId || "", // 신규 시에는 빈 문자열
								pgmGrpId: row.pgmGrpId,
								useYn: row.useYn || "Y", // 기본값 설정
							}));

						// 신규 저장 시에는 저장 후 반환된 역할 ID를 사용
						const roleIdToUse =
							isNewRole && saveResult.savedRoles.length > 0
								? saveResult.savedRoles[0].usrRoleId
								: selectedRole.usrRoleId;

						// 선택된 프로그램 그룹이 있는 경우에만 저장
						if (selectedPgmGrps.length > 0) {
							await saveProgramGroups(roleIdToUse, selectedPgmGrps);
						}
					}

					showToast("성공적으로 저장되었습니다.", "info");

					// 저장 후 버튼 상태 업데이트
					setIsNewMode(false);
					setIsCopyButtonEnabled(false);

					// 기존 시스템과 동일하게 전체 화면 초기화 (프로그램 그룹 목록도 재조회)
					handleSaveInitialize();
				} catch (error) {
					console.error(error);
					showConfirm({
						message: (error as Error).message,
						type: "error",
						onConfirm: () => {},
						confirmOnly: true,
					});
				}
			},
		});
	};

	// 전체 화면 초기화 함수 (기존 시스템의 fn_init과 동일)
	const handleInitialize = () => {
		// 좌측 그리드 선택 해제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// 우측 영역 완전 초기화
		setSelectedRole(null);
		setPgmGrpRowData([]);

		// 버튼 상태 초기화
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// 데이터 재조회
		loadData();
	};

	// 저장 후 초기화 함수 (기존 시스템의 fn_srch와 동일)
	const handleSaveInitialize = async () => {
		// 좌측 그리드 선택 해제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// 우측 영역 완전 초기화
		setSelectedRole(null);

		// 버튼 상태 초기화
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// 기존 시스템과 동일하게 프로그램 그룹 목록도 재조회
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			setPgmGrpRowData([]);
		}

		// 데이터 재조회
		loadData();
	};

	const handleNew = async () => {
		// 좌측 그리드 선택 해제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// 신규 버튼 클릭 시 빈 값으로 초기화 (사용자가 직접 선택하도록)
		const newRole: TblUserRole = {
			usrRoleId: "",
			usrRoleNm: "",
			useYn: "", // 빈 값으로 초기화
			athrGrdCd: "",
			orgInqRngCd: "",
			menuId: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // 신규 모드에서 추가된 필드
		};

		// 모든 프로그램 그룹 목록 조회 (체크박스로 선택 가능한 상태)
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			showToast(
				"프로그램 그룹 목록을 불러오는 중 오류가 발생했습니다.",
				"error"
			);
		}

		// 상태를 마지막에 업데이트 (다른 함수 호출 후)
		setSelectedRole(newRole);
		setIsNewMode(true); // 신규 모드로 설정
		setIsCopyButtonEnabled(false); // 신규 모드에서는 역할복사 버튼 비활성화
	};

	// 역할 선택 시 프로그램 그룹 조회
	const onSelectionChanged = async (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows();
		if (selectedRows.length > 0) {
			const role = selectedRows[0];

			// 백엔드 키명을 프론트엔드 키명으로 매핑
			const roleWithDefaults = {
				...role,
				// 백엔드: athtGrdCd -> 프론트엔드: athrGrdCd
				athrGrdCd: role.athtGrdCd || role.athrGrdCd || "1",
				// 백엔드: orgInqRangCd -> 프론트엔드: orgInqRngCd
				orgInqRngCd: role.orgInqRangCd || role.orgInqRngCd || "ALL",
				useYn: role.useYn || "Y",
				menuId: role.menuId || "",
				usrRoleNm: role.usrRoleNm || "",
				baseOutputScrnPgmIdCtt: role.baseOutputScrnPgmIdCtt || "",
				baseOutputScrnPgmNmCtt: role.baseOutputScrnPgmNmCtt || "", // 기존 역할 선택 시 추가된 필드
			};

			setSelectedRole(roleWithDefaults);
			setIsNewMode(false); // 기존 역할 선택 시 신규 모드 해제
			setIsCopyButtonEnabled(true); // 기존 역할 선택 시 역할복사 버튼 활성화

			try {
				const pgmGrps = await fetchProgramGroups(role.usrRoleId);
				setPgmGrpRowData((pgmGrps as any[]).map((item) => ({ ...item }))); // 변환 없이 그대로 할당
			} catch (error) {
				console.error(error);
				showConfirm({
					message: "프로그램 그룹을 불러오는 중 오류가 발생했습니다.",
					type: "error",
					onConfirm: () => {},
					confirmOnly: true,
				});
			}
		} else {
			setSelectedRole(null);
			setPgmGrpRowData([]);
			setIsNewMode(false);
			setIsCopyButtonEnabled(false);
		}
	};

	// 상세 폼 입력 변경 핸들러
	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		// selectedRole이 null이면 빈 객체로 초기화 (기본값 설정하지 않음)
		const currentRole = selectedRole || {
			usrRoleId: "",
			menuId: "",
			usrRoleNm: "",
			athrGrdCd: "",
			orgInqRngCd: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // 추가된 필드
			useYn: "",
		};

		setSelectedRole({
			...currentRole,
			[e.target.name]: e.target.value,
		});
	};

	// 기본출력화면 필드 초기화 핸들러
	const handleClearBaseOutput = () => {
		if (!selectedRole) return;
		setSelectedRole({
			...selectedRole,
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // 추가된 필드
			// baseOutputScrnPgmNmCtt 필드가 있다면 같이 초기화해야 합니다.
			// 현재 타입 정의에 없어 우선 ID 필드만 초기화합니다.
		});
	};

	// 프로그램 검색 핸들러
	const handleProgramSearch = (rowData: any, rowIndex: number) => {
		console.log("프로그램 검색 클릭:", rowData, rowIndex);
		// 프로그램 검색 팝업 열기 (그리드 안쪽: 클릭한 로우의 순번을 PGM_ID로 전달)
		openPopup({
			url: `/popup/sys/SYS1010D00?PGM_ID=${rowIndex}`,
			size: "custom",
			position: "center",
			options: {
				width: 850,
				height: 430,
				resizable: false,
				scrollbars: false,
			},
		});
	};

	// 프로그램 그룹 삭제 핸들러
	const handleDeletePgmGrp = () => {
		if (!pgmGrpGridRef.current) return;
		const selectedNodes = pgmGrpGridRef.current.api.getSelectedNodes();
		if (selectedNodes.length === 0) {
			showConfirm({
				message: "삭제할 프로그램 그룹을 선택해주세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		const selectedIds = selectedNodes
			.map((node) => node.data?.pgmGrpId)
			.filter(Boolean); // undefined나 null인 경우 제거
		setPgmGrpRowData((prevData) =>
			prevData.filter((row) => !selectedIds.includes(row.pgmGrpId))
		);
	};

	// 역할 복사 핸들러
	const handleCopyRole = async () => {
		if (!selectedRole) {
			showConfirm({
				message: "복사할 역할을 선택해주세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		showConfirm({
			message: `'${selectedRole.usrRoleNm}' 역할을 복사하시겠습니까?`,
			type: "info",
			onConfirm: async () => {
				try {
					await copyUserRole(selectedRole.usrRoleId);
					showToast("역할이 복사되었습니다.", "info");
					loadData(); // 목록 새로고침
				} catch (error) {
					console.error(error);
					showConfirm({
						message: (error as Error).message,
						type: "error",
						onConfirm: () => {},
						confirmOnly: true,
					});
				}
			},
		});
	};

	return (
		<div className='mdi'>
			{/* 🔍 조회 영역 */}
			<div className='search-div mb-4'>
				<table className='search-table w-full'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>사용자역할코드/명</th>
							<td className='search-td w-[20%]'>
								<input
									type='text'
									name='usrRoleId'
									value={searchConditions.usrRoleId}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='input-base input-default w-full'
									aria-label='사용자역할코드/명 입력'
									placeholder='코드 또는 명 입력'
								/>
							</td>
							<th className='search-th w-[100px]'>사용여부</th>
							<td className='search-td w-[10%]'>
								<select
									name='useYn'
									value={searchConditions.useYn}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='combo-base w-full min-w-[80px]'
									aria-label='사용여부 선택'
								>
									<option value=''>전체</option>
									{useYnData?.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<td className='search-td text-right' colSpan={1}>
								<button
									type='button'
									className='btn-base btn-search'
									onClick={loadData}
								>
									조회
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 📋 좌우 2단 */}
			<div className='flex gap-4 flex-1 overflow-auto'>
				{/* ◀ 좌측 */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>사용자역할 목록</h3>
					</div>
					<div
						className='gridbox-div flex-1 overflow-auto ag-theme-alpine'
						style={{ width: "100%" }}
					>
						<AgGridReact
							ref={userRoleGridRef}
							rowData={rowData}
							columnDefs={colDefs}
							defaultColDef={{
								resizable: true,
								sortable: true,
								filter: true,
							}}
							rowSelection='single'
							onSelectionChanged={onSelectionChanged}
							components={{
								agColumnHeader: (props: any) => (
									<div style={{ textAlign: "center", width: "100%" }}>
										{props.displayName}
									</div>
								),
							}}
						/>
					</div>
				</div>

				{/* ▶ 우측 상세 폼 */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>사용자역할 정보</h3>
					</div>
					<table className='form-table mb-2'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th required w-[120px]'>사용자역할명</th>
								<td className='form-td'>
									<input
										type='text'
										name='usrRoleNm'
										id='usrRoleNm'
										value={selectedRole?.usrRoleNm || ""}
										onChange={handleFormChange}
										className='input-base input-default w-full'
										aria-label='상세 사용자역할명'
										maxLength={33}
										placeholder='최대 33글자 (한글 기준)'
									/>
								</td>
								<th className='form-th required w-[100px]'>사용여부</th>
								<td className='form-td'>
									<select
										name='useYn'
										id='useYn'
										value={selectedRole ? selectedRole.useYn : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 사용여부'
									>
										<option value=''>선택</option>
										{useYnData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th w-[80px]'>등급</th>
								<td className='form-td'>
									<select
										name='athrGrdCd'
										id='athrGrdCd'
										value={selectedRole ? selectedRole.athrGrdCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 등급'
									>
										<option value=''>선택</option>
										{athrGrdData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th required'>조직조회범위</th>
								<td className='form-td'>
									<select
										name='orgInqRngCd'
										id='orgInqRngCd'
										value={selectedRole ? selectedRole.orgInqRngCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 조직조회범위'
									>
										<option value=''>선택</option>
										{orgInqRngData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th required'>메뉴</th>
								<td className='form-td' colSpan={3}>
									<select
										name='menuId'
										id='menuId'
										value={selectedRole ? selectedRole.menuId : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 메뉴'
									>
										<option value=''>선택</option>
										{menuList.map((menu) => (
											<option key={menu.menuId} value={menu.menuId}>
												{menu.menuNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>기본출력화면</th>
								<td className='form-td' colSpan={4}>
									{/* 프로그램ID는 hidden, 프로그램명은 표시 */}
									<input
										type='hidden'
										name='baseOutputScrnPgmIdCtt'
										value={selectedRole?.baseOutputScrnPgmIdCtt || ""}
										readOnly
									/>
									<input
										type='text'
										name='baseOutputScrnPgmNmCtt'
										value={selectedRole?.baseOutputScrnPgmNmCtt || ""}
										readOnly
										className='input-base input-default w-full'
										aria-label='상세 기본출력화면'
									/>
								</td>
								<td className='form-td'>
									<div className='flex gap-1'>
										<button
											type='button'
											className='btn-base btn-etc text-xs px-3 py-1'
											onClick={() => handleProgramSearch(null, 0)}
										>
											+ 추가
										</button>
										<button
											type='button'
											className='text-xl text-gray-400 px-2'
											onClick={handleClearBaseOutput}
										>
											×
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* ➕ 버튼 영역 - 원본에 없으므로 제거 */}
					{/*
					<div className='flex justify-between items-center mb-2 px-1'>
						<div></div>
						<div className='flex gap-1'>
							<button
								type='button'
								className='btn-base btn-etc text-xs px-3 py-1'
							>
								+ 추가
							</button>
							<button
								type='button'
								className='text-xl text-gray-400 px-2'
								onClick={handleDeletePgmGrp}
							>
								×
							</button>
						</div>
					</div>
					*/}

					{/* 프로그램 그룹 목록 */}
					<div className='tit_area mb-2'>
						<h3>사용자역할 프로그램그룹 목록</h3>
					</div>
					<div
						className='gridbox-div flex-1 overflow-auto ag-theme-alpine'
						style={{ width: "100%" }}
					>
						<AgGridReact
							ref={pgmGrpGridRef}
							rowData={pgmGrpRowData}
							columnDefs={pgmGrpColDefs}
							defaultColDef={{
								resizable: true,
								sortable: true,
								filter: true,
							}}
							rowSelection='multiple'
							suppressRowClickSelection={true} // 행 클릭으로 선택되는 것 방지
							getRowId={(params) => params.data.pgmGrpId}
							onGridReady={(params) => {
								params.api.forEachNode((node) => {
									if (node.data.isSelected) node.setSelected(true);
								});
							}}
							components={{
								agColumnHeader: (props: any) => (
									<div style={{ textAlign: "center", width: "100%" }}>
										{props.displayName}
									</div>
								),
							}}
						/>
					</div>
				</div>
			</div>

			{/* ⬇ 하단 버튼 */}
			<div className='flex justify-end gap-2 mt-4'>
				<button
					type='button'
					className='btn-base btn-etc'
					onClick={handleCopyRole}
					disabled={!isCopyButtonEnabled}
				>
					역할복사
				</button>
				<button type='button' className='btn-base btn-etc' onClick={handleNew}>
					신규
				</button>
				<button
					type='button'
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={!isNewMode && !selectedRole}
				>
					저장
				</button>
			</div>

			{/* 프로그램 찾기 팝업 */}
			{/* 제거 (조건부 렌더링 및 팝업 JSX 삭제) */}
		</div>
	);
}
