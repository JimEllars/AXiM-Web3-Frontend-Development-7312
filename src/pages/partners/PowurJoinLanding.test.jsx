import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import PowurJoinLanding from './PowurJoinLanding';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('PowurJoinLanding Component', () => {
  test('renders PowurJoinLanding without crashing', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <PowurJoinLanding />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/Build Your Own/i)).toBeInTheDocument();
  });
});
