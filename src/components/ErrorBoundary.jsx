import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { logTelemetry } from '../lib/telemetry';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logTelemetry('CRITICAL_UI_FAULT', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-mono text-zinc-400 bg-bg-void selection:bg-axim-gold/30 selection:text-white">
          <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-black uppercase text-white mb-4 tracking-tighter">System Malfunction</h1>
          <p className="max-w-md mb-8 text-xs leading-relaxed uppercase tracking-widest">
            A minor anomaly occurred. Our Onyx swarm has been notified.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-mono uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              Restart Uplink
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-axim-purple border border-axim-purple text-white font-mono uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
