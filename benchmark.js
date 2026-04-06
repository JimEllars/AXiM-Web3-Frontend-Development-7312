import { performance } from 'perf_hooks';

const MARQUEE_ITEMS = [
  { icon: 'LuCpu', text: "AXiM Ai" },
  { icon: 'LuScale', text: "Legal Automation" },
  { icon: 'LuZap', text: "Smart Grids" },
  { icon: 'LuDatabase', text: "Core Data" },
  { icon: 'LuAntenna', text: "Fiber Systems" },
  { icon: 'LuShieldCheck', text: "Smart Protocols" },
  { icon: 'LuMic', text: "Neural Transcription" },
];

function doWorkBad() {
  const result = [];
  const array = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
  }
  return result;
}

const DISPLAY_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
function doWorkGood() {
  const result = [];
  for (let i = 0; i < DISPLAY_ITEMS.length; i++) {
    result.push(DISPLAY_ITEMS[i]);
  }
  return result;
}

const ITERATIONS = 1000000;

console.log('Warming up...');
for (let i = 0; i < 1000; i++) {
  doWorkBad();
  doWorkGood();
}

console.log(`Running ${ITERATIONS} iterations...`);

const startBad = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  doWorkBad();
}
const endBad = performance.now();
const timeBad = endBad - startBad;

const startGood = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  doWorkGood();
}
const endGood = performance.now();
const timeGood = endGood - startGood;

console.log(`Bad version (inline array): ${timeBad.toFixed(2)} ms`);
console.log(`Good version (pre-computed array): ${timeGood.toFixed(2)} ms`);
console.log(`Improvement: ${((timeBad - timeGood) / timeBad * 100).toFixed(2)}%`);
