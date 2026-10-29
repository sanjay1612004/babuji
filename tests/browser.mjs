import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4181', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '';
server.stdout.on('data', b => { serverOutput += b; });
server.stderr.on('data', b => { serverOutput += b; });
let browser;
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4181')).ok) break; } catch {}
    if (attempt === 99) throw new Error(`Preview did not start: ${serverOutput}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const failedAssets = [];
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('127.0.0.1')) failedAssets.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://127.0.0.1:4181', { waitUntil: 'networkidle' });
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/hero-initial.png' });
  await page.locator('.portrait').waitFor();
  assert.equal(await page.locator('.portrait').evaluate(img => img.complete && img.naturalWidth > 0), true, 'Portrait loads');
  assert.equal(await page.locator('main section[id]').count(), 7, 'Hero and six chapters');
  await page.getByRole('button', { name: 'Attendance', exact: true }).click();
  await page.getByRole('heading', { name: 'Every day, accounted for.' }).waitFor();
  await page.getByRole('button', { name: 'Resources', exact: true }).click();
  await page.getByText('React essentials', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Helpdesk', exact: true }).click();
  await page.getByText('Environment setup', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Analytics', exact: true }).click();
  await page.getByRole('heading', { name: 'Activity into perspective.' }).waitFor();
  await page.getByRole('button', { name: 'Integrations', exact: true }).click();
  await page.getByText('Google Meet', { exact: true }).first().waitFor();
  for (const id of ['interngo', 'fclabs', 'aokah']) {
    const project = page.locator(`#project-${id}`);
    await project.getByRole('button', { name: 'Explore the project' }).click();
    assert.equal(await page.locator(`#${id}-case-study`).isVisible(), true);
    await project.getByRole('button', { name: 'Close case study' }).click();
    assert.equal(await page.locator(`#${id}-case-study`).isVisible(), false);
  }
  await page.getByRole('tab', { name: 'Campus overview', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Trainers', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('heading', { name: 'Follow the people teaching.' }).waitFor();
  await page.keyboard.press('End');
  await page.getByRole('heading', { name: 'Make progress visible.' }).waitFor();
  await page.getByRole('button', { name: '01 Documents', exact: true }).click();
  await page.getByText('Start with source information in documents and structured files.').waitFor();
  await page.getByRole('button', { name: 'How can an AI assistant retrieve information about project milestones?' }).click();
  await page.locator('.assistant-answer').getByText(/A retrieval workflow first finds/).waitFor();
  await page.getByRole('button', { name: 'What happens to a PDF before it becomes useful context?' }).click();
  await page.locator('.assistant-answer').getByText(/The text is extracted/).waitFor();
  await page.getByRole('tab', { name: 'AI & Machine Learning' }).click();
  await page.getByRole('heading', { name: 'AI & Machine Learning', exact: true }).waitFor();
  await page.locator('.skill-panel:visible').getByText('LangChain').waitFor();
  await page.getByRole('tab', { name: 'AI & Machine Learning' }).focus();
  await page.keyboard.press('ArrowDown');
  await page.getByRole('heading', { name: 'Data Processing', exact: true }).waitFor();
  await page.getByRole('button', { name: /OCT 2025/ }).click();
  await page.locator('.experience-panel:visible').getByRole('heading', { name: 'Developer Intern' }).waitFor();
  await page.getByRole('button', { name: 'Arrays', exact: true }).click();
  assert.equal(await page.locator('.problem-grid button').count(), 2);
  await page.locator('.problem-grid button').first().click();
  await page.getByText(/Two Sum selected/).waitFor();
  await page.getByLabel('GIVE IT A FEW WORDS').fill('Hello, world!');
  assert.equal(await page.locator('.token-output .token').count(), 4);
  await page.getByLabel('GIVE IT A FEW WORDS').fill('');
  await page.getByText('Type something to see its pieces.').waitFor();
  await page.getByLabel('Copy email address', { exact: true }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 's.kishorebabu8@gmail.com');
  await page.getByRole('button', { name: 'Copy contact details' }).click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Kishorebabu S\nFull-Stack Developer \/ AI Engineer\nCoimbatore/);
  assert.equal(await page.getByRole('link', { name: 'Let’s talk', exact: true }).last().getAttribute('href'), 'mailto:s.kishorebabu8@gmail.com');
  await page.keyboard.press('Control+k');
  assert.equal(await page.locator('dialog').isVisible(), true);
  await page.getByRole('textbox', { name: 'Find a chapter or action' }).fill('education');
  await page.getByRole('button', { name: 'Jump to Education' }).click();
  assert.equal(await page.locator('dialog').isVisible(), false);
  await page.getByLabel('Open command menu').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').isVisible(), false);
  await page.keyboard.press('Tab');
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);
    const overflowing = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => { const rect = el.getBoundingClientRect(); return rect.width > 0 && rect.right > innerWidth + 1 && !el.closest('.hero-art,.dashboard-sidebar,.tabbar'); }).map(el => ({ tag: el.tagName, class: typeof el.className === 'string' ? el.className : 'svg', right: el.getBoundingClientRect().right, width: el.getBoundingClientRect().width })).slice(0, 20));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No horizontal overflow at ${width}px: ${JSON.stringify(overflowing)}`);
    for (const section of ['top', ...['about', 'experience', 'work', 'skills', 'playground', 'contact']]) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      assert.equal(await page.locator(`#${section}`).isVisible(), true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel('Open navigation', { exact: true }).click();
  await page.locator('#main-links').getByRole('link', { name: 'Work', exact: true }).click();
  assert.equal(await page.getByLabel('Open navigation', { exact: true }).getAttribute('aria-expanded'), 'false');
  await page.getByLabel('Open navigation', { exact: true }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByLabel('Open navigation', { exact: true }).getAttribute('aria-expanded'), 'false');
  await mkdir('test-results', { recursive: true });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  await page.screenshot({ path: 'test-results/hero.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  assert.equal(await page.locator('.scene canvas').count(), 0);
  assert.deepEqual(errors, [], 'No JavaScript runtime errors');
  assert.deepEqual(failedAssets, [], 'No failed local asset requests');
  console.log('PASS: desktop, tablet, mobile, portrait, six chapters, case studies, dashboard modules, RAG examples, skills, experiments, keyboard navigation, mobile menu, clipboard, and reduced motion.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
