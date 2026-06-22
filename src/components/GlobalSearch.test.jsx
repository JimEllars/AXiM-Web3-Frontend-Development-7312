import 'global-jsdom/register';
import { test, describe, afterEach } from 'vitest';
import assert from 'node:assert/strict';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import GlobalSearch from './GlobalSearch.jsx';

describe('GlobalSearch Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders search button and opens modal', async () => {
    render(
      <MemoryRouter>
        <GlobalSearch />
      </MemoryRouter>
    );

    // Find the button with text Search
    const searchBtns = screen.getAllByRole('button');
    const searchBtn = searchBtns[0];

    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText('Search Intelligence Hub & Offerings...');
    assert.ok(input);

    fireEvent.change(input, { target: { value: 'Apps & Tools' } });

    await waitFor(() => {
        const toolsResult = screen.getAllByText('Apps & Tools')[0];
        assert.ok(toolsResult);
    });
  });
});
