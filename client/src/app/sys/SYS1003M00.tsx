/**
 * SYS1003M00 - ?¬ìš©????•  ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?¬ìš©????•  ? ê·œ ?±ë¡ ë°??˜ì •
 * - ?¬ìš©????• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ê´€ë¦?
 * - ?¬ìš©????•  ë³µì‚¬ ê¸°ëŠ¥
 * - ë©”ë‰´ ?•ë³´ ì¡°íšŒ
 *
 * API ?°ë™:
 * - GET /api/sys/user-roles/menus - ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
 * - GET /api/sys/user-roles/user-roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/user-roles/user-roles - ?¬ìš©????•  ?€??
 * - GET /api/sys/user-roles/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
 * - GET /api/sys/user-roles/program-groups - ?„ì²´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?€??
 * - POST /api/sys/user-roles/user-roles/:usrRoleId/copy - ?¬ìš©????•  ë³µì‚¬
 *
 * ?íƒœ ê´€ë¦?
 * - ?¬ìš©????•  ëª©ë¡ ë°?? íƒ????• 
 * - ???°ì´??(? ê·œ/?˜ì •??
 * - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ë°?? íƒ ?íƒœ
 * - ë©”ë‰´ ?•ë³´
 * - ë¡œë”© ?íƒœ ë°??ëŸ¬ ì²˜ë¦¬
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ê²€??ì¡°ê±´ ?…ë ¥ (??• ID/ëª? ?¬ìš©?¬ë?)
 * - ?¬ìš©????•  ëª©ë¡ ?Œì´ë¸?(? íƒ ê°€??
 * - ?¬ìš©????•  ?•ë³´ ?…ë ¥ ??(? ê·œ/?˜ì •)
 * - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?ê·¸ë¦¬??(ì²´í¬ë°•ìŠ¤)
 * - ë©”ë‰´ ?•ë³´ ?œì‹œ
 * - ?€??ì´ˆê¸°??ë³µì‚¬/?? œ ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - USR2010M00: ?¬ìš©??ê´€ë¦?(??•  ?•ë³´ ?°ë™)
 *
 * ?°ì´??êµ¬ì¡°:
 * - TblUserRole: ?¬ìš©????•  ?•ë³´ (usrRoleId, usrRoleNm, athrGrdCd, orgInqRngCd, menuId, useYn)
 * - TblUserRolePgmGrp: ?¬ìš©????• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° (usrRoleId, pgmGrpId, useYn)
 * - TblPgmGrpInf: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ (pgmGrpId, pgmGrpNm, useYn)
 * - TblMenuInf: ë©”ë‰´ ?•ë³´ (menuId, menuNm, useYn)
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { ColDef, SelectionChangedEvent } from "ag-grid-community"; // ColDef ?€??import
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/app/common/common.css"; // ê³µí†µ CSS ê²½ë¡œë¡??˜ì •

// ?¬ìš©????•  ?•ë³´ ?€??
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

// ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ ?€??
interface ProgramGroupData {
	pgmGrpId: string;
	pgmGrpNm: string;
	pgmGrpUseYn: string;
	cnt: number;
	[key: string]: any;
}

// ë©”ë‰´ ?•ë³´ ?€??
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
} from "../../modules/sys/services"; // ?œë¹„??import
import { usrApiService } from "../../modules/usr/services/usr-api.service"; // ê³µí†µì½”ë“œ API ?œë¹„??
import { useToast } from "@/contexts/ToastContext";
import { usePopup } from "@/modules/com/hooks/usePopup";

/**
 * SYS1003M00 - ?¬ìš©?ì—­??ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©????•  ?±ë¡/?˜ì •/?? œ
 * - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê¶Œí•œ ê´€ë¦?
 * - ??•  ë³µì‚¬ ê¸°ëŠ¥
 * - ë©”ë‰´ë³?ê¶Œí•œ ?¤ì •
 *
 * ?°ê? ?Œì´ë¸?
 * - TBL_USER_ROLE (?¬ìš©????• )
 * - TBL_USER_ROLE_PGM_GRP (?¬ìš©????•  ?„ë¡œê·¸ë¨ ê·¸ë£¹)
 * - TBL_MENU_INF (ë©”ë‰´ ?•ë³´)
 * - TBL_PGM_GRP (?„ë¡œê·¸ë¨ ê·¸ë£¹)
 */

