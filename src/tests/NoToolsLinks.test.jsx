import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { globSync } from 'glob';

describe('No Dead Tools Links', () => {
  it('should not contain /tools or /tools/* links in src files', () => {
    // Only check jsx files to speed up the test
    const files = globSync('src/**/*.jsx', { ignore: 'src/tests/**' });
    let violations = [];

    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('to="/tools"') || content.includes('href="/tools"') || content.includes('to="/tools/') || content.includes('href="/tools/')) {
        violations.push(file);
      }
    });

    expect(violations).toEqual([]);
  });
});
