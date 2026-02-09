import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = '/var/log/applications/API/dataprocessing';
const BASE_URL = 'http://localhost:4200';
const RECORD_COUNT = 10; // small count to verify flow works

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

test('Smoke test - verify full flow with 10 records', async ({ page }) => {
  // ========== GENERATE ==========
  console.log('\n--- GENERATE ---');
  await page.goto(`${BASE_URL}/generate`);

  // Wait for the input to be visible (Angular has rendered)
  const input = page.locator('input[type="number"]');
  await expect(input).toBeVisible({ timeout: 10000 });
  console.log('   Page loaded, input visible');

  // Set value using native setter + dispatch events for Angular ngModel
  await page.evaluate((count) => {
    const el = document.querySelector('input[type="number"]') as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    setter.call(el, String(count));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, RECORD_COUNT);
  await page.waitForTimeout(500);

  const val = await input.inputValue();
  console.log(`   Input value: ${val}`);

  // Click Generate
  const generateBtn = page.locator('button.action-btn');
  console.log(`   Button disabled: ${await generateBtn.isDisabled()}`);
  await generateBtn.click({ force: true });
  console.log('   Clicked Generate');

  await expect(page.getByText('Generating...')).toBeVisible({ timeout: 10000 });
  console.log('   Loading visible');

  await expect(page.locator('.status-success')).toBeVisible({ timeout: 60000 });
  console.log('   SUCCESS - Generation complete');

  // Navigate via step button
  await page.locator('button', { hasText: 'Next: Process Excel' }).click();
  await expect(page.locator('input[type="file"][accept=".xlsx,.xls"]')).toBeVisible({ timeout: 10000 });

  // ========== PROCESS ==========
  console.log('\n--- PROCESS ---');
  const xlsxFile = findLatestFile('.xlsx');
  console.log(`   File: ${xlsxFile}`);

  await page.locator('input[type="file"]').setInputFiles(xlsxFile);
  await page.waitForTimeout(500);
  await expect(page.locator('text=Selected:')).toBeVisible({ timeout: 3000 });
  console.log('   File selected');

  await page.locator('button.action-btn').click({ force: true });
  console.log('   Clicked Process');

  await expect(page.getByText('Processing...')).toBeVisible({ timeout: 10000 });
  console.log('   Loading visible');

  await expect(page.locator('.status-success')).toBeVisible({ timeout: 60000 });
  console.log('   SUCCESS - Processing complete');

  // Navigate via step button
  await page.locator('button', { hasText: 'Upload CSV' }).click();
  await expect(page.locator('input[type="file"][accept=".csv"]')).toBeVisible({ timeout: 10000 });

  // ========== UPLOAD ==========
  console.log('\n--- UPLOAD ---');
  const csvFile = findLatestFile('.csv');
  console.log(`   File: ${csvFile}`);

  await page.locator('input[type="file"]').setInputFiles(csvFile);
  await page.waitForTimeout(500);
  await expect(page.locator('text=Selected:')).toBeVisible({ timeout: 3000 });
  console.log('   File selected');

  await page.locator('button.action-btn').click({ force: true });
  console.log('   Clicked Upload');

  await expect(page.getByText('Uploading...')).toBeVisible({ timeout: 10000 });
  console.log('   Loading visible');

  await expect(page.locator('.status-success')).toBeVisible({ timeout: 60000 });
  console.log('   SUCCESS - Upload complete');

  // Navigate via step button
  await page.locator('button', { hasText: 'View Report' }).click();

  // ========== REPORT ==========
  console.log('\n--- REPORT ---');
  await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30000 });
  console.log('   SUCCESS - Report loaded with data');

  console.log('\n=== ALL STEPS PASSED ===\n');
});
