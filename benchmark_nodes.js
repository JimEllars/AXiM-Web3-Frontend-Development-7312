const ITERATIONS = 1000000;

const node = { id: 'AX-101', type: 'Solar', status: 'Optimal', load: '72%', temp: '42°C', icon: 'LuZap' };

function baseline() {
  let count = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    Object.entries(node).filter(([key]) => !['id', 'type', 'status', 'icon'].includes(key)).forEach(([key, val]) => {
      count++;
    });
  }
  return count;
}

const EXCLUDED_KEYS = new Set(['id', 'type', 'status', 'icon']);
function optimized() {
  let count = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key)).forEach(([key, val]) => {
      count++;
    });
  }
  return count;
}

console.log('Running Baseline...');
const startBaseline = performance.now();
baseline();
const endBaseline = performance.now();
console.log(`Baseline time: ${(endBaseline - startBaseline).toFixed(2)} ms`);

console.log('Running Optimized...');
const startOptimized = performance.now();
optimized();
const endOptimized = performance.now();
console.log(`Optimized time: ${(endOptimized - startOptimized).toFixed(2)} ms`);

const improvement = ((endBaseline - startBaseline) - (endOptimized - startOptimized)) / (endBaseline - startBaseline) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
