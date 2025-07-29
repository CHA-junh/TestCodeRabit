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

    // CSV ?�식?�로 ?�이???�성 (Excel?�서 ?????�음)
    const csvData = this.convertToCSV();

    // CSV ?�일�??�??
    const csvPath = outputPath.replace('.xlsx', '.csv');
    fs.writeFileSync(csvPath, csvData, 'utf8');

    console.log(`?�� ?�스??리포?��? ?�성?�었?�니?? ${csvPath}`);
  }

  convertToCSV() {
    const headers = [
      '?�스???�위??,
      '?�스??케?�스',
      '?�태',
      '?�행 ?�간 (ms)',
      '?�러 메시지',
      '?�택 ?�레?�스',
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


