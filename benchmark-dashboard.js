const { performance } = require('perf_hooks');

const nodes = [
  { id: 'AX-101', type: 'Solar', status: 'Optimal', load: '72%', temp: '42°C', icon: 'LuZap' },
  { id: 'AX-102', type: 'Fiber', status: 'Optimal', throughput: '1.2 Tbps', icon: 'LuGlobe' },
  { id: 'AX-103', type: 'Neural', status: 'Active', accuracy: '98.2%', icon: 'LuCpu' },
];

const EXCLUDED_KEYS = new Set(['id', 'type', 'status', 'icon']);

// Baseline: inline
function baseline() {
  let count = 0;
  for (let i = 0; i < 100000; i++) {
    for (const node of nodes) {
      const entries = Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key));
      count += entries.length;
    }
  }
  return count;
}

// Optimized: Pre-compute outside component
const optimizedNodes = nodes.map(node => ({
  ...node,
  metrics: Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key))
}));

function optimized() {
  let count = 0;
  for (let i = 0; i < 100000; i++) {
    for (const node of optimizedNodes) {
      const entries = node.metrics;
      count += entries.length;
    }
  }
  return count;
}

const t0 = performance.now();
baseline();
const t1 = performance.now();
console.log(`Baseline: ${t1 - t0} ms`);

const t2 = performance.now();
optimized();
const t3 = performance.now();
console.log(`Optimized: ${t3 - t2} ms`);
