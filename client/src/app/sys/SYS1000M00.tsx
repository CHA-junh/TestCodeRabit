/**
 * SYS1000M00 - ?„ë¡œê·¸ë¨ ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?„ë¡œê·¸ë¨ ? ê·œ ?±ë¡ ë°??˜ì •
 * - ?„ë¡œê·¸ë¨ êµ¬ë¶„ë³??„ë“œ ?œì„±??ë¹„í™œ?±í™”
 * - ?„ë¡œê·¸ë¨ ë¯¸ë¦¬ë³´ê¸° ë°??‘ì? ?¤ìš´ë¡œë“œ
 *
 * API ?°ë™:
 * - GET /api/sys/programs - ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/programs - ?„ë¡œê·¸ë¨ ?€??
 * - POST /api/common/search - ê³µí†µì½”ë“œ ì¡°íšŒ (?„ë¡œê·¸ë¨êµ¬ë¶„: 305, ?…ë¬´êµ¬ë¶„: 303)
 *
 * ?íƒœ ê´€ë¦?
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ë°?? íƒ???„ë¡œê·¸ë¨
 * - ê²€??ì¡°ê±´ (?„ë¡œê·¸ë¨?¤ì›Œ?? ?„ë¡œê·¸ë¨êµ¬ë¶„, ?¬ìš©?¬ë?, ?…ë¬´êµ¬ë¶„)
 * - ?„ë¡œê·¸ë¨êµ¬ë¶„/?…ë¬´êµ¬ë¶„ ì½”ë“œ ëª©ë¡
 * - MDI ëª¨ë“œ ?íƒœ (?„ë¡œê·¸ë¨êµ¬ë¶„???°ë¥¸ ?„ë“œ ?œì„±??
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ê²€??ì¡°ê±´ ?…ë ¥ (?„ë¡œê·¸ë¨?¤ì›Œ?? ?„ë¡œê·¸ë¨êµ¬ë¶„, ?¬ìš©?¬ë?, ?…ë¬´êµ¬ë¶„)
 * - ?„ë¡œê·¸ë¨ ëª©ë¡ ?Œì´ë¸?(AG-Grid)
 * - ?„ë¡œê·¸ë¨ ?ì„¸ ?•ë³´ ?…ë ¥ ??
 * - ?€??? ê·œ/ë¯¸ë¦¬ë³´ê¸°/?‘ì??¤ìš´ë¡œë“œ ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - SYS1001M00: ë©”ë‰´ ê´€ë¦?(?„ë¡œê·¸ë¨ ?°ê²°)
 * - SYS1002M00: ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦?
 *
 * ?°ì´??êµ¬ì¡°:
 * - Program: ?„ë¡œê·¸ë¨ ?•ë³´ (pgmId, pgmNm, pgmDivCd, bizDivCd, useYn, linkPath ??
 * - SystemCode: ê³µí†µì½”ë“œ ?•ë³´ (codeId, codeName, codeValue ??
 *
 * ?¹ì´?¬í•­:
 * - ?„ë¡œê·¸ë¨êµ¬ë¶„??'MDI'??ê²½ìš° ?ì—… ê´€???„ë“œ ?œì„±??
 * - ?„ë¡œê·¸ë¨êµ¬ë¶„/?…ë¬´êµ¬ë¶„?€ ê³µí†µì½”ë“œ ?Œì´ë¸”ì—???™ì  ì¡°íšŒ
 * - ?‘ì? ?¤ìš´ë¡œë“œ ???„ì¬ ê²€??ì¡°ê±´???°ì´?°ë§Œ ?¤ìš´ë¡œë“œ
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from '@/lib/utils';
import { Program } from '@/modules/sys/types/program.types';
import { ProgramService } from '@/modules/sys/services/programService';
import '../common/common.css';
import { SystemCode } from '@/modules/com/types';
import { useToast } from '@/contexts/ToastContext';


export default function SYS1000M00() {
  const { showToast, showConfirm } = useToast();
  
  // AG-Grid ref
  const gridRef = useRef<AgGridReact<Program>>(null);

  // AG-Grid ì»¬ëŸ¼ ?•ì˜
  const [columnDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '?„ë¡œê·¸ë¨ID', field: 'pgmId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?„ë¡œê·¸ë¨ëª?, field: 'pgmNm', width: 220, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?„ë¡œê·¸ë¨êµ¬ë¶„', field: 'pgmDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?…ë¬´êµ¬ë¶„', field: 'bizDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?¬ìš©?¬ë?', field: 'useYn', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '?¬ìš©' : 'ë¯¸ì‚¬?? },
    { headerName: 'width', field: 'pgmWdth', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: 'height', field: 'pgmHght', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: 'top', field: 'pgmPsnTop', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: 'left', field: 'pgmPsnLft', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
  ]);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNewCode, setIsNewCode] = useState(false);
  const [searchConditions, setSearchConditions] = useState({
    pgmKwd: '',
    pgmDivCd: '',
    useYn: '',
    bizDivCd: ''
  });
  const [isMdiMode, setIsMdiMode] = useState(false);
  // ?„ë¡œê·¸ë¨êµ¬ë¶„ ì½”ë“œ ëª©ë¡ ?íƒœ
  const [pgmDivOptions, setPgmDivOptions] = useState<SystemCode[]>([]);
  // ?…ë¬´êµ¬ë¶„ ì½”ë“œ ëª©ë¡ ?íƒœ
  const [bizDivOptions, setBizDivOptions] = useState<SystemCode[]>([]);

  // ?„ë¡œê·¸ë¨êµ¬ë¶„ ì½”ë“œ(305) ëª©ë¡ ì¡°íšŒ
  useEffect(() => {
    const fetchPgmDivOptions = async () => {
      try {
        const response = await fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '305' })
        });
        const data = await response.json();
        if (data && data.data) {
          // API ?‘ë‹µ??SystemCode ?€?…ì— ë§ê²Œ ë³€??
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm??codeName?¼ë¡œ ë§¤í•‘
            codeValue: item.codeId,
            description: item.codeNm,
            sortOrder: item.sortOrder || 0,
            isActive: item.useYn === 'Y',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          setPgmDivOptions(transformedData);
        }
      } catch (e) {
        console.error('?„ë¡œê·¸ë¨êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ ?¤íŒ¨:', e);
        setPgmDivOptions([]);
      }
    };
    fetchPgmDivOptions();
  }, []);

  // ?…ë¬´êµ¬ë¶„ ì½”ë“œ(303) ëª©ë¡ ì¡°íšŒ
  useEffect(() => {
    const fetchBizDivOptions = async () => {
      try {
        const response = await fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '303' })
        });
        const data = await response.json();
        if (data && data.data) {
          // API ?‘ë‹µ??SystemCode ?€?…ì— ë§ê²Œ ë³€??
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm??codeName?¼ë¡œ ë§¤í•‘
            codeValue: item.codeId,
            description: item.codeNm,
            sortOrder: item.sortOrder || 0,
            isActive: item.useYn === 'Y',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          setBizDivOptions(transformedData);
        }
      } catch (e) {
        console.error('?…ë¬´êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ ?¤íŒ¨:', e);
        setBizDivOptions([]);
      }
    };
    fetchBizDivOptions();
  }, []);

  // ?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ
  const loadData = useCallback(async () => {
    console.log('loadData ?¸ì¶œ?? ?Œë¼ë¯¸í„°:', searchConditions);
    setLoading(true);
    try {
      const response = await ProgramService.getProgramList(searchConditions);
      console.log('API ?‘ë‹µ:', response);
      setPrograms(response.data || []);
            } catch (error: any) {
          console.error('?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨:', error);
          showToast(`?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
        } finally {
          setLoading(false);
        }
  }, [searchConditions]);

  // ì´ˆê¸° ë¡œë“œ ?œì—ë§??°ì´??ì¡°íšŒ
  useEffect(() => {
    loadData();
  }, []);

  // ?°ì´??ë³€ê²???ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [programs]);

  // ì¡°íšŒ ì¡°ê±´ ë³€ê²??¸ë“¤??
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ?”í„°???…ë ¥ ???ë™ì¡°íšŒ
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadData();
    }
  };

  // ?„ë¡œê·¸ë¨ êµ¬ë¶„ ë³€ê²????„ë“œ ?œì„±??ë¹„í™œ?±í™” ì²˜ë¦¬
  const handleProgramDivisionChange = (value: string) => {
    const isMdi = value === '1'; // MDI ëª¨ë“œ
    setIsMdiMode(isMdi);
    
    setSelectedProgram(prev => prev ? { ...prev, pgmDivCd: value } : null);
  };

  // AG-Grid ?´ë²¤???¸ë“¤??
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const program = selectedRows[0];
      setSelectedProgram(program);
      setIsNewCode(false);
      
      // ?„ë¡œê·¸ë¨ êµ¬ë¶„???°ë¥¸ ?„ë“œ ?œì„±??ë¹„í™œ?±í™”
      const isMdi = program.pgmDivCd === '1';
      setIsMdiMode(isMdi);
    } else {
      setSelectedProgram(null);
    }
  };

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?„ë¡œê·¸ë¨ ? íƒ (ê¸°ì¡´ ?¨ìˆ˜ ? ì? - ?”ë¸”?´ë¦­??
  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsNewCode(false);
    
    // ?„ë¡œê·¸ë¨ êµ¬ë¶„???°ë¥¸ ?„ë“œ ?œì„±??ë¹„í™œ?±í™”
    const isMdi = program.pgmDivCd === '1';
    setIsMdiMode(isMdi);
  };

  // ?„ë¡œê·¸ë¨ ?€??
  const handleSave = async () => {
    if (!selectedProgram) return;
    
    // ?„ìˆ˜ ?…ë ¥ ê²€ì¦?
    if (!selectedProgram.pgmId) {
      showToast('?„ë¡œê·¸ë¨ IDë¥??…ë ¥?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    if (!selectedProgram.pgmNm) {
      showToast('?„ë¡œê·¸ë¨ëª…ì„ ?…ë ¥?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    if (!selectedProgram.pgmDivCd) {
      showToast('?„ë¡œê·¸ë¨ êµ¬ë¶„??? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    if (!selectedProgram.linkPath) {
      showToast('?Œì¼ ê²½ë¡œë¥??…ë ¥?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    if (!selectedProgram.useYn) {
      showToast('?¬ìš© ?¬ë?ë¥?? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    
    // ?€???•ì¸
    showConfirm({
      message: '?€?¥í•˜?œê² ?µë‹ˆê¹?',
      type: 'info',
      onConfirm: async () => {
        try {
          // ?ì—… ?¬ê¸° ?°ì´??ì²˜ë¦¬ ë°?ë¡œê¹…
          console.log('=== ?€?????°ì´???•ì¸ ===');
          console.log('?ë³¸ selectedProgram:', selectedProgram);
          console.log('pgmWdth (?ë³¸):', selectedProgram.pgmWdth, '?€??', typeof selectedProgram.pgmWdth);
          console.log('pgmHght (?ë³¸):', selectedProgram.pgmHght, '?€??', typeof selectedProgram.pgmHght);
          
          // ë¹?ë¬¸ì?? 0, null, undefinedë¥?nullë¡?ë³€?˜í•˜???¨ìˆ˜
          const processNumericValue = (value: any): number | null => {
            if (value === '' || value === null || value === undefined || value === 0) {
              return null;
            }
            const numValue = Number(value);
            return isNaN(numValue) ? null : numValue;
          };
          
          const processedPgmWdth = processNumericValue(selectedProgram.pgmWdth);
          const processedPgmHght = processNumericValue(selectedProgram.pgmHght);
          const processedPgmPsnTop = processNumericValue(selectedProgram.pgmPsnTop);
          const processedPgmPsnLft = processNumericValue(selectedProgram.pgmPsnLft);
          
          console.log('ì²˜ë¦¬??ê°’ë“¤:');
          console.log('pgmWdth (ì²˜ë¦¬??:', processedPgmWdth);
          console.log('pgmHght (ì²˜ë¦¬??:', processedPgmHght);
          console.log('pgmPsnTop (ì²˜ë¦¬??:', processedPgmPsnTop);
          console.log('pgmPsnLft (ì²˜ë¦¬??:', processedPgmPsnLft);
          
          if (selectedProgram.pgmId && !isNewCode) {
            // ?˜ì •
            const updateData = {
              ...selectedProgram,
              pgmWdth: processedPgmWdth,
              pgmHght: processedPgmHght,
              pgmPsnTop: processedPgmPsnTop,
              pgmPsnLft: processedPgmPsnLft,
            };
            
            console.log('?˜ì • ?°ì´??', updateData);
            await ProgramService.updateProgram(selectedProgram.pgmId, updateData);
          } else {
            // ? ê·œ - ?¹ì • ?„ë“œ?¤ì„ nullë¡??¤ì •
            const newProgram = {
              ...selectedProgram,
              svcSrvrId: '',
              linkSvcId: '',
              upPgmId: '',
              pgmWdth: processedPgmWdth,
              pgmHght: processedPgmHght,
              pgmPsnTop: processedPgmPsnTop,
              pgmPsnLft: processedPgmPsnLft,
            };
            
            console.log('? ê·œ ?±ë¡ ?°ì´??', newProgram);
            await ProgramService.createProgram(newProgram);
          }
          loadData();
          showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'success');
        } catch (error) {
          console.error('?„ë¡œê·¸ë¨ ?€???¤íŒ¨:', error);
          showToast('?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
        }
      }
    });
    return;
    
    try {
      // ë¹?ë¬¸ì?? 0, null, undefinedë¥?nullë¡?ë³€?˜í•˜???¨ìˆ˜
      const processNumericValue = (value: any): number | null => {
        if (value === '' || value === null || value === undefined || value === 0) {
          return null;
        }
        const numValue = Number(value);
        return isNaN(numValue) ? null : numValue;
      };
      
      const processedPgmWdth = processNumericValue(selectedProgram?.pgmWdth);
      const processedPgmHght = processNumericValue(selectedProgram?.pgmHght);
      const processedPgmPsnTop = processNumericValue(selectedProgram?.pgmPsnTop);
      const processedPgmPsnLft = processNumericValue(selectedProgram?.pgmPsnLft);
      
      console.log('ì²˜ë¦¬??ê°’ë“¤:');
      console.log('pgmWdth (ì²˜ë¦¬??:', processedPgmWdth);
      console.log('pgmHght (ì²˜ë¦¬??:', processedPgmHght);
      console.log('pgmPsnTop (ì²˜ë¦¬??:', processedPgmPsnTop);
      console.log('pgmPsnLft (ì²˜ë¦¬??:', processedPgmPsnLft);
      
      if (selectedProgram?.pgmId && !isNewCode) {
        // ?˜ì •
        const updateData = {
          ...selectedProgram,
          pgmWdth: processedPgmWdth,
          pgmHght: processedPgmHght,
          pgmPsnTop: processedPgmPsnTop,
          pgmPsnLft: processedPgmPsnLft,
        };
        
        console.log('?˜ì • ?°ì´??', updateData);
        await ProgramService.updateProgram(selectedProgram!.pgmId, updateData);
      } else {
        // ? ê·œ - ?¹ì • ?„ë“œ?¤ì„ nullë¡??¤ì •
        const newProgram = {
          ...selectedProgram!,
          svcSrvrId: '',
          linkSvcId: '',
          upPgmId: '',
          pgmWdth: processedPgmWdth,
          pgmHght: processedPgmHght,
          pgmPsnTop: processedPgmPsnTop,
          pgmPsnLft: processedPgmPsnLft,
        };
        
        console.log('? ê·œ ?±ë¡ ?°ì´??', newProgram);
        await ProgramService.createProgram(newProgram);
      }
      loadData();
      showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'success');
    } catch (error) {
      console.error('?„ë¡œê·¸ë¨ ?€???¤íŒ¨:', error);
      showToast('?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
    }
  };

  // ? ê·œ ë²„íŠ¼ ?´ë¦­
  const handleNew = () => {
    setSelectedProgram({
      pgmId: '',
      pgmNm: '',
      pgmDivCd: '',
      bizDivCd: '',
      sortSeq: 1,
      useYn: 'Y',
      linkPath: '',
      pgmHght: null,
      pgmWdth: null,
      pgmPsnTop: null,
      pgmPsnLft: null,
      popupMoni: 'N',
      tgtMdiDivCd: 'MAIN',
      popupSwtUseYn: 'N',
      svcSrvrId: '',
      linkSvcId: '',
      upPgmId: '',
      regDttm: '',
      chngDttm: '',
      chngrId: '',
      scrnDvcd: '1'
    });
    setIsNewCode(true);
    setIsMdiMode(true);
  };

  // ë¯¸ë¦¬ë³´ê¸° ë²„íŠ¼ ?´ë¦­
  const handlePreview = () => {
    if (!selectedProgram) {
      showToast('?„ë¡œê·¸ë¨??? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }

    if (!selectedProgram.linkPath) {
      showToast('?Œì¼ ê²½ë¡œê°€ ?†ìŠµ?ˆë‹¤.', 'warning');
      return;
    }

    // ?„ë¡œê·¸ë¨ êµ¬ë¶„???°ë¥¸ ë¯¸ë¦¬ë³´ê¸° ì²˜ë¦¬
    const scrnDvcd = selectedProgram.pgmDivCd || '1';
    switch (scrnDvcd) {
      case "1": // MDI
        window.open(selectedProgram.linkPath, '_blank');
        break;
      case "2": // POPUP
        const popupFeatures = `width=${selectedProgram.pgmWdth || 800},height=${selectedProgram.pgmHght || 600},top=${selectedProgram.pgmPsnTop || 100},left=${selectedProgram.pgmPsnLft || 100}`;
        window.open(selectedProgram.linkPath, 'preview', popupFeatures);
        break;
      case "3": // MODAL
        const modalFeatures = `width=${selectedProgram.pgmWdth || 800},height=${selectedProgram.pgmHght || 600},top=${selectedProgram.pgmPsnTop || 100},left=${selectedProgram.pgmPsnLft || 100}`;
        window.open(selectedProgram.linkPath, 'modal', modalFeatures);
        break;
      case "4": // WIDGET
        if (selectedProgram.linkPath.toLowerCase().substring(0, 4) === "http") {
          window.open(selectedProgram.linkPath, '_blank');
        } else {
          const widgetFeatures = `width=${selectedProgram.pgmWdth || 800},height=${selectedProgram.pgmHght || 600},top=${selectedProgram.pgmPsnTop || 100},left=${selectedProgram.pgmPsnLft || 100}`;
          window.open(selectedProgram.linkPath, 'modal', widgetFeatures);
        }
        break;
      case "5": // PANEL
        window.open(selectedProgram.linkPath, '_blank');
        break;
      default:
        window.open(selectedProgram.linkPath, '_blank');
        break;
    }
  };

  // ?‘ì? ?¤ìš´ë¡œë“œ
  const handleExcelDownload = () => {
    if (programs.length === 0) {
      showToast('?¤ìš´ë¡œë“œ???°ì´?°ê? ?†ìŠµ?ˆë‹¤.', 'warning');
      return;
    }
    
    showConfirm({
      message: '?‘ì? ?Œì¼???¤ìš´ë¡œë“œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
      type: 'info',
      onConfirm: () => {
        // CSV ?•ì‹?¼ë¡œ ?°ì´??ë³€??
        const headers = ['?„ë¡œê·¸ë¨ID', '?„ë¡œê·¸ë¨ëª?, '?„ë¡œê·¸ë¨êµ¬ë¶„', '?…ë¬´êµ¬ë¶„', '?¬ìš©?¬ë?', '?Œì¼ê²½ë¡œ'];
        const csvData = programs.map(program => [
          program.pgmId,
          program.pgmNm,
          program.pgmDivCd,
          program.bizDivCd,
          program.useYn === 'Y' ? '?¬ìš©' : 'ë¯¸ì‚¬??,
          program.linkPath
        ]);
        
        const csvContent = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `?„ë¡œê·¸ë¨ëª©ë¡_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('?•ìƒ?ìœ¼ë¡??¤ìš´ë¡œë“œ?˜ì—ˆ?µë‹ˆ??', 'success');
      }
    });
  };

  return (
    <div className="mdi h-screen flex flex-col" data-testid="sys1000m00-container">
      {/* ì¡°íšŒë¶€ */}
      <div className="search-div mb-4 flex-shrink-0" data-testid="search-section">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[131px]">?„ë¡œê·¸ë¨ID/ëª?/th>
              <td className="search-td w-[20%]">
                <input 
                  type="text" 
                  name="pgmKwd"
                  className="input-base input-default w-full" 
                  value={searchConditions.pgmKwd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-kwd"
                  aria-label="?„ë¡œê·¸ë¨ ID ?ëŠ” ?´ë¦„?¼ë¡œ ê²€??
                />
              </td>

              <th className="search-th w-[126px]">?„ë¡œê·¸ë¨êµ¬ë¶„</th>
              <td className="search-td w-[10%]">
                <select 
                  name="pgmDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.pgmDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-div"
                  aria-label="?„ë¡œê·¸ë¨ êµ¬ë¶„ ? íƒ"
                >
                  <option value="">?„ì²´</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>

              <th className="search-th w-[100px]">?¬ìš©?¬ë?</th>
              <td className="search-td w-[10%]">
                <select 
                  name="useYn"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.useYn}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-use-yn"
                  aria-label="?¬ìš© ?¬ë? ? íƒ"
                >
                  <option value="">?„ì²´</option>
                  <option value="Y">?¬ìš©</option>
                  <option value="N">ë¯¸ì‚¬??/option>
                </select>
              </td>

              <th className="search-th w-[100px]">?…ë¬´êµ¬ë¶„</th>
              <td className="search-td w-[10%]">
                <select 
                  name="bizDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.bizDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-biz-div"
                  aria-label="?…ë¬´ êµ¬ë¶„ ? íƒ"
                >
                  <option value="">?„ì²´</option>
                  {bizDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>

              <td className="search-td text-right" colSpan={1}>
                <button 
                  type="button" 
                  className="btn-base btn-search" 
                  onClick={loadData}
                  data-testid="search-button"
                  aria-label="?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ"
                >
                  ì¡°íšŒ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* ê·¸ë¦¬???ì—­ */}
      <div className="flex-1 flex flex-col min-h-0" data-testid="grid-section">
        <div className="tit_area flex-shrink-0 flex justify-between items-center">
          <h3>?„ë¡œê·¸ë¨ëª©ë¡</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-excel" 
              onClick={handleExcelDownload}
              data-testid="excel-download-button"
              aria-label="?‘ì? ?Œì¼ ?¤ìš´ë¡œë“œ"
            >
              ?‘ì? ?¤ìš´ë¡œë“œ
            </button>
          </div>
        </div>

        <div className="gridbox-div flex-1 min-h-0 ag-theme-alpine" style={{ height: 'calc(100vh - 400px)', minHeight: '300px' }}>
          <AgGridReact
            ref={gridRef}
            rowData={programs}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressSizeToFit: false,
            }}
            rowSelection='single'
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            loadingOverlayComponent={() => <div className="text-center py-4">ë¡œë”© ì¤?..</div>}
            noRowsOverlayComponent={() => <div className="text-center py-4">ì¡°íšŒ???•ë³´ê°€ ?†ìŠµ?ˆë‹¤.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            rowHeight={32}
            headerHeight={40}
          />
        </div>
      </div>

      {/* ?ì„¸ ?•ë³´ ?ì—­ */}
      <div className="flex-shrink-0" data-testid="detail-section">
        <div className="tit_area">
          <h3>?„ë¡œê·¸ë¨ ?•ë³´</h3>
        </div>
        <table className="form-table mb-4">
          <tbody>
            {/* 1??*/}
            <tr className="form-tr">
              <th className="form-th required">?„ë¡œê·¸ë¨ID</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmId || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmId: e.target.value } : null)}
                  disabled={!isNewCode}
                  data-testid="detail-pgm-id"
                  aria-label="?„ë¡œê·¸ë¨ ID ?…ë ¥"
                />
              </td>
              <th className="form-th required">?„ë¡œê·¸ë¨ëª?/th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmNm || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmNm: e.target.value } : null)}
                  data-testid="detail-pgm-nm"
                  aria-label="?„ë¡œê·¸ë¨ëª??…ë ¥"
                />
              </td>
              <th className="form-th required">?„ë¡œê·¸ë¨êµ¬ë¶„</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.pgmDivCd || ''}
                  onChange={(e) => handleProgramDivisionChange(e.target.value)}
                  data-testid="detail-pgm-div"
                  aria-label="?„ë¡œê·¸ë¨ êµ¬ë¶„ ? íƒ"
                >
                  <option value="">? íƒ</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
              <th className="form-th">?…ë¬´êµ¬ë¶„</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.bizDivCd || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, bizDivCd: e.target.value } : null)}
                  data-testid="detail-biz-div"
                  aria-label="?…ë¬´ êµ¬ë¶„ ? íƒ"
                >
                  <option value="">? íƒ</option>
                  {bizDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2??*/}
            <tr className="form-tr">
              <th className="form-th required">?Œì¼ê²½ë¡œ</th>
              <td className="form-td" colSpan={5}>
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.linkPath || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, linkPath: e.target.value } : null)}
                  data-testid="detail-link-path"
                  aria-label="?Œì¼ ê²½ë¡œ ?…ë ¥"
                />
              </td>
              <th className="form-th required">?¬ìš©?¬ë?</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.useYn || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, useYn: e.target.value } : null)}
                  data-testid="detail-use-yn"
                  aria-label="?¬ìš© ?¬ë? ? íƒ"
                >
                  <option value="">? íƒ</option>
                  <option value="Y">?¬ìš©</option>
                  <option value="N">ë¯¸ì‚¬??/option>
                </select>
              </td>
            </tr>

            {/* 3??*/}
            <tr className="form-tr">
              <th className="form-th">?ì—…?“ì´(width)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmWdth || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmWdth: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-wdth"
                  aria-label="?ì—… ?ˆë¹„ ?…ë ¥"
                />
              </td>
              <th className="form-th">?ì—…?’ì´(height)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmHght || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmHght: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-hght"
                  aria-label="?ì—… ?’ì´ ?…ë ¥"
                />
              </td>
              <th className="form-th">?ì—…?„ì¹˜(top)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnTop || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnTop: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-top"
                  aria-label="?ì—… ?„ì¹˜ top ?…ë ¥"
                />
              </td>
              <th className="form-th">?ì—…?„ì¹˜(left)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnLft || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnLft: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-lft"
                  aria-label="?ì—… ?„ì¹˜ left ?…ë ¥"
                />
              </td>
            </tr>

            {/* 4??*/}
            <tr className="form-tr">
              <th className="form-th">?€??MDI</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.tgtMdiDivCd || 'MAIN'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, tgtMdiDivCd: e.target.value } : null)}
                  data-testid="detail-tgt-mdi-div"
                  aria-label="?€??MDI ? íƒ"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SUB">SUB</option>
                </select>
              </td>
              <th className="form-th">?¬ê¸°ì¡°ì ˆ ?¬ìš©</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupSwtUseYn || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupSwtUseYn: e.target.value } : null)}
                  data-testid="detail-popup-swt-use-yn"
                  aria-label="?¬ê¸°ì¡°ì ˆ ?¬ìš© ?¬ë? ? íƒ"
                >
                  <option value="Y">?¬ìš©</option>
                  <option value="N">ë¯¸ì‚¬??/option>
                </select>
              </td>
              <th className="form-th">?ì—…?„í™˜ ?¬ìš©</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupMoni || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupMoni: e.target.value } : null)}
                  data-testid="detail-popup-moni"
                  aria-label="?ì—…?„í™˜ ?¬ìš© ?¬ë? ? íƒ"
                >
                  <option value="Y">?¬ìš©</option>
                  <option value="N">ë¯¸ì‚¬??/option>
                </select>
              </td>
            </tr>

          </tbody>
        </table>

        {/* ë²„íŠ¼ ?ì—­ */}
        <div className="flex gap-2 justify-end" data-testid="button-section">
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handlePreview}
            disabled={!selectedProgram}
            data-testid="preview-button"
            aria-label="?„ë¡œê·¸ë¨ ë¯¸ë¦¬ë³´ê¸°"
          >
            ë¯¸ë¦¬ë³´ê¸°
          </button>
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handleNew}
            data-testid="new-button"
            aria-label="???„ë¡œê·¸ë¨ ?±ë¡"
          >
            ? ê·œ
          </button>
          <button 
            type="button" 
            className="btn-base btn-act" 
            onClick={handleSave}
            disabled={!selectedProgram}
            data-testid="save-button"
            aria-label="?„ë¡œê·¸ë¨ ?€??
          >
            ?€??
          </button>
        </div>
      </div>
    </div>
  );
} 

