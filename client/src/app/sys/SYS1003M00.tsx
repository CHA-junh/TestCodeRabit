/**
 * SYS1003M00 - ?�용????�� 관�??�면
 *
 * 주요 기능:
 * - ?�용????�� 목록 조회 �?검??
 * - ?�용????�� ?�규 ?�록 �??�정
 * - ?�용????���??�로그램 그룹 ?�결 관�?
 * - ?�용????�� 복사 기능
 * - 메뉴 ?�보 조회
 *
 * API ?�동:
 * - GET /api/sys/user-roles/menus - 메뉴 목록 조회
 * - GET /api/sys/user-roles/user-roles - ?�용????�� 목록 조회
 * - POST /api/sys/user-roles/user-roles - ?�용????�� ?�??
 * - GET /api/sys/user-roles/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 조회
 * - GET /api/sys/user-roles/program-groups - ?�체 ?�로그램 그룹 조회
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 ?�??
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/copy - ?�용????�� 복사
 *
 * ?�태 관�?
 * - ?�용????�� 목록 �??�택????��
 * - ???�이??(?�규/?�정??
 * - ?�로그램 그룹 목록 �??�택 ?�태
 * - 메뉴 ?�보
 * - 로딩 ?�태 �??�러 처리
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (??��ID/�? ?�용?��?)
 * - ?�용????�� 목록 ?�이�?(?�택 가??
 * - ?�용????�� ?�보 ?�력 ??(?�규/?�정)
 * - ?�로그램 그룹 관�?그리??(체크박스)
 * - 메뉴 ?�보 ?�시
 * - ?�??초기??복사/??�� 버튼
 *
 * ?��? ?�면:
 * - USR2010M00: ?�용??관�?(??�� ?�보 ?�동)
 *
 * ?�이??구조:
 * - TblUserRole: ?�용????�� ?�보 (usrRoleId, usrRoleNm, athrGrdCd, orgInqRngCd, menuId, useYn)
 * - TblUserRolePgmGrp: ?�용????���??�로그램 그룹 ?�결 (usrRoleId, pgmGrpId, useYn)
 * - TblPgmGrpInf: ?�로그램 그룹 ?�보 (pgmGrpId, pgmGrpNm, useYn)
 * - TblMenuInf: 메뉴 ?�보 (menuId, menuNm, useYn)
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { ColDef, SelectionChangedEvent } from "ag-grid-community"; // ColDef ?�??import
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/app/common/common.css"; // 공통 CSS 경로�??�정

// ?�용????�� ?�보 ?�??
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

// ?�로그램 그룹 ?�보 ?�??
interface ProgramGroupData {
	pgmGrpId: string;
	pgmGrpNm: string;
	pgmGrpUseYn: string;
	cnt: number;
	[key: string]: any;
}

// 메뉴 ?�보 ?�??
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
} from "../../modules/sys/services"; // ?�비??import
import { usrApiService } from "../../modules/usr/services/usr-api.service"; // 공통코드 API ?�비??
import { useToast } from "@/contexts/ToastContext";
import { usePopup } from "@/modules/com/hooks/usePopup";

/**
 * SYS1003M00 - ?�용?�역??관�??�면
 *
 * 주요 기능:
 * - ?�용????�� ?�록/?�정/??��
 * - ?�로그램 그룹 권한 관�?
 * - ??�� 복사 기능
 * - 메뉴�?권한 ?�정
 *
 * ?��? ?�이�?
 * - TBL_USER_ROLE (?�용????��)
 * - TBL_USER_ROLE_PGM_GRP (?�용????�� ?�로그램 그룹)
 * - TBL_MENU_INF (메뉴 ?�보)
 * - TBL_PGM_GRP (?�로그램 그룹)
 */

// 공통코드 ?�???�의
interface CodeData {
	data: string;
	label: string;
}

// API ?�답??CodeData�?매핑?�는 ?�틸리티 ?�수
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

// 백엔?�에??camelCase�?변?�된 ?�이??구조??맞는 ?�???�의
type PgmGrpRow = ProgramGroupData;

