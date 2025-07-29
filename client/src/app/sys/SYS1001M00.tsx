/**
 * SYS1001M00 - ?�로그램 그룹 관�??�면
 *
 * 주요 기능:
 * - ?�로그램 그룹 목록 조회 �?검??
 * - ?�로그램 그룹 ?�규 ?�록 �??�정
 * - ?�로그램 그룹�??�로그램 ?�결 관�?
 * - ?�로그램 그룹 복사 기능
 * - ?�로그램 검??�?그룹??추�?/?�거
 *
 * API ?�동:
 * - GET /api/sys/program-groups - ?�로그램 그룹 목록 조회
 * - POST /api/sys/program-groups - ?�로그램 그룹 ?�??
 * - GET /api/sys/program-groups/:pgmGrpId/programs - 그룹�??�로그램 조회
 * - POST /api/sys/program-groups/:pgmGrpId/programs - 그룹�??�로그램 ?�??
 * - POST /api/sys/program-groups/:pgmGrpId/copy - ?�로그램 그룹 복사
 * - GET /api/sys/programs - ?�체 ?�로그램 목록 조회 (검?�용)
 *
 * ?�태 관�?
 * - ?�로그램 그룹 목록 �??�택??그룹
 * - 그룹�??�로그램 목록 �??�택???�로그램??
 * - 검??조건 (그룹�? ?�용?��?)
 * - ?�규/?�정 모드 ?�태
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (그룹�? ?�용?��?)
 * - ?�로그램 그룹 목록 ?�이�?(AG-Grid)
 * - ?�로그램 그룹 ?�세 ?�보 ?�력 ??
 * - 그룹�??�로그램 목록 ?�이�?(체크박스 ?�택)
 * - ?�???�규/복사/?�로그램추�?/?�로그램??�� 버튼
 *
 * ?��? ?�면:
 * - SYS1000M00: ?�로그램 관�?(?�로그램 ?�보)
 * - SYS1002M00: 메뉴�??�로그램 관�?(그룹 ?�결)
 * - SYS1003M00: ?�용????�� 관�?(그룹 권한)
 * - SYS1010D00: ?�로그램 검???�업
 *
 * ?�이??구조:
 * - ProgramGroup: ?�로그램 그룹 ?�보 (pgmGrpId, pgmGrpNm, useYn ??
 * - ProgramGroupDetail: ?�로그램 그룹 ?�세 ?�보 (그룹 ?�보 + ?�로그램 목록)
 * - ProgramGroupProgram: 그룹???�결???�로그램 ?�보 (pgmId, pgmNm, pgmDivNm, bizDivNm, useYn ??
 *
 * ?�이?�항:
 * - ?�로그램 그룹 복사 ??기존 그룹명에 "_COPY" ?��???추�?
 * - ?�로그램 검?��? ?�업???�해 별도 ?�면?�서 처리
 * - 그룹�??�로그램?� 체크박스�??�중 ?�택 가??
 * - URL ?�라미터�??�한 초기 그룹 ?�택 지??
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

  // AG-Grid 컬럼 ?�의 - ?�로그램 그룹
  const [programGroupColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '그룹코드', field: 'pgmGrpId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '그룹�?, field: 'pgmGrpNm', width: 180, flex: 1.2, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
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
    { headerName: '?�용?��?', field: 'useYn', width: 80, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '?�용' : '미사?? },
  ]);

  // AG-Grid 컬럼 ?�의 - ?�로그램
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
    { headerName: '?�로그램ID', field: 'pgmId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�로그램�?, field: 'pgmNm', width: 200, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '구분', field: 'pgmDivNm', width: 90, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�무', field: 'bizDivNm', width: 90, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�용?��?', field: 'useYn', width: 90, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '?�용' : '미사?? },
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

  // ?�업 ??
  const { openPopup } = usePopup();

  // ?�로그램 그룹 목록 로드
  const loadProgramGroups = useCallback(async () => {
    console.log('loadProgramGroups ?�출?? ?�라미터:', searchParams);
    setLoading(true);
    try {
      const response = await ProgramGroupService.getProgramGroupList(searchParams);
      console.log('API ?�답:', response);
      console.log('?�답 ?�??', typeof response);
      console.log('response.success:', response.success);
      console.log('response.data ?�??', typeof response.data);
      console.log('response.data:', response.data);
      console.log('Array.isArray(response.data):', Array.isArray(response.data));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('?�로그램 그룹 목록 ?�정:', response.data);
        setProgramGroups(response.data);
      } else {
        console.error('?�로그램 그룹 목록 로드 ?�패:', response.message);
        console.error('?�답 ?�이???�??', typeof response.data);
        console.error('?�답 ?�이??', response.data);
        setProgramGroups([]);
      }
    } catch (error: any) {
      console.error('?�로그램 그룹 목록 로드 ?�패:', error);
      showToast(`?�로그램 그룹 목록 로드 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
      setProgramGroups([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 초기 로드
  useEffect(() => {
    loadProgramGroups();
  }, []);

  // ?�업 메시지 리스??
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      console.log('=== SYS1001M00 ?�업 메시지 ?�신 ===');
      console.log('?�벤???�이??', event.data);
      console.log('?�벤???�??', event.data.type);
      console.log('?�로그램 ?�이??', event.data.data);
      console.log('PGM_ID:', event.data.PGM_ID);
      
      if (event.data.type === 'SELECTED_PROGRAMS' && event.data.data && Array.isArray(event.data.data)) {
        console.log('???�로그램 ?�택 ?�벤??감�???);
        console.log('?�택???�로그램 개수:', event.data.data.length);
        console.log('?�택???�로그램 ?�세:', event.data.data);
        
        if (!selectedGroup?.pgmGrpId) {
          console.log('???�로그램 그룹???�택?��? ?�음');
          showToast('?�로그램 그룹???�택?��? ?�았?�니??', 'warning');
          return;
        }

        console.log('?�재 ?�택??그룹:', selectedGroup);
        console.log('그룹 ID:', selectedGroup.pgmGrpId);

        try {
          // ?�택???�로그램 ID�?추출
          const programIds = event.data.data.map((p: any) => p.PGM_ID);
          const addedCount = await ProgramGroupService.addProgramsToGroup(selectedGroup.pgmGrpId, programIds);
          showToast(`${addedCount}개의 ?�로그램??추�??�었?�니??`, 'success');
          // ?�로그램 목록 ?�시 조회
          loadPrograms(selectedGroup.pgmGrpId);
        } catch (error: any) {
          console.error('???�로그램 추�? ?�패:', error);
          showToast('?�로그램 추�????�패?�습?�다.', 'error');
        }
      } else {
        console.log('???�로그램 ?�택 ?�벤?��? ?�님 ?�는 ?�로그램 ?�이???�음');
        console.log('?�상 ?�?? SELECTED_PROGRAMS, ?�제 ?�??', event.data.type);
        console.log('?�상 ?�이?? data (배열), ?�제 ?�이????', Object.keys(event.data));
        console.log('data가 배열?��? ?�인:', Array.isArray(event.data.data));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [selectedGroup]);

  // ?�이??변�???컬럼 ?�기 조정
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

  // 검??조건 변�????�동 조회
  useEffect(() => {
    if (searchParams.PGM_GRP_NM !== '' || searchParams.USE_YN !== '') {
      loadProgramGroups();
    }
  }, [searchParams]);

  // 조회 조건 변�??�들??
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ?�터???�력 ???�동조회
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadProgramGroups();
    }
  };

  // ?�로그램 목록 로드
  const loadPrograms = useCallback(async (groupId?: string) => {
    console.log('loadPrograms ?�출?? groupId:', groupId);
    
    if (!groupId) {
      console.log('groupId가 ?�어??programs�?�?배열�??�정');
      setPrograms([]);
      return;
    }
    
    try {
      const response = await ProgramGroupService.getProgramGroupPrograms(groupId);
      console.log('?�로그램 목록 API ?�답:', response);
      console.log('response.success:', response.success);
      console.log('response.data ?�??', typeof response.data);
      console.log('response.data:', response.data);
      console.log('Array.isArray(response.data):', Array.isArray(response.data));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('?�로그램 목록 ?�정:', response.data);
        setPrograms(response.data);
      } else {
        console.error('?�로그램 목록 로드 ?�패:', response.message);
        console.error('?�답 ?�이???�??', typeof response.data);
        console.error('?�답 ?�이??', response.data);
        setPrograms([]);
      }
    } catch (error: any) {
      console.error('?�로그램 목록 로드 ?�패:', error);
      setPrograms([]);
    }
  }, []);

  // 검??버튼 ?�릭
  const handleSearch = () => {
    loadProgramGroups();
  };

  // AG-Grid ?�벤???�들??
  const onProgramGroupSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const group = selectedRows[0];
      try {
        console.log('=== AG-Grid ?�택 ?�벤???�작 ===');
        console.log('?�택??그룹:', group);
        console.log('?�청??groupId:', group.pgmGrpId);
        
        ProgramGroupService.getProgramGroupDetail(group.pgmGrpId).then(response => {
          console.log('API ?�답:', response);
          
          if (response.success) {
            console.log('?�답 ?�이??', response.data);
            setSelectedGroup(response.data);
            setIsNewGroup(false);
            loadPrograms(group.pgmGrpId);
          } else {
            console.error('API ?�답 ?�패:', response.message);
            showToast(response.message, 'error');
          }
        }).catch(error => {
          console.error('?�로그램 그룹 ?�세 조회 ?�패:', error);
          showToast('?�로그램 그룹 ?�세 조회???�패?�습?�다.', 'error');
        });
      } catch (error: any) {
        console.error('?�로그램 그룹 ?�세 조회 ?�패:', error);
        showToast('?�로그램 그룹 ?�세 조회???�패?�습?�다.', 'error');
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
    console.log('?�택???�로그램??', selectedIds);
  };

  const onProgramGroupGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onProgramGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?�로그램 그룹 ?�택 (기존 ?�수 ?��?)
  const handleSelectGroup = async (group: ProgramGroup) => {
    try {
      console.log('=== 그리???�릭 ?�벤???�작 ===');
      console.log('?�릭??그룹:', group);
      console.log('?�청??groupId:', group.pgmGrpId);
      
      const response = await ProgramGroupService.getProgramGroupDetail(group.pgmGrpId);
      console.log('API ?�답:', response);
      
      if (response.success) {
        console.log('?�답 ?�이??', response.data);
        setSelectedGroup(response.data);
        setIsNewGroup(false);
        loadPrograms(group.pgmGrpId);
      } else {
        console.error('API ?�답 ?�패:', response.message);
        showToast(response.message, 'error');
      }
    } catch (error: any) {
      console.error('?�로그램 그룹 ?�세 조회 ?�패:', error);
      showToast('?�로그램 그룹 ?�세 조회???�패?�습?�다.', 'error');
    }
  };

  // ?�로그램 그룹 ?�??
  const handleSaveGroup = async () => {
    if (!selectedGroup) return;
    
    // ?�수 ?�력 검�?
    if (!selectedGroup.pgmGrpNm) {
      showToast('?�로그램 그룹명을 ?�력?�주?�요.', 'warning');
      return;
    }
    if (!selectedGroup.useYn) {
      showToast('?�용 ?��?�??�택?�주?�요.', 'warning');
      return;
    }
    
    try {
      const response = await ProgramGroupService.saveProgramGroup(selectedGroup);
      if (response.success) {
        showToast('?�?�되?�습?�다.', 'success');
        loadProgramGroups();
        // ?�?????�세 ?�보 ?�시 조회
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
      console.error('?�로그램 그룹 ?�???�패:', error);
      showToast('?�?�에 ?�패?�습?�다.', 'error');
    }
  };

  // ?�규 버튼 ?�릭
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

  // ?�로그램 그룹 복사
  const handleCopyGroup = async (group: ProgramGroup) => {
    showConfirm({
      message: '?�로그램 그룹??복사?�시겠습?�까?',
      type: 'info',
      onConfirm: async () => {
        try {
          const response = await ProgramGroupService.copyProgramGroup(group.pgmGrpId);
          
          if (response.success) {
            showToast('?�로그램 그룹??복사?�었?�니??', 'success');
            loadProgramGroups();
          } else {
            showToast(response.message, 'error');
          }
        } catch (error: any) {
          console.error('?�로그램 그룹 복사 ?�패:', error);
          showToast('?�로그램 그룹 복사???�패?�습?�다.', 'error');
        }
      }
    });
  };

  // ?�로그램 ?�택 체크박스
  const handleProgramSelect = (programId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrograms(prev => [...prev, programId]);
    } else {
      setSelectedPrograms(prev => prev.filter(id => id !== programId));
    }
  };

  // ?�로그램 추�?
  const handleAddPrograms = () => {
    console.log('=== SYS1001M00 ?�로그램 추�? 버튼 ?�릭 ===');
    console.log('?�택??그룹:', selectedGroup);
    
    if (!selectedGroup?.pgmGrpId) {
      console.log('???�로그램 그룹???�택?��? ?�음');
      showToast('?�로그램 그룹???�택?�주?�요.', 'warning');
      return;
    }

    console.log('???�업 ?�기 ?�작');
    console.log('?�업 URL:', `/popup/sys/SYS1010D00?PGM_GRP_ID=${selectedGroup.pgmGrpId}`);
    
    // ?�로그램 검???�업 ?�기
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
    
    console.log('???�업 ?�기 ?�료');
  };

  // ?�로그램 ??��
  const handleDeletePrograms = async () => {
    if (!selectedGroup?.pgmGrpId) {
      showToast('?�로그램 그룹???�택?�주?�요.', 'warning');
      return;
    }

    if (selectedPrograms.length === 0) {
      showToast('??��???�로그램???�택?�주?�요.', 'warning');
      return;
    }
    
    showConfirm({
      message: '?�택???�로그램????��?�시겠습?�까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const response = await ProgramGroupService.removeProgramsFromGroup(
            selectedGroup.pgmGrpId,
            selectedPrograms
          );
          
          if (response.success) {
            showToast('?�로그램????��?�었?�니??', 'success');
            setSelectedPrograms([]);
            // ?�로그램 목록 ?�시 조회
            loadPrograms(selectedGroup.pgmGrpId);
          } else {
            showToast(response.message, 'error');
          }
        } catch (error: any) {
          console.error('?�로그램 ??�� ?�패:', error);
          showToast('?�로그램 ??��???�패?�습?�다.', 'error');
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
              <th className="search-th w-[120px]">그룹�?코드</th>
              <td className="search-td w-[20%]">
                <input 
                  type="text" 
                  name="PGM_GRP_NM"
                  className="input-base input-default w-full"
                  value={searchParams.PGM_GRP_NM}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="그룹�??�는 코드 ?�력"
                />
              </td>
              <th className="search-th w-[100px]">?�용?��?</th>
              <td className="search-td w-[10%]">
                <select 
                  name="USE_YN"
                  className="combo-base w-full min-w-[80px]"
                  value={searchParams.USE_YN}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                >
                  <option value="">?�체</option>
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
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
  {/* ?�쪽: ?�로그램 그룹 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">?�로그램 그룹 목록</div>
    {/* ?�쪽 그리??wrapper */}
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
        loadingOverlayComponent={() => <div className="text-center py-4">로딩 �?..</div>}
        noRowsOverlayComponent={() => <div className="text-center py-4">조회???�보가 ?�습?�다.</div>}
        suppressRowClickSelection={false}
        animateRows={true}
        rowHeight={32}
        headerHeight={40}
      />
    </div>

    {/* ?�단 ?�력 ??*/}
    <div className="box-wrap mt-2">
      <div className="tit_area">
        <h3>?�로그램 그룹 ?�보</h3>
      </div>
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">?�로그램 그룹�?/th>
            <td className="form-td">
              <input 
                className="input-base input-default" 
                value={selectedGroup?.pgmGrpNm || ''}
                onChange={e => setSelectedGroup(prev => prev ? { ...prev, pgmGrpNm: e.target.value } : null)}
              />
            </td>
            <th className="form-th w-[130px] required">?�용?��?</th>
            <td className="form-td">
              <select
                className="combo-base w-full"
                value={selectedGroup?.useYn || ''}
                onChange={e => setSelectedGroup(prev => prev ? { ...prev, useYn: e.target.value } : null)}
              >
                <option value="">?�택</option>
                <option value="Y">?�용</option>
                <option value="N">미사??/option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-etc" onClick={handleNew}>?�규</button>
      <button className="btn-base btn-act" onClick={handleSaveGroup}>?�??/button>
    </div>
  </div>

  {/* ?�른�? ?�로그램 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">?�로그램 목록</div>
    {/* ?�른�?그리??wrapper */}
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
        loadingOverlayComponent={() => <div className="text-center py-4">로딩 �?..</div>}
        noRowsOverlayComponent={() => <div className="text-center py-4">조회???�보가 ?�습?�다.</div>}
        suppressRowClickSelection={false}
        animateRows={true}
        rowHeight={32}
        headerHeight={40}
      />
    </div>
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-delete" onClick={handleDeletePrograms}>??��</button>
      <button className="btn-base btn-etc" onClick={handleAddPrograms}>추�?</button>
    </div>
  </div>
  </div>
  </div>
  );
} 

