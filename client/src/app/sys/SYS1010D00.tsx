/**
 * SYS1010D00 - 프로그램 검색 팝업 화면
 *
 * 주요 기능:
 * - 프로그램 목록 조회 및 검색
 * - 프로그램 다중/단일 선택
 * - 선택된 프로그램을 부모 화면으로 전달
 * - 팝업 형태로 동작하여 부모 화면과 분리
 *
 * API 연동:
 * - GET /api/sys/programs - 프로그램 목록 조회
 * - POST /api/common/search - 공통코드 조회 (프로그램구분: 305, 업무구분: 303)
 *
 * 상태 관리:
 * - 프로그램 목록 및 선택된 프로그램들
 * - 검색 조건 (프로그램키워드, 프로그램구분, 업무구분)
 * - 로딩 상태 및 팝업 제어
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (프로그램키워드, 프로그램구분, 업무구분)
 * - 프로그램 목록 테이블 (AG-Grid)
 * - 체크박스 다중 선택 (multiple=true인 경우)
 * - 더블클릭 단일 선택
 * - 선택/취소/닫기 버튼
 *
 * 연관 화면:
 * - SYS1001M00: 프로그램 그룹 관리 (프로그램 추가)
 * - SYS1002M00: 메뉴별 프로그램 관리 (프로그램 연결)
 * - SYS1000M00: 프로그램 관리 (프로그램 정보)
 *
 * 데이터 구조:
 * - Program: 프로그램 정보 (PGM_ID, PGM_NM, PGM_DIV_CD, BIZ_DIV_CD, USE_YN 등)
 * - SYS1010D00Props: 팝업 속성 (onSelect, multiple)
 *
 * 특이사항:
 * - 팝업 형태로 동작하여 부모 화면에서 호출
 * - URL 파라미터를 통한 초기 설정 (PGM_ID, PGM_GRP_ID)
 * - 다중 선택/단일 선택 모드 지원
 * - 선택된 프로그램은 부모 화면의 콜백 함수로 전달
 * - 더블클릭 시 즉시 선택 완료
 * - 체크박스 선택 시 다중 선택 가능
 *
 * 사용 예시:
 * - SYS1001M00에서 프로그램 그룹에 프로그램 추가 시
 * - SYS1002M00에서 메뉴에 프로그램 연결 시
 * - 기타 프로그램 선택이 필요한 모든 화면
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../common/common.css';
import { useToast } from '@/contexts/ToastContext';

interface Program {
  PGM_ID: string;
  PGM_NM: string;
  PGM_DIV_CD: string;
  BIZ_DIV_CD: string;
  USE_YN: string;
  SORT_SEQ?: number;
}

interface SYS1010D00Props {
  onSelect?: (selectedPrograms: Program[]) => void;
  multiple?: boolean;
}

export default function SYS1010D00({ onSelect, multiple = true }: SYS1010D00Props) {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    PGM_KWD: '',
    PGM_DIV_CD: '',
    BIZ_DIV_CD: ''
  });

  // URL 파라미터에서 PGM_ID 가져오기
  const [popupPgmId, setPopupPgmId] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPopupPgmId(urlParams.get('PGM_ID'));
  }, []);

  // AG-Grid 관련
  const gridRef = useRef<AgGridReact>(null);

  // AG-Grid 컬럼 정의
  const columnDefs: ColDef[] = [
    ...(multiple ? [{
      headerName: '',
      field: 'checkbox',
      width: 60,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left' as const,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
    }] : []),
    {
      headerName: '프로그램ID',
      field: 'PGM_ID',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: '프로그램명',
      field: 'PGM_NM',
      flex: 2,
      minWidth: 180,
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: '구분',
      field: 'PGM_DIV_NM',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    },
    {
      headerName: '업무',
      field: 'BIZ_DIV_CD',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    }
  ];

  // 프로그램 목록 로드
  const loadPrograms = useCallback(async (params?: any) => {
    console.log('loadPrograms 호출됨, 파라미터:', params);
    setLoading(true);
    try {
      // URL 파라미터에서 PGM_GRP_ID 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const pgmGrpId = urlParams.get('PGM_GRP_ID');
      
      // API 호출을 위한 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      if (params?.PGM_KWD) queryParams.append('PGM_KWD', params.PGM_KWD);
      if (params?.PGM_DIV_CD) queryParams.append('PGM_DIV_CD', params.PGM_DIV_CD);
      if (params?.BIZ_DIV_CD) queryParams.append('BIZ_DIV_CD', params.BIZ_DIV_CD);
      if (pgmGrpId) queryParams.append('PGM_GRP_ID', pgmGrpId);
      
      const response = await fetch(`/api/sys/programs/search?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setPrograms(result.data);
        // 데이터 로드 후 컬럼 자동 맞춤
        setTimeout(() => {
          if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.sizeColumnsToFit();
          }
        }, 0);
      } else {
        console.error('프로그램 목록 로드 실패:', result.message);
        showToast(`프로그램 목록 로드 실패: ${result.message}`, 'error');
      }
    } catch (error: any) {
      console.error('프로그램 목록 로드 실패:', error);
      showToast(`프로그램 목록 로드 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPrograms(searchParams);
  }, []);

  // 검색 버튼 클릭
  const handleSearch = () => {
    console.log('조회 버튼 클릭됨');
    console.log('검색 파라미터:', searchParams);
    loadPrograms(searchParams);
  };

  // AG-Grid 이벤트 핸들러
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedPrograms(selectedRows);
  };

  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  };

  // 행 더블클릭 핸들러
  const handleRowDoubleClick = (event: any) => {
    const row = event.data;
    if (!row) return;
    // 부모 창에 메시지 전송 (팝업인 경우)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: [row],
        PGM_ID: popupPgmId // 팝업에서 받은 PGM_ID도 함께 보냄
      };
      window.opener.postMessage(messageData, '*');
      window.close();
    }
    // onSelect 콜백도 호출 (옵션)
    if (onSelect) {
      onSelect([row]);
    }
  };

  // 추가 버튼 클릭
  const handleAdd = () => {
    console.log('=== 추가 버튼 클릭 ===');
    console.log('선택된 프로그램 개수:', selectedPrograms.length);
    console.log('선택된 프로그램 데이터:', selectedPrograms);
    
    if (selectedPrograms.length === 0) {
      showToast('추가할 프로그램을 선택해주세요.', 'warning');
      return;
    }

    if (onSelect) {
      console.log('onSelect 콜백 호출');
      onSelect(selectedPrograms);
    }

    // 부모 창에 메시지 전송 (팝업인 경우)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: selectedPrograms,
        PGM_ID: popupPgmId // 추가: 팝업에서 받은 PGM_ID도 함께 보냄
      };
      console.log('부모 창으로 전송할 메시지:', messageData);
      window.opener.postMessage(messageData, '*');
      console.log('부모 창으로 메시지 전송 완료');
      window.close();
    }
  };

  // 팝업 닫기
  const handleClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  return (
    <div className='mdi' style={{ width: '850px', height: '430px', padding: '8px', minWidth: '850px' }}>
      {/* 🔍 조회 영역 */}
      <div className='search-div mb-2'>
        <table className='search-table w-full'>
          <tbody>
            <tr className='search-tr'>
              <th className='search-th w-[90px]'>프로그램 ID명</th>
              <td className='search-td w-[120px]'>
                <input
                  type='text'
                  className='input-base input-default w-full'
                  value={searchParams.PGM_KWD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_KWD: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label='프로그램 ID명 입력'
                />
              </td>
              <th className='search-th w-[60px]'>구분</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.PGM_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_DIV_CD: e.target.value }))}
                  aria-label='구분 선택'
                >
                  <option value="">선택</option>
                  <option value="화면">화면</option>
                  <option value="팝업">팝업</option>
                </select>
              </td>
              <th className='search-th w-[60px]'>업무</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.BIZ_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, BIZ_DIV_CD: e.target.value }))}
                  aria-label='업무 선택'
                >
                  <option value="">선택</option>
                  <option value="업무">업무</option>
                  <option value="시스템">시스템</option>
                </select>
              </td>
              <td className='search-td text-right w-[60px]'>
                <button type='button' className='btn-base btn-search text-xs px-2 py-1' onClick={handleSearch}>
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📋 타이틀 */}
      <div className='tit_area mb-1'>
        <h3 className='text-sm'>프로그램목록</h3>
      </div>

      {/* 📊 AG-Grid 영역 */}
      <div className='gridbox-div mb-2'>
        <div className='ag-theme-alpine' style={{ height: '300px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={programs}
            columnDefs={columnDefs}
            rowSelection={multiple ? 'multiple' : 'single'}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            loadingOverlayComponent={() => <div>로딩 중...</div>}
            noRowsOverlayComponent={() => <div>조회된 정보가 없습니다.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            pagination={false}
            domLayout="autoHeight"
            onRowDoubleClicked={handleRowDoubleClick}
            data-testid="program-search-grid"
          />
        </div>
      </div>

      {/* ⬇ 하단 버튼 */}
      <div className='flex justify-end gap-2 mt-2'>
        {onSelect && (
          <button type='button' className='btn-base btn-etc text-xs px-2 py-1' onClick={handleClose}>
            취소
          </button>
        )}
        <button type='button' className='btn-base btn-act text-xs px-2 py-1' onClick={handleAdd}>
          {multiple ? '추가' : '선택'}
        </button>
      </div>
    </div>
  );
} 