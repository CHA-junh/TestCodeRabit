/**
 * USR2010M00 - ?�용??관�??�면
 *
 * 주요 기능:
 * - ?�용??목록 조회 �?검??(본�?/부???�용?�명 조건)
 * - ?�용???�보 ?�규 ?�록 �??�정
 * - ?�용???�무권한 관�?(?�디??버튼?�로 권한 부???�제)
 * - ?�용????�� ?�당 (콤보박스)
 * - ?�인결재??검??�??�택
 * - 비�?번호 초기??
 *
 * API ?�동:
 * - GET /api/usr/list - ?�용??목록 조회
 * - GET /api/usr/work-auth/:userId - ?�용???�무권한 조회
 * - POST /api/usr/save - ?�용???�보 ?�??
 * - POST /api/usr/password-init - 비�?번호 초기??
 * - GET /api/usr/approver-search - ?�인결재??검??
 * - GET /api/usr/roles - ?�용????�� 목록 조회
 * - GET /api/common/search - 공통 코드 조회 (본�?, 부?? 권한, 직책 ??
 * - GET /api/common/dept-div-codes - 부?�구분코??조회
 *
 * ?�태 관�?
 * - ?�용??목록 �??�택???�용??
 * - ???�이??(?�규/?�정??
 * - ?�무권한 목록 �??�택 ?�태
 * - 콤보박스 ?�이??(본�?, 부?? 권한, 직책, ??�� ??
 * - 로딩 ?�태 �??�러 처리
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (본�?, 부?? ?�용?�명)
 * - ?�용??목록 ?�이�?(?�택 가??
 * - ?�용???�보 ?�력 ??(?�규/?�정)
 * - ?�무권한 관�?그리??(?�디??버튼)
 * - ?�인결재??검???�업
 * - ?�??초기??비�?번호 초기??버튼
 *
 * ?��? ?�면:
 * - SYS1003M00: ?�용????�� 관�?(??�� ?�보 ?�동)
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
 * USR2010M00 - ?�용??관�??�면
 *
 * 주요 기능:
 * - ?�용??조회 �??�록/?�정
 * - 본�?/부?�별 ?�용???�터�?
 * - ?�용??권한 �?직책 관�?
 * - ?�무�??�용권한 ?�정
 * - ?�인결재??지??
 * - 비�?번호 초기??
 *
 * ?��? ?�이�?
 * - ?�용???�보 (?�번, ?�명, 본�?, 부?? 직급, 직책 ??
 * - ?�용??권한 (?�용?�권?? ?�용?�역??
 * - ?�무�??�용권한 (?�업관�? ?�로?�트관�? ?�무추진비�?�? ?�사관�? ?�스?��?�?
 * - ?�인결재???�보
 *
 * ?��? ?�로?��?:
 * - USR_01_0201_S: ?�용??목록 조회 (본�?/부???�용?�명 조건)
 * - USR_01_0202_S: ?�무�??�용권한 목록 조회 (?�용?�ID 기�?)
 * - USR_01_0203_T: ?�용???�보 ?�??(?�규/?�정)
 * - USR_01_0104_T: 비�?번호 초기??
 * - COM_03_0101_S: 공통코드 조회 (본�?, 부?? 권한, 직책구분, ?�무권한 ??
 * - COM_03_0201_S: 부?�코??조회 (본�?�?부??목록)
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

// API ?�답??CodeData�?매핑
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

const USR2010M00: React.FC = () => {
	const { showToast, showConfirm } = useToast();
	const { openPopup } = usePopup(); // ?�업 ?�픈 ?�수 ?�언 복구
	const { user } = useAuth();

	// 검??조건 ?�태 관�?(ASIS: txtHqDiv.text, txtDeptDiv.text, txtUserNm.text)
	const [searchParams, setSearchParams] = useState(initialSearch);
	// ?�택???�용???�태 관�?(ASIS: grdUser.selectedItem)
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	// ?�집 중인 ?�용???�보 ?�태 관�?(ASIS: ???�드?�의 값들)
	const [editedUser, setEditedUser] = useState<Partial<UserSaveData>>({});

	// ?�무권한 목록 ?�태 관�?(ASIS: grdWorkAuth.dataProvider)
	const [workAuthList, setWorkAuthList] = useState<WorkAuthData[]>([]);
	// ?�무권한 로딩 ?�태 관�?(ASIS: showBusyCursor="true")
	const [workAuthLoading, setWorkAuthLoading] = useState(false);
	// ?�무권한 ?�러 ?�태 관�?(ASIS: Alert.show() 메시지)
	const [workAuthError, setWorkAuthError] = useState<string | null>(null);
	// ?�택???�무권한 코드 ?�태 관�?(ASIS: cboWorkAuth.selectedItem)
	const [selectedWorkAuthCode, setSelectedWorkAuthCode] = useState<string>("");
	// ?�무권한 ?�션 ?�태 관�?(ASIS: rdoGrant.selected, rdoRevoke.selected)
	const [workAuthAction, setWorkAuthAction] = useState<"1" | "0">("1");
	// ???�이???�태 관�?(ASIS: ???�드?�의 초기�?
	const [formData, setFormData] = useState(initialFormData);

	// 1. ?�인결재???�보 목록 ?�태 관�?(메인 userData?� 분리)
	const [approverList, setApproverList] = useState<UserData[]>([]);

	// 2. ?�인결재??검???�수 (메인 userData�?건드리�? ?�음)
	const handleApproverSearch = async (searchName: string) => {
		const result = await usrApiService.getUserList({
			hqDiv: "ALL",
			deptDiv: "ALL",
			userNm: searchName,
		});
		setApproverList(result);
	};

	// 3. ?�업 ?�픈 ??approverList�??�달
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
				console.log("?�� USR2010M00 - ?�업 ?�림");
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
		queryFn: () => Promise.resolve([{ data: "ALL", label: "?�체" }]),
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
		if (deptData) setDeptCodeList(deptData); // ?��? ?�바�??�태?��?�?변?�하지 ?�음
		if (authData) setAuthCodeList(mapCodeApiToCodeData(authData));
		if (dutyDivData) setDutyDivCodeList(mapCodeApiToCodeData(dutyDivData));
		if (workAuthData) setWorkAuthCodeList(mapCodeApiToCodeData(workAuthData));
		if (rolesData) setUserRoleList(rolesData);
	}, [hqData, deptData, authData, dutyDivData, workAuthData, rolesData]);

	// useEffect([userData])?�서 selectedUser�?무조�?null�?만드??로직 개선 부분�? ?��??�되, 불필?�한 setFormData/editedUser 초기?�는 최소??
	useEffect(() => {
		if (userData) {
			if (userData.length === 0) {
				setSelectedUser(null);
				setEditedUser({});
			} else if (selectedUser) {
				// userData???�재 ?�택???�용?��? ?�으�??��?
				const stillExists = userData.some(
					(u) => u.empNo === selectedUser.empNo
				);
				if (!stillExists) {
					setSelectedUser(null);
					setEditedUser({});
				}
				// else: selectedUser ?��? (초기?�하지 ?�음)
			}
			// selectedUser가 null?�면 ?�무것도 ?��? ?�음 (초기?�하지 ?�음)
		}
	}, [userData]);

	// userData 변�??? selectedUser가 null?�고 userData가 ?�으�?�?번째 ?�용???�동 ?�택
	useEffect(() => {
		if (userData && userData.length > 0 && !selectedUser) {
			handleUserSelect(userData[0]);
		}
	}, [userData]);

	// ?�무권한 콤보박스 변�????�디??버튼 ?�태 ?�기??
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
	 * 검??조건 변�??�들??
	 * ASIS: txtHqDiv_change(), txtDeptDiv_change(), txtUserNm_change() ?�수?� ?�일????��
	 * 검??조건 ?�력 ???�태�??�데?�트?�고, 본�? 변�???부??콤보�??�적?�로 ?�데?�트
	 * @param e ?�력 ?�벤??
	 */
	const handleSearchParamChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSearchParams((prev) => ({ ...prev, [name]: value }));

		// 본�? 변�???부??콤보 ?�데?�트 (ASIS: cboHqDiv_change() ?�수?� ?�일)
		if (name === "hqDiv") {
			// 부?��? 'ALL'�?초기??(ASIS: cboDeptDiv.selectedIndex = 0)
			setSearchParams((prev) => ({ ...prev, deptDiv: "ALL" }));

			if (value === "ALL") {
				// 본�?가 "?�체"???�는 부??콤보??"?�체"�??�시
				setDeptCodeList([{ data: "ALL", label: "?�체" }]);
			} else {
				// ?�정 본�? ?�택 ???�당 본�???부??목록 조회 (ASIS: COM_03_0201_S ?�로?��? ?�출)
				usrApiService
					.getDeptDivCodesByHq(value)
					.then((deptList) => {
						const mappedList = mapCodeApiToCodeData(deptList);
						setDeptCodeList(mappedList);
					})
					.catch((error) => {
						console.error("본�?�?부??조회 ?�패:", error);
						// ?�패 ??"?�체"�??�시
						setDeptCodeList([{ data: "ALL", label: "?�체" }]);
					});
			}
		}
	};

	/**
	 * ?�용??검???�행 ?�수
	 * ASIS: btnSearch_click() ?�수?� ?�일????��
	 * ?�재 검??조건?�로 ?�용??목록??조회
	 */
	const handleSearch = () => {
		refetchUserList();
	};

	/**
	 * ?�용???�택 처리 ?�수
	 * ASIS: grdUser_change() ?�수?� ?�일????��
	 * ?�용??목록?�서 ?�용?��? ?�택?�을 ???�에 ?�용???�보�??�정?�고 ?�무권한 목록??조회
	 * @param user ?�택???�용???�보
	 */
	const handleUserSelect = (user: UserData) => {
		setSelectedUser(user);

		// ???�이???�정 (ASIS: ???�드?�에 ?�용???�보 ?�정)
		setFormData({
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm,
			usrRoleId: user.usrRoleId,
		});

		// ?�집???�용???�보 초기??(ASIS: ?�집 모드 진입)
		const initialEditedUser: Partial<UserSaveData> = {
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm, // ?�인결재??추�?
			emailAddr: user.emailAddr,
			usrRoleId: user.usrRoleId,
		};

		// ?�용?�별 ?�무권한 목록 조회 (ASIS: USR_01_0202_S ?�로?��? ?�출)
		usrApiService.getWorkAuthList(user.empNo).then((list) => {
			setWorkAuthList(list);
			setEditedUser({ ...initialEditedUser, workAuthList: list });
			// ?�무권한 콤보박스 초기�??�정 (ASIS: cboWorkAuth.selectedIndex = 0)
			if (list.length > 0) {
				setSelectedWorkAuthCode(list[0].smlCsfCd);
			}
		});
	};

	/**
	 * ?�용???�보 ?�력 변�??�들??
	 * ASIS: ???�드?�의 change ?�벤???�들?��? ?�일????��
	 * ?�용???�보 ?�력 ???�집 ?�태�??�데?�트
	 * @param e ?�력 ?�벤??
	 */
	const handleUserInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setEditedUser((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * ?�용???�보 ?�??진행 ?�수
	 * ASIS: fnUserInfoSave() ?�수?� ?�일????��
	 * ?�인결재???�보?� ?�께 ?�용???�보�??�?�하�?결과�?처리
	 * @param approver ?�인결재???�보 (id: ?�인결재?�ID, name: ?�인결재?�명)
	 */
	const proceedWithSave = useCallback(
		async (approver: { id: string; name: string }, userForSave?: UserData) => {
			// ?�???�인 메시지 ?�시 (ASIS: Alert.show("?�?�하?�겠?�니�?"))
			showConfirm({
				message: "?�?�하?�겠?�니�?",
				type: "info",
				onConfirm: async () => {
					// ?�재 ?�무권한 목록?�서 부?�된 권한�??�터�?
					const currentWorkAuthList = editedUser.workAuthList || workAuthList;

					// ?�?�할 ?�이??구성 (ASIS: ?�?�할 객체 구성)
					const saveData: UserSaveData = {
						...(userForSave || selectedUser!),
						...editedUser,
						empNo: userForSave?.empNo || editedUser.empNo || "", // ??반드???�함!
						apvApofId: approver.id, // ?�인결재?�ID
						apvApofNm: approver.name, // ?�인결재?�명
						workAuthList: currentWorkAuthList,
						regUserId: user && "empNo" in user ? (user as any).empNo : "",
					};

					try {
						// ?�용???�보 ?�??(ASIS: USR_01_0203_T ?�로?��? ?�출)
						await usrApiService.saveUser(saveData);
						showToast("?�공?�으�??�?�되?�습?�다.", "info");

						// ?�?????�용??목록 ?�로고침 (ASIS: fn_srch() ?�출)
						await refetchUserList();

						// ?�재 ?�택???�용?��? ?�다�??�데?�트???�보�??�시 ?�정
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
							message: `?�??�??�류가 발생?�습?�다: ${(error as Error).message}`,
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

	// 4. handleApproverSelect??editedUser�?갱신 (userData/selectedUser??건드리�? ?�음)
	const handleApproverSelect = useCallback(
		(approver: { empNo: string; empNm: string; authCd: string }) => {
			if (approver.authCd !== "10" && approver.authCd !== "00") {
				showConfirm({
					message:
						"?�인결재?�는 부?�장 ?�상?�어???�니??\n???�력 ??주십?�요.",
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
			// ?�업?�서 ?�택 ???�동 ?�???�출
			proceedWithSave({ id: approver.empNo, name: approver.empNm });
		},
		[showConfirm, proceedWithSave]
	);

	// postMessage ?�벤??리스??추�?
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "EMP_SELECTED") {
				const empData = event.data.data;
				handleApproverSelect(empData);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [handleApproverSelect]); // handleApproverSelect ?�존??추�?

	/**
	 * ?�무권한 변�?처리 ?�수
	 * ASIS: rdoGrant_click(), rdoRevoke_click() ?�수?� ?�일????��
	 * ?�택???�무권한???�??부???�제 ?�션???�용
	 * @param action 권한 ?�션 ("1": 부?? "0": ?�제)
	 */
	const handleWorkAuthChange = (action: "1" | "0") => {
		// ?�무권한???�택?��? ?��? 경우 경고 메시지 ?�시
		if (!selectedWorkAuthCode) {
			showConfirm({
				message: "?�정???�무권한???�택?�세??",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// ?�무권한 목록?�서 ?�택????��??권한 ?�태�??�데?�트 (ASIS: grdWorkAuth ?�이???�데?�트)
		const updatedList = workAuthList.map((auth) =>
			auth.smlCsfCd === selectedWorkAuthCode
				? { ...auth, wrkUseYn: action }
				: auth
		);

		// ?�데?�트??목록?�로 ?�태 갱신
		setWorkAuthList(updatedList);
		setEditedUser((prev) => ({ ...prev, workAuthList: updatedList }));
	};

	// useEffect ?�거 - 무한 루프 방�?

	/**
	 * ?�용???�보 ?�???�수
	 * ASIS: btnSave_click() ?�수?� ?�일????��
	 * ?�용???�보 ?�효??검?????�인결재??검??�??�??진행
	 */
	const handleSave = async () => {
		const userForSave = selectedUser;
		if (!userForSave || !userForSave.empNo) {
			showConfirm({
				message: "?�?�할 ?�용?��? ?�택?�주?�요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}
		if (!editedUser.apvApofNm) {
			showConfirm({
				message: "?�인결재?��? ?�력??주십?�요.",
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
				message: "?�용?�권?�을 ?�택??주십?�요.",
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
				message: "직책구분???�택??주십?�요.",
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
						"?�용???�보??미등록된 ?�인결재???�니?? ?�인결재?��? ?�시 ?�력??주십?�요.",
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
							"?�인결재?�는 부?�장 ?�상?�어???�니??\n???�력 ??주십?�요.",
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
				message: `?�인결재??조회 �??�류가 발생?�습?�다: ${(error as Error).message}`,
				type: "error",
				onConfirm: () => {},
				confirmOnly: true,
			});
		}
	};

	/**
	 * 비�?번호 초기???�수
	 * ASIS: btnPasswordInit_click() ?�수?� ?�일????��
	 * ?�택???�용?�의 비�?번호�?초기?�하�?결과�?처리
	 */
	const handlePasswordReset = async () => {
		if (!selectedUser) {
			showConfirm({
				message: "비�?번호�?초기?�할 ?�용?��? ?�택?�주?�요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		showConfirm({
			message: `'${selectedUser.empNm}'?�의 비�?번호�?초기?�하?�겠?�니�?`,
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
						message: `비�?번호 초기??�??�류가 발생?�습?�다: ${(error as Error).message}`,
						type: "error",
						onConfirm: () => {},
						confirmOnly: true,
					});
				}
			},
		});
	};

	// ?�용??목록 컬럼 ?�의
	const userColumnDefs: ColDef[] = [
		{
			headerName: "?�번",
			field: "empNo",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�명",
			field: "empNm",
			width: 90,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "본�?�?,
			field: "hqDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "부?�명",
			field: "deptDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "직급�?,
			field: "dutyNm",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "직책구분",
			field: "dutyDivCdNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�용?�권??,
			field: "authCdNm",
			width: 110,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�용?�역?�ID",
			field: "usrRoleId",
			width: 120,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�용?�역??,
			field: "usrRoleNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�인결재??,
			field: "apvApofNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�업",
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
			headerName: "추진�?,
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
			headerName: "?�사/복리",
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

	// ?�무�??�용권한 컬럼 ?�의
	const workAuthColumnDefs: ColDef[] = [
		{
			headerName: "?�무구분",
			field: "smlCsfNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "?�용권한",
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
			headerName: "비고",
			field: "rmk",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
	];

	return (
		<div className='mdi'>
			{/* ?�단 검???�역 */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[70px]'>본�?</th>
							<td className='search-td w-[180px]'>
								<select
									name='hqDiv'
									value={searchParams.hqDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='hqDiv'
									title='본�? ?�택'
								>
									<option key='ALL' value='ALL'>
										?�체
									</option>
									{hqCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[70px]'>부??/th>
							<td className='search-td w-[180px]'>
								<select
									name='deptDiv'
									value={searchParams.deptDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='deptDiv'
									title='부???�택'
								>
									{deptCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[90px]'>?�용?�명</th>
							<td className='search-td w-[180px]'>
								<input
									type='text'
									name='userNm'
									value={searchParams.userNm}
									onChange={handleSearchParamChange}
									className='input-base'
									id='userNm'
									placeholder='?�용?�명 ?�력'
									title='?�용?�명 ?�력'
									maxLength={20}
								/>
							</td>
							<td className='search-td text-right' colSpan={2}>
								<button onClick={handleSearch} className='btn-base btn-search'>
									조회
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* ?�용??목록 그리??*/}
			<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
				<AgGridReact
					rowData={userData || []}
					columnDefs={userColumnDefs}
					onRowClicked={(event) => handleUserSelect(event.data)} // ?�일 ?�릭?�도 반영
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

			{/* ?�단: ?�록/?�정 ?�역�??�무권한 ?�이블을 가�?배치 */}
			<div className='flex gap-4 items-start'>
				{/* ?�쪽: ?�무권한 ?�?��? + ?�이�?*/}
				<div className='w-[30%]'>
					<div className='tit_area'>
						<h2>?�무�??�용권한</h2>
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

				{/* ?�른�? ?�용???�록 �??�정 */}
				<div className='flex-1'>
					<div className='tit_area'>
						<h2>?�용???�록 �??�정</h2>
					</div>
					<table className='form-table'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th w-[80px]'>?�번</th>
								<td className='form-td w-[200px]'>
									<input
										name='empNo'
										value={formData.empNo}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNo'
										title='?�번 ?�력'
									/>
								</td>
								<th className='form-th w-[80px]'>?�명</th>
								<td className='form-td !w-[150px]'>
									<input
										name='empNm'
										value={formData.empNm}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNm'
										title='?�명 ?�력'
									/>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>?�용?�권??/th>
								<td className='form-td'>
									<select
										name='authCd'
										value={editedUser?.authCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='authCd'
										title='?�용?�권???�택'
									>
										<option key='auth-empty' value=''>
											?�택
										</option>
										{authCodeList.map((code) => (
											<option key={code.data} value={code.data}>
												{code.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th'>직책구분</th>
								<td className='form-td'>
									<select
										name='dutyDivCd'
										value={editedUser?.dutyDivCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='dutyDivCd'
										title='직책구분 ?�택'
									>
										<option key='duty-empty' value=''>
											?�택
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
								<th className='form-th'>?�인결재??/th>
								<td className='form-td'>
									<div className='flex items-center'>
										<input
											name='apvApofNm'
											value={editedUser?.apvApofNm || ""}
											onChange={handleUserInputChange}
											className='input-base input-default'
											id='apvApofNm'
											placeholder='?�인결재?�명???�력?�세??
											title='?�인결재?�명 ?�력'
											maxLength={20}
										/>
									</div>
								</td>
								<th className='form-th'>?�용?�역??/th>
								<td className='form-td'>
									<select
										name='usrRoleId'
										value={editedUser?.usrRoleId || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='usrRoleId'
										title='?�용????�� ?�택'
									>
										<option key='role-empty' value=''>
											?�택
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
								<th className='form-th'>?�무권한</th>
								<td className='form-td' colSpan={3}>
									<div className='flex items-center gap-2 text-sm leading-none'>
										<select
											className='combo-base !w-[200px]'
											value={selectedWorkAuthCode}
											onChange={(e) => {
												setSelectedWorkAuthCode(e.target.value);
											}}
											id='workAuth'
											title='?�무권한 ?�택'
										>
											<option key='work-auth-empty' value=''>
												== ?�택 ==
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
													// 즉시 ?�무권한 변�??�용
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											부??
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
													// 즉시 ?�무권한 변�??�용
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											?�제
										</label>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* ?�단 버튼 ?�역 */}
					<div className='flex justify-end mt-4'>
						<button
							onClick={handlePasswordReset}
							className='btn-base btn-etc mr-2'
						>
							비�?번호 초기??
						</button>
						<button onClick={handleSave} className='btn-base btn-act'>
							?�??
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default USR2010M00;


