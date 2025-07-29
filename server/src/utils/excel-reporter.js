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

    // CSV ?•ì‹?¼ë¡œ ?°ì´???ì„± (Excel?ì„œ ?????ˆìŒ)
    const csvData = this.convertToCSV();

    // CSV ?Œì¼ë¡??€??
    const csvPath = outputPath.replace('.xlsx', '.csv');
    fs.writeFileSync(csvPath, csvData, 'utf8');

    console.log(`?“Š ?ŒìŠ¤??ë¦¬í¬?¸ê? ?ì„±?˜ì—ˆ?µë‹ˆ?? ${csvPath}`);
  }

  convertToCSV() {
    const headers = [
      '?ŒìŠ¤???¤ìœ„??,
      '?ŒìŠ¤??ì¼€?´ìŠ¤',
      '?íƒœ',
      '?¤í–‰ ?œê°„ (ms)',
      '?ëŸ¬ ë©”ì‹œì§€',
      '?¤íƒ ?¸ë ˆ?´ìŠ¤',
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


