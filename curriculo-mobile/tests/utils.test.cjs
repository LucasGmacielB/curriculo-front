const assert = require('node:assert/strict');
const test = require('node:test');

const { loadTypescript } = require('./helpers/load-typescript.cjs');

const { safeExternalUrl } = loadTypescript('src/utils/links.ts');
const { formatPeriod } = loadTypescript('src/utils/format.ts');

test('professional links accept HTTP and HTTPS addresses', () => {
  assert.equal(safeExternalUrl('https://github.com/LucasGmacielB'), 'https://github.com/LucasGmacielB');
  assert.equal(safeExternalUrl('http://example.com/demo'), 'http://example.com/demo');
  assert.equal(safeExternalUrl('  https://example.com  '), 'https://example.com/');
});

test('external links reject script/data protocols, credentials, and malformed URLs', () => {
  for (const unsafe of [
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'intent://example.com',
    'https://user:password@example.com',
    'https://user@example.com',
    'https://example.com/line\nbreak',
    'https://example.com/space here',
    'not a URL',
    '',
    null,
    undefined,
  ]) {
    assert.equal(safeExternalUrl(unsafe), null, String(unsafe));
  }
});

test('email links accept bare and mailto addresses without allowing extra actions', () => {
  assert.equal(safeExternalUrl('lucas.macielbarros01@gmail.com', 'email'), 'mailto:lucas.macielbarros01@gmail.com');
  assert.equal(safeExternalUrl('mailto:mariana@example.com', 'email'), 'mailto:mariana@example.com');
  for (const unsafe of ['javascript:alert(1)', 'data:example', 'test@example.com?body=content', 'test@example.com\r\nBcc:bad@example.com', 'bad address']) {
    assert.equal(safeExternalUrl(unsafe, 'email'), null, unsafe);
  }
});

test('phone links normalize formatting and reject injected actions', () => {
  assert.equal(safeExternalUrl('+55 (81) 99999-9999', 'phone'), 'tel:+5581999999999');
  assert.equal(safeExternalUrl('tel:81999999999', 'phone'), 'tel:81999999999');
  for (const unsafe of ['javascript:alert(1)', 'tel:81999999999;ext=1', '123', 'tel:abc', '+1234567890123456']) {
    assert.equal(safeExternalUrl(unsafe, 'phone'), null, unsafe);
  }
});

test('unknown dates never imply the experience is current', () => {
  assert.equal(formatPeriod(), 'Período não informado');
  assert.equal(formatPeriod(null, null), 'Período não informado');
  const withStart = formatPeriod('2026-09-01', null);
  assert.match(withStart, /2026/);
  assert.match(withStart, /Término não informado/);
  assert.doesNotMatch(withStart, /atual|presente/i);
  assert.match(formatPeriod(null, '2026-09-01'), /Início não informado/);
});

test('invalid or impossible dates do not leak raw backend values', () => {
  for (const invalid of ['banana', '2026-99-99', '2026-02-30', '2026-01-00', '01/09/2026']) {
    assert.equal(formatPeriod(invalid, invalid), 'Período não informado');
    const withValidEnd = formatPeriod(invalid, '2026-09-01');
    assert.match(withValidEnd, /Início não informado/);
    assert.ok(!withValidEnd.includes(invalid));
  }
});

test('valid dates and ISO timestamps produce a readable period', () => {
  const period = formatPeriod('2025-02-28', '2026-09-01T00:00:00.000Z');
  assert.match(period, /2025/);
  assert.match(period, /2026/);
  assert.doesNotMatch(period, /não informado|Invalid Date/);
});
