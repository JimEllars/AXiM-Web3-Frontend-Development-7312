import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Dashboard.jsx has been refactored', async (t) => {
  const content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

  // Check that new components are imported
  assert.ok(content.includes("import TelemetryBar from '../components/TelemetryBar';"));
  assert.ok(content.includes("import DashboardAccessDenied from '../components/DashboardAccessDenied';"));
  assert.ok(content.includes("import DashboardNodes from '../components/DashboardNodes';"));
  assert.ok(content.includes("import VaultedRecords from '../components/VaultedRecords';"));

  // Check that extracted logic is removed
  assert.ok(!content.includes("function TelemetryBar"));
  assert.ok(!content.includes("const nodes = ["));

  // Check that the file is shorter (it was ~260 lines, now should be around 140)
  const lines = content.split('\n').length;
  console.log(`Dashboard.jsx lines: ${lines}`);
  assert.ok(lines < 150);
});

test('New component files exist and have content', async (t) => {
  const components = [
    'src/components/TelemetryBar.jsx',
    'src/components/DashboardAccessDenied.jsx',
    'src/components/DashboardNodes.jsx',
    'src/components/VaultedRecords.jsx'
  ];

  components.forEach(file => {
    assert.ok(fs.existsSync(file), `${file} should exist`);
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(content.length > 0, `${file} should not be empty`);
    assert.ok(content.includes('export default function'), `${file} should export a function`);
  });
});
