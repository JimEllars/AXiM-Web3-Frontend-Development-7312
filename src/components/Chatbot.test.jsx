import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Chatbot from './Chatbot.jsx';
import * as telemetry from '../lib/telemetry.js';

vi.mock('../lib/telemetry.js', () => ({
  logTelemetry: vi.fn(),
}));

describe('Chatbot Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('opens support drawer and clicks support', () => {
    render(
      <BrowserRouter>
        <Chatbot />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /Inquire \/ Support/i });
    fireEvent.click(button);
    expect(telemetry.logTelemetry).toHaveBeenCalledWith('support_drawer_opened');

    const supportLink = screen.getByText('Technical Support');
    fireEvent.click(supportLink);
    expect(telemetry.logTelemetry).toHaveBeenCalledWith('support_drawer_support_clicked');
  });

  it('opens support drawer and clicks consultation', () => {
    render(
      <BrowserRouter>
        <Chatbot />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /Inquire \/ Support/i });
    fireEvent.click(button);

    const consultationLink = screen.getByText('Book Consultation');
    fireEvent.click(consultationLink);
    expect(telemetry.logTelemetry).toHaveBeenCalledWith('support_drawer_consultation_clicked');
  });
});
