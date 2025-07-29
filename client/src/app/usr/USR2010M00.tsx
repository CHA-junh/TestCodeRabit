/**
 * USR2010M00 - ?¬ìš©??ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©??ëª©ë¡ ì¡°íšŒ ë°?ê²€??(ë³¸ë?/ë¶€???¬ìš©?ëª… ì¡°ê±´)
 * - ?¬ìš©???•ë³´ ? ê·œ ?±ë¡ ë°??˜ì •
 * - ?¬ìš©???…ë¬´ê¶Œí•œ ê´€ë¦?(?¼ë””??ë²„íŠ¼?¼ë¡œ ê¶Œí•œ ë¶€???´ì œ)
 * - ?¬ìš©????•  ? ë‹¹ (ì½¤ë³´ë°•ìŠ¤)
 * - ?¹ì¸ê²°ì¬??ê²€??ë°?? íƒ
 * - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 *
 * API ?°ë™:
 * - GET /api/usr/list - ?¬ìš©??ëª©ë¡ ì¡°íšŒ
 * - GET /api/usr/work-auth/:userId - ?¬ìš©???…ë¬´ê¶Œí•œ ì¡°íšŒ
 * - POST /api/usr/save - ?¬ìš©???•ë³´ ?€??
 * - POST /api/usr/password-init - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - GET /api/usr/approver-search - ?¹ì¸ê²°ì¬??ê²€??
 * - GET /api/usr/roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 * - GET /api/common/search - ê³µí†µ ì½”ë“œ ì¡°íšŒ (ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±… ??
 * - GET /api/common/dept-div-codes - ë¶€?œêµ¬ë¶„ì½”??ì¡°íšŒ
 *
 * ?íƒœ ê´€ë¦?
 * - ?¬ìš©??ëª©ë¡ ë°?? íƒ???¬ìš©??
 * - ???°ì´??(? ê·œ/?˜ì •??
 * - ?…ë¬´ê¶Œí•œ ëª©ë¡ ë°?? íƒ ?íƒœ
 * - ì½¤ë³´ë°•ìŠ¤ ?°ì´??(ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±…, ??•  ??
 * - ë¡œë”© ?íƒœ ë°??ëŸ¬ ì²˜ë¦¬
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ê²€??ì¡°ê±´ ?…ë ¥ (ë³¸ë?, ë¶€?? ?¬ìš©?ëª…)
 * - ?¬ìš©??ëª©ë¡ ?Œì´ë¸?(? íƒ ê°€??
 * - ?¬ìš©???•ë³´ ?…ë ¥ ??(? ê·œ/?˜ì •)
 * - ?…ë¬´ê¶Œí•œ ê´€ë¦?ê·¸ë¦¬??(?¼ë””??ë²„íŠ¼)
 * - ?¹ì¸ê²°ì¬??ê²€???ì—…
 * - ?€??ì´ˆê¸°??ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦?(??•  ?•ë³´ ?°ë™)
 */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { usePopup } from "../../modules/com/hooks/usePopup";
import { usrApiService } from "../../modules/usr/services/usr-api.service";
import {
	UserData,
	WorkAuthData,
	CodeData,
	UserSaveData,
} from "../../modules/usr/services/usr-api.service";
import "../common/common.css";
import COMZ100P00, { EmpSearchModalRef } from "@/app/com/COMZ100P00";
import { useAuth } from "../../modules/auth/hooks/useAuth";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

/**
 * USR2010M00 - ?¬ìš©??ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©??ì¡°íšŒ ë°??±ë¡/?˜ì •
 * - ë³¸ë?/ë¶€?œë³„ ?¬ìš©???„í„°ë§?
 * - ?¬ìš©??ê¶Œí•œ ë°?ì§ì±… ê´€ë¦?
 * - ?…ë¬´ë³??¬ìš©ê¶Œí•œ ?¤ì •
 * - ?¹ì¸ê²°ì¬??ì§€??
 * - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 *
 * ?°ê? ?Œì´ë¸?
 * - ?¬ìš©???•ë³´ (?¬ë²ˆ, ?±ëª…, ë³¸ë?, ë¶€?? ì§ê¸‰, ì§ì±… ??
 * - ?¬ìš©??ê¶Œí•œ (?¬ìš©?ê¶Œ?? ?¬ìš©?ì—­??
 * - ?…ë¬´ë³??¬ìš©ê¶Œí•œ (?¬ì—…ê´€ë¦? ?„ë¡œ?íŠ¸ê´€ë¦? ?…ë¬´ì¶”ì§„ë¹„ê?ë¦? ?¸ì‚¬ê´€ë¦? ?œìŠ¤?œê?ë¦?
 * - ?¹ì¸ê²°ì¬???•ë³´
 *
 * ?°ê? ?„ë¡œ?œì?:
 * - USR_01_0201_S: ?¬ìš©??ëª©ë¡ ì¡°íšŒ (ë³¸ë?/ë¶€???¬ìš©?ëª… ì¡°ê±´)
 * - USR_01_0202_S: ?…ë¬´ë³??¬ìš©ê¶Œí•œ ëª©ë¡ ì¡°íšŒ (?¬ìš©?ID ê¸°ì?)
 * - USR_01_0203_T: ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
 * - USR_01_0104_T: ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - COM_03_0101_S: ê³µí†µì½”ë“œ ì¡°íšŒ (ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±…êµ¬ë¶„, ?…ë¬´ê¶Œí•œ ??
 * - COM_03_0201_S: ë¶€?œì½”??ì¡°íšŒ (ë³¸ë?ë³?ë¶€??ëª©ë¡)
 */

