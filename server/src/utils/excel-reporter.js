const fs = require('fs');
const path = require('path');

class ExcelReporter {
  constructor(globalConfig, options) {
    this.globalConfig = globalConfig;
    this.options = options;
    this.results = [];
  }

  onRunComplete(contexts, results) {
    this.results = results;
    this.generateExcelReport();
  }

  generateExcelReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.resolve(
      __dirname,
      '../../../server-test-report.xlsx',
    );

    // CSV 형식으로 데이터 생성 (Excel에서 열 수 있음)
    const csvData = this.convertToCSV();

    // CSV 파일로 저장
    const csvPath = outputPath.replace('.xlsx', '.csv');
    fs.writeFileSync(csvPath, csvData, 'utf8');

    console.log(`📊 테스트 리포트가 생성되었습니다: ${csvPath}`);
  }

  convertToCSV() {
    const headers = [
      '테스트 스위트',
      '테스트 케이스',
      '상태',
      '실행 시간 (ms)',
      '에러 메시지',
      '스택 트레이스',
    ];

    const rows = [headers.join(',')];

    this.results.testResults.forEach((testResult) => {
      testResult.testResults.forEach((test) => {
        const row = [
          `"${testResult.testFilePath}"`,
          `"${test.title}"`,
          `"${test.status}"`,
          `"${test.duration || 0}"`,
          `"${test.failureMessages ? test.failureMessages.join('; ') : ''}"`,
          `"${test.failureDetails ? test.failureDetails.map((f) => f.stack).join('; ') : ''}"`,
        ];
        rows.push(row.join(','));
      });
    });

    return rows.join('\n');
  }
}

module.exports = ExcelReporter;
