/**
 * SYS1000M00 - ?�로그램 관�??�면
 *
 * 주요 기능:
 * - ?�로그램 목록 조회 �?검??
 * - ?�로그램 ?�규 ?�록 �??�정
 * - ?�로그램 구분�??�드 ?�성??비활?�화
 * - ?�로그램 미리보기 �??��? ?�운로드
 *
 * API ?�동:
 * - GET /api/sys/programs - ?�로그램 목록 조회
 * - POST /api/sys/programs - ?�로그램 ?�??
 * - POST /api/common/search - 공통코드 조회 (?�로그램구분: 305, ?�무구분: 303)
 *
 * ?�태 관�?
 * - ?�로그램 목록 �??�택???�로그램
 * - 검??조건 (?�로그램?�워?? ?�로그램구분, ?�용?��?, ?�무구분)
 * - ?�로그램구분/?�무구분 코드 목록
 * - MDI 모드 ?�태 (?�로그램구분???�른 ?�드 ?�성??
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (?�로그램?�워?? ?�로그램구분, ?�용?��?, ?�무구분)
 * - ?�로그램 목록 ?�이�?(AG-Grid)
 * - ?�로그램 ?�세 ?�보 ?�력 ??
 * - ?�???�규/미리보기/?��??�운로드 버튼
 *
 * ?��? ?�면:
 * - SYS1001M00: 메뉴 관�?(?�로그램 ?�결)
 * - SYS1002M00: 메뉴�??�로그램 관�?
 *
 * ?�이??구조:
 * - Program: ?�로그램 ?�보 (pgmId, pgmNm, pgmDivCd, bizDivCd, useYn, linkPath ??
 * - SystemCode: 공통코드 ?�보 (codeId, codeName, codeValue ??
 *
 * ?�이?�항:
 * - ?�로그램구분??'MDI'??경우 ?�업 관???�드 ?�성??
 * - ?�로그램구분/?�무구분?� 공통코드 ?�이블에???�적 조회
 * - ?��? ?�운로드 ???�재 검??조건???�이?�만 ?�운로드
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

  // AG-Grid 컬럼 ?�의
  const [columnDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '?�로그램ID', field: 'pgmId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�로그램�?, field: 'pgmNm', width: 220, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?�로그램구분', field: 'pgmDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�무구분', field: 'bizDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�용?��?', field: 'useYn', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '?�용' : '미사?? },
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
  // ?�로그램구분 코드 목록 ?�태
  const [pgmDivOptions, setPgmDivOptions] = useState<SystemCode[]>([]);
  // ?�무구분 코드 목록 ?�태
  const [bizDivOptions, setBizDivOptions] = useState<SystemCode[]>([]);

  // ?�로그램구분 코드(305) 목록 조회
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
          // API ?�답??SystemCode ?�?�에 맞게 변??
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm??codeName?�로 매핑
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
        console.error('?�로그램구분 코드 조회 ?�패:', e);
        setPgmDivOptions([]);
      }
    };
    fetchPgmDivOptions();
  }, []);

  // ?�무구분 코드(303) 목록 조회
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
          // API ?�답??SystemCode ?�?�에 맞게 변??
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm??codeName?�로 매핑
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
        console.error('?�무구분 코드 조회 ?�패:', e);
        setBizDivOptions([]);
      }
    };
    fetchBizDivOptions();
  }, []);

  // ?�로그램 목록 로드
  const loadData = useCallback(async () => {
    console.log('loadData ?�출?? ?�라미터:', searchConditions);
    setLoading(true);
    try {
      const response = await ProgramService.getProgramList(searchConditions);
      console.log('API ?�답:', response);
      setPrograms(response.data || []);
            } catch (error: any) {
          console.error('?�로그램 목록 로드 ?�패:', error);
          showToast(`?�로그램 목록 로드 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
        } finally {
          setLoading(false);
        }
  }, [searchConditions]);

  // 초기 로드 ?�에�??�이??조회
  useEffect(() => {
    loadData();
  }, []);

  // ?�이??변�???컬럼 ?�기 조정
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [programs]);

  // 조회 조건 변�??�들??
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ?�터???�력 ???�동조회
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadData();
    }
  };

  // ?�로그램 구분 변�????�드 ?�성??비활?�화 처리
  const handleProgramDivisionChange = (value: string) => {
    const isMdi = value === '1'; // MDI 모드
    setIsMdiMode(isMdi);
    
    setSelectedProgram(prev => prev ? { ...prev, pgmDivCd: value } : null);
  };

  // AG-Grid ?�벤???�들??
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const program = selectedRows[0];
      setSelectedProgram(program);
      setIsNewCode(false);
      
      // ?�로그램 구분???�른 ?�드 ?�성??비활?�화
      const isMdi = program.pgmDivCd === '1';
      setIsMdiMode(isMdi);
    } else {
      setSelectedProgram(null);
    }
  };

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?�로그램 ?�택 (기존 ?�수 ?��? - ?�블?�릭??
  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsNewCode(false);
    
    // ?�로그램 구분???�른 ?�드 ?�성??비활?�화
    const isMdi = program.pgmDivCd === '1';
    setIsMdiMode(isMdi);
  };

  // ?�로그램 ?�??
  const handleSave = async () => {
    if (!selectedProgram) return;
    
    // ?�수 ?�력 검�?
    if (!selectedProgram.pgmId) {
      showToast('?�로그램 ID�??�력?�주?�요.', 'warning');
      return;
    }
    if (!selectedProgram.pgmNm) {
      showToast('?�로그램명을 ?�력?�주?�요.', 'warning');
      return;
    }
    if (!selectedProgram.pgmDivCd) {
      showToast('?�로그램 구분???�택?�주?�요.', 'warning');
      return;
    }
    if (!selectedProgram.linkPath) {
      showToast('?�일 경로�??�력?�주?�요.', 'warning');
      return;
    }
    if (!selectedProgram.useYn) {
      showToast('?�용 ?��?�??�택?�주?�요.', 'warning');
      return;
    }
    
    // ?�???�인
    showConfirm({
      message: '?�?�하?�겠?�니�?',
      type: 'info',
      onConfirm: async () => {
        try {
          // ?�업 ?�기 ?�이??처리 �?로깅
          console.log('=== ?�?????�이???�인 ===');
          console.log('?�본 selectedProgram:', selectedProgram);
          console.log('pgmWdth (?�본):', selectedProgram.pgmWdth, '?�??', typeof selectedProgram.pgmWdth);
          console.log('pgmHght (?�본):', selectedProgram.pgmHght, '?�??', typeof selectedProgram.pgmHght);
          
          // �?문자?? 0, null, undefined�?null�?변?�하???�수
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
          
          console.log('처리??값들:');
          console.log('pgmWdth (처리??:', processedPgmWdth);
          console.log('pgmHght (처리??:', processedPgmHght);
          console.log('pgmPsnTop (처리??:', processedPgmPsnTop);
          console.log('pgmPsnLft (처리??:', processedPgmPsnLft);
          
          if (selectedProgram.pgmId && !isNewCode) {
            // ?�정
            const updateData = {
              ...selectedProgram,
              pgmWdth: processedPgmWdth,
              pgmHght: processedPgmHght,
              pgmPsnTop: processedPgmPsnTop,
              pgmPsnLft: processedPgmPsnLft,
            };
            
            console.log('?�정 ?�이??', updateData);
            await ProgramService.updateProgram(selectedProgram.pgmId, updateData);
          } else {
            // ?�규 - ?�정 ?�드?�을 null�??�정
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
            
            console.log('?�규 ?�록 ?�이??', newProgram);
            await ProgramService.createProgram(newProgram);
          }
          loadData();
          showToast('?�?�되?�습?�다.', 'success');
        } catch (error) {
          console.error('?�로그램 ?�???�패:', error);
          showToast('?�?�에 ?�패?�습?�다.', 'error');
        }
      }
    });
    return;
    
    try {
      // �?문자?? 0, null, undefined�?null�?변?�하???�수
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
      
      console.log('처리??값들:');
      console.log('pgmWdth (처리??:', processedPgmWdth);
      console.log('pgmHght (처리??:', processedPgmHght);
      console.log('pgmPsnTop (처리??:', processedPgmPsnTop);
      console.log('pgmPsnLft (처리??:', processedPgmPsnLft);
      
      if (selectedProgram?.pgmId && !isNewCode) {
        // ?�정
        const updateData = {
          ...selectedProgram,
          pgmWdth: processedPgmWdth,
          pgmHght: processedPgmHght,
          pgmPsnTop: processedPgmPsnTop,
          pgmPsnLft: processedPgmPsnLft,
        };
        
        console.log('?�정 ?�이??', updateData);
        await ProgramService.updateProgram(selectedProgram!.pgmId, updateData);
      } else {
        // ?�규 - ?�정 ?�드?�을 null�??�정
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
        
        console.log('?�규 ?�록 ?�이??', newProgram);
        await ProgramService.createProgram(newProgram);
      }
      loadData();
      showToast('?�?�되?�습?�다.', 'success');
    } catch (error) {
      console.error('?�로그램 ?�???�패:', error);
      showToast('?�?�에 ?�패?�습?�다.', 'error');
    }
  };

  // ?�규 버튼 ?�릭
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

  // 미리보기 버튼 ?�릭
  const handlePreview = () => {
    if (!selectedProgram) {
      showToast('?�로그램???�택?�주?�요.', 'warning');
      return;
    }

    if (!selectedProgram.linkPath) {
      showToast('?�일 경로가 ?�습?�다.', 'warning');
      return;
    }

    // ?�로그램 구분???�른 미리보기 처리
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

  // ?��? ?�운로드
  const handleExcelDownload = () => {
    if (programs.length === 0) {
      showToast('?�운로드???�이?��? ?�습?�다.', 'warning');
      return;
    }
    
    showConfirm({
      message: '?��? ?�일???�운로드?�시겠습?�까?',
      type: 'info',
      onConfirm: () => {
        // CSV ?�식?�로 ?�이??변??
        const headers = ['?�로그램ID', '?�로그램�?, '?�로그램구분', '?�무구분', '?�용?��?', '?�일경로'];
        const csvData = programs.map(program => [
          program.pgmId,
          program.pgmNm,
          program.pgmDivCd,
          program.bizDivCd,
          program.useYn === 'Y' ? '?�용' : '미사??,
          program.linkPath
        ]);
        
        const csvContent = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `?�로그램목록_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('?�상?�으�??�운로드?�었?�니??', 'success');
      }
    });
  };

  return (
    <div className="mdi h-screen flex flex-col" data-testid="sys1000m00-container">
      {/* 조회부 */}
      <div className="search-div mb-4 flex-shrink-0" data-testid="search-section">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[131px]">?�로그램ID/�?/th>
              <td className="search-td w-[20%]">
                <input 
                  type="text" 
                  name="pgmKwd"
                  className="input-base input-default w-full" 
                  value={searchConditions.pgmKwd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-kwd"
                  aria-label="?�로그램 ID ?�는 ?�름?�로 검??
                />
              </td>

              <th className="search-th w-[126px]">?�로그램구분</th>
              <td className="search-td w-[10%]">
                <select 
                  name="pgmDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.pgmDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-div"
                  aria-label="?�로그램 구분 ?�택"
                >
                  <option value="">?�체</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>

              <th className="search-th w-[100px]">?�용?��?</th>
              <td className="search-td w-[10%]">
                <select 
                  name="useYn"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.useYn}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-use-yn"
                  aria-label="?�용 ?��? ?�택"
                >
                  <option value="">?�체</option>
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
                </select>
              </td>

              <th className="search-th w-[100px]">?�무구분</th>
              <td className="search-td w-[10%]">
                <select 
                  name="bizDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.bizDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-biz-div"
                  aria-label="?�무 구분 ?�택"
                >
                  <option value="">?�체</option>
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
                  aria-label="?�로그램 목록 조회"
                >
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 그리???�역 */}
      <div className="flex-1 flex flex-col min-h-0" data-testid="grid-section">
        <div className="tit_area flex-shrink-0 flex justify-between items-center">
          <h3>?�로그램목록</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-excel" 
              onClick={handleExcelDownload}
              data-testid="excel-download-button"
              aria-label="?��? ?�일 ?�운로드"
            >
              ?��? ?�운로드
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
            loadingOverlayComponent={() => <div className="text-center py-4">로딩 �?..</div>}
            noRowsOverlayComponent={() => <div className="text-center py-4">조회???�보가 ?�습?�다.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            rowHeight={32}
            headerHeight={40}
          />
        </div>
      </div>

      {/* ?�세 ?�보 ?�역 */}
      <div className="flex-shrink-0" data-testid="detail-section">
        <div className="tit_area">
          <h3>?�로그램 ?�보</h3>
        </div>
        <table className="form-table mb-4">
          <tbody>
            {/* 1??*/}
            <tr className="form-tr">
              <th className="form-th required">?�로그램ID</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmId || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmId: e.target.value } : null)}
                  disabled={!isNewCode}
                  data-testid="detail-pgm-id"
                  aria-label="?�로그램 ID ?�력"
                />
              </td>
              <th className="form-th required">?�로그램�?/th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmNm || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmNm: e.target.value } : null)}
                  data-testid="detail-pgm-nm"
                  aria-label="?�로그램�??�력"
                />
              </td>
              <th className="form-th required">?�로그램구분</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.pgmDivCd || ''}
                  onChange={(e) => handleProgramDivisionChange(e.target.value)}
                  data-testid="detail-pgm-div"
                  aria-label="?�로그램 구분 ?�택"
                >
                  <option value="">?�택</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
              <th className="form-th">?�무구분</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.bizDivCd || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, bizDivCd: e.target.value } : null)}
                  data-testid="detail-biz-div"
                  aria-label="?�무 구분 ?�택"
                >
                  <option value="">?�택</option>
                  {bizDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2??*/}
            <tr className="form-tr">
              <th className="form-th required">?�일경로</th>
              <td className="form-td" colSpan={5}>
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.linkPath || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, linkPath: e.target.value } : null)}
                  data-testid="detail-link-path"
                  aria-label="?�일 경로 ?�력"
                />
              </td>
              <th className="form-th required">?�용?��?</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.useYn || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, useYn: e.target.value } : null)}
                  data-testid="detail-use-yn"
                  aria-label="?�용 ?��? ?�택"
                >
                  <option value="">?�택</option>
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
                </select>
              </td>
            </tr>

            {/* 3??*/}
            <tr className="form-tr">
              <th className="form-th">?�업?�이(width)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmWdth || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmWdth: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-wdth"
                  aria-label="?�업 ?�비 ?�력"
                />
              </td>
              <th className="form-th">?�업?�이(height)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmHght || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmHght: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-hght"
                  aria-label="?�업 ?�이 ?�력"
                />
              </td>
              <th className="form-th">?�업?�치(top)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnTop || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnTop: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-top"
                  aria-label="?�업 ?�치 top ?�력"
                />
              </td>
              <th className="form-th">?�업?�치(left)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnLft || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnLft: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-lft"
                  aria-label="?�업 ?�치 left ?�력"
                />
              </td>
            </tr>

            {/* 4??*/}
            <tr className="form-tr">
              <th className="form-th">?�??MDI</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.tgtMdiDivCd || 'MAIN'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, tgtMdiDivCd: e.target.value } : null)}
                  data-testid="detail-tgt-mdi-div"
                  aria-label="?�??MDI ?�택"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SUB">SUB</option>
                </select>
              </td>
              <th className="form-th">?�기조절 ?�용</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupSwtUseYn || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupSwtUseYn: e.target.value } : null)}
                  data-testid="detail-popup-swt-use-yn"
                  aria-label="?�기조절 ?�용 ?��? ?�택"
                >
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
                </select>
              </td>
              <th className="form-th">?�업?�환 ?�용</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupMoni || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupMoni: e.target.value } : null)}
                  data-testid="detail-popup-moni"
                  aria-label="?�업?�환 ?�용 ?��? ?�택"
                >
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
                </select>
              </td>
            </tr>

          </tbody>
        </table>

        {/* 버튼 ?�역 */}
        <div className="flex gap-2 justify-end" data-testid="button-section">
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handlePreview}
            disabled={!selectedProgram}
            data-testid="preview-button"
            aria-label="?�로그램 미리보기"
          >
            미리보기
          </button>
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handleNew}
            data-testid="new-button"
            aria-label="???�로그램 ?�록"
          >
            ?�규
          </button>
          <button 
            type="button" 
            className="btn-base btn-act" 
            onClick={handleSave}
            disabled={!selectedProgram}
            data-testid="save-button"
            aria-label="?�로그램 ?�??
          >
            ?�??
          </button>
        </div>
      </div>
    </div>
  );
} 

