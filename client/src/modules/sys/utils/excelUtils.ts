import * as XLSX from 'xlsx';

export interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
}

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  columns?: ExcelColumn[];
}

/**
 * 데이터를 Excel 파일로 다운로드합니다.
 * @param data 다운로드할 데이터 배열
 * @param options Excel 옵션
 */
export function downloadExcel<T extends Record<string, any>>(
  data: T[],
  options: ExcelExportOptions = {}
): void {
  const {
    filename = 'export.xlsx',
    sheetName = 'Sheet1',
    columns = []
  } = options;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();

  // 데이터 준비
  let exportData: any[] = [];

  if (columns.length > 0) {
    // 컬럼이 지정된 경우
    exportData = data.map(item => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        row[col.header] = item[col.key];
      });
      return row;
    });
  } else {
    // 컬럼이 지정되지 않은 경우, 첫 번째 항목의 키를 사용
    if (data.length > 0) {
      const firstItem = data[0];
      exportData = data.map(item => {
        const row: Record<string, any> = {};
        Object.keys(firstItem).forEach(key => {
          row[key] = item[key];
        });
        return row;
      });
    }
  }

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // 컬럼 너비 설정
  if (columns.length > 0) {
    const colWidths: { [key: string]: number } = {};
    columns.forEach((col, index) => {
      if (col.width) {
        colWidths[XLSX.utils.encode_col(index)] = col.width;
      }
    });
    worksheet['!cols'] = Object.keys(colWidths).map(key => ({
      width: colWidths[key]
    }));
  }

  // 워크시트를 워크북에 추가
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 파일 다운로드
  XLSX.writeFile(workbook, filename);
}

/**
 * CSV 형식으로 데이터를 다운로드합니다.
 * @param data 다운로드할 데이터 배열
 * @param options CSV 옵션
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  options: { filename?: string; columns?: ExcelColumn[] } = {}
): void {
  const { filename = 'export.csv', columns = [] } = options;

  let csvContent = '';

  if (data.length === 0) {
    csvContent = '';
  } else if (columns.length > 0) {
    // 헤더 추가
    const headers = columns.map(col => col.header);
    csvContent += headers.join(',') + '\n';

    // 데이터 추가
    data.forEach(item => {
      const row = columns.map(col => {
        const value = item[col.key];
        // CSV에서 쉼표와 따옴표 처리
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += row.join(',') + '\n';
    });
  } else {
    // 컬럼이 지정되지 않은 경우
    const firstItem = data[0];
    const headers = Object.keys(firstItem);
    csvContent += headers.join(',') + '\n';

    data.forEach(item => {
      const row = headers.map(key => {
        const value = item[key];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += row.join(',') + '\n';
    });
  }

  // 파일 다운로드
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 