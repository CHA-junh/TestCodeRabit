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

    // CSV ?μ?Όλ‘ ?°μ΄???μ± (Excel?μ ?????μ)
    const csvData = this.convertToCSV();

    // CSV ?μΌλ‘????
    const csvPath = outputPath.replace('.xlsx', '.csv');
    fs.writeFileSync(csvPath, csvData, 'utf8');

    console.log(`? ?μ€??λ¦¬ν¬?Έκ? ?μ±?μ?΅λ?? ${csvPath}`);
  }

  convertToCSV() {
    const headers = [
      '?μ€???€μ??,
      '?μ€??μΌ?΄μ€',
      '?ν',
      '?€ν ?κ° (ms)',
      '?λ¬ λ©μμ§',
      '?€ν ?Έλ ?΄μ€',
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


