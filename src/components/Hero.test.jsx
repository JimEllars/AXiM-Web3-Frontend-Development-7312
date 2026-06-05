import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Hero from './Hero.jsx';

describe('Hero Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver for framer-motion
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Enable fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders main headings and static content', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // Check main title
    assert.ok(screen.getByText(/Work Smarter/));
    assert.ok(screen.getAllByText(/Systems/)[0]);

    // Check description
    assert.ok(screen.getByText(/Access On-Demand Templates & Tools without Breaking the Bank/));

    // Check links
    const demandLetterLink = screen.getByRole('link', { name: /NEW: \$4\.00 QUICK DEMAND LETTER GENERATOR/i });
    assert.ok(demandLetterLink);
    assert.strictEqual(demandLetterLink.getAttribute('href'), 'https://quickdemandletter.com/start');

    const exploreToolsLink = screen.getByRole('link', { name: /Explore Offerings/i });
    assert.ok(exploreToolsLink);
    assert.strictEqual(exploreToolsLink.getAttribute('href'), '/tools');

    const consultationLink = screen.getByRole('link', { name: /Request Consultation/i });
    assert.ok(consultationLink);
    assert.strictEqual(consultationLink.getAttribute('href'), '/consultation');
  });

  test('typewriter effect works deterministically with fake timers', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    const getTypedText = () => {
      const container = document.querySelector('.bg-axim-purple\\/10');
      return container ? container.querySelectorAll('span')[1].textContent : "";
    };

    act(() => {
        vi.advanceTimersByTime(100);
    });
    assert.ok(getTypedText().includes("A"));

    act(() => {
        vi.advanceTimersByTime(100);
    });
    assert.ok(getTypedText().includes("AX"));

    act(() => {
        vi.advanceTimersByTime(100);
    });
    assert.ok(getTypedText().includes("AXi"));

    act(() => {
        vi.advanceTimersByTime(100);
    });
    assert.ok(getTypedText().includes("AXiM"));

    // Advance multiple characters
    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }

    assert.ok(getTypedText().includes("AXiM_CORE_CONNECTED"));

    act(() => {
        vi.advanceTimersByTime(2000); // pause
    });

    act(() => {
        vi.advanceTimersByTime(50); // delete 1 char
    });
    assert.ok(!getTypedText().includes("D_")); // D is removed
  });
});
