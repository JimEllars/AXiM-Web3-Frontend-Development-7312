/**
 * @vitest-environment jsdom
 */
import { describe, it } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalSearch from './GlobalSearch';
import { BrowserRouter } from 'react-router-dom';

describe('GlobalSearch Component', () => {
  it('renders search button and opens modal', () => {
    render(
      <BrowserRouter>
        <GlobalSearch />
      </BrowserRouter>
    );

    const openBtns = screen.getAllByRole('button');
    const openBtn = openBtns[0];

    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText('Search AXiM Omnibar...');

    fireEvent.change(input, { target: { value: 'tools' } });

    // Tools (The Machine Shop) should be visible in results
    const toolsLink = screen.getByText('Tools (The Machine Shop)');
  });
});
