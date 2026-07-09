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

  componentDidMount() {
    this.handleError = (event) => {
      const isChunkLoadError = event.message && (
        event.message.match(/Loading chunk [\d]+ failed/) ||
        event.message.includes('Failed to fetch dynamically imported module')
      );
      if (isChunkLoadError) {
        logTelemetry('CHUNK_LOAD_ERROR_RECOVERY', { message: event.message });
        window.location.reload(true);
      }
    };
    window.addEventListener('error', this.handleError);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleError);
  }

  componentDidCatch(error, errorInfo) {
    const isChunkLoadError = error && error.message && (
      error.message.match(/Loading chunk [\d]+ failed/) ||
      error.message.includes('Failed to fetch dynamically imported module')
    );
    if (isChunkLoadError) {
      logTelemetry('CHUNK_LOAD_ERROR_RECOVERY', { message: error.message });
      window.location.reload(true);
      return;
    }

    logTelemetry('CRITICAL_UI_FAULT', {
      message: error.message,
      stack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-mono text-zinc-400 bg-[#050505] selection:bg-axim-gold/30 selection:text-white">
          <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-black uppercase text-white mb-4 tracking-tighter">System Malfunction</h1>
          <p className="max-w-md mb-8 text-xs leading-relaxed uppercase tracking-widest">
            System Exception Intercepted. Rebooting Node.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-axim-purple border border-axim-purple text-white font-mono uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
          >
            Hard Reset Uplink
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
