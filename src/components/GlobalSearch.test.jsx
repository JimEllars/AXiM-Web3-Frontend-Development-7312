import 'global-jsdom/register';
import { test, describe, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const GlobalSearch = (await import('./GlobalSearch.jsx')).default;

describe('GlobalSearch Component Focus Trapping', () => {
  afterEach(() => {
    cleanup();
  });

  test('Escape key closes modal', async () => {
    render(
      <MemoryRouter>
        <GlobalSearch />
      </MemoryRouter>
    );

    const searchBtns = screen.getAllByRole('button');
    fireEvent.click(searchBtns[0]);

    const input = screen.getByPlaceholderText('Search Intelligence Hub & Offerings...');
    expect(input).toBeTruthy();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search Intelligence Hub & Offerings...')).toBeNull();
    });
  });
});
