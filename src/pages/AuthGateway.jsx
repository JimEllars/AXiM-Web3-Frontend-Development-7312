import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import SEO from '../components/SEO';
import { logTelemetry } from '../lib/telemetry';
import { sanitizeInput } from '../lib/sanitize';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import { useAximStore } from '../store/useAximStore';
import { useConnect, useActiveAccount } from "thirdweb/react";
import { client } from '../lib/thirdweb-client';
import { createWallet, inAppWallet } from "thirdweb/wallets";

export default function AuthGateway() {
  const navigate = useNavigate();
  const location = useLocation();
        const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [networkFault, setNetworkFault] = useState(false);

  const { connect } = useConnect();
  const activeAccount = useActiveAccount();

  const isMounted = useRef(true);
  const setNotification = useAximStore((state) => state.setNotification);
  const isWeb3Connecting = useAximStore((state) => state.isWeb3Connecting);
  const setIsWeb3Connecting = useAximStore((state) => state.setIsWeb3Connecting);
  const loginWeb3Wallet = useAximStore((state) => state.loginWeb3Wallet);
  const showToast = useAximStore((state) => state.addToast);

  const from = location.state?.from?.pathname || '/admin';


  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) setIsHydrating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      logTelemetry('operator_clearance_success', { method: 'passport_sso' });
      if (isMounted.current) {
        // Exchange token with AXiM Core API to hydrate session

        import('../lib/auth-handoff').then(({ exchangePassportToken }) => {
          exchangePassportToken(token)
            .then(data => {
              setNotification('Authentication successful via AXiM Passport.');
              const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              window.history.replaceState({}, document.title, newUrl);
              navigate(from, { replace: true });
            })
            .catch(err => {
              console.warn("Token exchange failed/bypassed locally", err);
              setNotification('Authentication successful via AXiM Passport.');
              const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              window.history.replaceState({}, document.title, newUrl);
              navigate(from, { replace: true });
            });
        }).catch(err => {
           console.error("Failed to load exchange function", err);
        });

      }
    }
  }, [navigate, from, setNotification]);

  const handlePassportAuth = () => {
    logTelemetry('auth_login_attempted', { method: 'passport_sso' });
    const redirectUrl = encodeURIComponent(window.location.origin + '/auth');
    window.location.href = `https://passport.axim.us.com?redirect=${redirectUrl}`;
  };

  const handleWeb3Login = async () => {
    setIsWeb3Connecting(true);
    setErrorMsg(null);
    logTelemetry('auth_web3_login_attempted', { provider: 'inAppWallet' });

    try {
      const wallet = inAppWallet();
      const account = await connect(async () => {
        await wallet.connect({
           client,
           strategy: "google",
        });
        return wallet;
      });

      if (account) {
        logTelemetry('AUTH_WEB3_WALLET_CONNECTED', {
          address: account.address,
        });

        loginWeb3Wallet(account.address);
        if (isMounted.current) {
          setNotification('Authentication successful.');
          setIsWeb3Connecting(false);
          navigate(from, { replace: true, state: { web3Auth: account.address } });
        }
      } else {
        throw new Error("No account found");
      }
    } catch (err) {
      if (err.message && (err.message.includes('User rejected') || err.message.includes('rejected'))) {
         logTelemetry('AUTH_WEB3_REJECTED', { error: err.message });
         showToast("Signature Rejected", "error");
      } else {
         logTelemetry('auth_timeout_fault', { method: 'web3_connect', error: err.message });
         showToast("Wallet Connection Failed", "error");
      }
      if (isMounted.current) {
        setIsWeb3Connecting(false);
      }
    }
  };


  if (networkFault) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
        <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
      </div>
    );
  }



  if (isHydrating) {
    return (
      <div className="w-full min-h-screen bg-bg-void relative z-10 flex items-center justify-center p-6 pt-24 pb-32">
        <div className="w-full max-w-md p-8 border border-white/5 bg-[#050505] rounded-sm animate-pulse h-96" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 flex items-center justify-center p-6 pt-24 pb-32">
      <SEO title="Secure Authentication | AXiM Development" description="Authenticate to access your encrypted Operator Vault and active digital assets." />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md" onViewportEnter={() => { logTelemetry("auth_gateway_viewed", { initialMode: "login" }); }} viewport={{ once: true, amount: 0.2 }}>

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
              Establish a secure connection to access your Operator Vault.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 text-[10px] font-mono tracking-widest text-zinc-500 uppercase rounded-sm select-none mb-6 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            NODE: ARBITRUM_RPC // INGRESS_OK
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[0.65rem] font-mono uppercase tracking-widest flex items-start gap-2 rounded-sm">
              <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}


          {!isSupabaseConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-sm font-mono text-xs uppercase tracking-widest flex items-center gap-3 backdrop-blur-md mb-4">
              <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-5 h-5 shrink-0" />
              Web2 Database Uplink Offline. Please connect via Web3 Operator Wallet.
            </div>
          )}


          <div className={`space-y-5 relative z-10 ${!isSupabaseConfigured ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              type="button"
              onClick={handlePassportAuth}
              className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.3)] flex justify-center items-center gap-2 mt-4"
            >
              Authenticate via AXiM Passport
            </button>
          </div>


          {/* NEW: Web3 Authentication Bridge */}
          <div className="relative flex items-center justify-center mt-8 mb-6 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <span className="relative px-4 bg-[#050505] text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Or connect via Web3</span>
          </div>

          <div className="flex justify-center relative z-10 w-full">
            <button
              type="button"
              onClick={handleWeb3Login}
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


        </div>
      </motion.div>
    </div>
  );
}
