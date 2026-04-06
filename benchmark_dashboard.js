import React from 'react';
import { renderToString } from 'react-dom/server';
import DashboardNodes from './src/components/DashboardNodes.jsx';
import { performance } from 'perf_hooks';

const iterations = 10000;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
  renderToString(React.createElement(DashboardNodes, { selectedNode: null, setSelectedNode: () => {} }));
}
const end = performance.now();
console.log(`Render time for ${iterations} iterations: ${(end - start).toFixed(2)} ms`);
