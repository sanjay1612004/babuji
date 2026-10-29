import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4181';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4181', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = ''; server.stdout.on('data', b => serverOutput += b); server.stderr.on('data', b => serverOutput += b);
let browser, page;
const errors = [], failedAssets = [];
async function waitFor(test, arg) { await page.waitForFunction(test, arg, { timeout: 20000 }); }
async function closePanel() { await page.getByRole('button', { name: 'Close panel', exact: true }).click(); }
async function openMap() { await page.getByRole('button', { name: 'Open world map', exact: true }).click(); }
async function contentAt(index) { await openMap(); await page.locator('.destination-list > div').nth(index).getByRole('button', { name: 'Open professional content' }).click(); }
async function fastTravel(name) { await page.getByRole('button', { name: `Fast travel: ${name}`, exact: true }).click(); await page.locator('.world-canvas canvas').focus(); await page.waitForTimeout(180); }
async function walk(key, axis, target, less = true) {
  await page.keyboard.down(key);
  try { await waitFor(({ axis, target, less }) => { const value = Number(document.querySelector('.codeverse-app').getAttribute(`data-player-${axis}`)); return less ? value < target : value > target; }, { axis, target, less }); }
  finally { await page.keyboard.up(key); }
  await page.waitForTimeout(180);
}
async function realm(id) {
  await fastTravel('Project universe');
  if (id === 'interngo') await walk('a', 'x', 1.5);
  if (id === 'aokah') await walk('d', 'x', 8.6, false);
  await walk('w', 'z', id === 'fclabs' ? -25.1 : -24.2);
  await page.locator('.interaction-prompt strong').filter({ hasText: id === 'fclabs' ? 'FC Labs' : id === 'aokah' ? 'AOKAH' : 'Interngo' }).waitFor();
  await page.keyboard.press('e');
  await waitFor(id => document.querySelector('.codeverse-app').dataset.realm === id, id);
  await page.locator('.interaction-prompt').waitFor();
  await page.keyboard.press('e');
  await page.getByRole('dialog').waitFor();
}
try {
  for (let attempt = 0; attempt < 100; attempt++) { try { if ((await fetch(origin)).ok) break; } catch {} if (attempt === 99) throw new Error(serverOutput); await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, permissions: ['clipboard-read', 'clipboard-write'] });
  page = await context.newPage(); page.setDefaultTimeout(12000);
  page.on('pageerror', e => errors.push(e.message)); page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(origin)) failedAssets.push(`${r.status()} ${r.url()}`); });
  await mkdir('test-results', { recursive: true });
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Quick Portfolio', exact: true }).click();
  await page.getByRole('heading', { name: 'Kishorebabu S', level: 1 }).waitFor();
  assert.equal(await page.locator('.quick-main .case-study').count(), 3);
  await page.getByText('Hindusthan College of Engineering and Technology', { exact: true }).waitFor();
  assert.equal(await page.locator('.profile-portrait img').evaluate(img => img.complete && img.naturalWidth > 0), true);
  assert.equal(await page.locator('.quick-main a[href^="mailto:"]').count(), 2);
  await page.screenshot({ animations: 'disabled', path: 'test-results/quick-portfolio.png' });
  await page.getByRole('button', { name: 'Back to the universe' }).click();
  await page.getByText('UNIVERSE ONLINE').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Enable sound', exact: true }).isVisible(), true, 'Audio starts off');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('button', { name: /Lightweight/ }).click();
  await page.getByRole('checkbox', { name: /Remember progress/ }).check();
  await closePanel();
  await page.screenshot({ animations: 'disabled', path: 'test-results/game-desktop.png' });
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  await page.locator('.world-canvas canvas').focus();
  await walk('w', 'z', 4.7);
  await page.keyboard.down('Shift'); await page.keyboard.down('w');
  await waitFor(() => Number(document.querySelector('.codeverse-app').dataset.playerSpeed) > 6);
  await page.keyboard.up('w'); await page.keyboard.up('Shift');
  await page.keyboard.down('Space'); await waitFor(() => Number(document.querySelector('.codeverse-app').dataset.playerY) > .25); await page.keyboard.up('Space');
  const yaw = Number(await page.locator('.codeverse-app').getAttribute('data-camera-yaw'));
  await page.mouse.move(850, 470); await page.mouse.down(); await page.mouse.move(1020, 500, { steps: 8 }); await page.mouse.up();
  await waitFor(yaw => Math.abs(Number(document.querySelector('.codeverse-app').dataset.cameraYaw) - yaw) > .4, yaw);
  await page.keyboard.press('r'); await waitFor(() => Math.abs(Number(document.querySelector('.codeverse-app').dataset.cameraYaw)) < .02);
  await page.keyboard.press('Escape');
  await page.getByRole('heading', { name: 'Take a moment.' }).waitFor();
  const paused = await page.locator('.codeverse-app').getAttribute('data-player-z');
  await page.keyboard.down('w'); await page.waitForTimeout(350); await page.keyboard.up('w');
  assert.equal(await page.locator('.codeverse-app').getAttribute('data-player-z'), paused, 'Pause stops movement');
  for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => Boolean(document.activeElement.closest('dialog'))), true, 'Dialog traps focus'); }
  await page.keyboard.press('Escape');
  await page.screenshot({ animations: 'disabled', path: 'test-results/game-third-person.png' });
  console.log('PASS: instant Quick Portfolio, avatar movement, sprint, jump, mouse camera, pause and focus management.');

  await fastTravel('Identity terminal'); await page.keyboard.press('e');
  await page.locator('.capability-holograms').waitFor();
  for (let i = 0; i < 3; i++) await page.locator('.capability-holograms > button').nth(i).click();
  await closePanel();
  await contentAt(1); await page.locator('.career-gate-selectors > button').nth(1).click(); await closePanel();
  await realm('interngo');
  await page.locator('.workflow-node').nth(2).click(); assert.equal(await page.locator('.workflow-node.online').count(), 0, 'Invalid workflow connection is rejected');
  for (let i = 0; i < 6; i++) await page.locator('.workflow-node').nth(i).click();
  await page.getByRole('button', { name: 'Trigger simulated Slack update' }).click();
  await page.getByRole('button', { name: /Read the case study/ }).click();
  await page.getByText('Complete frontend & backend development', { exact: true }).waitFor();
  await page.locator('.case-study .tag-list').getByText('React Compiler', { exact: true }).waitFor();
  await closePanel();
  await realm('fclabs');
  assert.equal(await page.getByRole('button', { name: 'Unlock administration overview' }).isDisabled(), true);
  await page.locator('.answer-options > button').nth(0).click();
  assert.equal(await page.getByRole('button', { name: 'Unlock administration overview' }).isDisabled(), true);
  await page.locator('.answer-options > button').nth(2).click();
  await page.locator('.campus-tabs > button').nth(1).click(); await page.getByRole('button', { name: 'Mira', exact: true }).click();
  await page.locator('.campus-tabs > button').nth(2).click(); await page.locator('.answer-options > button').nth(1).click();
  await page.getByRole('button', { name: 'Unlock administration overview' }).click();
  await page.getByText('Campus overview online.', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Read the case study/ }).click();
  await page.getByText('Frontend development · four-member team', { exact: true }).waitFor(); await closePanel();
  await realm('aokah');
  await page.locator('.source-options > button').nth(1).click(); await page.getByRole('button', { name: 'Load sample source' }).click();
  await page.getByRole('button', { name: 'Extract sample text' }).click(); await page.getByRole('button', { name: 'Find relevant context' }).click();
  await page.locator('.context-fragments > button').nth(0).click(); assert.equal(await page.getByRole('button', { name: 'Use selected context' }).isDisabled(), true);
  await page.locator('.context-fragments > button').nth(1).click(); await page.getByRole('button', { name: 'Use selected context' }).click();
  await page.getByRole('button', { name: 'Run simulated language model' }).click();
  await page.locator('.grounded-answer').getByText('18 November 2026', { exact: true }).waitFor();
  await page.screenshot({ animations: 'disabled', path: 'test-results/game-ai-mission.png' }); await closePanel();
  console.log('PASS: all three real 3D project rooms, invalid/correct puzzle input, full case studies, campus checks, grounded RAG pipeline.');

  await fastTravel('Skill nexus'); await page.keyboard.press('e');
  await page.locator('.tech-choices > button').filter({ hasText: 'Fastify' }).click(); assert.equal(await page.locator('.constellation-route > .lit').count(), 0);
  for (const name of ['React', 'Node.js', 'Fastify', 'PostgreSQL']) await page.locator('.tech-choices > button').filter({ hasText: name }).click();
  assert.equal(await page.locator('.constellation-route > .lit').count(), 4); await closePanel();
  await fastTravel('Experimental lab'); await page.keyboard.press('e');
  await page.getByRole('button', { name: 'Medium', exact: true }).click(); assert.equal(await page.locator('.problem-grid > button').count(), 3);
  await page.locator('.problem-grid > button').first().click(); await page.locator('.problem-metadata strong').waitFor();
  await page.getByLabel('ENTER SOMETHING TO TAKE APART').fill('Hello, world!'); assert.equal(await page.locator('.token-segments > span').count(), 4);
  await page.getByLabel('ENTER SOMETHING TO TAKE APART').fill(''); await page.getByText('Type a little text to see its pieces.').waitFor(); await closePanel();
  await fastTravel('Connection portal'); await walk('w', 'z', 28.2); await page.keyboard.press('e');
  await page.getByRole('button', { name: 'Copy email', exact: true }).click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 's.kishorebabu8@gmail.com');
  await page.getByRole('button', { name: 'Copy contact details', exact: true }).click(); assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Kishorebabu S\nFull-Stack Developer \/ AI Engineer\nCoimbatore/);
  assert.equal(await page.getByRole('link', { name: 'Send email' }).getAttribute('href'), 'mailto:s.kishorebabu8@gmail.com');
  await page.getByRole('button', { name: 'Return to central hub', exact: true }).click();
  await page.getByRole('button', { name: 'Dismiss completion message' }).click();
  assert.match(await page.locator('.mission-counter').innerText(), /08/);
  await page.keyboard.press('j'); await page.getByRole('heading', { name: 'Universe Explorer', exact: true }).waitFor(); await closePanel();
  const position = await page.locator('.codeverse-app').getAttribute('data-player-z');
  await page.getByRole('button', { name: 'Quick Portfolio', exact: true }).click(); await page.waitForTimeout(250);
  assert.equal(await page.locator('.codeverse-app').getAttribute('data-player-z'), position, 'Quick mode preserves world position');
  await page.getByRole('button', { name: 'Back to the universe' }).click();
  await page.getByRole('button', { name: 'Hide HUD for screenshot' }).click(); await page.getByRole('button', { name: /Restore HUD/ }).click();
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click(); await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.getByRole('button', { name: 'Mission journal, 8 of 8 complete' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Enable sound', exact: true }).isVisible(), true, 'Saved preferences do not autoplay audio');
  console.log('PASS: skills, lab filters and segmenter, all eight badges, contact clipboard, mode switching, HUD, optional sound, opt-in persistence.');

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Welcome fits ${width}px`);
    await page.getByRole('button', { name: 'Open world map', exact: true }).click();
    assert.equal(await page.locator('dialog').evaluate(el => el.getBoundingClientRect().right <= innerWidth && el.getBoundingClientRect().left >= 0), true, `Map fits ${width}px`);
    await closePanel();
    await page.getByRole('button', { name: 'Quick Portfolio', exact: true }).click();
    assert.equal(await page.locator('.quick-portfolio').evaluate(el => el.scrollWidth <= el.clientWidth), true, `Quick Portfolio fits ${width}px`);
    await page.getByRole('button', { name: 'Back to the universe' }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.screenshot({ animations: 'disabled', path: 'test-results/game-mobile-welcome.png' });
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  const joystick = await page.getByRole('group', { name: 'Touch movement joystick' }).boundingBox();
  const mobileZ = Number(await page.locator('.codeverse-app').getAttribute('data-player-z'));
  await page.mouse.move(joystick.x + joystick.width / 2, joystick.y + joystick.height / 2); await page.mouse.down(); await page.mouse.move(joystick.x + joystick.width / 2, joystick.y + joystick.height / 2 - 28, { steps: 4 });
  await waitFor(z => Number(document.querySelector('.codeverse-app').dataset.playerZ) < z - .4, mobileZ); await page.mouse.up();
  await page.screenshot({ animations: 'disabled', path: 'test-results/game-mobile-play.png' });
  await page.getByRole('button', { name: 'Open settings', exact: true }).click(); await page.getByRole('checkbox', { name: /Reduce motion/ }).check(); await closePanel();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.motion), 'reduced');
  console.log('PASS: responsive welcome/map/Quick Portfolio at five widths, pointer joystick, mobile HUD, reduced motion.');

  const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const fallback = await fallbackContext.newPage();
  await fallback.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null; return original.call(this, type, ...args); }; });
  await fallback.goto(origin, { waitUntil: 'domcontentloaded' }); await fallback.locator('.render-fallback').waitFor();
  await fallback.getByRole('button', { name: 'Start exploring', exact: true }).click(); await fallback.getByRole('heading', { name: 'The whole universe. Within reach.' }).waitFor();
  await fallback.getByRole('button', { name: 'Open complete Quick Portfolio' }).click(); await fallback.getByRole('heading', { name: 'Kishorebabu S', level: 1 }).waitFor();
  await fallbackContext.close();
  assert.deepEqual(errors, [], 'No runtime exceptions'); assert.deepEqual(failedAssets, [], 'No broken local assets');
  console.log('PASS: WebGL failure fallback, accessible profile, no runtime exceptions or broken local assets.');
} catch (error) {
  if (page && !page.isClosed()) { await page.screenshot({ animations: 'disabled', path: 'test-results/game-failure.png' }).catch(() => {}); console.error('STATE', await page.locator('.codeverse-app').evaluate(el => ({ x: el.dataset.playerX, z: el.dataset.playerZ, realm: el.dataset.realm, zone: el.dataset.zone })).catch(() => ({}))); }
  throw error;
} finally { await browser?.close(); server.kill('SIGTERM'); }
