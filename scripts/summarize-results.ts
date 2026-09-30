import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface TestResult {
  projectName?: string;
  status?: string;
  duration?: number;
}

interface TestCase {
  title?: string;
  projectName?: string;
  results?: TestResult[];
}

interface TestSpec {
  title?: string;
  tests?: TestCase[];
}

interface TestSuite {
  title?: string;
  specs?: TestSpec[];
  suites?: TestSuite[];
}

interface TestReport {
  suites?: TestSuite[];
}

interface ResultSummary {
  title: string;
  project: string;
  status: string;
  duration: number;
}

const resultsPath = path.resolve(process.cwd(), 'test-results', 'results.json');
if (!existsSync(resultsPath)) {
  console.error('No results.json found. Run tests first.');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resultsPath, 'utf8')) as TestReport;
let total = 0;
let passed = 0;
let failed = 0;
let flaky = 0;
let timedOut = 0;
const details: ResultSummary[] = [];

function walkSuites(suites: TestSuite[] | undefined): void {
  if (!suites) return;

  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const testCase of spec.tests ?? []) {
        for (const result of testCase.results ?? []) {
          total++;
          const status = result.status ?? 'unknown';
          if (status === 'passed') passed++;
          else if (status === 'failed') failed++;
          else if (status === 'flaky') flaky++;
          else if (status === 'timedOut') timedOut++;

          details.push({
            title: testCase.title ?? spec.title ?? suite.title ?? 'Untitled test',
            project: testCase.projectName ?? result.projectName ?? 'unknown',
            status,
            duration: result.duration ?? 0,
          });
        }
      }
    }

    walkSuites(suite.suites);
  }
}

walkSuites(data.suites);

console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}, Flaky: ${flaky}, TimedOut: ${timedOut}`);
console.log('Details:');
for (const detail of details) {
  console.log(`- ${detail.project} | ${detail.status.toUpperCase()} | ${detail.title} (${detail.duration}ms)`);
}