const initialSearch = { hqDiv: "ALL", deptDiv: "ALL", userNm: "" };

const initialFormData = {
	empNo: "",
	empNm: "",
	authCd: "",
	dutyDivCd: "",
	apvApofId: "",
	apvApofNm: "",
	usrRoleId: "",
};

// API ?‘ë‹µ??CodeDataë¡?ë§¤í•‘
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

const USR2010M00: React.FC = () => {
	const { showToast, showConfirm } = useToast();
	const { openPopup } = usePopup(); // ?ì—… ?¤í”ˆ ?¨ìˆ˜ ? ì–¸ ë³µêµ¬
	const { user } = useAuth();

	// ê²€??ì¡°ê±´ ?íƒœ ê´€ë¦?(ASIS: txtHqDiv.text, txtDeptDiv.text, txtUserNm.text)
	const [searchParams, setSearchParams] = useState(initialSearch);
	// ? íƒ???¬ìš©???íƒœ ê´€ë¦?(ASIS: grdUser.selectedItem)
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	// ?¸ì§‘ ì¤‘ì¸ ?¬ìš©???•ë³´ ?íƒœ ê´€ë¦?(ASIS: ???„ë“œ?¤ì˜ ê°’ë“¤)
	const [editedUser, setEditedUser] = useState<Partial<UserSaveData>>({});

	// ?…ë¬´ê¶Œí•œ ëª©ë¡ ?íƒœ ê´€ë¦?(ASIS: grdWorkAuth.dataProvider)
	const [workAuthList, setWorkAuthList] = useState<WorkAuthData[]>([]);
	// ?…ë¬´ê¶Œí•œ ë¡œë”© ?íƒœ ê´€ë¦?(ASIS: showBusyCursor="true")
	const [workAuthLoading, setWorkAuthLoading] = useState(false);
	// ?…ë¬´ê¶Œí•œ ?ëŸ¬ ?íƒœ ê´€ë¦?(ASIS: Alert.show() ë©”ì‹œì§€)
	const [workAuthError, setWorkAuthError] = useState<string | null>(null);
	// ? íƒ???…ë¬´ê¶Œí•œ ì½”ë“œ ?íƒœ ê´€ë¦?(ASIS: cboWorkAuth.selectedItem)
	const [selectedWorkAuthCode, setSelectedWorkAuthCode] = useState<string>("");
	// ?…ë¬´ê¶Œí•œ ?¡ì…˜ ?íƒœ ê´€ë¦?(ASIS: rdoGrant.selected, rdoRevoke.selected)
	const [workAuthAction, setWorkAuthAction] = useState<"1" | "0">("1");
	// ???°ì´???íƒœ ê´€ë¦?(ASIS: ???„ë“œ?¤ì˜ ì´ˆê¸°ê°?
	const [formData, setFormData] = useState(initialFormData);

	// 1. ?¹ì¸ê²°ì¬???„ë³´ ëª©ë¡ ?íƒœ ê´€ë¦?(ë©”ì¸ userData?€ ë¶„ë¦¬)
	const [approverList, setApproverList] = useState<UserData[]>([]);

	// 2. ?¹ì¸ê²°ì¬??ê²€???¨ìˆ˜ (ë©”ì¸ userDataë¥?ê±´ë“œë¦¬ì? ?ŠìŒ)
	const handleApproverSearch = async (searchName: string) => {
		const result = await usrApiService.getUserList({
			hqDiv: "ALL",
			deptDiv: "ALL",
			userNm: searchName,
		});
		setApproverList(result);
	};

	// 3. ?ì—… ?¤í”ˆ ??approverListë¥??„ë‹¬
	const openApproverPopup = () => {
		openPopup({
			url: "/popup/com/COMZ100P00",
			size: "medium",
			position: "center",
			waitForReady: true,
			readyResponseData: {
				type: "CHOICE_EMP_INIT",
				data: {
					empNm: editedUser.apvApofNm || "",
					empList: approverList,
				},
			},
			onOpen: (popup) => {
				console.log("?“± USR2010M00 - ?ì—… ?´ë¦¼");
			},
		});
	};

	const [hqCodeList, setHqCodeList] = useState<CodeData[]>([]);
	const [deptCodeList, setDeptCodeList] = useState<CodeData[]>([]);
	const [authCodeList, setAuthCodeList] = useState<CodeData[]>([]);
	const [dutyDivCodeList, setDutyDivCodeList] = useState<CodeData[]>([]);
	const [workAuthCodeList, setWorkAuthCodeList] = useState<CodeData[]>([]);
	const [userRoleList, setUserRoleList] = useState<
		{ usrRoleId: string; usrRoleNm: string }[]
	>([]);

	const {
		data: userData,
		refetch: refetchUserList,
		isLoading,
		error,
	} = useQuery<UserData[]>({
		queryKey: ["userList", searchParams],
		queryFn: () => usrApiService.getUserList(searchParams),
	});

	const { data: hqData } = useQuery<CodeData[]>({
		queryKey: ["hqCodes"],
		queryFn: () => usrApiService.getHqDivCodes(),
	});
	const { data: deptData } = useQuery<CodeData[]>({
		queryKey: ["deptCodes"],
		queryFn: () => Promise.resolve([{ data: "ALL", label: "?„ì²´" }]),
	});
	const { data: authData } = useQuery<CodeData[]>({
		queryKey: ["authCodes"],
		queryFn: () => usrApiService.getAuthCodes(),
	});
	const { data: dutyDivData } = useQuery<CodeData[]>({
		queryKey: ["dutyDivCodes"],
		queryFn: () => usrApiService.getDutyDivCodes(),
	});
	const { data: workAuthData } = useQuery<CodeData[]>({
		queryKey: ["workAuthCodes"],
		queryFn: () => usrApiService.getCodes("991"),
	});
	const { data: rolesData } = useQuery({
		queryKey: ["userRoles"],
		queryFn: () => usrApiService.getUserRoles(),
	});

	useEffect(() => {
		if (hqData) setHqCodeList(mapCodeApiToCodeData(hqData));
		if (deptData) setDeptCodeList(deptData); // ?´ë? ?¬ë°”ë¥??•íƒœ?´ë?ë¡?ë³€?˜í•˜ì§€ ?ŠìŒ
		if (authData) setAuthCodeList(mapCodeApiToCodeData(authData));
		if (dutyDivData) setDutyDivCodeList(mapCodeApiToCodeData(dutyDivData));
		if (workAuthData) setWorkAuthCodeList(mapCodeApiToCodeData(workAuthData));
		if (rolesData) setUserRoleList(rolesData);
	}, [hqData, deptData, authData, dutyDivData, workAuthData, rolesData]);

	// useEffect([userData])?ì„œ selectedUserë¥?ë¬´ì¡°ê±?nullë¡?ë§Œë“œ??ë¡œì§ ê°œì„  ë¶€ë¶„ì? ? ì??˜ë˜, ë¶ˆí•„?”í•œ setFormData/editedUser ì´ˆê¸°?”ëŠ” ìµœì†Œ??
	useEffect(() => {
		if (userData) {
			if (userData.length === 0) {
				setSelectedUser(null);
				setEditedUser({});
			} else if (selectedUser) {
				// userData???„ì¬ ? íƒ???¬ìš©?ê? ?ˆìœ¼ë©?? ì?
				const stillExists = userData.some(
					(u) => u.empNo === selectedUser.empNo
				);
				if (!stillExists) {
					setSelectedUser(null);
					setEditedUser({});
				}
				// else: selectedUser ? ì? (ì´ˆê¸°?”í•˜ì§€ ?ŠìŒ)
			}
			// selectedUserê°€ null?´ë©´ ?„ë¬´ê²ƒë„ ?˜ì? ?ŠìŒ (ì´ˆê¸°?”í•˜ì§€ ?ŠìŒ)
		}
	}, [userData]);

	// userData ë³€ê²??? selectedUserê°€ null?´ê³  userDataê°€ ?ˆìœ¼ë©?ì²?ë²ˆì§¸ ?¬ìš©???ë™ ? íƒ
	useEffect(() => {
		if (userData && userData.length > 0 && !selectedUser) {
			handleUserSelect(userData[0]);
		}
	}, [userData]);

	// ?…ë¬´ê¶Œí•œ ì½¤ë³´ë°•ìŠ¤ ë³€ê²????¼ë””??ë²„íŠ¼ ?íƒœ ?™ê¸°??
	useEffect(() => {
		if (selectedWorkAuthCode) {
			const selectedAuth = workAuthList.find(
				(auth) => auth.smlCsfCd === selectedWorkAuthCode
			);
			if (selectedAuth) {
				setWorkAuthAction(selectedAuth.wrkUseYn as "1" | "0");
			}
		}
	}, [selectedWorkAuthCode, workAuthList]);

	/**
	 * ê²€??ì¡°ê±´ ë³€ê²??¸ë“¤??
	 * ASIS: txtHqDiv_change(), txtDeptDiv_change(), txtUserNm_change() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ê²€??ì¡°ê±´ ?…ë ¥ ???íƒœë¥??…ë°?´íŠ¸?˜ê³ , ë³¸ë? ë³€ê²???ë¶€??ì½¤ë³´ë¥??™ì ?¼ë¡œ ?…ë°?´íŠ¸
	 * @param e ?…ë ¥ ?´ë²¤??
	 */
	const handleSearchParamChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSearchParams((prev) => ({ ...prev, [name]: value }));

		// ë³¸ë? ë³€ê²???ë¶€??ì½¤ë³´ ?…ë°?´íŠ¸ (ASIS: cboHqDiv_change() ?¨ìˆ˜?€ ?™ì¼)
		if (name === "hqDiv") {
			// ë¶€?œë? 'ALL'ë¡?ì´ˆê¸°??(ASIS: cboDeptDiv.selectedIndex = 0)
			setSearchParams((prev) => ({ ...prev, deptDiv: "ALL" }));

			if (value === "ALL") {
				// ë³¸ë?ê°€ "?„ì²´"???ŒëŠ” ë¶€??ì½¤ë³´??"?„ì²´"ë§??œì‹œ
				setDeptCodeList([{ data: "ALL", label: "?„ì²´" }]);
			} else {
				// ?¹ì • ë³¸ë? ? íƒ ???´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡ ì¡°íšŒ (ASIS: COM_03_0201_S ?„ë¡œ?œì? ?¸ì¶œ)
				usrApiService
					.getDeptDivCodesByHq(value)
					.then((deptList) => {
						const mappedList = mapCodeApiToCodeData(deptList);
						setDeptCodeList(mappedList);
					})
					.catch((error) => {
						console.error("ë³¸ë?ë³?ë¶€??ì¡°íšŒ ?¤íŒ¨:", error);
						// ?¤íŒ¨ ??"?„ì²´"ë§??œì‹œ
						setDeptCodeList([{ data: "ALL", label: "?„ì²´" }]);
					});
			}
		}
	};

	/**
	 * ?¬ìš©??ê²€???¤í–‰ ?¨ìˆ˜
	 * ASIS: btnSearch_click() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ?„ì¬ ê²€??ì¡°ê±´?¼ë¡œ ?¬ìš©??ëª©ë¡??ì¡°íšŒ
	 */
	const handleSearch = () => {
		refetchUserList();
	};

	/**
	 * ?¬ìš©??? íƒ ì²˜ë¦¬ ?¨ìˆ˜
	 * ASIS: grdUser_change() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ?¬ìš©??ëª©ë¡?ì„œ ?¬ìš©?ë? ? íƒ?ˆì„ ???¼ì— ?¬ìš©???•ë³´ë¥??¤ì •?˜ê³  ?…ë¬´ê¶Œí•œ ëª©ë¡??ì¡°íšŒ
	 * @param user ? íƒ???¬ìš©???•ë³´
	 */
	const handleUserSelect = (user: UserData) => {
		setSelectedUser(user);

		// ???°ì´???¤ì • (ASIS: ???„ë“œ?¤ì— ?¬ìš©???•ë³´ ?¤ì •)
		setFormData({
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm,
			usrRoleId: user.usrRoleId,
		});

		// ?¸ì§‘???¬ìš©???•ë³´ ì´ˆê¸°??(ASIS: ?¸ì§‘ ëª¨ë“œ ì§„ì…)
		const initialEditedUser: Partial<UserSaveData> = {
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm, // ?¹ì¸ê²°ì¬??ì¶”ê?
			emailAddr: user.emailAddr,
			usrRoleId: user.usrRoleId,
		};

		// ?¬ìš©?ë³„ ?…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ (ASIS: USR_01_0202_S ?„ë¡œ?œì? ?¸ì¶œ)
		usrApiService.getWorkAuthList(user.empNo).then((list) => {
			setWorkAuthList(list);
			setEditedUser({ ...initialEditedUser, workAuthList: list });
			// ?…ë¬´ê¶Œí•œ ì½¤ë³´ë°•ìŠ¤ ì´ˆê¸°ê°??¤ì • (ASIS: cboWorkAuth.selectedIndex = 0)
			if (list.length > 0) {
				setSelectedWorkAuthCode(list[0].smlCsfCd);
			}
		});
	};

	/**
	 * ?¬ìš©???•ë³´ ?…ë ¥ ë³€ê²??¸ë“¤??
	 * ASIS: ???„ë“œ?¤ì˜ change ?´ë²¤???¸ë“¤?¬ì? ?™ì¼????• 
	 * ?¬ìš©???•ë³´ ?…ë ¥ ???¸ì§‘ ?íƒœë¥??…ë°?´íŠ¸
	 * @param e ?…ë ¥ ?´ë²¤??
	 */
	const handleUserInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setEditedUser((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * ?¬ìš©???•ë³´ ?€??ì§„í–‰ ?¨ìˆ˜
	 * ASIS: fnUserInfoSave() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ?¹ì¸ê²°ì¬???•ë³´?€ ?¨ê»˜ ?¬ìš©???•ë³´ë¥??€?¥í•˜ê³?ê²°ê³¼ë¥?ì²˜ë¦¬
	 * @param approver ?¹ì¸ê²°ì¬???•ë³´ (id: ?¹ì¸ê²°ì¬?ID, name: ?¹ì¸ê²°ì¬?ëª…)
	 */
	const proceedWithSave = useCallback(
		async (approver: { id: string; name: string }, userForSave?: UserData) => {
			// ?€???•ì¸ ë©”ì‹œì§€ ?œì‹œ (ASIS: Alert.show("?€?¥í•˜?œê² ?µë‹ˆê¹?"))
			showConfirm({
				message: "?€?¥í•˜?œê² ?µë‹ˆê¹?",
				type: "info",
				onConfirm: async () => {
					// ?„ì¬ ?…ë¬´ê¶Œí•œ ëª©ë¡?ì„œ ë¶€?¬ëœ ê¶Œí•œë§??„í„°ë§?
					const currentWorkAuthList = editedUser.workAuthList || workAuthList;

					// ?€?¥í•  ?°ì´??êµ¬ì„± (ASIS: ?€?¥í•  ê°ì²´ êµ¬ì„±)
					const saveData: UserSaveData = {
						...(userForSave || selectedUser!),
						...editedUser,
						empNo: userForSave?.empNo || editedUser.empNo || "", // ??ë°˜ë“œ???¬í•¨!
						apvApofId: approver.id, // ?¹ì¸ê²°ì¬?ID
						apvApofNm: approver.name, // ?¹ì¸ê²°ì¬?ëª…
						workAuthList: currentWorkAuthList,
						regUserId: user && "empNo" in user ? (user as any).empNo : "",
					};

					try {
						// ?¬ìš©???•ë³´ ?€??(ASIS: USR_01_0203_T ?„ë¡œ?œì? ?¸ì¶œ)
						await usrApiService.saveUser(saveData);
						showToast("?±ê³µ?ìœ¼ë¡??€?¥ë˜?ˆìŠµ?ˆë‹¤.", "info");

						// ?€?????¬ìš©??ëª©ë¡ ?ˆë¡œê³ ì¹¨ (ASIS: fn_srch() ?¸ì¶œ)
						await refetchUserList();

						// ?„ì¬ ? íƒ???¬ìš©?ê? ?ˆë‹¤ë©??…ë°?´íŠ¸???•ë³´ë¡??¤ì‹œ ?¤ì •
						if (userForSave || selectedUser) {
							const updatedUserList =
								await usrApiService.getUserList(searchParams);
							const updatedUser = updatedUserList.find(
								(u) => u.empNo === (userForSave?.empNo || selectedUser?.empNo)
							);
							if (updatedUser) {
								handleUserSelect(updatedUser);
							}
						}
					} catch (error) {
						console.error("Failed to save user:", error);
						showConfirm({
							message: `?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${(error as Error).message}`,
							type: "error",
							onConfirm: () => {},
							confirmOnly: true,
						});
					}
				},
			});
		},
		[
			editedUser,
			workAuthList,
			selectedUser,
			user,
			searchParams,
			showConfirm,
			showToast,
			refetchUserList,
		]
	);

	// 4. handleApproverSelect??editedUserë§?ê°±ì‹  (userData/selectedUser??ê±´ë“œë¦¬ì? ?ŠìŒ)
	const handleApproverSelect = useCallback(
		(approver: { empNo: string; empNm: string; authCd: string }) => {
			if (approver.authCd !== "10" && approver.authCd !== "00") {
				showConfirm({
					message:
						"?¹ì¸ê²°ì¬?ëŠ” ë¶€?œì¥ ?´ìƒ?´ì–´???©ë‹ˆ??\n???…ë ¥ ??ì£¼ì‹­?œìš”.",
					type: "warning",
					onConfirm: () => {
						const apvApofInput = document.getElementById(
							"apvApofNm"
						) as HTMLInputElement;
						if (apvApofInput) apvApofInput.focus();
					},
					confirmOnly: true,
				});
				return;
			}
			setEditedUser((prev) => ({
				...prev,
				apvApofId: approver.empNo,
				apvApofNm: approver.empNm,
			}));
			// ?ì—…?ì„œ ? íƒ ???ë™ ?€???¸ì¶œ
			proceedWithSave({ id: approver.empNo, name: approver.empNm });
		},
		[showConfirm, proceedWithSave]
	);

	// postMessage ?´ë²¤??ë¦¬ìŠ¤??ì¶”ê?
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "EMP_SELECTED") {
				const empData = event.data.data;
				handleApproverSelect(empData);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [handleApproverSelect]); // handleApproverSelect ?˜ì¡´??ì¶”ê?

	/**
	 * ?…ë¬´ê¶Œí•œ ë³€ê²?ì²˜ë¦¬ ?¨ìˆ˜
	 * ASIS: rdoGrant_click(), rdoRevoke_click() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ? íƒ???…ë¬´ê¶Œí•œ???€??ë¶€???´ì œ ?¡ì…˜???ìš©
	 * @param action ê¶Œí•œ ?¡ì…˜ ("1": ë¶€?? "0": ?´ì œ)
	 */
	const handleWorkAuthChange = (action: "1" | "0") => {
		// ?…ë¬´ê¶Œí•œ??? íƒ?˜ì? ?Šì? ê²½ìš° ê²½ê³  ë©”ì‹œì§€ ?œì‹œ
		if (!selectedWorkAuthCode) {
			showConfirm({
				message: "?˜ì •???…ë¬´ê¶Œí•œ??? íƒ?˜ì„¸??",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// ?…ë¬´ê¶Œí•œ ëª©ë¡?ì„œ ? íƒ????ª©??ê¶Œí•œ ?íƒœë¥??…ë°?´íŠ¸ (ASIS: grdWorkAuth ?°ì´???…ë°?´íŠ¸)
		const updatedList = workAuthList.map((auth) =>
			auth.smlCsfCd === selectedWorkAuthCode
				? { ...auth, wrkUseYn: action }
				: auth
		);

		// ?…ë°?´íŠ¸??ëª©ë¡?¼ë¡œ ?íƒœ ê°±ì‹ 
		setWorkAuthList(updatedList);
		setEditedUser((prev) => ({ ...prev, workAuthList: updatedList }));
	};

	// useEffect ?œê±° - ë¬´í•œ ë£¨í”„ ë°©ì?

	/**
	 * ?¬ìš©???•ë³´ ?€???¨ìˆ˜
	 * ASIS: btnSave_click() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ?¬ìš©???•ë³´ ? íš¨??ê²€?????¹ì¸ê²°ì¬??ê²€??ë°??€??ì§„í–‰
	 */
	const handleSave = async () => {
		const userForSave = selectedUser;
		if (!userForSave || !userForSave.empNo) {
			showConfirm({
				message: "?€?¥í•  ?¬ìš©?ë? ? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		if (!editedUser.apvApofNm) {
			showConfirm({
				message: "?¹ì¸ê²°ì¬?ë? ?…ë ¥??ì£¼ì‹­?œìš”.",
				type: "warning",
				onConfirm: () => {
					const apvApofInput = document.getElementById(
						"apvApofNm"
					) as HTMLInputElement;
					if (apvApofInput) apvApofInput.focus();
				},
				confirmOnly: true,
			});
			return;
		}
		if (!editedUser.authCd) {
			showConfirm({
				message: "?¬ìš©?ê¶Œ?œì„ ? íƒ??ì£¼ì‹­?œìš”.",
				type: "warning",
				onConfirm: () => {
					const authSelect = document.getElementById(
						"authCd"
					) as HTMLSelectElement;
					if (authSelect) authSelect.focus();
				},
				confirmOnly: true,
			});
			return;
		}
		if (!editedUser.dutyDivCd) {
			showConfirm({
				message: "ì§ì±…êµ¬ë¶„??? íƒ??ì£¼ì‹­?œìš”.",
				type: "warning",
				onConfirm: () => {
					const dutyDivSelect = document.getElementById(
						"dutyDivCd"
					) as HTMLSelectElement;
					if (dutyDivSelect) dutyDivSelect.focus();
				},
				confirmOnly: true,
			});
			return;
		}
		try {
			const approvers = await usrApiService.getUserList({
				hqDiv: "ALL",
				deptDiv: "ALL",
				userNm: editedUser.apvApofNm,
			});
			if (approvers.length === 0) {
				showConfirm({
					message:
						"?¬ìš©???•ë³´??ë¯¸ë“±ë¡ëœ ?¹ì¸ê²°ì¬???…ë‹ˆ?? ?¹ì¸ê²°ì¬?ë? ?¤ì‹œ ?…ë ¥??ì£¼ì‹­?œìš”.",
					type: "warning",
					onConfirm: () => {
						const apvApofInput = document.getElementById(
							"apvApofNm"
						) as HTMLInputElement;
						if (apvApofInput) apvApofInput.focus();
					},
					confirmOnly: true,
				});
				return;
			} else if (approvers.length === 1) {
				const approver = approvers[0];
				if (approver.authCd !== "10" && approver.authCd !== "00") {
					showConfirm({
						message:
							"?¹ì¸ê²°ì¬?ëŠ” ë¶€?œì¥ ?´ìƒ?´ì–´???©ë‹ˆ??\n???…ë ¥ ??ì£¼ì‹­?œìš”.",
						type: "warning",
						onConfirm: () => {
							const apvApofInput = document.getElementById(
								"apvApofNm"
							) as HTMLInputElement;
							if (apvApofInput) apvApofInput.focus();
						},
						confirmOnly: true,
					});
					return;
				}
				setEditedUser((prev) => ({
					...prev,
					apvApofId: approver.empNo,
					apvApofNm: approver.empNm,
				}));
				proceedWithSave(
					{ id: approver.empNo, name: approver.empNm },
					userForSave
				);
			} else {
				openApproverPopup();
			}
		} catch (error) {
			console.error("Failed to search approver:", error);
			showConfirm({
				message: `?¹ì¸ê²°ì¬??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${(error as Error).message}`,
				type: "error",
				onConfirm: () => {},
				confirmOnly: true,
			});
		}
	};

	/**
	 * ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???¨ìˆ˜
	 * ASIS: btnPasswordInit_click() ?¨ìˆ˜?€ ?™ì¼????• 
	 * ? íƒ???¬ìš©?ì˜ ë¹„ë?ë²ˆí˜¸ë¥?ì´ˆê¸°?”í•˜ê³?ê²°ê³¼ë¥?ì²˜ë¦¬
	 */
	const handlePasswordReset = async () => {
		if (!selectedUser) {
			showConfirm({
				message: "ë¹„ë?ë²ˆí˜¸ë¥?ì´ˆê¸°?”í•  ?¬ìš©?ë? ? íƒ?´ì£¼?¸ìš”.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		showConfirm({
			message: `'${selectedUser.empNm}'?˜ì˜ ë¹„ë?ë²ˆí˜¸ë¥?ì´ˆê¸°?”í•˜?œê² ?µë‹ˆê¹?`,
			type: "info",
			onConfirm: async () => {
				try {
					const resultMessage = await usrApiService.initPassword(
						selectedUser.empNo
					);
					showToast(resultMessage, "info");
				} catch (error) {
					console.error("Failed to reset password:", error);
					showConfirm({
						message: `ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${(error as Error).message}`,
						type: "error",
						onConfirm: () => {},
						confirmOnly: true,
					});
				}
			},
		});
	};

	// ?¬ìš©??ëª©ë¡ ì»¬ëŸ¼ ?•ì˜
	const userColumnDefs: ColDef[] = [
		{
			headerName: "?¬ë²ˆ",
			field: "empNo",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?±ëª…",
			field: "empNm",
			width: 90,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "ë³¸ë?ëª?,
			field: "hqDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "ë¶€?œëª…",
			field: "deptDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "ì§ê¸‰ëª?,
			field: "dutyNm",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "ì§ì±…êµ¬ë¶„",
			field: "dutyDivCdNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¬ìš©?ê¶Œ??,
			field: "authCdNm",
			width: 110,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¬ìš©?ì—­? ID",
			field: "usrRoleId",
			width: 120,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¬ìš©?ì—­??,
			field: "usrRoleNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¹ì¸ê²°ì¬??,
			field: "apvApofNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¬ì—…",
			field: "bsnUseYn",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "ì¶”ì§„ë¹?,
			field: "wpcUseYn",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "?¸ì‚¬/ë³µë¦¬",
			field: "psmUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
	];

	// ?…ë¬´ë³??¬ìš©ê¶Œí•œ ì»¬ëŸ¼ ?•ì˜
	const workAuthColumnDefs: ColDef[] = [
		{
			headerName: "?…ë¬´êµ¬ë¶„",
			field: "smlCsfNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?¬ìš©ê¶Œí•œ",
			field: "wrkUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "ë¹„ê³ ",
			field: "rmk",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
	];

	return (
		<div className='mdi'>
			{/* ?ë‹¨ ê²€???ì—­ */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[70px]'>ë³¸ë?</th>
							<td className='search-td w-[180px]'>
								<select
									name='hqDiv'
									value={searchParams.hqDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='hqDiv'
									title='ë³¸ë? ? íƒ'
								>
									<option key='ALL' value='ALL'>
										?„ì²´
									</option>
									{hqCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[70px]'>ë¶€??/th>
							<td className='search-td w-[180px]'>
								<select
									name='deptDiv'
									value={searchParams.deptDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='deptDiv'
									title='ë¶€??? íƒ'
								>
									{deptCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[90px]'>?¬ìš©?ëª…</th>
							<td className='search-td w-[180px]'>
								<input
									type='text'
									name='userNm'
									value={searchParams.userNm}
									onChange={handleSearchParamChange}
									className='input-base'
									id='userNm'
									placeholder='?¬ìš©?ëª… ?…ë ¥'
									title='?¬ìš©?ëª… ?…ë ¥'
									maxLength={20}
								/>
							</td>
							<td className='search-td text-right' colSpan={2}>
								<button onClick={handleSearch} className='btn-base btn-search'>
									ì¡°íšŒ
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* ?¬ìš©??ëª©ë¡ ê·¸ë¦¬??*/}
			<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
				<AgGridReact
					rowData={userData || []}
					columnDefs={userColumnDefs}
					onRowClicked={(event) => handleUserSelect(event.data)} // ?¨ì¼ ?´ë¦­?ë„ ë°˜ì˜
					rowSelection='single'
					getRowClass={(params: any) =>
						selectedUser?.empNo === params.data.empNo ? "selected" : ""
					}
					defaultColDef={{
						resizable: true,
						sortable: true,
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

			{/* ?˜ë‹¨: ?±ë¡/?˜ì • ?ì—­ê³??…ë¬´ê¶Œí•œ ?Œì´ë¸”ì„ ê°€ë¡?ë°°ì¹˜ */}
			<div className='flex gap-4 items-start'>
				{/* ?¼ìª½: ?…ë¬´ê¶Œí•œ ?€?´í? + ?Œì´ë¸?*/}
				<div className='w-[30%]'>
					<div className='tit_area'>
						<h2>?…ë¬´ë³??¬ìš©ê¶Œí•œ</h2>
					</div>
					<div
						className='ag-theme-alpine'
						style={{ height: 300, width: "100%" }}
					>
						<AgGridReact
							rowData={workAuthList}
							columnDefs={workAuthColumnDefs}
							defaultColDef={{
								resizable: true,
								sortable: true,
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

				{/* ?¤ë¥¸ìª? ?¬ìš©???±ë¡ ë°??˜ì • */}
				<div className='flex-1'>
					<div className='tit_area'>
						<h2>?¬ìš©???±ë¡ ë°??˜ì •</h2>
					</div>
					<table className='form-table'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th w-[80px]'>?¬ë²ˆ</th>
								<td className='form-td w-[200px]'>
									<input
										name='empNo'
										value={formData.empNo}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNo'
										title='?¬ë²ˆ ?…ë ¥'
									/>
								</td>
								<th className='form-th w-[80px]'>?±ëª…</th>
								<td className='form-td !w-[150px]'>
									<input
										name='empNm'
										value={formData.empNm}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNm'
										title='?±ëª… ?…ë ¥'
									/>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>?¬ìš©?ê¶Œ??/th>
								<td className='form-td'>
									<select
										name='authCd'
										value={editedUser?.authCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='authCd'
										title='?¬ìš©?ê¶Œ??? íƒ'
									>
										<option key='auth-empty' value=''>
											? íƒ
										</option>
										{authCodeList.map((code) => (
											<option key={code.data} value={code.data}>
												{code.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th'>ì§ì±…êµ¬ë¶„</th>
								<td className='form-td'>
									<select
										name='dutyDivCd'
										value={editedUser?.dutyDivCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='dutyDivCd'
										title='ì§ì±…êµ¬ë¶„ ? íƒ'
									>
										<option key='duty-empty' value=''>
											? íƒ
										</option>
										{dutyDivCodeList.map((code) => (
											<option key={code.data} value={code.data}>
												{code.label}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>?¹ì¸ê²°ì¬??/th>
								<td className='form-td'>
									<div className='flex items-center'>
										<input
											name='apvApofNm'
											value={editedUser?.apvApofNm || ""}
											onChange={handleUserInputChange}
											className='input-base input-default'
											id='apvApofNm'
											placeholder='?¹ì¸ê²°ì¬?ëª…???…ë ¥?˜ì„¸??
											title='?¹ì¸ê²°ì¬?ëª… ?…ë ¥'
											maxLength={20}
										/>
									</div>
								</td>
								<th className='form-th'>?¬ìš©?ì—­??/th>
								<td className='form-td'>
									<select
										name='usrRoleId'
										value={editedUser?.usrRoleId || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='usrRoleId'
										title='?¬ìš©????•  ? íƒ'
									>
										<option key='role-empty' value=''>
											? íƒ
										</option>
										{userRoleList.map((role) => (
											<option key={role.usrRoleId} value={role.usrRoleId}>
												{role.usrRoleNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>?…ë¬´ê¶Œí•œ</th>
								<td className='form-td' colSpan={3}>
									<div className='flex items-center gap-2 text-sm leading-none'>
										<select
											className='combo-base !w-[200px]'
											value={selectedWorkAuthCode}
											onChange={(e) => {
												setSelectedWorkAuthCode(e.target.value);
											}}
											id='workAuth'
											title='?…ë¬´ê¶Œí•œ ? íƒ'
										>
											<option key='work-auth-empty' value=''>
												== ? íƒ ==
											</option>
											{workAuthList.map((auth) => (
												<option key={auth.smlCsfCd} value={auth.smlCsfCd}>
													{auth.smlCsfNm}
												</option>
											))}
										</select>
										<label htmlFor='workAuthAction_1'>
											<input
												id='workAuthAction_1'
												type='radio'
												name='workAuthAction'
												value='1'
												checked={workAuthAction === "1"}
												onChange={(e) => {
													const value = e.target.value as "1";
													setWorkAuthAction(value);
													// ì¦‰ì‹œ ?…ë¬´ê¶Œí•œ ë³€ê²??ìš©
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											ë¶€??
										</label>
										<label htmlFor='workAuthAction_0'>
											<input
												id='workAuthAction_0'
												type='radio'
												name='workAuthAction'
												value='0'
												checked={workAuthAction === "0"}
												onChange={(e) => {
													const value = e.target.value as "0";
													setWorkAuthAction(value);
													// ì¦‰ì‹œ ?…ë¬´ê¶Œí•œ ë³€ê²??ìš©
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											?´ì œ
										</label>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* ?˜ë‹¨ ë²„íŠ¼ ?ì—­ */}
					<div className='flex justify-end mt-4'>
						<button
							onClick={handlePasswordReset}
							className='btn-base btn-etc mr-2'
						>
							ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
						</button>
						<button onClick={handleSave} className='btn-base btn-act'>
							?€??
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default USR2010M00;


