import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import GovernanceVote from './GovernanceVote.jsx';

describe('GovernanceVote Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockProposal = {
    title: 'Test Proposal',
  };

  test('Renders initial proposal data and votes', () => {
    render(<GovernanceVote proposal={mockProposal} />);

    assert.ok(screen.getByText('Test Proposal'));
    assert.ok(screen.getByText('68%'));
    assert.ok(screen.getByText('32%'));
    assert.ok(screen.getByRole('button', { name: /^For$/i }));
    assert.ok(screen.getByRole('button', { name: /^Against$/i }));
  });

  test('Clicking "For" updates state correctly', async () => {
    render(<GovernanceVote proposal={mockProposal} />);

    const forButton = screen.getByRole('button', { name: /^For$/i });
    const againstButton = screen.getByRole('button', { name: /^Against$/i });

    assert.strictEqual(forButton.disabled, false);
    assert.strictEqual(againstButton.disabled, false);

    fireEvent.click(forButton);

    assert.ok(screen.getByRole('button', { name: /voting\.\.\./i }));
    assert.strictEqual(forButton.disabled, true);
    assert.strictEqual(againstButton.disabled, true);

    await waitFor(() => {
      const votedForButton = screen.getByRole('button', { name: /voted for/i });
      assert.ok(votedForButton);
      assert.strictEqual(votedForButton.disabled, true);
      assert.strictEqual(againstButton.disabled, true);

      // Check if vote counts updated
      assert.ok(screen.getByText('69%'));
      assert.ok(screen.getByText('32%'));
    }, { timeout: 1500 });
  });

  test('Clicking "Against" updates state correctly', async () => {
    render(<GovernanceVote proposal={mockProposal} />);

    const forButton = screen.getByRole('button', { name: /^For$/i });
    const againstButton = screen.getByRole('button', { name: /^Against$/i });

    fireEvent.click(againstButton);

    assert.ok(screen.getByRole('button', { name: /voting\.\.\./i }));
    assert.strictEqual(forButton.disabled, true);
    assert.strictEqual(againstButton.disabled, true);

    await waitFor(() => {
      const votedAgainstButton = screen.getByRole('button', { name: /^against$/i });
      assert.ok(votedAgainstButton);
      assert.strictEqual(votedAgainstButton.disabled, true);
      assert.strictEqual(forButton.disabled, true);

      // Check if vote counts updated
      assert.ok(screen.getByText('68%'));
      assert.ok(screen.getByText('33%'));
    }, { timeout: 1500 });
  });

  test('Voting is only allowed once', async () => {
    render(<GovernanceVote proposal={mockProposal} />);

    const forButton = screen.getByRole('button', { name: /^For$/i });
    const againstButton = screen.getByRole('button', { name: /^Against$/i });

    fireEvent.click(forButton);

    // Simulate multiple clicks
    fireEvent.click(forButton);
    fireEvent.click(againstButton);

    await waitFor(() => {
      const votedForButton = screen.getByRole('button', { name: /voted for/i });
      assert.ok(votedForButton);

      // Since it was clicked multiple times during transition,
      // it should still only register one vote (69%)
      assert.ok(screen.getByText('69%'));
    }, { timeout: 1500 });

    // Try clicking after vote is complete
    const votedForButton = screen.getByRole('button', { name: /voted for/i });
    const disabledAgainstButton = screen.getByRole('button', { name: /^Against$/i });

    fireEvent.click(votedForButton);
    fireEvent.click(disabledAgainstButton);

    // Votes should still be the same
    assert.ok(screen.getByText('69%'));
  });
});
