import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import MakeLanding from './MakeLanding';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('MakeLanding Component', () => {
  test('renders MakeLanding without crashing', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <MakeLanding />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/Scale Operations/i)).toBeInTheDocument();
  });
});
