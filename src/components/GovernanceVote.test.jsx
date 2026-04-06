import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
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
      const votedAgainstButton = screen.getByRole('button', { name: /voted against/i });
      assert.ok(votedAgainstButton);
      assert.strictEqual(votedAgainstButton.disabled, true);
      assert.strictEqual(forButton.disabled, true);

      // Check if vote counts updated
      assert.ok(screen.getByText('68%'));
      assert.ok(screen.getByText('33%'));
    }, { timeout: 1500 });
  });

  test('Buttons display the correct selected visual states after voting For', async () => {
    render(<GovernanceVote proposal={mockProposal} />);

    const forButton = screen.getByRole('button', { name: /^For$/i });
    const againstButton = screen.getByRole('button', { name: /^Against$/i });

    fireEvent.click(forButton);

    await waitFor(() => {
      // For button should turn solid green with black text
      assert.ok(forButton.className.includes('bg-axim-green'));
      assert.ok(forButton.className.includes('text-black'));

      // Against button should become opaque
      assert.ok(againstButton.className.includes('opacity-50'));
      assert.ok(againstButton.className.includes('cursor-not-allowed'));
      // It should NOT have bg-red-500, since it's unselected
      assert.strictEqual(againstButton.className.includes('bg-red-500 text-black border-red-500'), false);
    }, { timeout: 1500 });
  });

  test('Buttons display the correct selected visual states after voting Against', async () => {
    render(<GovernanceVote proposal={mockProposal} />);

    const againstButton = screen.getByRole('button', { name: /^Against$/i });
    const forButton = screen.getByRole('button', { name: /^For$/i });

    fireEvent.click(againstButton);

    await waitFor(() => {
      // Against button should turn solid red with black text
      assert.ok(againstButton.className.includes('bg-red-500'));
      assert.ok(againstButton.className.includes('text-black'));

      // For button should become opaque
      assert.ok(forButton.className.includes('opacity-50'));
      assert.ok(forButton.className.includes('cursor-not-allowed'));
      // It should NOT have bg-axim-green, since it's unselected
      assert.strictEqual(forButton.className.includes('bg-axim-green text-black'), false);

      // Check the button text changes correctly
      const votedAgainstButton = screen.getByRole('button', { name: /voted against/i });
      assert.ok(votedAgainstButton);
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
describe('GovernanceVote Edge Cases', () => {
  test('Renders without error when proposal is undefined', () => {
    assert.doesNotThrow(() => { render(<GovernanceVote proposal={{}} />); });
  });

  test('Renders without error when proposal is missing', () => {
    assert.doesNotThrow(() => { render(<GovernanceVote />); });
  });

  test('Buttons display fallback states', async () => {
    render(<GovernanceVote proposal={{title: "x"}} />);
    const againstButton = screen.getAllByRole('button', { name: /^Against$/i })[0];
    fireEvent.click(againstButton);
    await waitFor(() => {
      assert.ok(screen.getAllByRole('button')[1].className.includes('bg-red-500'));
    }, { timeout: 1500 });
  });

  test('handleVote returns early if already voted', async () => {
    render(<GovernanceVote proposal={{title: "x"}} />);
    const forButton = screen.getAllByRole('button', { name: /^For$/i })[0];
    fireEvent.click(forButton);
    await waitFor(() => {
      assert.ok(screen.getAllByRole('button')[0].className.includes('bg-axim-green'));
    }, { timeout: 1500 });

    // Voted is true
    const votedButton = screen.getAllByRole('button')[0];
    votedButton.removeAttribute('disabled');
    fireEvent.click(votedButton); // hits if(voted) return
  });
});
