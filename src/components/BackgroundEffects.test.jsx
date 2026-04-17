import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, cleanup, act } from '@testing-library/react';
import React from 'react';
import BackgroundEffects from './BackgroundEffects.jsx';

describe('BackgroundEffects Component', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let requestAnimationFrameSpy;
  let cancelAnimationFrameSpy;

  beforeEach((context) => {
    // Mock getContext since jsdom doesn't support canvas fully
    window.HTMLCanvasElement.prototype.getContext = () => ({
      clearRect: mock.fn(),
      beginPath: mock.fn(),
      arc: mock.fn(),
      fill: mock.fn(),
      fillStyle: ''
    });

    addEventListenerSpy = mock.method(window, 'addEventListener');
    removeEventListenerSpy = mock.method(window, 'removeEventListener');
    requestAnimationFrameSpy = mock.method(global, 'requestAnimationFrame', (cb) => {
      return setTimeout(cb, 16);
    });
    cancelAnimationFrameSpy = mock.method(global, 'cancelAnimationFrame', (id) => {
      clearTimeout(id);
    });

    context.mock.timers.enable({ apis: ['setTimeout'] });
  });

  afterEach(() => {
    cleanup();
    mock.restoreAll();
  });

  test('renders canvas element with correct classes', () => {
    render(<BackgroundEffects />);
    const canvas = document.querySelector('canvas');
    assert.ok(canvas);
    assert.strictEqual(canvas.className, 'fixed inset-0 pointer-events-none z-0 opacity-40');
  });

  test('initializes canvas size to window size', () => {
    window.innerWidth = 800;
    window.innerHeight = 600;
    render(<BackgroundEffects />);
    const canvas = document.querySelector('canvas');
    assert.strictEqual(canvas.width, 800);
    assert.strictEqual(canvas.height, 600);
  });

  test('updates canvas size on window resize', () => {
    render(<BackgroundEffects />);
    const canvas = document.querySelector('canvas');

    window.innerWidth = 1024;
    window.innerHeight = 768;

    // Create a real window Event for jsdom instead of Mocking
    const resizeEvent = document.createEvent('Event');
    resizeEvent.initEvent('resize', true, true);
    window.dispatchEvent(resizeEvent);

    assert.strictEqual(canvas.width, 1024);
    assert.strictEqual(canvas.height, 768);
  });

  test('starts animation loop and cleans up on unmount', (context) => {
    // Math.random hack to ensure all wrapping bounds branch logic is hit
    // in BackgroundEffects.jsx (p.x < 0, p.x > canvas.width, p.y < 0, p.y > canvas.height)
    // Speed calc: (Math.random() - 0.5) * 0.5. Max is 0.25, min is -0.25
    let randomVals = [
      0.99, 0.99, // init x, y (close to max)
      0.5, // size
      0.99, 0.99, // speedX, speedY -> math gives 0.245. 0.99 * w + 0.245 -> w > w, will exceed max
      0.5, // opacity

      0.01, 0.01, // init x, y (close to min)
      0.5, // size
      0.01, 0.01, // speedX, speedY -> math gives -0.245. 0.01 * w - 0.245 -> negative, will drop below 0
      0.5, // opacity
    ];
    let i = 0;
    mock.method(Math, 'random', () => {
      let val = randomVals[i % randomVals.length];
      i++;
      return val;
    });

    // Make canvas small so particles easily wrap bounds
    window.innerWidth = 1;
    window.innerHeight = 1;

    const { unmount } = render(<BackgroundEffects />);

    const resizeCall = addEventListenerSpy.mock.calls.find(call => call.arguments[0] === 'resize');
    assert.ok(resizeCall);

    assert.strictEqual(requestAnimationFrameSpy.mock.calls.length, 1);

    // Trigger frames to ensure all boundaries and particles are hit
    for(let j=0; j<50; j++) {
      act(() => {
        context.mock.timers.tick(16);
      });
    }

    assert.ok(requestAnimationFrameSpy.mock.calls.length > 50);

    unmount();

    const removeResizeCall = removeEventListenerSpy.mock.calls.find(call => call.arguments[0] === 'resize');
    assert.ok(removeResizeCall);
    assert.strictEqual(cancelAnimationFrameSpy.mock.calls.length, 1);
  });
});
