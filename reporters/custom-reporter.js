const Mocha = require('mocha');
const { Base } = Mocha.reporters;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class CustomReporter extends Base {
  constructor(runner) {
    super(runner);

    let passes = 0;
    let failures = 0;
    let tests = [];
    let errors = [];

    runner.on('pass', (test) => {
      passes++;
      tests.push({
        title: test.title,
        state: 'passed',
        duration: test.duration,
      });
    });

    runner.on('fail', (test, err) => {
      failures++;
      tests.push({
        title: test.title,
        state: 'failed',
        duration: test.duration,
        error: err.message,
      });
      errors.push({
        title: test.title,
        error: err.message,
      });
    });

    runner.on('end', () => {
      console.log('%d/%d tests passed', passes, passes + failures);
      console.log('%d tests failed', failures);

      // Generate PDF report after tests complete
      this.createPDFReport(tests);
    });
  }

  createPDFReport(tests) {
    const doc = new PDFDocument();
    const fileName = path.join('C:', 'Users', 'mhami', 'Documents', 'PDF report', `test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
    const filePath = path.resolve(fileName); // Resolve absolute file path

    try {
      doc.pipe(fs.createWriteStream(filePath));

      const currentDate = new Date().toLocaleString();

      // Title Page
      doc.fontSize(22).text('Test Results Report', { align: 'center' });
      doc.fontSize(14).text(`Date: ${currentDate}`, { align: 'center' });
      doc.moveDown(2);

      // Summary
      doc.fontSize(18).text('Summary', { underline: true });
      doc.fontSize(14).text(`Total Tests: ${tests.length}`);
      doc.text(`Passed: ${tests.filter(t => t.state === 'passed').length}`);
      doc.text(`Failed: ${tests.filter(t => t.state === 'failed').length}`);
      doc.moveDown(2);

      // Test Details
      doc.fontSize(18).text('Test Details', { underline: true });

      tests.forEach((test, index) => {
        doc.fontSize(12).text(`Test ${index + 1}: ${test.title}`);
        doc.text(`State: ${test.state}`);
        doc.text(`Duration: ${test.duration}ms`);
        if (test.error) {
          doc.text(`Error: ${test.error}`);
        }
        doc.moveDown();
      });

      // Footer with page numbers
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(10).text(`Page ${i + 1} of ${range.count}`, 0.5 * (doc.page.width - doc.widthOfString(`Page ${i + 1} of ${range.count}`)), doc.page.height - 30, {
          align: 'center',
          lineBreak: false
        });
      }

      doc.end();
      console.log(`PDF report created at ${filePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}

module.exports = CustomReporter;
