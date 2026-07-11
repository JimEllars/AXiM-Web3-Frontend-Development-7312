import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../lib/supabase';
import { useAximStore } from '../store/useAximStore';
import { useEffect } from 'react';
import { sanitizeInput } from '../lib/sanitize';
import { logTelemetry } from '../lib/telemetry';


export default function AuthGateway() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [networkFault, setNetworkFault] = useState(false);

  // Note: Assuming useAximAuth provides standard Supabase wrappers. Adjust as needed.
  const { signIn, signUp } = useAximAuth();
  const navigate = useNavigate();
  const loginWeb3Wallet = useAximStore(state => state.loginWeb3Wallet);
  const setNotification = useAximStore(state => state.setNotification);
  const [isWeb3Connecting, setIsWeb3Connecting] = useState(false);

  const handleMockWeb3Login = async () => {
    setIsWeb3Connecting(true);
    setErrorMsg(null);
    setEmail('');
    setPassword('');

    try {
      // Simulate timeout and connection logic with Thirdweb wrappers
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection Timeout"));
        }, 8000);

        setTimeout(() => {
          clearTimeout(timeout);
          resolve();
        }, 2000);
      });

      const mockAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

      logTelemetry('AUTH_WEB3_LOGIN_SUCCESS', {
        address: mockAddress,
        method: 'mock_wallet_connect'
      });

      loginWeb3Wallet(mockAddress);
      setNotification('Authentication successful.');
      setIsWeb3Connecting(false);
      navigate("/admin", { state: { web3Auth: mockAddress } });
    } catch (err) {
      logTelemetry('auth_timeout_fault', { method: 'mock_wallet_connect', error: err.message });
      setNetworkFault(true);
      setIsWeb3Connecting(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    const cleanEmail = sanitizeInput(email);
    const authPromise = isLogin
        ? supabase.auth.signInWithPassword({ email: cleanEmail, password: password })
        : supabase.auth.signUp({ email: cleanEmail, password: password });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("auth_timeout_fault")), 8000));

    try {
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);
      if (error) throw error;

      // Route directly to the Operator Vault on success
      setNotification('Authentication successful.');
      navigate('/admin');
    } catch (err) {
      if (err.message === "auth_timeout_fault") {
        logTelemetry('auth_timeout_fault', { method: isLogin ? 'login' : 'signup', email: cleanEmail });
        setNetworkFault(true);
      } else {
        console.error("[AXiM_AUTH] Clearance rejected:", err);
        setErrorMsg(err.message || "Authentication failed. Verify credentials and try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };


  if (networkFault) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
        <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 flex items-center justify-center p-6 pt-24 pb-32">
      <SEO title="Secure Authentication | AXiM Systems" description="Authenticate to access your encrypted Operator Vault and active digital assets." />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">

        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
          <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Return to Public Grid
        </Link>

        <div className="bg-[#050505] border border-white/10 p-8 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/10 blur-[60px] pointer-events-none" />

          <div className="relative z-10 mb-8">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-6 shadow-lg">
              <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6 text-axim-purple" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-2">
              System <span className="text-axim-purple">Clearance.</span>
            </h1>
            <p className="text-[0.7rem] font-mono text-zinc-400 uppercase tracking-widest">
              {isLogin ? 'Enter credentials to access your Operator Vault.' : 'Establish a secure profile to encrypt your assets.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[0.65rem] font-mono uppercase tracking-widest flex items-start gap-2 rounded-sm">
              <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Secure Comms (Email)</label>
              <div className="relative">
                <SafeIcon icon={LuIcons.LuMail} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                  placeholder="operator@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Decryption Key (Password)</label>
              <div className="relative">
                <SafeIcon icon={LuIcons.LuKey} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button disabled={isProcessing} type="submit" className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 mt-4">
              {isProcessing ? <><SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin" /> Verifying...</> : (isLogin ? 'Authenticate' : 'Initialize Profile')}
            </button>
          </form>

          {/* NEW: Web3 Authentication Bridge */}
          <div className="relative flex items-center justify-center mt-8 mb-6 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <span className="relative px-4 bg-[#050505] text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Or connect via Web3</span>
          </div>

          <div className="flex justify-center relative z-10 w-full">
            <button
              type="button"
              onClick={handleMockWeb3Login}
              disabled={isWeb3Connecting || isProcessing}
              className="w-full py-4 bg-[#050505] border border-white/5 text-axim-purple hover:bg-axim-purple/10 hover:text-white hover:border-axim-purple/50 font-black uppercase tracking-widest text-xs transition-colors rounded-sm flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
            >
              {isWeb3Connecting ? (
                <>
                  <SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin" />
                  Awaiting Wallet Signature...
                </>
              ) : (
                'Authenticate with Wallet'
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); setEmail(''); setPassword(''); }} className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
              {isLogin ? "Need clearance? Request an account." : "Already have clearance? Authenticate here."}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
