import test from 'node:test';
import assert from 'node:assert';
import NetworkTopology from './src/components/NetworkTopology.jsx';

// Very basic test to ensure component renders without crashing
test('NetworkTopology renders without crashing', () => {
    // Cannot easily test framer-motion SVG rendering in pure node:test without JSDOM,
    // but we can at least ensure we can import it.
    assert.ok(NetworkTopology);
});