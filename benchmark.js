import { performance } from 'perf_hooks';

const nodes = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, x: Math.random() * 100, y: Math.random() * 100, label: `NODE_${i}` }));

// Create 5000 random connections
const connections = Array.from({ length: 5000 }, () => {
  const from = Math.floor(Math.random() * 1000) + 1;
  const to = Math.floor(Math.random() * 1000) + 1;
  return [from, to];
});

function originalMethod() {
  const results = [];
  connections.forEach(([from, to]) => {
    const start = nodes.find(n => n.id === from);
    const end = nodes.find(n => n.id === to);
    if (start && end) {
      results.push({ start, end });
    }
  });
  return results;
}

function optimizedMethod() {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const results = [];
  connections.forEach(([from, to]) => {
    const start = nodeMap.get(from);
    const end = nodeMap.get(to);
    if (start && end) {
      results.push({ start, end });
    }
  });
  return results;
}

const iterations = 100;

// Warmup
for (let i = 0; i < 10; i++) {
  originalMethod();
  optimizedMethod();
}

let originalTotal = 0;
for (let i = 0; i < iterations; i++) {
  const start = performance.now();
  originalMethod();
  originalTotal += performance.now() - start;
}

let optimizedTotal = 0;
for (let i = 0; i < iterations; i++) {
  const start = performance.now();
  optimizedMethod();
  optimizedTotal += performance.now() - start;
}

console.log(`Original method: ${(originalTotal / iterations).toFixed(4)} ms per run`);
console.log(`Optimized method: ${(optimizedTotal / iterations).toFixed(4)} ms per run`);
console.log(`Improvement: ${((originalTotal - optimizedTotal) / originalTotal * 100).toFixed(2)}% faster`);
