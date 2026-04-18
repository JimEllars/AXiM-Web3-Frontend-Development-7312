import React from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import { usePassport } from '../hooks/usePassport';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import ProfileCard from '../components/ProfileCard';
import ProfileMenuButton from '../components/ProfileMenuButton';
import InfoPanel from '../components/InfoPanel';
import { ConnectButton, useReadContract, useActiveWalletChain } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { generators } from '../data/companyOfferings';
import { ensureSafeProtocol } from '../lib/sanitize';

const { LuUser, LuKey, LuShieldAlert, LuDatabase, LuHardDrive, LuSettings, LuArrowRight, LuUnlock, LuFileText, LuRefreshCw } = LuIcons;

const ACCESS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

const contract = getContract({
  client,
  chain: sepolia,
  address: ACCESS_TOKEN_ADDRESS,
});

export default function Profile() {
  const { account, profile, loading } = useAximAuth();
  const { userSession, loading: passportLoading } = usePassport();
  const [isRollingKey, setIsRollingKey] = React.useState(false);
  const [apiRollMessage, setApiRollMessage] = React.useState(null);
  const [apiKeyPrefix, setApiKeyPrefix] = React.useState('sk_live_***');
  const [creditsRemaining, setCreditsRemaining] = React.useState('10,000');

  const handleRollApiKey = async () => {
    setIsRollingKey(true);
    setApiRollMessage(null);
    try {
      const response = await fetch('https://api.axim.us.com/v1/functions/api-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'roll_key' }),
        credentials: 'include'
      });
      if (response.ok) {
        // In a real scenario we might get the new prefix back
        setApiRollMessage({ type: 'success', text: 'API Key successfully rolled. New key sent to registered email.' });
        // Mock updating the prefix
        setApiKeyPrefix('sk_live_' + Math.random().toString(36).substring(2, 6));
      } else {
        setApiRollMessage({ type: 'error', text: 'Failed to roll API key. Please try again.' });
      }
    } catch (err) {
      setApiRollMessage({ type: 'error', text: 'Network error. Could not reach API Gateway.' });
    } finally {
      setIsRollingKey(false);
    }
  };
  const activeChain = useActiveWalletChain();
  const isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';

  const { data: balanceData, isLoading: balanceLoading } = useReadContract({
    contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: account ? [account.address] : ["0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: isWeb3Enabled && !!account },
  });

  const { data: yieldData, isLoading: yieldLoading } = useReadContract({
    contract,
    method: "function calculateYield(address owner) view returns (uint256)",
    params: account ? [account.address] : ["0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: isWeb3Enabled && !!account },
  });

  const [claimedYield, setClaimedYield] = React.useState(false);
  const [showYieldToast, setShowYieldToast] = React.useState(false);

  const handleClaimYield = () => {
    setClaimedYield(true);
    setShowYieldToast(true);
    setTimeout(() => setShowYieldToast(false), 3000);
  };

  const hasAccess = account && balanceData && balanceData > 0n;

  if (!isWeb3Enabled) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuShieldAlert} className="w-10 h-10 text-axim-gold opacity-50" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4">Web3 Features Dormant</h2>
        <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs">The Web3 ecosystem is currently offline for this production release.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center font-mono text-axim-gold">
      <SafeIcon icon={LuUser} className="w-8 h-8 animate-pulse" />
      <span>INITIALIZING_PROFILE...</span>
    </div>
  );

  if (!account) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuUser} className="w-10 h-10 text-axim-gold opacity-50" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4">Identity Required</h2>
        <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs">Connect your Web3 identity to access secure profile data.</p>
        <div className="flex justify-center scale-110 origin-center mb-8">
          <ConnectButton
            client={client}
            accountAbstraction={{ chain: sepolia, sponsorGas: true }}
            theme="dark"
          />
        </div>
        <div className="p-4 bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-600 uppercase">
          Status: Await_Handshake // Error: 0xAUTH_REQ
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">AXiM ID Dashboard</h1>
        <p className="text-zinc-500 text-sm">Manage your decentralized identity and infrastructure access.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-80 space-y-6">
          <ProfileCard address={account.address} clearanceLevel={profile?.clearance_level} />

          <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-6 space-y-4">
            <ProfileMenuButton icon={LuSettings} label="System Settings" />
            <ProfileMenuButton icon={LuKey} label="API Keys" />
            <ProfileMenuButton icon={LuShieldAlert} label="Terminate Session" danger={true} />
          </div>
        </div>

        <div className="flex-grow space-y-8">
          <InfoPanel icon={LuDatabase} iconColor="text-axim-gold" title="Network Connection">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Active Network</div>
                <div className="font-bold text-white tracking-widest uppercase">{activeChain?.name || "Sepolia"}</div>
              </div>
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Wallet Status</div>
                <div className="font-bold text-axim-green tracking-widest uppercase">Connected</div>
              </div>
            </div>
          </InfoPanel>

          <InfoPanel icon={LuHardDrive} iconColor="text-axim-purple" title="Node Holdings & Yield">
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[0.7rem] font-mono text-zinc-500 uppercase">AXiM Node Tokens</span>
                <span className="text-2xl font-black text-white">{balanceLoading ? '...' : (balanceData ? balanceData.toString() : '0')} AXM</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4">
                <div>
                  <div className="text-[0.7rem] font-mono text-zinc-500 uppercase mb-1">Pending Yield</div>
                  <div className="text-xl font-bold text-axim-purple">
                    {yieldLoading ? '...' : claimedYield ? '0' : (yieldData ? yieldData.toString() : '150')} AXM
                  </div>
                </div>
                <button
                  onClick={handleClaimYield}
                  disabled={claimedYield || (yieldData && yieldData.toString() === '0')}
                  className="px-4 py-2 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple font-mono text-xs uppercase tracking-widest hover:bg-axim-purple hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claimedYield ? 'Claimed' : 'Claim Yield'}
                </button>
              </div>

              {showYieldToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 text-xs font-mono text-axim-green border border-axim-green/30 bg-axim-green/10 flex items-center justify-center"
                >
                  Yield Claimed Successfully
                </motion.div>
              )}
            </div>
          </InfoPanel>

          <InfoPanel icon={LuFileText} iconColor="text-axim-green" title="Ecosystem Documents">
            <div className="space-y-4">
              {passportLoading ? (
                <div className="p-4 border border-white/5 bg-white/5 text-center text-xs font-mono text-zinc-500 uppercase">
                  Syncing Document History...
                </div>
              ) : userSession && userSession.documents && userSession.documents.length > 0 ? (
                <div className="space-y-3">
                  {userSession.documents.map((doc, i) => (
                    <div key={i} className="p-4 border border-white/10 bg-white/5 flex justify-between items-center group hover:border-axim-green/50 transition-all">
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-axim-green transition-colors">{doc.title}</div>
                        <div className="text-[0.65rem] font-mono text-zinc-500 uppercase mt-1">Generated: {new Date(doc.createdAt).toLocaleDateString()}</div>
                      </div>
                      <a href={ensureSafeProtocol(doc.url)} className="text-axim-green bg-axim-green/10 p-2 rounded-sm hover:bg-axim-green hover:text-black transition-all">
                        <SafeIcon icon={LuArrowRight} className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-white/5 bg-white/5 text-center flex flex-col items-center">
                  <SafeIcon icon={LuFileText} className="w-8 h-8 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-400">No documents found in ecosystem history.</p>
                  {!userSession && (
                    <p className="text-[0.65rem] font-mono text-zinc-500 uppercase mt-2">AXiM Passport Disconnected</p>
                  )}
                </div>
              )}
            </div>
          </InfoPanel>

          <InfoPanel icon={LuUnlock} iconColor="text-axim-teal" title="Unlocked Infrastructure">
            {!hasAccess ? (
               <div className="p-6 border border-axim-gold/20 bg-axim-gold/5 text-center flex flex-col items-center">
                 <p className="text-sm text-zinc-400 mb-4">You do not hold an AXiM Node NFT. Mint one to unlock access to all micro-apps.</p>
                 <a href="/early-access" className="w-full sm:w-auto py-3 px-6 bg-axim-gold text-black font-bold uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                   Mint AXiM Node <SafeIcon icon={LuArrowRight} />
                 </a>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                 {generators.map((doc) => {
                    let destUrl = doc.externalUrl ? `${doc.externalUrl}?source=axim_hub` : "#";
                    if (doc.externalUrl && userSession && userSession.session_token) {
                      destUrl += `&auth_handoff=${userSession.session_token}`;
                    }
                    return (
                    <a key={doc.id} href={ensureSafeProtocol(destUrl)}  className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-axim-teal/50 transition-colors group flex flex-col gap-2 rounded-sm cursor-pointer block">
                       <div className="flex items-center gap-3">
                         <SafeIcon icon={LuIcons[doc.iconName] || LuIcons.LuFileText} className="text-axim-teal w-5 h-5" />
                         <span className="font-bold text-sm text-white group-hover:text-axim-teal transition-colors uppercase tracking-wider">{doc.title}</span>
                       </div>
                       <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{doc.desc}</p>
                    </a>
                    );
                 })}
               </div>
            )}
          </InfoPanel>


          {userSession?.is_partner && (
            <InfoPanel icon={LuKey} iconColor="text-axim-purple" title="API Credentials (B2B)">
              <div className="space-y-6">
                <div className="p-6 border border-axim-purple/20 bg-axim-purple/5 text-left flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                     <div>
                       <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">Active Key Prefix</div>
                       <div className="font-mono text-lg text-white">{apiKeyPrefix}</div>
                     </div>
                     <div className="text-left sm:text-right">
                       <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">Credits Remaining</div>
                       <div className="font-bold text-xl text-axim-purple">{creditsRemaining}</div>
                     </div>
                  </div>

                  {apiRollMessage && (
                    <div className={`p-3 text-xs font-mono ${apiRollMessage.type === 'success' ? 'text-axim-green border border-axim-green/30 bg-axim-green/10' : 'text-red-400 border border-red-400/30 bg-red-400/10'}`}>
                      {apiRollMessage.text}
                    </div>
                  )}

                  <button
                    onClick={handleRollApiKey}
                    disabled={isRollingKey}
                    className="w-full sm:w-auto py-2 px-4 bg-white/5 border border-white/10 text-white font-mono text-[0.65rem] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={LuRefreshCw} className={`w-3 h-3 ${isRollingKey ? 'animate-spin' : ''}`} />
                    {isRollingKey ? 'Rolling Key...' : 'Roll API Key'}
                  </button>
                </div>
              </div>
            </InfoPanel>
          )}
        </div>
      </div>
    </div>
  );
}