export default function RoleManagementPage() {
	const { showToast, showConfirm } = useToast();

	// ?�용????�� 목록 ?�태 관�?(ASIS: grdUserRole.dataProvider)
	// useState<ProgramGroupData[]> ?�에???�??충돌??발생?��? ?�도�? ?�단??직접 ?�의???�?�만 ?�용?�도�?명시?�으�??�???�언
	const [rowData, setRowData] = useState<TblUserRole[]>([]);
	// ?�택???�용????�� ?�태 관�?(ASIS: grdUserRole.selectedItem)
	const [selectedRole, setSelectedRole] = useState<TblUserRole | null>(null);
	// ?�로그램 그룹 목록 ?�태 관�?(ASIS: grdPgmGrp.dataProvider)
	const [pgmGrpRowData, setPgmGrpRowData] = useState<ProgramGroupData[]>([]);
	// 메뉴 목록 ?�태 관�?(ASIS: cboMenu.dataProvider)
	const [menuList, setMenuList] = useState<TblMenuInf[]>([]);

	// ?�업 관�???(ASIS: PopUpManager?� ?�일????��)
	const { openPopup } = usePopup();

	// ?�규 모드 ?�태 관�?(ASIS: isNewMode 변?��? ?�일)
	const [isNewMode, setIsNewMode] = useState(false);
	// ??��복사 버튼 ?�성???�태 관�?(ASIS: btnCopy.enabled)
	const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(false);

	// 조회 조건 ?�태 관�?(ASIS: txtUsrRoleId.text, cboUseYn.selectedItem)
	const [searchConditions, setSearchConditions] = useState({
		usrRoleId: "", // ?�용?�역?�코??�?검?�어
		useYn: "", // ?�용?��? ?�터
	});

	// 공통코드 API ?�출 (ASIS: COM_03_0101_S ?�로?��?�?조회)
	const { data: useYnApiData } = useQuery({
		queryKey: ["useYnCodes"],
		queryFn: () => usrApiService.getCodes("300"), // ?�용?��? 코드 (?�분류: 300)
	});

	const { data: athrGrdApiData } = useQuery({
		queryKey: ["athrGrdCodes"],
		queryFn: () => usrApiService.getCodes("301"), // 권한?�급 코드 (?�분류: 301)
	});

	const { data: orgInqRngApiData } = useQuery({
		queryKey: ["orgInqRngCodes"],
		queryFn: () => usrApiService.getCodes("302"), // 조직조회범위 코드 (?�분류: 302)
	});

	// API ?�답??CodeData�?매핑
	const useYnData = useYnApiData ? mapCodeApiToCodeData(useYnApiData) : [];
	const athrGrdData = athrGrdApiData
		? mapCodeApiToCodeData(athrGrdApiData)
		: [];
	const orgInqRngData = orgInqRngApiData
		? mapCodeApiToCodeData(orgInqRngApiData)
		: [];

	/**
	 * 조회 조건 변�??�들??
	 * ASIS: txtUsrRoleId_change(), cboUseYn_change() ?�수?� ?�일????��
	 * 검??조건 ?�력 ???�태�??�데?�트
	 * @param e ?�력 ?�벤??
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
	 * ?�터???�력 ???�동조회 ?�들??
	 * ASIS: ?�보???�벤??처리?� ?�일
	 * Enter ???�력 ???�동?�로 조회 ?�행
	 * @param e ?�보???�벤??
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
		// ?�용?�역?�코??(코드/ID) - 가?�데 ?�렬
		{
			headerName: "?�용?�역?�코??,
			field: "usrRoleId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?�용?�역?�명 (?�스???�름) - ?�쪽 ?�렬
		{
			headerName: "?�용?�역?�명",
			field: "usrRoleNm",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// 메뉴 (?�스???�름) - ?�쪽 ?�렬
		{
			headerName: "메뉴",
			field: "menuNm",
			width: 120,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// ?�용?��? (체크박스/?�이�? - 가?�데 ?�렬
		{
			headerName: "?�용?��?",
			field: "useYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?�용?�수 (?�자?? - ?�른�??�렬
		{
			headerName: "?�용?�수",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	const [pgmGrpColDefs] = useState<ColDef[]>([
		// 체크박스 컬럼 - 가?�데 ?�렬
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
		// ?�로그램그룹 코드 (코드/ID) - 가?�데 ?�렬
		{
			headerName: "?�로그램그룹 코드",
			field: "pgmGrpId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?�로그램그룹�?(?�스???�름) - ?�쪽 ?�렬
		{
			headerName: "?�로그램그룹�?,
			field: "pgmGrpNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// ?�용?��? (체크박스/?�이�? - 가?�데 ?�렬
		{
			headerName: "?�용?��?",
			field: "pgmGrpUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?�용?�수 (?�자?? - ?�른�??�렬
		{
			headerName: "?�용?�수",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	/**
	 * ?�용????�� 목록 조회 ?�수
	 * ASIS: fn_srch() ?�수?� ?�일????��
	 * 검??조건???�라 ?�용????�� 목록??조회?�고 ?�면???�시
	 * 기존 ?�스?�과 ?�일?�게 조회 ?�에???�로그램 그룹 목록???�께 조회
	 */
	const loadData = async () => {
		try {
			// ?�용????�� 목록 조회 (ASIS: USR_02_0101_S ?�로?��? ?�출)
			const data = await fetchUserRoles(searchConditions);
			setRowData((data as any[]).map((item) => ({ ...item })));

			// 기존 ?�스?�과 ?�일?�게 조회 ?�에???�로그램 그룹 목록 조회
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
				message: "?�이?��? 불러?�는 �??�류가 발생?�습?�다.",
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
					message: "메뉴 목록??불러?�는 �??�류가 발생?�습?�다.",
					type: "error",
					onConfirm: () => {},
					confirmOnly: true,
				});
			}
		};
		loadMenus();
	}, []);

	// postMessage ?�벤??리스??추�?
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
				message: "?�?�할 ??��???�택?�주?�요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// ?�효??검??
		if (!selectedRole.usrRoleNm || selectedRole.usrRoleNm.trim() === "") {
			showConfirm({
				message: "?�용?�역?�명???�력?�주?�요.",
				type: "warning",
				onConfirm: () => {
					// ?�용?�역?�명 ?�력 ?�드???�커??
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
				message: "?�용?��?�??�택?�주?�요.",
				type: "warning",
				onConfirm: () => {
					// ?�용?��? ?�택 ?�드???�커??
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
				message: "메뉴�??�택?�주?�요.",
				type: "warning",
				onConfirm: () => {
					// 메뉴 ?�택 ?�드???�커??
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
				message: "?�급???�택?�주?�요.",
				type: "warning",
				onConfirm: () => {
					// ?�급 ?�택 ?�드???�커??
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
				message: "조직조회범위�??�택?�주?�요.",
				type: "warning",
				onConfirm: () => {
					// 조직조회범위 ?�택 ?�드???�커??
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

		// ?�???�인 메시지
		showConfirm({
			message: "?�?�하?�겠?�니�?",
			type: "info",
			onConfirm: async () => {
				// ?�??로직???�기�??�동
				if (!selectedRole) return;

				try {
					// 1. ??�� ?�세 ?�보 ?�??
					// usrRoleId가 �?문자?�이�??�규 ?�?? ?�니�??�정
					const isNewRole =
						!selectedRole.usrRoleId || selectedRole.usrRoleId.trim() === "";

					const saveResult = await saveUserRoles({
						createdRows: isNewRole ? [selectedRole] : [],
						updatedRows: isNewRole ? [] : [selectedRole],
						deletedRows: [],
					});

					// 2. ?�로그램 그룹 ?�보 ?�??
					if (pgmGrpGridRef.current?.api) {
						const selectedPgmGrps = pgmGrpGridRef.current.api
							.getSelectedRows()
							.map((row) => ({
								usrRoleId: selectedRole.usrRoleId || "", // ?�규 ?�에??�?문자??
								pgmGrpId: row.pgmGrpId,
								useYn: row.useYn || "Y", // 기본�??�정
							}));

						// ?�규 ?�???�에???�????반환????�� ID�??�용
						const roleIdToUse =
							isNewRole && saveResult.savedRoles.length > 0
								? saveResult.savedRoles[0].usrRoleId
								: selectedRole.usrRoleId;

						// ?�택???�로그램 그룹???�는 경우?�만 ?�??
						if (selectedPgmGrps.length > 0) {
							await saveProgramGroups(roleIdToUse, selectedPgmGrps);
						}
					}

					showToast("?�공?�으�??�?�되?�습?�다.", "info");

					// ?�????버튼 ?�태 ?�데?�트
					setIsNewMode(false);
					setIsCopyButtonEnabled(false);

					// 기존 ?�스?�과 ?�일?�게 ?�체 ?�면 초기??(?�로그램 그룹 목록???�조??
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

	// ?�체 ?�면 초기???�수 (기존 ?�스?�의 fn_init�??�일)
	const handleInitialize = () => {
		// 좌측 그리???�택 ?�제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ?�측 ?�역 ?�전 초기??
		setSelectedRole(null);
		setPgmGrpRowData([]);

		// 버튼 ?�태 초기??
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// ?�이???�조??
		loadData();
	};

	// ?�????초기???�수 (기존 ?�스?�의 fn_srch?� ?�일)
	const handleSaveInitialize = async () => {
		// 좌측 그리???�택 ?�제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ?�측 ?�역 ?�전 초기??
		setSelectedRole(null);

		// 버튼 ?�태 초기??
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// 기존 ?�스?�과 ?�일?�게 ?�로그램 그룹 목록???�조??
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			setPgmGrpRowData([]);
		}

		// ?�이???�조??
		loadData();
	};

	const handleNew = async () => {
		// 좌측 그리???�택 ?�제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ?�규 버튼 ?�릭 ??�?값으�?초기??(?�용?��? 직접 ?�택?�도�?
		const newRole: TblUserRole = {
			usrRoleId: "",
			usrRoleNm: "",
			useYn: "", // �?값으�?초기??
			athrGrdCd: "",
			orgInqRngCd: "",
			menuId: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // ?�규 모드?�서 추�????�드
		};

		// 모든 ?�로그램 그룹 목록 조회 (체크박스�??�택 가?�한 ?�태)
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			showToast(
				"?�로그램 그룹 목록??불러?�는 �??�류가 발생?�습?�다.",
				"error"
			);
		}

		// ?�태�?마�?막에 ?�데?�트 (?�른 ?�수 ?�출 ??
		setSelectedRole(newRole);
		setIsNewMode(true); // ?�규 모드�??�정
		setIsCopyButtonEnabled(false); // ?�규 모드?�서????��복사 버튼 비활?�화
	};

	// ??�� ?�택 ???�로그램 그룹 조회
	const onSelectionChanged = async (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows();
		if (selectedRows.length > 0) {
			const role = selectedRows[0];

			// 백엔???�명???�론?�엔???�명?�로 매핑
			const roleWithDefaults = {
				...role,
				// 백엔?? athtGrdCd -> ?�론?�엔?? athrGrdCd
				athrGrdCd: role.athtGrdCd || role.athrGrdCd || "1",
				// 백엔?? orgInqRangCd -> ?�론?�엔?? orgInqRngCd
				orgInqRngCd: role.orgInqRangCd || role.orgInqRngCd || "ALL",
				useYn: role.useYn || "Y",
				menuId: role.menuId || "",
				usrRoleNm: role.usrRoleNm || "",
				baseOutputScrnPgmIdCtt: role.baseOutputScrnPgmIdCtt || "",
				baseOutputScrnPgmNmCtt: role.baseOutputScrnPgmNmCtt || "", // 기존 ??�� ?�택 ??추�????�드
			};

			setSelectedRole(roleWithDefaults);
			setIsNewMode(false); // 기존 ??�� ?�택 ???�규 모드 ?�제
			setIsCopyButtonEnabled(true); // 기존 ??�� ?�택 ????��복사 버튼 ?�성??

			try {
				const pgmGrps = await fetchProgramGroups(role.usrRoleId);
				setPgmGrpRowData((pgmGrps as any[]).map((item) => ({ ...item }))); // 변???�이 그�?�??�당
			} catch (error) {
				console.error(error);
				showConfirm({
					message: "?�로그램 그룹??불러?�는 �??�류가 발생?�습?�다.",
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

	// ?�세 ???�력 변�??�들??
	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		// selectedRole??null?�면 �?객체�?초기??(기본�??�정?��? ?�음)
		const currentRole = selectedRole || {
			usrRoleId: "",
			menuId: "",
			usrRoleNm: "",
			athrGrdCd: "",
			orgInqRngCd: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // 추�????�드
			useYn: "",
		};

		setSelectedRole({
			...currentRole,
			[e.target.name]: e.target.value,
		});
	};

	// 기본출력?�면 ?�드 초기???�들??
	const handleClearBaseOutput = () => {
		if (!selectedRole) return;
		setSelectedRole({
			...selectedRole,
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // 추�????�드
			// baseOutputScrnPgmNmCtt ?�드가 ?�다�?같이 초기?�해???�니??
			// ?�재 ?�???�의???�어 ?�선 ID ?�드�?초기?�합?�다.
		});
	};

	// ?�로그램 검???�들??
	const handleProgramSearch = (rowData: any, rowIndex: number) => {
		console.log("?�로그램 검???�릭:", rowData, rowIndex);
		// ?�로그램 검???�업 ?�기 (그리???�쪽: ?�릭??로우???�번??PGM_ID�??�달)
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

	// ?�로그램 그룹 ??�� ?�들??
	const handleDeletePgmGrp = () => {
		if (!pgmGrpGridRef.current) return;
		const selectedNodes = pgmGrpGridRef.current.api.getSelectedNodes();
		if (selectedNodes.length === 0) {
			showConfirm({
				message: "??��???�로그램 그룹???�택?�주?�요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		const selectedIds = selectedNodes
			.map((node) => node.data?.pgmGrpId)
			.filter(Boolean); // undefined??null??경우 ?�거
		setPgmGrpRowData((prevData) =>
			prevData.filter((row) => !selectedIds.includes(row.pgmGrpId))
		);
	};

	// ??�� 복사 ?�들??
	const handleCopyRole = async () => {
		if (!selectedRole) {
			showConfirm({
				message: "복사????��???�택?�주?�요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		showConfirm({
			message: `'${selectedRole.usrRoleNm}' ??��??복사?�시겠습?�까?`,
			type: "info",
			onConfirm: async () => {
				try {
					await copyUserRole(selectedRole.usrRoleId);
					showToast("??��??복사?�었?�니??", "info");
					loadData(); // 목록 ?�로고침
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
			{/* ?�� 조회 ?�역 */}
			<div className='search-div mb-4'>
				<table className='search-table w-full'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>?�용?�역?�코??�?/th>
							<td className='search-td w-[20%]'>
								<input
									type='text'
									name='usrRoleId'
									value={searchConditions.usrRoleId}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='input-base input-default w-full'
									aria-label='?�용?�역?�코??�??�력'
									placeholder='코드 ?�는 �??�력'
								/>
							</td>
							<th className='search-th w-[100px]'>?�용?��?</th>
							<td className='search-td w-[10%]'>
								<select
									name='useYn'
									value={searchConditions.useYn}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='combo-base w-full min-w-[80px]'
									aria-label='?�용?��? ?�택'
								>
									<option value=''>?�체</option>
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

			{/* ?�� 좌우 2??*/}
			<div className='flex gap-4 flex-1 overflow-auto'>
				{/* ?� 좌측 */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>?�용?�역??목록</h3>
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

				{/* ???�측 ?�세 ??*/}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>?�용?�역???�보</h3>
					</div>
					<table className='form-table mb-2'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th required w-[120px]'>?�용?�역?�명</th>
								<td className='form-td'>
									<input
										type='text'
										name='usrRoleNm'
										id='usrRoleNm'
										value={selectedRole?.usrRoleNm || ""}
										onChange={handleFormChange}
										className='input-base input-default w-full'
										aria-label='?�세 ?�용?�역?�명'
										maxLength={33}
										placeholder='최�? 33글??(?��? 기�?)'
									/>
								</td>
								<th className='form-th required w-[100px]'>?�용?��?</th>
								<td className='form-td'>
									<select
										name='useYn'
										id='useYn'
										value={selectedRole ? selectedRole.useYn : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?�세 ?�용?��?'
									>
										<option value=''>?�택</option>
										{useYnData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th w-[80px]'>?�급</th>
								<td className='form-td'>
									<select
										name='athrGrdCd'
										id='athrGrdCd'
										value={selectedRole ? selectedRole.athrGrdCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?�세 ?�급'
									>
										<option value=''>?�택</option>
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
										aria-label='?�세 조직조회범위'
									>
										<option value=''>?�택</option>
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
										aria-label='?�세 메뉴'
									>
										<option value=''>?�택</option>
										{menuList.map((menu) => (
											<option key={menu.menuId} value={menu.menuId}>
												{menu.menuNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>기본출력?�면</th>
								<td className='form-td' colSpan={4}>
									{/* ?�로그램ID??hidden, ?�로그램명�? ?�시 */}
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
										aria-label='?�세 기본출력?�면'
									/>
								</td>
								<td className='form-td'>
									<div className='flex gap-1'>
										<button
											type='button'
											className='btn-base btn-etc text-xs px-3 py-1'
											onClick={() => handleProgramSearch(null, 0)}
										>
											+ 추�?
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

					{/* ??버튼 ?�역 - ?�본???�으므�??�거 */}
					{/*
					<div className='flex justify-between items-center mb-2 px-1'>
						<div></div>
						<div className='flex gap-1'>
							<button
								type='button'
								className='btn-base btn-etc text-xs px-3 py-1'
							>
								+ 추�?
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

					{/* ?�로그램 그룹 목록 */}
					<div className='tit_area mb-2'>
						<h3>?�용?�역???�로그램그룹 목록</h3>
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
							suppressRowClickSelection={true} // ???�릭?�로 ?�택?�는 �?방�?
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

			{/* �??�단 버튼 */}
			<div className='flex justify-end gap-2 mt-4'>
				<button
					type='button'
					className='btn-base btn-etc'
					onClick={handleCopyRole}
					disabled={!isCopyButtonEnabled}
				>
					??��복사
				</button>
				<button type='button' className='btn-base btn-etc' onClick={handleNew}>
					?�규
				</button>
				<button
					type='button'
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={!isNewMode && !selectedRole}
				>
					?�??
				</button>
			</div>

			{/* ?�로그램 찾기 ?�업 */}
			{/* ?�거 (조건부 ?�더�?�??�업 JSX ??��) */}
		</div>
	);
}


