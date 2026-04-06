const { performance } = require('perf_hooks');

const EXCLUDED_KEYS = new Set(['id', 'type', 'status', 'icon']);

const nodes = [
  { id: 'AX-101', type: 'Solar', status: 'Optimal', load: '72%', temp: '42°C', icon: 'LuZap' },
  { id: 'AX-102', type: 'Fiber', status: 'Optimal', throughput: '1.2 Tbps', icon: 'LuGlobe' },
  { id: 'AX-103', type: 'Neural', status: 'Active', accuracy: '98.2%', icon: 'LuCpu' },
];

const nodesWithPrecomputed = nodes.map(node => ({
  ...node,
  displayEntries: Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key))
}));

const iterations = 1000000;

function runBaseline() {
  const start = performance.now();
  let count = 0;
  for (let i = 0; i < iterations; i++) {
    for (const node of nodes) {
      const entries = Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key));
      for (const [key, val] of entries) {
        count += val.length;
      }
    }
  }
  const end = performance.now();
  return { time: end - start, count };
}

function runOptimized() {
  const start = performance.now();
  let count = 0;
  for (let i = 0; i < iterations; i++) {
    for (const node of nodesWithPrecomputed) {
      for (const [key, val] of node.displayEntries) {
        count += val.length;
      }
    }
  }
  const end = performance.now();
  return { time: end - start, count };
}

const baseline = runBaseline();
const optimized = runOptimized();

console.log(`Baseline time: ${baseline.time.toFixed(2)} ms`);
console.log(`Optimized time: ${optimized.time.toFixed(2)} ms`);
console.log(`Improvement: ${((baseline.time - optimized.time) / baseline.time * 100).toFixed(2)}%`);
