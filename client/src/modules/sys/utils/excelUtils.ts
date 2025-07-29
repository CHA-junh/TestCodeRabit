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
 * ?°ì´?°ë? Excel ?Œì¼ë¡??¤ìš´ë¡œë“œ?©ë‹ˆ??
 * @param data ?¤ìš´ë¡œë“œ???°ì´??ë°°ì—´
 * @param options Excel ?µì…˜
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

  // ?Œí¬ë¶??ì„±
  const workbook = XLSX.utils.book_new();

  // ?°ì´??ì¤€ë¹?
  let exportData: any[] = [];

  if (columns.length > 0) {
    // ì»¬ëŸ¼??ì§€?•ëœ ê²½ìš°
    exportData = data.map(item => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        row[col.header] = item[col.key];
      });
      return row;
    });
  } else {
    // ì»¬ëŸ¼??ì§€?•ë˜ì§€ ?Šì? ê²½ìš°, ì²?ë²ˆì§¸ ??ª©???¤ë? ?¬ìš©
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

  // ?Œí¬?œíŠ¸ ?ì„±
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // ì»¬ëŸ¼ ?ˆë¹„ ?¤ì •
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

  // ?Œí¬?œíŠ¸ë¥??Œí¬ë¶ì— ì¶”ê?
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // ?Œì¼ ?¤ìš´ë¡œë“œ
  XLSX.writeFile(workbook, filename);
}

/**
 * CSV ?•ì‹?¼ë¡œ ?°ì´?°ë? ?¤ìš´ë¡œë“œ?©ë‹ˆ??
 * @param data ?¤ìš´ë¡œë“œ???°ì´??ë°°ì—´
 * @param options CSV ?µì…˜
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
    // ?¤ë” ì¶”ê?
    const headers = columns.map(col => col.header);
    csvContent += headers.join(',') + '\n';

    // ?°ì´??ì¶”ê?
    data.forEach(item => {
      const row = columns.map(col => {
        const value = item[col.key];
        // CSV?ì„œ ?¼í‘œ?€ ?°ì˜´??ì²˜ë¦¬
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += row.join(',') + '\n';
    });
  } else {
    // ì»¬ëŸ¼??ì§€?•ë˜ì§€ ?Šì? ê²½ìš°
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

  // ?Œì¼ ?¤ìš´ë¡œë“œ
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


