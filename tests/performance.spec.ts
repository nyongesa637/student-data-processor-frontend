import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = '/var/log/applications/API/dataprocessing';
const BASE_URL = 'http://localhost:4200';
const RECORD_COUNT = 1000000;

// Helper: find latest file matching a pattern in the output directory
function findLatestFile(extension: string): string {
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith(extension))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(OUTPUT_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) throw new Error(`No ${extension} file found in ${OUTPUT_DIR}`);
  return path.join(OUTPUT_DIR, files[0].name);
}

// Helper: format milliseconds to minutes
function msToMin(ms: number): string {
  return (ms / 60000).toFixed(2);
}

test('Full pipeline performance test (1M records)', async ({ page }) => {
  const results: Record<string, { status: string; timeMs: number }> = {};

  // ========== STEP 1: GENERATE ==========
  console.log('\n=== STEP 1: DATA GENERATION (1,000,000 records) ===');
  await page.goto(`${BASE_URL}/generate`);

  // Wait for Angular to render the input
  const input = page.locator('input[type="number"]');
  await expect(input).toBeVisible({ timeout: 10000 });

  // Set value using native setter + dispatch events for Angular ngModel
  await page.evaluate((count) => {
    const el = document.querySelector('input[type="number"]') as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    setter.call(el, String(count));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, RECORD_COUNT);
  await page.waitForTimeout(500);

  const inputValue = await input.inputValue();
  console.log(`   Input value set to: ${inputValue}`);

  // Click Generate Excel button
  const generateBtn = page.locator('button.action-btn');
  await expect(generateBtn).toBeEnabled({ timeout: 5000 });
  console.log('   Button enabled, clicking Generate...');

  const genStart = Date.now();
  await generateBtn.click({ force: true });

  // Confirm the click worked
  await expect(page.getByText('Generating...')).toBeVisible({ timeout: 10000 });
  console.log('   Generation in progress...');

  // Wait for success - up to 25 minutes for 1M records
  await expect(page.locator('.status-success')).toBeVisible({ timeout: 25 * 60 * 1000 });
  const genTime = Date.now() - genStart;

  results['a) Data Generation'] = { status: 'Done', timeMs: genTime };
  console.log(`   Status: Done`);
  console.log(`   Time: ${msToMin(genTime)} minutes (${genTime}ms)`);

  // Navigate to Process using the step nav button
  console.log('   Navigating to Process page...');
  await page.locator('button', { hasText: 'Next: Process Excel' }).click();
  await expect(page.locator('input[type="file"][accept=".xlsx,.xls"]')).toBeVisible({ timeout: 10000 });

  // ========== STEP 2: PROCESS ==========
  console.log('\n=== STEP 2: DATA PROCESSING (Excel → CSV, Score +10) ===');

  const xlsxFile = findLatestFile('.xlsx');
  console.log(`   Using file: ${xlsxFile}`);
  await page.locator('input[type="file"]').setInputFiles(xlsxFile);
  await page.waitForTimeout(500);
  await expect(page.locator('text=Selected:')).toBeVisible({ timeout: 3000 });
  console.log('   File selected');

  const processBtn = page.locator('button.action-btn');
  await expect(processBtn).toBeEnabled({ timeout: 5000 });
  console.log('   Button enabled, clicking Process...');

  const procStart = Date.now();
  await processBtn.click({ force: true });

  await expect(page.getByText('Processing...')).toBeVisible({ timeout: 10000 });
  console.log('   Processing in progress...');

  // Wait for success - up to 25 minutes
  await expect(page.locator('.status-success')).toBeVisible({ timeout: 25 * 60 * 1000 });
  const procTime = Date.now() - procStart;

  results['b) Data Processing'] = { status: 'Done', timeMs: procTime };
  console.log(`   Status: Done`);
  console.log(`   Time: ${msToMin(procTime)} minutes (${procTime}ms)`);

  // Navigate to Upload using the step nav button
  console.log('   Navigating to Upload page...');
  await page.locator('button', { hasText: 'Upload CSV' }).click();
  await expect(page.locator('input[type="file"][accept=".csv"]')).toBeVisible({ timeout: 10000 });

  // ========== STEP 3: UPLOAD ==========
  console.log('\n=== STEP 3: DATA UPLOAD (CSV → Database, Score +5) ===');

  const csvFile = findLatestFile('.csv');
  console.log(`   Using file: ${csvFile}`);
  await page.locator('input[type="file"]').setInputFiles(csvFile);
  await page.waitForTimeout(500);
  await expect(page.locator('text=Selected:')).toBeVisible({ timeout: 3000 });
  console.log('   File selected');

  const uploadBtn = page.locator('button.action-btn');
  await expect(uploadBtn).toBeEnabled({ timeout: 5000 });
  console.log('   Button enabled, clicking Upload...');

  const uploadStart = Date.now();
  await uploadBtn.click({ force: true });

  await expect(page.getByText('Uploading...')).toBeVisible({ timeout: 10000 });
  console.log('   Upload in progress...');

  // Wait for success - up to 25 minutes
  await expect(page.locator('.status-success')).toBeVisible({ timeout: 25 * 60 * 1000 });
  const uploadTime = Date.now() - uploadStart;

  results['a) Data Upload'] = { status: 'Done', timeMs: uploadTime };
  console.log(`   Status: Done`);
  console.log(`   Time: ${msToMin(uploadTime)} minutes (${uploadTime}ms)`);

  // Navigate to Report using the step nav button
  console.log('   Navigating to Report page...');
  await page.locator('button', { hasText: 'View Report' }).click();

  // ========== STEP 4: REPORT ==========
  console.log('\n=== STEP 4: REPORT ===');

  await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
  results['b) Report'] = { status: 'Done', timeMs: 0 };
  console.log(`   Status: Done (report page loaded with data)`);

  // ========== SUMMARY ==========
  console.log('\n\n========================================');
  console.log('   PERFORMANCE RESULTS SUMMARY');
  console.log('========================================');
  console.log(`   Records: ${RECORD_COUNT.toLocaleString()}`);
  console.log('----------------------------------------');
  console.log(`   a) Data Generation:  ${msToMin(results['a) Data Generation'].timeMs)} mins`);
  console.log(`   b) Data Processing:  ${msToMin(results['b) Data Processing'].timeMs)} mins`);
  console.log(`   a) Data Upload:      ${msToMin(results['a) Data Upload'].timeMs)} mins`);
  console.log(`   b) Report:           Done`);
  console.log('========================================\n');
});
