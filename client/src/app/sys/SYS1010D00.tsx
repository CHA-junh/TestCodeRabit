/**
 * SYS1010D00 - ?„ë¡œê·¸ë¨ ê²€???ì—… ?”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?„ë¡œê·¸ë¨ ?¤ì¤‘/?¨ì¼ ? íƒ
 * - ? íƒ???„ë¡œê·¸ë¨??ë¶€ëª??”ë©´?¼ë¡œ ?„ë‹¬
 * - ?ì—… ?•íƒœë¡??™ì‘?˜ì—¬ ë¶€ëª??”ë©´ê³?ë¶„ë¦¬
 *
 * API ?°ë™:
 * - GET /api/sys/programs - ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ
 * - POST /api/common/search - ê³µí†µì½”ë“œ ì¡°íšŒ (?„ë¡œê·¸ë¨êµ¬ë¶„: 305, ?…ë¬´êµ¬ë¶„: 303)
 *
 * ?íƒœ ê´€ë¦?
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ë°?? íƒ???„ë¡œê·¸ë¨??
 * - ê²€??ì¡°ê±´ (?„ë¡œê·¸ë¨?¤ì›Œ?? ?„ë¡œê·¸ë¨êµ¬ë¶„, ?…ë¬´êµ¬ë¶„)
 * - ë¡œë”© ?íƒœ ë°??ì—… ?œì–´
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ê²€??ì¡°ê±´ ?…ë ¥ (?„ë¡œê·¸ë¨?¤ì›Œ?? ?„ë¡œê·¸ë¨êµ¬ë¶„, ?…ë¬´êµ¬ë¶„)
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ?Œì´ë¸?(AG-Grid)
 * - ì²´í¬ë°•ìŠ¤ ?¤ì¤‘ ? íƒ (multiple=true??ê²½ìš°)
 * - ?”ë¸”?´ë¦­ ?¨ì¼ ? íƒ
 * - ? íƒ/ì·¨ì†Œ/?«ê¸° ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?(?„ë¡œê·¸ë¨ ì¶”ê?)
 * - SYS1002M00: ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦?(?„ë¡œê·¸ë¨ ?°ê²°)
 * - SYS1000M00: ?„ë¡œê·¸ë¨ ê´€ë¦?(?„ë¡œê·¸ë¨ ?•ë³´)
 *
 * ?°ì´??êµ¬ì¡°:
 * - Program: ?„ë¡œê·¸ë¨ ?•ë³´ (PGM_ID, PGM_NM, PGM_DIV_CD, BIZ_DIV_CD, USE_YN ??
 * - SYS1010D00Props: ?ì—… ?ì„± (onSelect, multiple)
 *
 * ?¹ì´?¬í•­:
 * - ?ì—… ?•íƒœë¡??™ì‘?˜ì—¬ ë¶€ëª??”ë©´?ì„œ ?¸ì¶œ
 * - URL ?Œë¼ë¯¸í„°ë¥??µí•œ ì´ˆê¸° ?¤ì • (PGM_ID, PGM_GRP_ID)
 * - ?¤ì¤‘ ? íƒ/?¨ì¼ ? íƒ ëª¨ë“œ ì§€??
 * - ? íƒ???„ë¡œê·¸ë¨?€ ë¶€ëª??”ë©´??ì½œë°± ?¨ìˆ˜ë¡??„ë‹¬
 * - ?”ë¸”?´ë¦­ ??ì¦‰ì‹œ ? íƒ ?„ë£Œ
 * - ì²´í¬ë°•ìŠ¤ ? íƒ ???¤ì¤‘ ? íƒ ê°€??
 *
 * ?¬ìš© ?ˆì‹œ:
 * - SYS1001M00?ì„œ ?„ë¡œê·¸ë¨ ê·¸ë£¹???„ë¡œê·¸ë¨ ì¶”ê? ??
 * - SYS1002M00?ì„œ ë©”ë‰´???„ë¡œê·¸ë¨ ?°ê²° ??
 * - ê¸°í? ?„ë¡œê·¸ë¨ ? íƒ???„ìš”??ëª¨ë“  ?”ë©´
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

  // URL ?Œë¼ë¯¸í„°?ì„œ PGM_ID ê°€?¸ì˜¤ê¸?
  const [popupPgmId, setPopupPgmId] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPopupPgmId(urlParams.get('PGM_ID'));
  }, []);

  // AG-Grid ê´€??
  const gridRef = useRef<AgGridReact>(null);

  // AG-Grid ì»¬ëŸ¼ ?•ì˜
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
      headerName: '?„ë¡œê·¸ë¨ID',
      field: 'PGM_ID',
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: '?„ë¡œê·¸ë¨ëª?,
      field: 'PGM_NM',
      flex: 2,
      minWidth: 180,
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'êµ¬ë¶„',
      field: 'PGM_DIV_NM',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    },
    {
      headerName: '?…ë¬´',
      field: 'BIZ_DIV_CD',
      flex: 1,
      minWidth: 80,
      sortable: true,
      filter: true
    }
  ];

  // ?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ
  const loadPrograms = useCallback(async (params?: any) => {
    console.log('loadPrograms ?¸ì¶œ?? ?Œë¼ë¯¸í„°:', params);
    setLoading(true);
    try {
      // URL ?Œë¼ë¯¸í„°?ì„œ PGM_GRP_ID ê°€?¸ì˜¤ê¸?
      const urlParams = new URLSearchParams(window.location.search);
      const pgmGrpId = urlParams.get('PGM_GRP_ID');
      
      // API ?¸ì¶œ???„í•œ ì¿¼ë¦¬ ?Œë¼ë¯¸í„° êµ¬ì„±
      const queryParams = new URLSearchParams();
      if (params?.PGM_KWD) queryParams.append('PGM_KWD', params.PGM_KWD);
      if (params?.PGM_DIV_CD) queryParams.append('PGM_DIV_CD', params.PGM_DIV_CD);
      if (params?.BIZ_DIV_CD) queryParams.append('BIZ_DIV_CD', params.BIZ_DIV_CD);
      if (pgmGrpId) queryParams.append('PGM_GRP_ID', pgmGrpId);
      
      const response = await fetch(`/api/sys/programs/search?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setPrograms(result.data);
        // ?°ì´??ë¡œë“œ ??ì»¬ëŸ¼ ?ë™ ë§ì¶¤
        setTimeout(() => {
          if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.sizeColumnsToFit();
          }
        }, 0);
      } else {
        console.error('?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨:', result.message);
        showToast(`?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨: ${result.message}`, 'error');
      }
    } catch (error: any) {
      console.error('?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨:', error);
      showToast(`?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // ì´ˆê¸° ë¡œë“œ
  useEffect(() => {
    loadPrograms(searchParams);
  }, []);

  // ê²€??ë²„íŠ¼ ?´ë¦­
  const handleSearch = () => {
    console.log('ì¡°íšŒ ë²„íŠ¼ ?´ë¦­??);
    console.log('ê²€???Œë¼ë¯¸í„°:', searchParams);
    loadPrograms(searchParams);
  };

  // AG-Grid ?´ë²¤???¸ë“¤??
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedPrograms(selectedRows);
  };

  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit();
  };

  // ???”ë¸”?´ë¦­ ?¸ë“¤??
  const handleRowDoubleClick = (event: any) => {
    const row = event.data;
    if (!row) return;
    // ë¶€ëª?ì°½ì— ë©”ì‹œì§€ ?„ì†¡ (?ì—…??ê²½ìš°)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: [row],
        PGM_ID: popupPgmId // ?ì—…?ì„œ ë°›ì? PGM_ID???¨ê»˜ ë³´ëƒ„
      };
      window.opener.postMessage(messageData, '*');
      window.close();
    }
    // onSelect ì½œë°±???¸ì¶œ (?µì…˜)
    if (onSelect) {
      onSelect([row]);
    }
  };

  // ì¶”ê? ë²„íŠ¼ ?´ë¦­
  const handleAdd = () => {
    console.log('=== ì¶”ê? ë²„íŠ¼ ?´ë¦­ ===');
    console.log('? íƒ???„ë¡œê·¸ë¨ ê°œìˆ˜:', selectedPrograms.length);
    console.log('? íƒ???„ë¡œê·¸ë¨ ?°ì´??', selectedPrograms);
    
    if (selectedPrograms.length === 0) {
      showToast('ì¶”ê????„ë¡œê·¸ë¨??? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }

    if (onSelect) {
      console.log('onSelect ì½œë°± ?¸ì¶œ');
      onSelect(selectedPrograms);
    }

    // ë¶€ëª?ì°½ì— ë©”ì‹œì§€ ?„ì†¡ (?ì—…??ê²½ìš°)
    if (window.opener) {
      const messageData = {
        type: 'SELECTED_PROGRAMS',
        data: selectedPrograms,
        PGM_ID: popupPgmId // ì¶”ê?: ?ì—…?ì„œ ë°›ì? PGM_ID???¨ê»˜ ë³´ëƒ„
      };
      console.log('ë¶€ëª?ì°½ìœ¼ë¡??„ì†¡??ë©”ì‹œì§€:', messageData);
      window.opener.postMessage(messageData, '*');
      console.log('ë¶€ëª?ì°½ìœ¼ë¡?ë©”ì‹œì§€ ?„ì†¡ ?„ë£Œ');
      window.close();
    }
  };

  // ?ì—… ?«ê¸°
  const handleClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  return (
    <div className='mdi' style={{ width: '850px', height: '430px', padding: '8px', minWidth: '850px' }}>
      {/* ?” ì¡°íšŒ ?ì—­ */}
      <div className='search-div mb-2'>
        <table className='search-table w-full'>
          <tbody>
            <tr className='search-tr'>
              <th className='search-th w-[90px]'>?„ë¡œê·¸ë¨ IDëª?/th>
              <td className='search-td w-[120px]'>
                <input
                  type='text'
                  className='input-base input-default w-full'
                  value={searchParams.PGM_KWD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_KWD: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label='?„ë¡œê·¸ë¨ IDëª??…ë ¥'
                />
              </td>
              <th className='search-th w-[60px]'>êµ¬ë¶„</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.PGM_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, PGM_DIV_CD: e.target.value }))}
                  aria-label='êµ¬ë¶„ ? íƒ'
                >
                  <option value="">? íƒ</option>
                  <option value="?”ë©´">?”ë©´</option>
                  <option value="?ì—…">?ì—…</option>
                </select>
              </td>
              <th className='search-th w-[60px]'>?…ë¬´</th>
              <td className='search-td w-[80px]'>
                <select
                  className='combo-base w-full'
                  value={searchParams.BIZ_DIV_CD}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, BIZ_DIV_CD: e.target.value }))}
                  aria-label='?…ë¬´ ? íƒ'
                >
                  <option value="">? íƒ</option>
                  <option value="?…ë¬´">?…ë¬´</option>
                  <option value="?œìŠ¤??>?œìŠ¤??/option>
                </select>
              </td>
              <td className='search-td text-right w-[60px]'>
                <button type='button' className='btn-base btn-search text-xs px-2 py-1' onClick={handleSearch}>
                  ì¡°íšŒ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ?“‹ ?€?´í? */}
      <div className='tit_area mb-1'>
        <h3 className='text-sm'>?„ë¡œê·¸ë¨ëª©ë¡</h3>
      </div>

      {/* ?“Š AG-Grid ?ì—­ */}
      <div className='gridbox-div mb-2'>
        <div className='ag-theme-alpine' style={{ height: '300px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={programs}
            columnDefs={columnDefs}
            rowSelection={multiple ? 'multiple' : 'single'}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            loadingOverlayComponent={() => <div>ë¡œë”© ì¤?..</div>}
            noRowsOverlayComponent={() => <div>ì¡°íšŒ???•ë³´ê°€ ?†ìŠµ?ˆë‹¤.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            pagination={false}
            domLayout="autoHeight"
            onRowDoubleClicked={handleRowDoubleClick}
            data-testid="program-search-grid"
          />
        </div>
      </div>

      {/* â¬??˜ë‹¨ ë²„íŠ¼ */}
      <div className='flex justify-end gap-2 mt-2'>
        {onSelect && (
          <button type='button' className='btn-base btn-etc text-xs px-2 py-1' onClick={handleClose}>
            ì·¨ì†Œ
          </button>
        )}
        <button type='button' className='btn-base btn-act text-xs px-2 py-1' onClick={handleAdd}>
          {multiple ? 'ì¶”ê?' : '? íƒ'}
        </button>
      </div>
    </div>
  );
} 

