/**
 * SYS1010D00 - ?ë¡ê·¸ë¨ ê²???ì ?ë©´
 *
 * ì£¼ì ê¸°ë¥:
 * - ?ë¡ê·¸ë¨ ëª©ë¡ ì¡°í ë°?ê²??
 * - ?ë¡ê·¸ë¨ ?¤ì¤/?¨ì¼ ? í
 * - ? í???ë¡ê·¸ë¨??ë¶ëª??ë©´?¼ë¡ ?ë¬
 * - ?ì ?íë¡??ì?ì¬ ë¶ëª??ë©´ê³?ë¶ë¦¬
 *
 * API ?°ë:
 * - GET /api/sys/programs - ?ë¡ê·¸ë¨ ëª©ë¡ ì¡°í
 * - POST /api/common/search - ê³µíµì½ë ì¡°í (?ë¡ê·¸ë¨êµ¬ë¶: 305, ?ë¬´êµ¬ë¶: 303)
 *
 * ?í ê´ë¦?
 * - ?ë¡ê·¸ë¨ ëª©ë¡ ë°?? í???ë¡ê·¸ë¨??
 * - ê²??ì¡°ê±´ (?ë¡ê·¸ë¨?¤ì?? ?ë¡ê·¸ë¨êµ¬ë¶, ?ë¬´êµ¬ë¶)
 * - ë¡ë© ?í ë°??ì ?ì´
 *
 * ?¬ì©???¸í°?ì´??
 * - ê²??ì¡°ê±´ ?ë ¥ (?ë¡ê·¸ë¨?¤ì?? ?ë¡ê·¸ë¨êµ¬ë¶, ?ë¬´êµ¬ë¶)
 * - ?ë¡ê·¸ë¨ ëª©ë¡ ?ì´ë¸?(AG-Grid)
 * - ì²´í¬ë°ì¤ ?¤ì¤ ? í (multiple=true??ê²½ì°)
 * - ?ë¸?´ë¦­ ?¨ì¼ ? í
 * - ? í/ì·¨ì/?«ê¸° ë²í¼
 *
 * ?°ê? ?ë©´:
 * - SYS1001M00: ?ë¡ê·¸ë¨ ê·¸ë£¹ ê´ë¦?(?ë¡ê·¸ë¨ ì¶ê?)
 * - SYS1002M00: ë©ë´ë³??ë¡ê·¸ë¨ ê´ë¦?(?ë¡ê·¸ë¨ ?°ê²°)
 * - SYS1000M00: ?ë¡ê·¸ë¨ ê´ë¦?(?ë¡ê·¸ë¨ ?ë³´)
 *
 * ?°ì´??êµ¬ì¡°:
 * - Program: ?ë¡ê·¸ë¨ ?ë³´ (PGM_ID, PGM_NM, PGM_DIV_CD, BIZ_DIV_CD, USE_YN ??
 * - SYS1010D00Props: ?ì ?ì± (onSelect, multiple)
 *
 * ?¹ì´?¬í­:
 * - ?ì ?íë¡??ì?ì¬ ë¶ëª??ë©´?ì ?¸ì¶
 * - URL ?ë¼ë¯¸í°ë¥??µí ì´ê¸° ?¤ì  (PGM_ID, PGM_GRP_ID)
 * - ?¤ì¤ ? í/?¨ì¼ ? í ëª¨ë ì§??
 * - ? í???ë¡ê·¸ë¨? ë¶ëª??ë©´??ì½ë°± ?¨ìë¡??ë¬
 * - ?ë¸?´ë¦­ ??ì¦ì ? í ?ë£
 * - ì²´í¬ë°ì¤ ? í ???¤ì¤ ? í ê°??
 *
 * ?¬ì© ?ì:
 * - SYS1001M00?ì ?ë¡ê·¸ë¨ ê·¸ë£¹???ë¡ê·¸ë¨ ì¶ê? ??
 * - SYS1002M00?ì ë©ë´???ë¡ê·¸ë¨ ?°ê²° ??
 * - ê¸°í? ?ë¡ê·¸ë¨ ? í???ì??ëª¨ë  ?ë©´
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

  // URL ?ë¼ë¯¸í°?ì PGM_ID ê°?¸ì¤ê¸?
  const [popupPgmId, setPopupPgmId] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPopupPgmId(urlParams.get('PGM_ID'));
  }, []);

  // AG-Grid ê´??
  const gridRef = useRef<AgGridReact>(null);

  // AG-Grid ì»¬ë¼ ?ì
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
      headerName: '?ë¡ê·¸ë¨ID',
      field: 'PGM_ID',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: '?ë¡ê·¸ë¨ëª?,
      field: 'PGM_NM',
      flex: 2,
      minWidth: 180,
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'êµ¬ë¶',
      field: 'PGM_DIV_NM',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    },
    {
      headerName: '?ë¬´',
      field: 'BIZ_DIV_CD',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    }
  ];

  // ?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë
  const loadPrograms = useCallback(async (params?: any) => {
    console.log('loadPrograms ?¸ì¶?? ?ë¼ë¯¸í°:', params);
    setLoading(true);
    try {
      // URL ?ë¼ë¯¸í°?ì PGM_GRP_ID ê°?¸ì¤ê¸?
      const urlParams = new URLSearchParams(window.location.search);
      const pgmGrpId = urlParams.get('PGM_GRP_ID');
      
      // API ?¸ì¶???í ì¿¼ë¦¬ ?ë¼ë¯¸í° êµ¬ì±
      const queryParams = new URLSearchParams();
      if (params?.PGM_KWD) queryParams.append('PGM_KWD', params.PGM_KWD);
      if (params?.PGM_DIV_CD) queryParams.append('PGM_DIV_CD', params.PGM_DIV_CD);
      if (params?.BIZ_DIV_CD) queryParams.append('BIZ_DIV_CD', params.BIZ_DIV_CD);
      if (pgmGrpId) queryParams.append('PGM_GRP_ID', pgmGrpId);
      
      const response = await fetch(`/api/sys/programs/search?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setPrograms(result.data);
        // ?°ì´??ë¡ë ??ì»¬ë¼ ?ë ë§ì¶¤
        setTimeout(() => {
          if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.sizeColumnsToFit();
          }
        }, 0);
      } else {
        console.error('?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨:', result.message);
        showToast(`?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨: ${result.message}`, 'error');
      }
    } catch (error: any) {
      console.error('?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨:', error);
      showToast(`?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨: ${error?.message || '?????ë ?¤ë¥'}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // ì´ê¸° ë¡ë
  useEffect(() => {
    loadPrograms(searchParams);
  }, []);

  // ê²??ë²í¼ ?´ë¦­
  const handleSearch = () => {
    console.log('ì¡°í ë²í¼ ?´ë¦­??);
    console.log('ê²???ë¼ë¯¸í°:', searchParams);
    loadPrograms(searchParams);
  };

  // AG-Grid ?´ë²¤???¸ë¤??
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedPrograms(selectedRows);
  };

  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  };

  // ???ë¸?´ë¦­ ?¸ë¤??
  const handleRowDoubleClick = (event: any) => {
    const row = event.data;
    if (!row) return;
    // ë¶ëª?ì°½ì ë©ìì§ ?ì¡ (?ì??ê²½ì°)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: [row],
        PGM_ID: popupPgmId // ?ì?ì ë°ì? PGM_ID???¨ê» ë³´ë
      };
      window.opener.postMessage(messageData, '*');
      window.close();
    }
    // onSelect ì½ë°±???¸ì¶ (?µì)
    if (onSelect) {
      onSelect([row]);
    }
  };

  // ì¶ê? ë²í¼ ?´ë¦­
  const handleAdd = () => {
    console.log('=== ì¶ê? ë²í¼ ?´ë¦­ ===');
    console.log('? í???ë¡ê·¸ë¨ ê°ì:', selectedPrograms.length);
    console.log('? í???ë¡ê·¸ë¨ ?°ì´??', selectedPrograms);
    
    if (selectedPrograms.length === 0) {
      showToast('ì¶ê????ë¡ê·¸ë¨??? í?´ì£¼?¸ì.', 'warning');
      return;
    }

    if (onSelect) {
      console.log('onSelect ì½ë°± ?¸ì¶');
      onSelect(selectedPrograms);
    }

    // ë¶ëª?ì°½ì ë©ìì§ ?ì¡ (?ì??ê²½ì°)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: selectedPrograms,
        PGM_ID: popupPgmId // ì¶ê?: ?ì?ì ë°ì? PGM_ID???¨ê» ë³´ë
      };
      console.log('ë¶ëª?ì°½ì¼ë¡??ì¡??ë©ìì§:', messageData);
      window.opener.postMessage(messageData, '*');
      console.log('ë¶ëª?ì°½ì¼ë¡?ë©ìì§ ?ì¡ ?ë£');
      window.close();
    }
  };

  // ?ì ?«ê¸°
  const handleClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  return (
    <div className='mdi' style={{ width: '850px', height: '430px', padding: '8px', minWidth: '850px' }}>
      {/* ? ì¡°í ?ì­ */}
      <div className='search-div mb-2'>
        <table className='search-table w-full'>
          <tbody>
            <tr className='search-tr'>
              <th className='search-th w-[90px]'>?ë¡ê·¸ë¨ IDëª?/th>
              <td className='search-td w-[120px]'>
                <input
                  type='text'
                  className='input-base input-default w-full'
                  value={searchParams.PGM_KWD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_KWD: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label='?ë¡ê·¸ë¨ IDëª??ë ¥'
                />
              </td>
              <th className='search-th w-[60px]'>êµ¬ë¶</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.PGM_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_DIV_CD: e.target.value }))}
                  aria-label='êµ¬ë¶ ? í'
                >
                  <option value="">? í</option>
                  <option value="?ë©´">?ë©´</option>
                  <option value="?ì">?ì</option>
                </select>
              </td>
              <th className='search-th w-[60px]'>?ë¬´</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.BIZ_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, BIZ_DIV_CD: e.target.value }))}
                  aria-label='?ë¬´ ? í'
                >
                  <option value="">? í</option>
                  <option value="?ë¬´">?ë¬´</option>
                  <option value="?ì¤??>?ì¤??/option>
                </select>
              </td>
              <td className='search-td text-right w-[60px]'>
                <button type='button' className='btn-base btn-search text-xs px-2 py-1' onClick={handleSearch}>
                  ì¡°í
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ? ??´í? */}
      <div className='tit_area mb-1'>
        <h3 className='text-sm'>?ë¡ê·¸ë¨ëª©ë¡</h3>
      </div>

      {/* ? AG-Grid ?ì­ */}
      <div className='gridbox-div mb-2'>
        <div className='ag-theme-alpine' style={{ height: '300px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={programs}
            columnDefs={columnDefs}
            rowSelection={multiple ? 'multiple' : 'single'}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            loadingOverlayComponent={() => <div>ë¡ë© ì¤?..</div>}
            noRowsOverlayComponent={() => <div>ì¡°í???ë³´ê° ?ìµ?ë¤.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            pagination={false}
            domLayout="autoHeight"
            onRowDoubleClicked={handleRowDoubleClick}
            data-testid="program-search-grid"
          />
        </div>
      </div>

      {/* â¬??ë¨ ë²í¼ */}
      <div className='flex justify-end gap-2 mt-2'>
        {onSelect && (
          <button type='button' className='btn-base btn-etc text-xs px-2 py-1' onClick={handleClose}>
            ì·¨ì
          </button>
        )}
        <button type='button' className='btn-base btn-act text-xs px-2 py-1' onClick={handleAdd}>
          {multiple ? 'ì¶ê?' : '? í'}
        </button>
      </div>
    </div>
  );
} 

