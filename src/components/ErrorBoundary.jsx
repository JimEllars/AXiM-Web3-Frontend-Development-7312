import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-mono text-zinc-400 bg-bg-void selection:bg-axim-gold/30 selection:text-white">
          <SafeIcon icon={FiIcons.FiAlertTriangle} className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-black uppercase text-white mb-4 tracking-tighter">System Malfunction</h1>
          <p className="max-w-md mb-8 text-xs leading-relaxed uppercase tracking-widest">
            A critical error has occurred in the UI or Web3 RPC layer. Please refresh the page to re-establish connection.
          </p>
          {this.state.error && (
            <div className="bg-white/5 border border-white/10 p-4 mb-8 text-[0.6rem] text-left overflow-auto max-w-2xl w-full text-red-400">
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-axim-gold text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-colors"
          >
            Reboot Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
