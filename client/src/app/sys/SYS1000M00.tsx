/**
 * SYS1000M00 - 프로그램 관리 화면
 *
 * 주요 기능:
 * - 프로그램 목록 조회 및 검색
 * - 프로그램 신규 등록 및 수정
 * - 프로그램 구분별 필드 활성화/비활성화
 * - 프로그램 미리보기 및 엑셀 다운로드
 *
 * API 연동:
 * - GET /api/sys/programs - 프로그램 목록 조회
 * - POST /api/sys/programs - 프로그램 저장
 * - POST /api/common/search - 공통코드 조회 (프로그램구분: 305, 업무구분: 303)
 *
 * 상태 관리:
 * - 프로그램 목록 및 선택된 프로그램
 * - 검색 조건 (프로그램키워드, 프로그램구분, 사용여부, 업무구분)
 * - 프로그램구분/업무구분 코드 목록
 * - MDI 모드 상태 (프로그램구분에 따른 필드 활성화)
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (프로그램키워드, 프로그램구분, 사용여부, 업무구분)
 * - 프로그램 목록 테이블 (AG-Grid)
 * - 프로그램 상세 정보 입력 폼
 * - 저장/신규/미리보기/엑셀다운로드 버튼
 *
 * 연관 화면:
 * - SYS1001M00: 메뉴 관리 (프로그램 연결)
 * - SYS1002M00: 메뉴별 프로그램 관리
 *
 * 데이터 구조:
 * - Program: 프로그램 정보 (pgmId, pgmNm, pgmDivCd, bizDivCd, useYn, linkPath 등)
 * - SystemCode: 공통코드 정보 (codeId, codeName, codeValue 등)
 *
 * 특이사항:
 * - 프로그램구분이 'MDI'인 경우 팝업 관련 필드 활성화
 * - 프로그램구분/업무구분은 공통코드 테이블에서 동적 조회
 * - 엑셀 다운로드 시 현재 검색 조건의 데이터만 다운로드
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

  // AG-Grid 컬럼 정의
  const [columnDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '프로그램ID', field: 'pgmId', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '프로그램명', field: 'pgmNm', width: 220, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '프로그램구분', field: 'pgmDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '업무구분', field: 'bizDivNm', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '사용여부', field: 'useYn', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value === 'Y' ? '사용' : '미사용' },
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
  // 프로그램구분 코드 목록 상태
  const [pgmDivOptions, setPgmDivOptions] = useState<SystemCode[]>([]);
  // 업무구분 코드 목록 상태
  const [bizDivOptions, setBizDivOptions] = useState<SystemCode[]>([]);

  // 프로그램구분 코드(305) 목록 조회
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
          // API 응답을 SystemCode 타입에 맞게 변환
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm을 codeName으로 매핑
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
        console.error('프로그램구분 코드 조회 실패:', e);
        setPgmDivOptions([]);
      }
    };
    fetchPgmDivOptions();
  }, []);

  // 업무구분 코드(303) 목록 조회
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
          // API 응답을 SystemCode 타입에 맞게 변환
          const transformedData = data.data.map((item: any) => ({
            codeId: item.codeId,
            codeName: item.codeNm, // codeNm을 codeName으로 매핑
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
        console.error('업무구분 코드 조회 실패:', e);
        setBizDivOptions([]);
      }
    };
    fetchBizDivOptions();
  }, []);

  // 프로그램 목록 로드
  const loadData = useCallback(async () => {
    console.log('loadData 호출됨, 파라미터:', searchConditions);
    setLoading(true);
    try {
      const response = await ProgramService.getProgramList(searchConditions);
      console.log('API 응답:', response);
      setPrograms(response.data || []);
            } catch (error: any) {
          console.error('프로그램 목록 로드 실패:', error);
          showToast(`프로그램 목록 로드 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
        } finally {
          setLoading(false);
        }
  }, [searchConditions]);

  // 초기 로드 시에만 데이터 조회
  useEffect(() => {
    loadData();
  }, []);

  // 데이터 변경 시 컬럼 크기 조정
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [programs]);

  // 조회 조건 변경 핸들러
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 엔터키 입력 시 자동조회
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadData();
    }
  };

  // 프로그램 구분 변경 시 필드 활성화/비활성화 처리
  const handleProgramDivisionChange = (value: string) => {
    const isMdi = value === '1'; // MDI 모드
    setIsMdiMode(isMdi);
    
    setSelectedProgram(prev => prev ? { ...prev, pgmDivCd: value } : null);
  };

  // AG-Grid 이벤트 핸들러
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const program = selectedRows[0];
      setSelectedProgram(program);
      setIsNewCode(false);
      
      // 프로그램 구분에 따른 필드 활성화/비활성화
      const isMdi = program.pgmDivCd === '1';
      setIsMdiMode(isMdi);
    } else {
      setSelectedProgram(null);
    }
  };

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // 프로그램 선택 (기존 함수 유지 - 더블클릭용)
  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsNewCode(false);
    
    // 프로그램 구분에 따른 필드 활성화/비활성화
    const isMdi = program.pgmDivCd === '1';
    setIsMdiMode(isMdi);
  };

  // 프로그램 저장
  const handleSave = async () => {
    if (!selectedProgram) return;
    
    // 필수 입력 검증
    if (!selectedProgram.pgmId) {
      showToast('프로그램 ID를 입력해주세요.', 'warning');
      return;
    }
    if (!selectedProgram.pgmNm) {
      showToast('프로그램명을 입력해주세요.', 'warning');
      return;
    }
    if (!selectedProgram.pgmDivCd) {
      showToast('프로그램 구분을 선택해주세요.', 'warning');
      return;
    }
    if (!selectedProgram.linkPath) {
      showToast('파일 경로를 입력해주세요.', 'warning');
      return;
    }
    if (!selectedProgram.useYn) {
      showToast('사용 여부를 선택해주세요.', 'warning');
      return;
    }
    
    // 저장 확인
    showConfirm({
      message: '저장하시겠습니까?',
      type: 'info',
      onConfirm: async () => {
        try {
          // 팝업 크기 데이터 처리 및 로깅
          console.log('=== 저장 전 데이터 확인 ===');
          console.log('원본 selectedProgram:', selectedProgram);
          console.log('pgmWdth (원본):', selectedProgram.pgmWdth, '타입:', typeof selectedProgram.pgmWdth);
          console.log('pgmHght (원본):', selectedProgram.pgmHght, '타입:', typeof selectedProgram.pgmHght);
          
          // 빈 문자열, 0, null, undefined를 null로 변환하는 함수
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
          
          console.log('처리된 값들:');
          console.log('pgmWdth (처리후):', processedPgmWdth);
          console.log('pgmHght (처리후):', processedPgmHght);
          console.log('pgmPsnTop (처리후):', processedPgmPsnTop);
          console.log('pgmPsnLft (처리후):', processedPgmPsnLft);
          
          if (selectedProgram.pgmId && !isNewCode) {
            // 수정
            const updateData = {
              ...selectedProgram,
              pgmWdth: processedPgmWdth,
              pgmHght: processedPgmHght,
              pgmPsnTop: processedPgmPsnTop,
              pgmPsnLft: processedPgmPsnLft,
            };
            
            console.log('수정 데이터:', updateData);
            await ProgramService.updateProgram(selectedProgram.pgmId, updateData);
          } else {
            // 신규 - 특정 필드들을 null로 설정
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
            
            console.log('신규 등록 데이터:', newProgram);
            await ProgramService.createProgram(newProgram);
          }
          loadData();
          showToast('저장되었습니다.', 'success');
        } catch (error) {
          console.error('프로그램 저장 실패:', error);
          showToast('저장에 실패했습니다.', 'error');
        }
      }
    });
    return;
    
    try {
      // 빈 문자열, 0, null, undefined를 null로 변환하는 함수
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
      
      console.log('처리된 값들:');
      console.log('pgmWdth (처리후):', processedPgmWdth);
      console.log('pgmHght (처리후):', processedPgmHght);
      console.log('pgmPsnTop (처리후):', processedPgmPsnTop);
      console.log('pgmPsnLft (처리후):', processedPgmPsnLft);
      
      if (selectedProgram?.pgmId && !isNewCode) {
        // 수정
        const updateData = {
          ...selectedProgram,
          pgmWdth: processedPgmWdth,
          pgmHght: processedPgmHght,
          pgmPsnTop: processedPgmPsnTop,
          pgmPsnLft: processedPgmPsnLft,
        };
        
        console.log('수정 데이터:', updateData);
        await ProgramService.updateProgram(selectedProgram!.pgmId, updateData);
      } else {
        // 신규 - 특정 필드들을 null로 설정
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
        
        console.log('신규 등록 데이터:', newProgram);
        await ProgramService.createProgram(newProgram);
      }
      loadData();
      showToast('저장되었습니다.', 'success');
    } catch (error) {
      console.error('프로그램 저장 실패:', error);
      showToast('저장에 실패했습니다.', 'error');
    }
  };

  // 신규 버튼 클릭
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

  // 미리보기 버튼 클릭
  const handlePreview = () => {
    if (!selectedProgram) {
      showToast('프로그램을 선택해주세요.', 'warning');
      return;
    }

    if (!selectedProgram.linkPath) {
      showToast('파일 경로가 없습니다.', 'warning');
      return;
    }

    // 프로그램 구분에 따른 미리보기 처리
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

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (programs.length === 0) {
      showToast('다운로드할 데이터가 없습니다.', 'warning');
      return;
    }
    
    showConfirm({
      message: '엑셀 파일을 다운로드하시겠습니까?',
      type: 'info',
      onConfirm: () => {
        // CSV 형식으로 데이터 변환
        const headers = ['프로그램ID', '프로그램명', '프로그램구분', '업무구분', '사용여부', '파일경로'];
        const csvData = programs.map(program => [
          program.pgmId,
          program.pgmNm,
          program.pgmDivCd,
          program.bizDivCd,
          program.useYn === 'Y' ? '사용' : '미사용',
          program.linkPath
        ]);
        
        const csvContent = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `프로그램목록_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('정상적으로 다운로드되었습니다.', 'success');
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
              <th className="search-th w-[131px]">프로그램ID/명</th>
              <td className="search-td w-[20%]">
                <input 
                  type="text" 
                  name="pgmKwd"
                  className="input-base input-default w-full" 
                  value={searchConditions.pgmKwd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-kwd"
                  aria-label="프로그램 ID 또는 이름으로 검색"
                />
              </td>

              <th className="search-th w-[126px]">프로그램구분</th>
              <td className="search-td w-[10%]">
                <select 
                  name="pgmDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.pgmDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-pgm-div"
                  aria-label="프로그램 구분 선택"
                >
                  <option value="">전체</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>

              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select 
                  name="useYn"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.useYn}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-use-yn"
                  aria-label="사용 여부 선택"
                >
                  <option value="">전체</option>
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </td>

              <th className="search-th w-[100px]">업무구분</th>
              <td className="search-td w-[10%]">
                <select 
                  name="bizDivCd"
                  className="combo-base w-full min-w-[100px]"
                  value={searchConditions.bizDivCd}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  data-testid="search-biz-div"
                  aria-label="업무 구분 선택"
                >
                  <option value="">전체</option>
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
                  aria-label="프로그램 목록 조회"
                >
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 그리드 영역 */}
      <div className="flex-1 flex flex-col min-h-0" data-testid="grid-section">
        <div className="tit_area flex-shrink-0 flex justify-between items-center">
          <h3>프로그램목록</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-excel" 
              onClick={handleExcelDownload}
              data-testid="excel-download-button"
              aria-label="엑셀 파일 다운로드"
            >
              엑셀 다운로드
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
            loadingOverlayComponent={() => <div className="text-center py-4">로딩 중...</div>}
            noRowsOverlayComponent={() => <div className="text-center py-4">조회된 정보가 없습니다.</div>}
            suppressRowClickSelection={false}
            animateRows={true}
            rowHeight={32}
            headerHeight={40}
          />
        </div>
      </div>

      {/* 상세 정보 영역 */}
      <div className="flex-shrink-0" data-testid="detail-section">
        <div className="tit_area">
          <h3>프로그램 정보</h3>
        </div>
        <table className="form-table mb-4">
          <tbody>
            {/* 1행 */}
            <tr className="form-tr">
              <th className="form-th required">프로그램ID</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmId || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmId: e.target.value } : null)}
                  disabled={!isNewCode}
                  data-testid="detail-pgm-id"
                  aria-label="프로그램 ID 입력"
                />
              </td>
              <th className="form-th required">프로그램명</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmNm || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmNm: e.target.value } : null)}
                  data-testid="detail-pgm-nm"
                  aria-label="프로그램명 입력"
                />
              </td>
              <th className="form-th required">프로그램구분</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.pgmDivCd || ''}
                  onChange={(e) => handleProgramDivisionChange(e.target.value)}
                  data-testid="detail-pgm-div"
                  aria-label="프로그램 구분 선택"
                >
                  <option value="">선택</option>
                  {pgmDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
              <th className="form-th">업무구분</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.bizDivCd || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, bizDivCd: e.target.value } : null)}
                  data-testid="detail-biz-div"
                  aria-label="업무 구분 선택"
                >
                  <option value="">선택</option>
                  {bizDivOptions.map(opt => (
                    <option key={opt.codeId} value={opt.codeId}>{opt.codeName}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2행 */}
            <tr className="form-tr">
              <th className="form-th required">파일경로</th>
              <td className="form-td" colSpan={5}>
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.linkPath || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, linkPath: e.target.value } : null)}
                  data-testid="detail-link-path"
                  aria-label="파일 경로 입력"
                />
              </td>
              <th className="form-th required">사용여부</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.useYn || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, useYn: e.target.value } : null)}
                  data-testid="detail-use-yn"
                  aria-label="사용 여부 선택"
                >
                  <option value="">선택</option>
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </td>
            </tr>

            {/* 3행 */}
            <tr className="form-tr">
              <th className="form-th">팝업넓이(width)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmWdth || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmWdth: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-wdth"
                  aria-label="팝업 너비 입력"
                />
              </td>
              <th className="form-th">팝업높이(height)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmHght || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmHght: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-hght"
                  aria-label="팝업 높이 입력"
                />
              </td>
              <th className="form-th">팝업위치(top)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnTop || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnTop: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-top"
                  aria-label="팝업 위치 top 입력"
                />
              </td>
              <th className="form-th">팝업위치(left)</th>
              <td className="form-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={selectedProgram?.pgmPsnLft || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, pgmPsnLft: parseInt(e.target.value) || 0 } : null)}
                  data-testid="detail-pgm-psn-lft"
                  aria-label="팝업 위치 left 입력"
                />
              </td>
            </tr>

            {/* 4행 */}
            <tr className="form-tr">
              <th className="form-th">대상 MDI</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.tgtMdiDivCd || 'MAIN'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, tgtMdiDivCd: e.target.value } : null)}
                  data-testid="detail-tgt-mdi-div"
                  aria-label="대상 MDI 선택"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SUB">SUB</option>
                </select>
              </td>
              <th className="form-th">크기조절 사용</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupSwtUseYn || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupSwtUseYn: e.target.value } : null)}
                  data-testid="detail-popup-swt-use-yn"
                  aria-label="크기조절 사용 여부 선택"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </td>
              <th className="form-th">팝업전환 사용</th>
              <td className="form-td">
                <select 
                  className="combo-base w-full"
                  value={selectedProgram?.popupMoni || 'N'}
                  onChange={(e) => setSelectedProgram(prev => prev ? { ...prev, popupMoni: e.target.value } : null)}
                  data-testid="detail-popup-moni"
                  aria-label="팝업전환 사용 여부 선택"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </td>
            </tr>

          </tbody>
        </table>

        {/* 버튼 영역 */}
        <div className="flex gap-2 justify-end" data-testid="button-section">
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handlePreview}
            disabled={!selectedProgram}
            data-testid="preview-button"
            aria-label="프로그램 미리보기"
          >
            미리보기
          </button>
          <button 
            type="button" 
            className="btn-base btn-etc" 
            onClick={handleNew}
            data-testid="new-button"
            aria-label="새 프로그램 등록"
          >
            신규
          </button>
          <button 
            type="button" 
            className="btn-base btn-act" 
            onClick={handleSave}
            disabled={!selectedProgram}
            data-testid="save-button"
            aria-label="프로그램 저장"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
} 