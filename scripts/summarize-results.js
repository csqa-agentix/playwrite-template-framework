const fs = require('fs');
const path = require('path');

const resultsPath = path.resolve(process.cwd(), 'test-results', 'results.json');
if (!fs.existsSync(resultsPath)) {
  console.error('No results.json found. Run tests first.');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
let total = 0, passed = 0, failed = 0, flaky = 0, timedOut = 0;
const details = [];

function walkSuites(suites) {
  if (!suites) return;
  for (const s of suites) {
    if (s.specs) {
      for (const spec of s.specs) {
        if (spec.tests) {
          for (const t of spec.tests) {
            for (const r of t.results || []) {
              total++;
              const status = r.status || 'unknown';
              if (status === 'passed') passed++;
              else if (status === 'failed') failed++;
              else if (status === 'flaky') flaky++;
              else if (status === 'timedOut') timedOut++;
              details.push({ title: t.title || spec.title || s.title, project: r.projectName, status, duration: r.duration });
            }
          }
        }
      }
    }
    if (s.suites) walkSuites(s.suites);
  }
}

walkSuites(data.suites || []);

console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}, Flaky: ${flaky}, TimedOut: ${timedOut}`);
console.log('Details:');
for (const d of details) {
  console.log(`- ${d.project} | ${d.status.toUpperCase()} | ${d.title} (${d.duration}ms)`);
}
