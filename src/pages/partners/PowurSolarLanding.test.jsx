import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import PowurSolarLanding from './PowurSolarLanding';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('PowurSolarLanding Component', () => {
  test('renders PowurSolarLanding without crashing', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <PowurSolarLanding />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/Decentralize Your/i)).toBeInTheDocument();
  });
});