// ê³µí†µì½”ë“œ ?€???•ì˜
interface CodeData {
	data: string;
	label: string;
}

// API ?‘ë‹µ??CodeDataë¡?ë§¤í•‘?˜ëŠ” ? í‹¸ë¦¬í‹° ?¨ìˆ˜
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

// ë°±ì—”?œì—??camelCaseë¡?ë³€?˜ëœ ?°ì´??êµ¬ì¡°??ë§ëŠ” ?€???•ì˜
type PgmGrpRow = ProgramGroupData;

export default function RoleManagementPage() {
	const { showToast, showConfirm } = useToast();

	// ?¬ìš©????•  ëª©ë¡ ?íƒœ ê´€ë¦?(ASIS: grdUserRole.dataProvider)
	// useState<ProgramGroupData[]> ?±ì—???€??ì¶©ëŒ??ë°œìƒ?˜ì? ?Šë„ë¡? ?ë‹¨??ì§ì ‘ ?•ì˜???€?…ë§Œ ?¬ìš©?˜ë„ë¡?ëª…ì‹œ?ìœ¼ë¡??€??? ì–¸
	const [rowData, setRowData] = useState<TblUserRole[]>([]);
	// ? íƒ???¬ìš©????•  ?íƒœ ê´€ë¦?(ASIS: grdUserRole.selectedItem)
	const [selectedRole, setSelectedRole] = useState<TblUserRole | null>(null);
	// ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ?íƒœ ê´€ë¦?(ASIS: grdPgmGrp.dataProvider)
	const [pgmGrpRowData, setPgmGrpRowData] = useState<ProgramGroupData[]>([]);
	// ë©”ë‰´ ëª©ë¡ ?íƒœ ê´€ë¦?(ASIS: cboMenu.dataProvider)
	const [menuList, setMenuList] = useState<TblMenuInf[]>([]);

	// ?ì—… ê´€ë¦???(ASIS: PopUpManager?€ ?™ì¼????• )
	const { openPopup } = usePopup();

	// ? ê·œ ëª¨ë“œ ?íƒœ ê´€ë¦?(ASIS: isNewMode ë³€?˜ì? ?™ì¼)
	const [isNewMode, setIsNewMode] = useState(false);
	// ??• ë³µì‚¬ ë²„íŠ¼ ?œì„±???íƒœ ê´€ë¦?(ASIS: btnCopy.enabled)
	const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(false);

	// ì¡°íšŒ ì¡°ê±´ ?íƒœ ê´€ë¦?(ASIS: txtUsrRoleId.text, cboUseYn.selectedItem)
	const [searchConditions, setSearchConditions] = useState({
		usrRoleId: "", // ?¬ìš©?ì—­? ì½”??ëª?ê²€?‰ì–´
		useYn: "", // ?¬ìš©?¬ë? ?„í„°
	});

	// ê³µí†µì½”ë“œ API ?¸ì¶œ (ASIS: COM_03_0101_S ?„ë¡œ?œì?ë¡?ì¡°íšŒ)
	const { data: useYnApiData } = useQuery({
		queryKey: ["useYnCodes"],
		queryFn: () => usrApiService.getCodes("300"), // ?¬ìš©?¬ë? ì½”ë“œ (?€ë¶„ë¥˜: 300)
	});

	const { data: athrGrdApiData } = useQuery({
		queryKey: ["athrGrdCodes"],
		queryFn: () => usrApiService.getCodes("301"), // ê¶Œí•œ?±ê¸‰ ì½”ë“œ (?€ë¶„ë¥˜: 301)
	});

	const { data: orgInqRngApiData } = useQuery({
		queryKey: ["orgInqRngCodes"],
		queryFn: () => usrApiService.getCodes("302"), // ì¡°ì§ì¡°íšŒë²”ìœ„ ì½”ë“œ (?€ë¶„ë¥˜: 302)
	});

	// API ?‘ë‹µ??CodeDataë¡?ë§¤í•‘
	const useYnData = useYnApiData ? mapCodeApiToCodeData(useYnApiData) : [];
	const athrGrdData = athrGrdApiData
		? mapCodeApiToCodeData(athrGrdApiData)
		: [];
	const orgInqRngData = orgInqRngApiData
		? mapCodeApiToCodeData(orgInqRngApiData)
		: [];

	/**
	 * ì¡°íšŒ ì¡°ê±´ ë³€ê²??¸ë“¤??
	 * ASIS: txtUsrRoleId_change(), cboUseYn_change() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ê²€??ì¡°ê±´ ?…ë ¥ ???íƒœë¥??…ë°?´íŠ¸
	 * @param e ?…ë ¥ ?´ë²¤??
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
	 * ?”í„°???…ë ¥ ???ë™ì¡°íšŒ ?¸ë“¤??
	 * ASIS: ?¤ë³´???´ë²¤??ì²˜ë¦¬?€ ?™ì¼
	 * Enter ???…ë ¥ ???ë™?¼ë¡œ ì¡°íšŒ ?¤í–‰
	 * @param e ?¤ë³´???´ë²¤??
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
		// ?¬ìš©?ì—­? ì½”??(ì½”ë“œ/ID) - ê°€?´ë° ?•ë ¬
		{
			headerName: "?¬ìš©?ì—­? ì½”??,
			field: "usrRoleId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?¬ìš©?ì—­? ëª… (?ìŠ¤???´ë¦„) - ?¼ìª½ ?•ë ¬
		{
			headerName: "?¬ìš©?ì—­? ëª…",
			field: "usrRoleNm",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// ë©”ë‰´ (?ìŠ¤???´ë¦„) - ?¼ìª½ ?•ë ¬
		{
			headerName: "ë©”ë‰´",
			field: "menuNm",
			width: 120,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// ?¬ìš©?¬ë? (ì²´í¬ë°•ìŠ¤/?„ì´ì½? - ê°€?´ë° ?•ë ¬
		{
			headerName: "?¬ìš©?¬ë?",
			field: "useYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?¬ìš©?ìˆ˜ (?«ì?? - ?¤ë¥¸ìª??•ë ¬
		{
			headerName: "?¬ìš©?ìˆ˜",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	const [pgmGrpColDefs] = useState<ColDef[]>([
		// ì²´í¬ë°•ìŠ¤ ì»¬ëŸ¼ - ê°€?´ë° ?•ë ¬
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
		// ?„ë¡œê·¸ë¨ê·¸ë£¹ ì½”ë“œ (ì½”ë“œ/ID) - ê°€?´ë° ?•ë ¬
		{
			headerName: "?„ë¡œê·¸ë¨ê·¸ë£¹ ì½”ë“œ",
			field: "pgmGrpId",
			width: 150,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?„ë¡œê·¸ë¨ê·¸ë£¹ëª?(?ìŠ¤???´ë¦„) - ?¼ìª½ ?•ë ¬
		{
			headerName: "?„ë¡œê·¸ë¨ê·¸ë£¹ëª?,
			field: "pgmGrpNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		// ?¬ìš©?¬ë? (ì²´í¬ë°•ìŠ¤/?„ì´ì½? - ê°€?´ë° ?•ë ¬
		{
			headerName: "?¬ìš©?¬ë?",
			field: "pgmGrpUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		// ?¬ìš©?ìˆ˜ (?«ì?? - ?¤ë¥¸ìª??•ë ¬
		{
			headerName: "?¬ìš©?ìˆ˜",
			field: "cnt",
			width: 100,
			flex: 0,
			type: "numericColumn",
			cellStyle: { textAlign: "right" },
			headerClass: "ag-center-header",
		},
	]);

	/**
	 * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?¨ìˆ˜
	 * ASIS: fn_srch() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ê²€??ì¡°ê±´???°ë¼ ?¬ìš©????•  ëª©ë¡??ì¡°íšŒ?˜ê³  ?”ë©´???œì‹œ
	 * ê¸°ì¡´ ?œìŠ¤?œê³¼ ?™ì¼?˜ê²Œ ì¡°íšŒ ?œì—???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡???¨ê»˜ ì¡°íšŒ
	 */
	const loadData = async () => {
		try {
			// ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ (ASIS: USR_02_0101_S ?„ë¡œ?œì? ?¸ì¶œ)
			const data = await fetchUserRoles(searchConditions);
			setRowData((data as any[]).map((item) => ({ ...item })));

			// ê¸°ì¡´ ?œìŠ¤?œê³¼ ?™ì¼?˜ê²Œ ì¡°íšŒ ?œì—???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ
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
				message: "?°ì´?°ë? ë¶ˆëŸ¬?¤ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.",
				type: "error",
				onConfirm: () => {},
				confirmOnly: true,
			});
		}
	};

	useEffect(() => {
		loadData();
		// ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
		const loadMenus = async () => {
			try {
				const menus = await fetchMenus();
				setMenuList(menus);
			} catch (error) {
				console.error(error);
				showConfirm({
					message: "ë©”ë‰´ ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.",
					type: "error",
					onConfirm: () => {},
					confirmOnly: true,
				});
			}
		};
		loadMenus();
	}, []);

	// postMessage ?´ë²¤??ë¦¬ìŠ¤??ì¶”ê?
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
				message: "?€?¥í•  ??• ??? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// ? íš¨??ê²€??
		if (!selectedRole.usrRoleNm || selectedRole.usrRoleNm.trim() === "") {
			showConfirm({
				message: "?¬ìš©?ì—­? ëª…???…ë ¥?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {
					// ?¬ìš©?ì—­? ëª… ?…ë ¥ ?„ë“œ???¬ì»¤??
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
				message: "?¬ìš©?¬ë?ë¥?? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {
					// ?¬ìš©?¬ë? ? íƒ ?„ë“œ???¬ì»¤??
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
				message: "ë©”ë‰´ë¥?? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {
					// ë©”ë‰´ ? íƒ ?„ë“œ???¬ì»¤??
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
				message: "?±ê¸‰??? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {
					// ?±ê¸‰ ? íƒ ?„ë“œ???¬ì»¤??
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
				message: "ì¡°ì§ì¡°íšŒë²”ìœ„ë¥?? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {
					// ì¡°ì§ì¡°íšŒë²”ìœ„ ? íƒ ?„ë“œ???¬ì»¤??
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

		// ?€???•ì¸ ë©”ì‹œì§€
		showConfirm({
			message: "?€?¥í•˜?œê² ?µë‹ˆê¹?",
			type: "info",
			onConfirm: async () => {
				// ?€??ë¡œì§???¬ê¸°ë¡??´ë™
				if (!selectedRole) return;

				try {
					// 1. ??•  ?ì„¸ ?•ë³´ ?€??
					// usrRoleIdê°€ ë¹?ë¬¸ì?´ì´ë©?? ê·œ ?€?? ?„ë‹ˆë©??˜ì •
					const isNewRole =
						!selectedRole.usrRoleId || selectedRole.usrRoleId.trim() === "";

					const saveResult = await saveUserRoles({
						createdRows: isNewRole ? [selectedRole] : [],
						updatedRows: isNewRole ? [] : [selectedRole],
						deletedRows: [],
					});

					// 2. ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ ?€??
					if (pgmGrpGridRef.current?.api) {
						const selectedPgmGrps = pgmGrpGridRef.current.api
							.getSelectedRows()
							.map((row) => ({
								usrRoleId: selectedRole.usrRoleId || "", // ? ê·œ ?œì—??ë¹?ë¬¸ì??
								pgmGrpId: row.pgmGrpId,
								useYn: row.useYn || "Y", // ê¸°ë³¸ê°??¤ì •
							}));

						// ? ê·œ ?€???œì—???€????ë°˜í™˜????•  IDë¥??¬ìš©
						const roleIdToUse =
							isNewRole && saveResult.savedRoles.length > 0
								? saveResult.savedRoles[0].usrRoleId
								: selectedRole.usrRoleId;

						// ? íƒ???„ë¡œê·¸ë¨ ê·¸ë£¹???ˆëŠ” ê²½ìš°?ë§Œ ?€??
						if (selectedPgmGrps.length > 0) {
							await saveProgramGroups(roleIdToUse, selectedPgmGrps);
						}
					}

					showToast("?±ê³µ?ìœ¼ë¡??€?¥ë˜?ˆìŠµ?ˆë‹¤.", "info");

					// ?€????ë²„íŠ¼ ?íƒœ ?…ë°?´íŠ¸
					setIsNewMode(false);
					setIsCopyButtonEnabled(false);

					// ê¸°ì¡´ ?œìŠ¤?œê³¼ ?™ì¼?˜ê²Œ ?„ì²´ ?”ë©´ ì´ˆê¸°??(?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡???¬ì¡°??
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

	// ?„ì²´ ?”ë©´ ì´ˆê¸°???¨ìˆ˜ (ê¸°ì¡´ ?œìŠ¤?œì˜ fn_initê³??™ì¼)
	const handleInitialize = () => {
		// ì¢Œì¸¡ ê·¸ë¦¬??? íƒ ?´ì œ
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ?°ì¸¡ ?ì—­ ?„ì „ ì´ˆê¸°??
		setSelectedRole(null);
		setPgmGrpRowData([]);

		// ë²„íŠ¼ ?íƒœ ì´ˆê¸°??
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// ?°ì´???¬ì¡°??
		loadData();
	};

	// ?€????ì´ˆê¸°???¨ìˆ˜ (ê¸°ì¡´ ?œìŠ¤?œì˜ fn_srch?€ ?™ì¼)
	const handleSaveInitialize = async () => {
		// ì¢Œì¸¡ ê·¸ë¦¬??? íƒ ?´ì œ
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ?°ì¸¡ ?ì—­ ?„ì „ ì´ˆê¸°??
		setSelectedRole(null);

		// ë²„íŠ¼ ?íƒœ ì´ˆê¸°??
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// ê¸°ì¡´ ?œìŠ¤?œê³¼ ?™ì¼?˜ê²Œ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡???¬ì¡°??
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			setPgmGrpRowData([]);
		}

		// ?°ì´???¬ì¡°??
		loadData();
	};

	const handleNew = async () => {
		// ì¢Œì¸¡ ê·¸ë¦¬??? íƒ ?´ì œ
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// ? ê·œ ë²„íŠ¼ ?´ë¦­ ??ë¹?ê°’ìœ¼ë¡?ì´ˆê¸°??(?¬ìš©?ê? ì§ì ‘ ? íƒ?˜ë„ë¡?
		const newRole: TblUserRole = {
			usrRoleId: "",
			usrRoleNm: "",
			useYn: "", // ë¹?ê°’ìœ¼ë¡?ì´ˆê¸°??
			athrGrdCd: "",
			orgInqRngCd: "",
			menuId: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // ? ê·œ ëª¨ë“œ?ì„œ ì¶”ê????„ë“œ
		};

		// ëª¨ë“  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ (ì²´í¬ë°•ìŠ¤ë¡?? íƒ ê°€?¥í•œ ?íƒœ)
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps as ProgramGroupData[]);
		} catch (error) {
			console.error(error);
			showToast(
				"?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.",
				"error"
			);
		}

		// ?íƒœë¥?ë§ˆì?ë§‰ì— ?…ë°?´íŠ¸ (?¤ë¥¸ ?¨ìˆ˜ ?¸ì¶œ ??
		setSelectedRole(newRole);
		setIsNewMode(true); // ? ê·œ ëª¨ë“œë¡??¤ì •
		setIsCopyButtonEnabled(false); // ? ê·œ ëª¨ë“œ?ì„œ????• ë³µì‚¬ ë²„íŠ¼ ë¹„í™œ?±í™”
	};

	// ??•  ? íƒ ???„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
	const onSelectionChanged = async (event: SelectionChangedEvent) => {
		const selectedRows = event.api.getSelectedRows();
		if (selectedRows.length > 0) {
			const role = selectedRows[0];

			// ë°±ì—”???¤ëª…???„ë¡ ?¸ì—”???¤ëª…?¼ë¡œ ë§¤í•‘
			const roleWithDefaults = {
				...role,
				// ë°±ì—”?? athtGrdCd -> ?„ë¡ ?¸ì—”?? athrGrdCd
				athrGrdCd: role.athtGrdCd || role.athrGrdCd || "1",
				// ë°±ì—”?? orgInqRangCd -> ?„ë¡ ?¸ì—”?? orgInqRngCd
				orgInqRngCd: role.orgInqRangCd || role.orgInqRngCd || "ALL",
				useYn: role.useYn || "Y",
				menuId: role.menuId || "",
				usrRoleNm: role.usrRoleNm || "",
				baseOutputScrnPgmIdCtt: role.baseOutputScrnPgmIdCtt || "",
				baseOutputScrnPgmNmCtt: role.baseOutputScrnPgmNmCtt || "", // ê¸°ì¡´ ??•  ? íƒ ??ì¶”ê????„ë“œ
			};

			setSelectedRole(roleWithDefaults);
			setIsNewMode(false); // ê¸°ì¡´ ??•  ? íƒ ??? ê·œ ëª¨ë“œ ?´ì œ
			setIsCopyButtonEnabled(true); // ê¸°ì¡´ ??•  ? íƒ ????• ë³µì‚¬ ë²„íŠ¼ ?œì„±??

			try {
				const pgmGrps = await fetchProgramGroups(role.usrRoleId);
				setPgmGrpRowData((pgmGrps as any[]).map((item) => ({ ...item }))); // ë³€???†ì´ ê·¸ë?ë¡?? ë‹¹
			} catch (error) {
				console.error(error);
				showConfirm({
					message: "?„ë¡œê·¸ë¨ ê·¸ë£¹??ë¶ˆëŸ¬?¤ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.",
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

	// ?ì„¸ ???…ë ¥ ë³€ê²??¸ë“¤??
	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		// selectedRole??null?´ë©´ ë¹?ê°ì²´ë¡?ì´ˆê¸°??(ê¸°ë³¸ê°??¤ì •?˜ì? ?ŠìŒ)
		const currentRole = selectedRole || {
			usrRoleId: "",
			menuId: "",
			usrRoleNm: "",
			athrGrdCd: "",
			orgInqRngCd: "",
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // ì¶”ê????„ë“œ
			useYn: "",
		};

		setSelectedRole({
			...currentRole,
			[e.target.name]: e.target.value,
		});
	};

	// ê¸°ë³¸ì¶œë ¥?”ë©´ ?„ë“œ ì´ˆê¸°???¸ë“¤??
	const handleClearBaseOutput = () => {
		if (!selectedRole) return;
		setSelectedRole({
			...selectedRole,
			baseOutputScrnPgmIdCtt: "",
			baseOutputScrnPgmNmCtt: "", // ì¶”ê????„ë“œ
			// baseOutputScrnPgmNmCtt ?„ë“œê°€ ?ˆë‹¤ë©?ê°™ì´ ì´ˆê¸°?”í•´???©ë‹ˆ??
			// ?„ì¬ ?€???•ì˜???†ì–´ ?°ì„  ID ?„ë“œë§?ì´ˆê¸°?”í•©?ˆë‹¤.
		});
	};

	// ?„ë¡œê·¸ë¨ ê²€???¸ë“¤??
	const handleProgramSearch = (rowData: any, rowIndex: number) => {
		console.log("?„ë¡œê·¸ë¨ ê²€???´ë¦­:", rowData, rowIndex);
		// ?„ë¡œê·¸ë¨ ê²€???ì—… ?´ê¸° (ê·¸ë¦¬???ˆìª½: ?´ë¦­??ë¡œìš°???œë²ˆ??PGM_IDë¡??„ë‹¬)
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

	// ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?? œ ?¸ë“¤??
	const handleDeletePgmGrp = () => {
		if (!pgmGrpGridRef.current) return;
		const selectedNodes = pgmGrpGridRef.current.api.getSelectedNodes();
		if (selectedNodes.length === 0) {
			showConfirm({
				message: "?? œ???„ë¡œê·¸ë¨ ê·¸ë£¹??? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		const selectedIds = selectedNodes
			.map((node) => node.data?.pgmGrpId)
			.filter(Boolean); // undefined??null??ê²½ìš° ?œê±°
		setPgmGrpRowData((prevData) =>
			prevData.filter((row) => !selectedIds.includes(row.pgmGrpId))
		);
	};

	// ??•  ë³µì‚¬ ?¸ë“¤??
	const handleCopyRole = async () => {
		if (!selectedRole) {
			showConfirm({
				message: "ë³µì‚¬????• ??? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		showConfirm({
			message: `'${selectedRole.usrRoleNm}' ??• ??ë³µì‚¬?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
			type: "info",
			onConfirm: async () => {
				try {
					await copyUserRole(selectedRole.usrRoleId);
					showToast("??• ??ë³µì‚¬?˜ì—ˆ?µë‹ˆ??", "info");
					loadData(); // ëª©ë¡ ?ˆë¡œê³ ì¹¨
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
			{/* ?” ì¡°íšŒ ?ì—­ */}
			<div className='search-div mb-4'>
				<table className='search-table w-full'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>?¬ìš©?ì—­? ì½”??ëª?/th>
							<td className='search-td w-[20%]'>
								<input
									type='text'
									name='usrRoleId'
									value={searchConditions.usrRoleId}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='input-base input-default w-full'
									aria-label='?¬ìš©?ì—­? ì½”??ëª??…ë ¥'
									placeholder='ì½”ë“œ ?ëŠ” ëª??…ë ¥'
								/>
							</td>
							<th className='search-th w-[100px]'>?¬ìš©?¬ë?</th>
							<td className='search-td w-[10%]'>
								<select
									name='useYn'
									value={searchConditions.useYn}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='combo-base w-full min-w-[80px]'
									aria-label='?¬ìš©?¬ë? ? íƒ'
								>
									<option value=''>?„ì²´</option>
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
									ì¡°íšŒ
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* ?“‹ ì¢Œìš° 2??*/}
			<div className='flex gap-4 flex-1 overflow-auto'>
				{/* ?€ ì¢Œì¸¡ */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>?¬ìš©?ì—­??ëª©ë¡</h3>
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

				{/* ???°ì¸¡ ?ì„¸ ??*/}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>?¬ìš©?ì—­???•ë³´</h3>
					</div>
					<table className='form-table mb-2'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th required w-[120px]'>?¬ìš©?ì—­? ëª…</th>
								<td className='form-td'>
									<input
										type='text'
										name='usrRoleNm'
										id='usrRoleNm'
										value={selectedRole?.usrRoleNm || ""}
										onChange={handleFormChange}
										className='input-base input-default w-full'
										aria-label='?ì„¸ ?¬ìš©?ì—­? ëª…'
										maxLength={33}
										placeholder='ìµœë? 33ê¸€??(?œê? ê¸°ì?)'
									/>
								</td>
								<th className='form-th required w-[100px]'>?¬ìš©?¬ë?</th>
								<td className='form-td'>
									<select
										name='useYn'
										id='useYn'
										value={selectedRole ? selectedRole.useYn : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?ì„¸ ?¬ìš©?¬ë?'
									>
										<option value=''>? íƒ</option>
										{useYnData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th w-[80px]'>?±ê¸‰</th>
								<td className='form-td'>
									<select
										name='athrGrdCd'
										id='athrGrdCd'
										value={selectedRole ? selectedRole.athrGrdCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?ì„¸ ?±ê¸‰'
									>
										<option value=''>? íƒ</option>
										{athrGrdData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th required'>ì¡°ì§ì¡°íšŒë²”ìœ„</th>
								<td className='form-td'>
									<select
										name='orgInqRngCd'
										id='orgInqRngCd'
										value={selectedRole ? selectedRole.orgInqRngCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?ì„¸ ì¡°ì§ì¡°íšŒë²”ìœ„'
									>
										<option value=''>? íƒ</option>
										{orgInqRngData?.map((item) => (
											<option key={item.data} value={item.data}>
												{item.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th required'>ë©”ë‰´</th>
								<td className='form-td' colSpan={3}>
									<select
										name='menuId'
										id='menuId'
										value={selectedRole ? selectedRole.menuId : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='?ì„¸ ë©”ë‰´'
									>
										<option value=''>? íƒ</option>
										{menuList.map((menu) => (
											<option key={menu.menuId} value={menu.menuId}>
												{menu.menuNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>ê¸°ë³¸ì¶œë ¥?”ë©´</th>
								<td className='form-td' colSpan={4}>
									{/* ?„ë¡œê·¸ë¨ID??hidden, ?„ë¡œê·¸ë¨ëª…ì? ?œì‹œ */}
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
										aria-label='?ì„¸ ê¸°ë³¸ì¶œë ¥?”ë©´'
									/>
								</td>
								<td className='form-td'>
									<div className='flex gap-1'>
										<button
											type='button'
											className='btn-base btn-etc text-xs px-3 py-1'
											onClick={() => handleProgramSearch(null, 0)}
										>
											+ ì¶”ê?
										</button>
										<button
											type='button'
											className='text-xl text-gray-400 px-2'
											onClick={handleClearBaseOutput}
										>
											Ã—
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* ??ë²„íŠ¼ ?ì—­ - ?ë³¸???†ìœ¼ë¯€ë¡??œê±° */}
					{/*
					<div className='flex justify-between items-center mb-2 px-1'>
						<div></div>
						<div className='flex gap-1'>
							<button
								type='button'
								className='btn-base btn-etc text-xs px-3 py-1'
							>
								+ ì¶”ê?
							</button>
							<button
								type='button'
								className='text-xl text-gray-400 px-2'
								onClick={handleDeletePgmGrp}
							>
								Ã—
							</button>
						</div>
					</div>
					*/}

					{/* ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ */}
					<div className='tit_area mb-2'>
						<h3>?¬ìš©?ì—­???„ë¡œê·¸ë¨ê·¸ë£¹ ëª©ë¡</h3>
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
							suppressRowClickSelection={true} // ???´ë¦­?¼ë¡œ ? íƒ?˜ëŠ” ê²?ë°©ì?
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

			{/* â¬??˜ë‹¨ ë²„íŠ¼ */}
			<div className='flex justify-end gap-2 mt-4'>
				<button
					type='button'
					className='btn-base btn-etc'
					onClick={handleCopyRole}
					disabled={!isCopyButtonEnabled}
				>
					??• ë³µì‚¬
				</button>
				<button type='button' className='btn-base btn-etc' onClick={handleNew}>
					? ê·œ
				</button>
				<button
					type='button'
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={!isNewMode && !selectedRole}
				>
					?€??
				</button>
			</div>

			{/* ?„ë¡œê·¸ë¨ ì°¾ê¸° ?ì—… */}
			{/* ?œê±° (ì¡°ê±´ë¶€ ?Œë”ë§?ë°??ì—… JSX ?? œ) */}
		</div>
	);
}


