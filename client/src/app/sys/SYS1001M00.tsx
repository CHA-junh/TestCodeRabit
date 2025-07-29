/**
 * SYS1001M00 - 프로그램 그룹 관리 화면
 *
 * 주요 기능:
 * - 프로그램 그룹 목록 조회 및 검색
 * - 프로그램 그룹 신규 등록 및 수정
 * - 프로그램 그룹별 프로그램 연결 관리
 * - 프로그램 그룹 복사 기능
 * - 프로그램 검색 및 그룹에 추가/제거
 *
 * API 연동:
 * - GET /api/sys/program-groups - 프로그램 그룹 목록 조회
 * - POST /api/sys/program-groups - 프로그램 그룹 저장
 * - GET /api/sys/program-groups/:pgmGrpId/programs - 그룹별 프로그램 조회
 * - POST /api/sys/program-groups/:pgmGrpId/programs - 그룹별 프로그램 저장
 * - POST /api/sys/program-groups/:pgmGrpId/copy - 프로그램 그룹 복사
 * - GET /api/sys/programs - 전체 프로그램 목록 조회 (검색용)
 *
 * 상태 관리:
 * - 프로그램 그룹 목록 및 선택된 그룹
 * - 그룹별 프로그램 목록 및 선택된 프로그램들
 * - 검색 조건 (그룹명, 사용여부)
 * - 신규/수정 모드 상태
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (그룹명, 사용여부)
 * - 프로그램 그룹 목록 테이블 (AG-Grid)
 * - 프로그램 그룹 상세 정보 입력 폼
 * - 그룹별 프로그램 목록 테이블 (체크박스 선택)
 * - 저장/신규/복사/프로그램추가/프로그램삭제 버튼
 *
 * 연관 화면:
 * - SYS1000M00: 프로그램 관리 (프로그램 정보)
 * - SYS1002M00: 메뉴별 프로그램 관리 (그룹 연결)
 * - SYS1003M00: 사용자 역할 관리 (그룹 권한)
 * - SYS1010D00: 프로그램 검색 팝업
 *
 * 데이터 구조:
 * - ProgramGroup: 프로그램 그룹 정보 (pgmGrpId, pgmGrpNm, useYn 등)
 * - ProgramGroupDetail: 프로그램 그룹 상세 정보 (그룹 정보 + 프로그램 목록)
 * - ProgramGroupProgram: 그룹에 연결된 프로그램 정보 (pgmId, pgmNm, pgmDivNm, bizDivNm, useYn 등)
 *
 * 특이사항:
 * - 프로그램 그룹 복사 시 기존 그룹명에 "_COPY" 접미사 추가
 * - 프로그램 검색은 팝업을 통해 별도 화면에서 처리
 * - 그룹별 프로그램은 체크박스로 다중 선택 가능
 * - URL 파라미터를 통한 초기 그룹 선택 지원
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from '@/lib/utils';
import '../common/common.css';
import { ProgramGroupService } from '@/modules/sys/services/programGroupService';
import { ProgramGroup, ProgramGroupDetail, ProgramGroupProgram } from '@/modules/sys/types/programGroup.types';
import { usePopup } from '@/modules/com/hooks/usePopup';
import { useToast } from '@/contexts/ToastContext';

export default function SYS1001M00() {
  const { showToast, showConfirm } = useToast();
  
  // AG-Grid refs
  const programGroupGridRef = useRef<AgGridReact<ProgramGroup>>(null);
  const programGridRef = useRef<AgGridReact<ProgramGroupProgram>>(null);

  // AG-Grid 컬럼 정의 - 프로그램 그룹
  const [programGroupColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '그룹코드', field: 'pgmGrpId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '그룹명', field: 'pgmGrpNm', width: 180, flex: 1.2, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '복사', field: 'copy', width: 80, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', cellRenderer: (params: any) => (
      <button 
        className="btn-base btn-etc text-xs px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
          handleCopyGroup(params.data);
        }}
      >
        복사
      </button>
    )},
    { headerName: '사용여부', field: 'useYn', width: 80, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '사용' : '미사용' },
  ]);

  // AG-Grid 컬럼 정의 - 프로그램
  const [programColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { 
      headerName: '', 
      field: 'checkbox', 
      width: 40, 
      flex: 0.3, 
      cellStyle: { textAlign: 'center' }, 
      headerClass: 'ag-center-header',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    { headerName: '프로그램ID', field: 'pgmId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '프로그램명', field: 'pgmNm', width: 200, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '구분', field: 'pgmDivNm', width: 90, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '업무', field: 'bizDivNm', width: 90, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '사용여부', field: 'useYn', width: 90, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '사용' : '미사용' },
  ]);

  const [programGroups, setProgramGroups] = useState<ProgramGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ProgramGroupDetail | null>(null);
  const [programs, setPrograms] = useState<ProgramGroupProgram[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [searchParams, setSearchParams] = useState({
    PGM_GRP_NM: '',
    USE_YN: ''
  });

  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // 팝업 훅
  const { openPopup } = usePopup();

  // 프로그램 그룹 목록 로드
  const loadProgramGroups = useCallback(async () => {
    console.log('loadProgramGroups 호출됨, 파라미터:', searchParams);
    setLoading(true);
    try {
      const response = await ProgramGroupService.getProgramGroupList(searchParams);
      console.log('API 응답:', response);
      console.log('응답 타입:', typeof response);
      console.log('response.success:', response.success);
      console.log('response.data 타입:', typeof response.data);
      console.log('response.data:', response.data);
      console.log('Array.isArray(response.data):', Array.isArray(response.data));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('프로그램 그룹 목록 설정:', response.data);
        setProgramGroups(response.data);
      } else {
        console.error('프로그램 그룹 목록 로드 실패:', response.message);
        console.error('응답 데이터 타입:', typeof response.data);
        console.error('응답 데이터:', response.data);
        setProgramGroups([]);
      }
    } catch (error: any) {
      console.error('프로그램 그룹 목록 로드 실패:', error);
      showToast(`프로그램 그룹 목록 로드 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
      setProgramGroups([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 초기 로드
  useEffect(() => {
    loadProgramGroups();
  }, []);

  // 팝업 메시지 리스너
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      console.log('=== SYS1001M00 팝업 메시지 수신 ===');
      console.log('이벤트 데이터:', event.data);
      console.log('이벤트 타입:', event.data.type);
      console.log('프로그램 데이터:', event.data.data);
      console.log('PGM_ID:', event.data.PGM_ID);
      
      if (event.data.type === 'SELECTED_PROGRAMS' && event.data.data && Array.isArray(event.data.data)) {
        console.log('✅ 프로그램 선택 이벤트 감지됨');
        console.log('선택된 프로그램 개수:', event.data.data.length);
        console.log('선택된 프로그램 상세:', event.data.data);
        
        if (!selectedGroup?.pgmGrpId) {
          console.log('❌ 프로그램 그룹이 선택되지 않음');
          showToast('프로그램 그룹이 선택되지 않았습니다.', 'warning');
          return;
        }

        console.log('현재 선택된 그룹:', selectedGroup);
        console.log('그룹 ID:', selectedGroup.pgmGrpId);

        try {
          // 선택된 프로그램 ID만 추출
          const programIds = event.data.data.map((p: any) => p.PGM_ID);
          const addedCount = await ProgramGroupService.addProgramsToGroup(selectedGroup.pgmGrpId, programIds);
          showToast(`${addedCount}개의 프로그램이 추가되었습니다.`, 'success');
          // 프로그램 목록 다시 조회
          loadPrograms(selectedGroup.pgmGrpId);
        } catch (error: any) {
          console.error('❌ 프로그램 추가 실패:', error);
          showToast('프로그램 추가에 실패했습니다.', 'error');
        }
      } else {
        console.log('❌ 프로그램 선택 이벤트가 아님 또는 프로그램 데이터 없음');
        console.log('예상 타입: SELECTED_PROGRAMS, 실제 타입:', event.data.type);
        console.log('예상 데이터: data (배열), 실제 데이터 키:', Object.keys(event.data));
        console.log('data가 배열인지 확인:', Array.isArray(event.data.data));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [selectedGroup]);

  // 데이터 변경 시 컬럼 크기 조정
  useEffect(() => {
    if (programGroupGridRef.current?.api) {
      programGroupGridRef.current.api.sizeColumnsToFit();
    }
  }, [programGroups]);

  useEffect(() => {
    if (programGridRef.current?.api) {
      programGridRef.current.api.sizeColumnsToFit();
    }
  }, [programs]);

  // 검색 조건 변경 시 자동 조회
  useEffect(() => {
    if (searchParams.PGM_GRP_NM !== '' || searchParams.USE_YN !== '') {
      loadProgramGroups();
    }
  }, [searchParams]);

  // 조회 조건 변경 핸들러
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 엔터키 입력 시 자동조회
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadProgramGroups();
    }
  };

  // 프로그램 목록 로드
  const loadPrograms = useCallback(async (groupId?: string) => {
    console.log('loadPrograms 호출됨, groupId:', groupId);
    
    if (!groupId) {
      console.log('groupId가 없어서 programs를 빈 배열로 설정');
      setPrograms([]);
      return;
    }
    
    try {
      const response = await ProgramGroupService.getProgramGroupPrograms(groupId);
      console.log('프로그램 목록 API 응답:', response);
      console.log('response.success:', response.success);
      console.log('response.data 타입:', typeof response.data);
      console.log('response.data:', response.data);
      console.log('Array.isArray(response.data):', Array.isArray(response.data));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('프로그램 목록 설정:', response.data);
        setPrograms(response.data);
      } else {
        console.error('프로그램 목록 로드 실패:', response.message);
        console.error('응답 데이터 타입:', typeof response.data);
        console.error('응답 데이터:', response.data);
        setPrograms([]);
      }
    } catch (error: any) {
      console.error('프로그램 목록 로드 실패:', error);
      setPrograms([]);
    }
  }, []);

  // 검색 버튼 클릭
  const handleSearch = () => {
    loadProgramGroups();
  };

  // AG-Grid 이벤트 핸들러
  const onProgramGroupSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const group = selectedRows[0];
      try {
        console.log('=== AG-Grid 선택 이벤트 시작 ===');
        console.log('선택한 그룹:', group);
        console.log('요청할 groupId:', group.pgmGrpId);
        
        ProgramGroupService.getProgramGroupDetail(group.pgmGrpId).then(response => {
          console.log('API 응답:', response);
          
          if (response.success) {
            console.log('응답 데이터:', response.data);
            setSelectedGroup(response.data);
            setIsNewGroup(false);
            loadPrograms(group.pgmGrpId);
          } else {
            console.error('API 응답 실패:', response.message);
            showToast(response.message, 'error');
          }
        }).catch(error => {
          console.error('프로그램 그룹 상세 조회 실패:', error);
          showToast('프로그램 그룹 상세 조회에 실패했습니다.', 'error');
        });
      } catch (error: any) {
        console.error('프로그램 그룹 상세 조회 실패:', error);
        showToast('프로그램 그룹 상세 조회에 실패했습니다.', 'error');
      }
    } else {
      setSelectedGroup(null);
      setPrograms([]);
    }
  };

  const onProgramSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.pgmId);
    setSelectedPrograms(selectedIds);
    console.log('선택된 프로그램들:', selectedIds);
  };

  const onProgramGroupGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onProgramGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // 프로그램 그룹 선택 (기존 함수 유지)
  const handleSelectGroup = async (group: ProgramGroup) => {
    try {
      console.log('=== 그리드 클릭 이벤트 시작 ===');
      console.log('클릭한 그룹:', group);
      console.log('요청할 groupId:', group.pgmGrpId);
      
      const response = await ProgramGroupService.getProgramGroupDetail(group.pgmGrpId);
      console.log('API 응답:', response);
      
      if (response.success) {
        console.log('응답 데이터:', response.data);
        setSelectedGroup(response.data);
        setIsNewGroup(false);
        loadPrograms(group.pgmGrpId);
      } else {
        console.error('API 응답 실패:', response.message);
        showToast(response.message, 'error');
      }
    } catch (error: any) {
      console.error('프로그램 그룹 상세 조회 실패:', error);
      showToast('프로그램 그룹 상세 조회에 실패했습니다.', 'error');
    }
  };

  // 프로그램 그룹 저장
  const handleSaveGroup = async () => {
    if (!selectedGroup) return;
    
    // 필수 입력 검증
    if (!selectedGroup.pgmGrpNm) {
      showToast('프로그램 그룹명을 입력해주세요.', 'warning');
      return;
    }
    if (!selectedGroup.useYn) {
      showToast('사용 여부를 선택해주세요.', 'warning');
      return;
    }
    
    try {
      const response = await ProgramGroupService.saveProgramGroup(selectedGroup);
      if (response.success) {
        showToast('저장되었습니다.', 'success');
        loadProgramGroups();
        // 저장 후 상세 정보 다시 조회
        if (selectedGroup.pgmGrpId) {
          const detailResponse = await ProgramGroupService.getProgramGroupDetail(selectedGroup.pgmGrpId);
          if (detailResponse.success) {
            setSelectedGroup(detailResponse.data);
          }
        }
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      console.error('프로그램 그룹 저장 실패:', error);
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  // 신규 버튼 클릭
  const handleNew = () => {
    setSelectedGroup({
      pgmGrpId: '',
      pgmGrpNm: '',
      useYn: 'Y'
    });
    setIsNewGroup(true);
    setPrograms([]);
    setSelectedPrograms([]);
  };

  // 프로그램 그룹 복사
  const handleCopyGroup = async (group: ProgramGroup) => {
    showConfirm({
      message: '프로그램 그룹을 복사하시겠습니까?',
      type: 'info',
      onConfirm: async () => {
        try {
          const response = await ProgramGroupService.copyProgramGroup(group.pgmGrpId);
          
          if (response.success) {
            showToast('프로그램 그룹이 복사되었습니다.', 'success');
            loadProgramGroups();
          } else {
            showToast(response.message, 'error');
          }
        } catch (error: any) {
          console.error('프로그램 그룹 복사 실패:', error);
          showToast('프로그램 그룹 복사에 실패했습니다.', 'error');
        }
      }
    });
  };

  // 프로그램 선택 체크박스
  const handleProgramSelect = (programId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrograms(prev => [...prev, programId]);
    } else {
      setSelectedPrograms(prev => prev.filter(id => id !== programId));
    }
  };

  // 프로그램 추가
  const handleAddPrograms = () => {
    console.log('=== SYS1001M00 프로그램 추가 버튼 클릭 ===');
    console.log('선택된 그룹:', selectedGroup);
    
    if (!selectedGroup?.pgmGrpId) {
      console.log('❌ 프로그램 그룹이 선택되지 않음');
      showToast('프로그램 그룹을 선택해주세요.', 'warning');
      return;
    }

    console.log('✅ 팝업 열기 시작');
    console.log('팝업 URL:', `/popup/sys/SYS1010D00?PGM_GRP_ID=${selectedGroup.pgmGrpId}`);
    
    // 프로그램 검색 팝업 열기
    openPopup({
      url: `/popup/sys/SYS1010D00?PGM_GRP_ID=${selectedGroup.pgmGrpId}`,
      size: 'custom',
      position: 'center',
      options: {
        width: 850,
        height: 430,
        resizable: false,
        scrollbars: false
      }
    });
    
    console.log('✅ 팝업 열기 완료');
  };

  // 프로그램 삭제
  const handleDeletePrograms = async () => {
    if (!selectedGroup?.pgmGrpId) {
      showToast('프로그램 그룹을 선택해주세요.', 'warning');
      return;
    }

    if (selectedPrograms.length === 0) {
      showToast('삭제할 프로그램을 선택해주세요.', 'warning');
      return;
    }
    
    showConfirm({
      message: '선택한 프로그램을 삭제하시겠습니까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const response = await ProgramGroupService.removeProgramsFromGroup(
            selectedGroup.pgmGrpId,
            selectedPrograms
          );
          
          if (response.success) {
            showToast('프로그램이 삭제되었습니다.', 'success');
            setSelectedPrograms([]);
            // 프로그램 목록 다시 조회
            loadPrograms(selectedGroup.pgmGrpId);
          } else {
            showToast(response.message, 'error');
          }
        } catch (error: any) {
          console.error('프로그램 삭제 실패:', error);
          showToast('프로그램 삭제에 실패했습니다.', 'error');
        }
      }
    });
  };

  return (
    <div className="mdi">
      
      {/* 조회부 */}
      <div className="search-div mb-4 ">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[120px]">그룹명/코드</th>
              <td className="search-td w-[20%]">
                <input 
                  type="text" 
                  name="PGM_GRP_NM"
                  className="input-base input-default w-full"
                  value={searchParams.PGM_GRP_NM}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="그룹명 또는 코드 입력"
                />
              </td>
              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select 
                  name="USE_YN"
                  className="combo-base w-full min-w-[80px]"
                  value={searchParams.USE_YN}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                >
                  <option value="">전체</option>
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search" onClick={handleSearch}>조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
     <div className="flex w-full h-[calc(100vh-200px)] gap-4">
  {/* 왼쪽: 프로그램 그룹 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">프로그램 그룹 목록</div>
    {/* 왼쪽 그리드 wrapper */}
    <div className="gridbox-div flex-1 overflow-auto ag-theme-alpine">
      <AgGridReact
        ref={programGroupGridRef}
        rowData={programGroups}
        columnDefs={programGroupColDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          suppressSizeToFit: false,
        }}
        rowSelection='single'
        onSelectionChanged={onProgramGroupSelectionChanged}
        onGridReady={onProgramGroupGridReady}
        loadingOverlayComponent={() => <div className="text-center py-4">로딩 중...</div>}
        noRowsOverlayComponent={() => <div className="text-center py-4">조회된 정보가 없습니다.</div>}
        suppressRowClickSelection={false}
        animateRows={true}
        rowHeight={32}
        headerHeight={40}
      />
    </div>

    {/* 하단 입력 폼 */}
    <div className="box-wrap mt-2">
      <div className="tit_area">
        <h3>프로그램 그룹 정보</h3>
      </div>
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">프로그램 그룹명</th>
            <td className="form-td">
              <input 
                className="input-base input-default" 
                value={selectedGroup?.pgmGrpNm || ''}
                onChange={e => setSelectedGroup(prev => prev ? { ...prev, pgmGrpNm: e.target.value } : null)}
              />
            </td>
            <th className="form-th w-[130px] required">사용여부</th>
            <td className="form-td">
              <select
                className="combo-base w-full"
                value={selectedGroup?.useYn || ''}
                onChange={e => setSelectedGroup(prev => prev ? { ...prev, useYn: e.target.value } : null)}
              >
                <option value="">선택</option>
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-etc" onClick={handleNew}>신규</button>
      <button className="btn-base btn-act" onClick={handleSaveGroup}>저장</button>
    </div>
  </div>

  {/* 오른쪽: 프로그램 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">프로그램 목록</div>
    {/* 오른쪽 그리드 wrapper */}
    <div className="gridbox-div flex-1 overflow-auto mb-4 ag-theme-alpine">
      <AgGridReact
        ref={programGridRef}
        rowData={programs}
        columnDefs={programColDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          suppressSizeToFit: false,
        }}
        rowSelection='multiple'
        onSelectionChanged={onProgramSelectionChanged}
        onGridReady={onProgramGridReady}
        loadingOverlayComponent={() => <div className="text-center py-4">로딩 중...</div>}
        noRowsOverlayComponent={() => <div className="text-center py-4">조회된 정보가 없습니다.</div>}
        suppressRowClickSelection={false}
        animateRows={true}
        rowHeight={32}
        headerHeight={40}
      />
    </div>
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-delete" onClick={handleDeletePrograms}>삭제</button>
      <button className="btn-base btn-etc" onClick={handleAddPrograms}>추가</button>
    </div>
  </div>
  </div>
  </div>
  );
} 