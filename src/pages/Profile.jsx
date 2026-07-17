import { useWalletBalance } from 'thirdweb/react';
import { arbitrum } from 'thirdweb/chains';
import { client } from '../lib/thirdweb-client';
import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { supabase } from '../lib/supabase';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardAccessDenied from '../components/DashboardAccessDenied';
import VaultedRecords from '../components/VaultedRecords';
import { logTelemetry } from '../lib/telemetry';

export default function Profile() {
  const { session, user, signOut, profile } = useAximAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const walletAddress = useAximStore((state) => state.walletAddress);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const logoutWeb3Wallet = useAximStore((state) => state.logoutWeb3Wallet);
  const [activeTab, setActiveTab] = useState('vault');
  const usdcTokenAddress = import.meta.env.VITE_USDC_TOKEN_ADDRESS || '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // Default Arbitrum USDC address
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({
    chain: arbitrum,
    address: walletAddress,
    client: client,
    tokenAddress: usdcTokenAddress,
  });

const [extractingId, setExtractingId] = useState(null);
  const [extractedAssets, setExtractedAssets] = useState([]);

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Zustand State Access
  const vaultedAssets = useAximStore((state) => state.assets);
  const activeTickets = useAximStore((state) => state.tickets);
  const clearStore = useAximStore((state) => state.clearStore);

  // Strict Authentication Gate
  if (!session && !isWeb3Authenticated) {
    return <DashboardAccessDenied />;
  }

  // Security Protocol: Terminate Session
  const handleTerminate = async () => {
    try {
      logTelemetry('operator_session_terminated', { method: isWeb3Authenticated ? 'web3_wallet' : 'email_key' });
      if (signOut) await signOut();
      await supabase.auth.signOut();
      clearStore(); // Wipe PII from local state
      logoutWeb3Wallet();
      useAximStore.getState().showToast('Operator connection severed. Session closed.', 'success');
      navigate('/auth');
    } catch (error) {
      useAximStore.getState().showToast('Error closing session.', 'error');
      console.error("[AXiM_SEC] Termination failed:", error);
    }
  };

  // UX Protocol: Simulate Cryptographic Extraction
  const handleExtract = (assetId) => {
    logTelemetry('profile_asset_extraction_intent', { assetId });
    setExtractingId(assetId);
    // Simulate decryption and network download delay
    setTimeout(() => {
      if (isMounted.current) {
        setExtractingId(null);
        setExtractedAssets((prev) => [...prev, assetId]);
        // In production, this would trigger a Blob download of the PDF
      }
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Operator Vault | AXiM Systems" noindex={true} />

      {/* Vault Header */}
      <section className="pt-32 pb-12 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-green/10 border border-axim-green/30 text-[0.65rem] font-mono uppercase tracking-widest text-axim-green mb-4 rounded-sm">
              <SafeIcon icon={LuIcons.LuLock} className="w-3 h-3" />
              <span>Connection Secure</span>
            </div>
            <h2 className="text-xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              {isWeb3Authenticated ? "Cryptographic Operator Profile" : "Standard System Profile"}
            </h2>
            <p className="text-zinc-400 text-sm font-mono mt-2 uppercase tracking-widest flex items-center gap-2">
              ID: {isWeb3Authenticated ? (
                <span className="text-axim-gold flex items-center gap-1 font-bold">
                  <SafeIcon icon={LuIcons.LuWallet} className="w-3 h-3" /> {walletAddress}
                </span>
              ) : (
                user?.email || 'AXIM_OP_001'
              )}
            </p>
          </div>
            {isWeb3Authenticated && (
              <div className="mt-6 border border-white/5 bg-[#050505] p-6 rounded-sm shadow-xl">
                {isBalanceLoading ? (
                   <div className="animate-pulse bg-white/5 h-8 rounded-sm w-48"></div>
                ) : (
                   <div className="font-mono text-xs uppercase tracking-widest text-zinc-300">
                     ACCOUNT SETTLE BALANCE: <span className="text-white font-bold">{balanceData?.displayValue || '0.00'} {balanceData?.symbol || 'USDC'}</span> [ARBITRUM ONE]
                   </div>
                )}
                {isWeb3Authenticated && (
                  <div className="flex items-center gap-2 mt-3 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    <span className="px-2 py-0.5 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple rounded-sm">[STREAK: 5 DAYS]</span>
                    <span className="px-2 py-0.5 bg-axim-gold/10 border border-axim-gold/30 text-axim-gold rounded-sm">[RANK: ELITE_OP]</span>
                    {isWeb3Authenticated && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-sm">
                        [MULTIPLIER: 1.2x]
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}


          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
              Settings
            </button>
            <button onClick={handleTerminate} className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors rounded-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuLogOut} className="w-3 h-3" /> Terminate
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('vault'); logTelemetry('profile_tab_view', { tab: 'vault' }); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'vault' ? 'text-axim-purple border-b-2 border-axim-purple' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}`}
          >
            Digital Assets
          </button>
          <button
            onClick={() => { setActiveTab('tickets'); logTelemetry('profile_tab_view', { tab: 'tickets' }); }}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'tickets' ? 'text-[#DB2777] border-b-2 border-[#DB2777]' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}`}
          >
            Active Consultations
          </button>
          {isWeb3Authenticated && (
            <button
              onClick={() => { setActiveTab('activity'); logTelemetry('profile_tab_view', { tab: 'activity' }); }}
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'activity' ? 'text-axim-green border-b-2 border-axim-green' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}`}
            >
              Recent On-Chain Activity
            </button>
          )}
        </div>

        {/* Enterprise Tools Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuZap} className="w-5 h-5 text-axim-gold" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Enterprise Tools</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/tools/nda-generator" className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl hover:border-axim-purple/50 transition-colors group flex items-start gap-4">
              <div className="p-3 bg-axim-purple/10 text-axim-purple rounded-sm">
                <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight mb-1">NDA Generator</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Generate a balanced, two-way non-disclosure agreement optimized for tech collaborations.</p>
              </div>
            </Link>
            <Link to="/tools/pay-stub" className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl hover:border-[#DB2777]/50 transition-colors group flex items-start gap-4">
              <div className="p-3 bg-[#DB2777]/10 text-[#DB2777] rounded-sm">
                <SafeIcon icon={LuIcons.LuFileText} className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight mb-1">Pay Stub System</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Standardize independent payroll documentation with mathematical accuracy.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Tab 1: Vaulted Assets */}
        {activeTab === 'vault' && (
          <div className="animate-fade-in">
             <VaultedRecords />
          </div>
        )}

        {/* Tab 2: Tickets */}
        {activeTab === 'tickets' && (
          <div className="animate-fade-in">
            {activeTickets.length === 0 ? (
               <div className="bg-[#0F172A] border border-white/5 p-12 rounded-sm text-center shadow-md">
                 <SafeIcon icon={LuIcons.LuMessageSquareOff} className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                 <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">No Active Tickets</h3>
                 <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">You have no pending consultations or support requests.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {activeTickets.map((ticket, idx) => (
                  <div key={idx} className="bg-[#0F172A] border border-white/5 p-6 rounded-sm shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-sm">{ticket.id}</span>
                        <span className={`text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-white/5 text-zinc-400'}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white uppercase tracking-wider">{ticket.subject}</h4>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">{ticket.date}</span>
                      <span className="text-[0.65rem] font-bold text-axim-gold uppercase tracking-widest flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-axim-gold animate-pulse" /> {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: On-Chain Activity */}
        {activeTab === 'activity' && isWeb3Authenticated && (
          <div className="animate-fade-in">
            <div className="space-y-4">
              {profile?.transactions?.map((tx, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-white/5 p-6 rounded-sm shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-sm">{tx.type}</span>
                    </div>
                    <h4 className="text-base font-black text-white uppercase tracking-wider font-mono">
                      <a href="#" className="hover:text-axim-green transition-colors">{tx.hash}</a>
                    </h4>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">{tx.timestamp}</span>
                    <span className="text-[0.65rem] font-bold text-axim-green uppercase tracking-widest flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-axim-green animate-pulse" /> Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
