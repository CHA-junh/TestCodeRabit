/**
 * SYS1010D00 - ?�로그램 검???�업 ?�면
 *
 * 주요 기능:
 * - ?�로그램 목록 조회 �?검??
 * - ?�로그램 ?�중/?�일 ?�택
 * - ?�택???�로그램??부�??�면?�로 ?�달
 * - ?�업 ?�태�??�작?�여 부�??�면�?분리
 *
 * API ?�동:
 * - GET /api/sys/programs - ?�로그램 목록 조회
 * - POST /api/common/search - 공통코드 조회 (?�로그램구분: 305, ?�무구분: 303)
 *
 * ?�태 관�?
 * - ?�로그램 목록 �??�택???�로그램??
 * - 검??조건 (?�로그램?�워?? ?�로그램구분, ?�무구분)
 * - 로딩 ?�태 �??�업 ?�어
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (?�로그램?�워?? ?�로그램구분, ?�무구분)
 * - ?�로그램 목록 ?�이�?(AG-Grid)
 * - 체크박스 ?�중 ?�택 (multiple=true??경우)
 * - ?�블?�릭 ?�일 ?�택
 * - ?�택/취소/?�기 버튼
 *
 * ?��? ?�면:
 * - SYS1001M00: ?�로그램 그룹 관�?(?�로그램 추�?)
 * - SYS1002M00: 메뉴�??�로그램 관�?(?�로그램 ?�결)
 * - SYS1000M00: ?�로그램 관�?(?�로그램 ?�보)
 *
 * ?�이??구조:
 * - Program: ?�로그램 ?�보 (PGM_ID, PGM_NM, PGM_DIV_CD, BIZ_DIV_CD, USE_YN ??
 * - SYS1010D00Props: ?�업 ?�성 (onSelect, multiple)
 *
 * ?�이?�항:
 * - ?�업 ?�태�??�작?�여 부�??�면?�서 ?�출
 * - URL ?�라미터�??�한 초기 ?�정 (PGM_ID, PGM_GRP_ID)
 * - ?�중 ?�택/?�일 ?�택 모드 지??
 * - ?�택???�로그램?� 부�??�면??콜백 ?�수�??�달
 * - ?�블?�릭 ??즉시 ?�택 ?�료
 * - 체크박스 ?�택 ???�중 ?�택 가??
 *
 * ?�용 ?�시:
 * - SYS1001M00?�서 ?�로그램 그룹???�로그램 추�? ??
 * - SYS1002M00?�서 메뉴???�로그램 ?�결 ??
 * - 기�? ?�로그램 ?�택???�요??모든 ?�면
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

  // URL ?�라미터?�서 PGM_ID 가?�오�?
  const [popupPgmId, setPopupPgmId] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPopupPgmId(urlParams.get('PGM_ID'));
  }, []);

  // AG-Grid 관??
  const gridRef = useRef<AgGridReact>(null);

  // AG-Grid 컬럼 ?�의
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
      headerName: '?�로그램ID',
      field: 'PGM_ID',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: '?�로그램�?,
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
      headerName: '?�무',
      field: 'BIZ_DIV_CD',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    }
  ];

  // ?�로그램 목록 로드
  const loadPrograms = useCallback(async (params?: any) => {
    console.log('loadPrograms ?�출?? ?�라미터:', params);
    setLoading(true);
    try {
      // URL ?�라미터?�서 PGM_GRP_ID 가?�오�?
      const urlParams = new URLSearchParams(window.location.search);
      const pgmGrpId = urlParams.get('PGM_GRP_ID');
      
      // API ?�출???�한 쿼리 ?�라미터 구성
      const queryParams = new URLSearchParams();
      if (params?.PGM_KWD) queryParams.append('PGM_KWD', params.PGM_KWD);
      if (params?.PGM_DIV_CD) queryParams.append('PGM_DIV_CD', params.PGM_DIV_CD);
      if (params?.BIZ_DIV_CD) queryParams.append('BIZ_DIV_CD', params.BIZ_DIV_CD);
      if (pgmGrpId) queryParams.append('PGM_GRP_ID', pgmGrpId);
      
      const response = await fetch(`/api/sys/programs/search?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setPrograms(result.data);
        // ?�이??로드 ??컬럼 ?�동 맞춤
        setTimeout(() => {
          if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.sizeColumnsToFit();
          }
        }, 0);
      } else {
        console.error('?�로그램 목록 로드 ?�패:', result.message);
        showToast(`?�로그램 목록 로드 ?�패: ${result.message}`, 'error');
      }
    } catch (error: any) {
      console.error('?�로그램 목록 로드 ?�패:', error);
      showToast(`?�로그램 목록 로드 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPrograms(searchParams);
  }, []);

  // 검??버튼 ?�릭
  const handleSearch = () => {
    console.log('조회 버튼 ?�릭??);
    console.log('검???�라미터:', searchParams);
    loadPrograms(searchParams);
  };

  // AG-Grid ?�벤???�들??
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedPrograms(selectedRows);
  };

  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  };

  // ???�블?�릭 ?�들??
  const handleRowDoubleClick = (event: any) => {
    const row = event.data;
    if (!row) return;
    // 부�?창에 메시지 ?�송 (?�업??경우)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: [row],
        PGM_ID: popupPgmId // ?�업?�서 받�? PGM_ID???�께 보냄
      };
      window.opener.postMessage(messageData, '*');
      window.close();
    }
    // onSelect 콜백???�출 (?�션)
    if (onSelect) {
      onSelect([row]);
    }
  };

  // 추�? 버튼 ?�릭
  const handleAdd = () => {
    console.log('=== 추�? 버튼 ?�릭 ===');
    console.log('?�택???�로그램 개수:', selectedPrograms.length);
    console.log('?�택???�로그램 ?�이??', selectedPrograms);
    
    if (selectedPrograms.length === 0) {
      showToast('추�????�로그램???�택?�주?�요.', 'warning');
      return;
    }

    if (onSelect) {
      console.log('onSelect 콜백 ?�출');
      onSelect(selectedPrograms);
    }

    // 부�?창에 메시지 ?�송 (?�업??경우)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: selectedPrograms,
        PGM_ID: popupPgmId // 추�?: ?�업?�서 받�? PGM_ID???�께 보냄
      };
      console.log('부�?창으�??�송??메시지:', messageData);
      window.opener.postMessage(messageData, '*');
      console.log('부�?창으�?메시지 ?�송 ?�료');
      window.close();
    }
  };

  // ?�업 ?�기
  const handleClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  return (
    <div className='mdi' style={{ width: '850px', height: '430px', padding: '8px', minWidth: '850px' }}>
      {/* ?�� 조회 ?�역 */}
      <div className='search-div mb-2'>
        <table className='search-table w-full'>
          <tbody>
            <tr className='search-tr'>
              <th className='search-th w-[90px]'>?�로그램 ID�?/th>
              <td className='search-td w-[120px]'>
                <input
                  type='text'
                  className='input-base input-default w-full'
                  value={searchParams.PGM_KWD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_KWD: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label='?�로그램 ID�??�력'
                />
              </td>
              <th className='search-th w-[60px]'>구분</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.PGM_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_DIV_CD: e.target.value }))}
                  aria-label='구분 ?�택'
                >
                  <option value="">?�택</option>
                  <option value="?�면">?�면</option>
                  <option value="?�업">?�업</option>
                </select>
              </td>
              <th className='search-th w-[60px]'>?�무</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.BIZ_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, BIZ_DIV_CD: e.target.value }))}
                  aria-label='?�무 ?�택'
                >
                  <option value="">?�택</option>
                  <option value="?�무">?�무</option>
                  <option value="?�스??>?�스??/option>
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

      {/* ?�� ?�?��? */}
      <div className='tit_area mb-1'>
        <h3 className='text-sm'>?�로그램목록</h3>
      </div>

      {/* ?�� AG-Grid ?�역 */}
      <div className='gridbox-div mb-2'>
        <div className='ag-theme-alpine' style={{ height: '300px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={programs}
            columnDefs={columnDefs}
            rowSelection={multiple ? 'multiple' : 'single'}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            loadingOverlayComponent={() => <div>로딩 �?..</div>}
            noRowsOverlayComponent={() => <div>조회???�보가 ?�습?�다.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            pagination={false}
            domLayout="autoHeight"
            onRowDoubleClicked={handleRowDoubleClick}
            data-testid="program-search-grid"
          />
        </div>
      </div>

      {/* �??�단 버튼 */}
      <div className='flex justify-end gap-2 mt-2'>
        {onSelect && (
          <button type='button' className='btn-base btn-etc text-xs px-2 py-1' onClick={handleClose}>
            취소
          </button>
        )}
        <button type='button' className='btn-base btn-act text-xs px-2 py-1' onClick={handleAdd}>
          {multiple ? '추�?' : '?�택'}
        </button>
      </div>
    </div>
  );
} 

