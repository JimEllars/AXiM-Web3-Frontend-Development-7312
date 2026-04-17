import React from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
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

const { LuUser, LuKey, LuShieldAlert, LuDatabase, LuHardDrive, LuSettings, LuArrowRight, LuUnlock } = LuIcons;

const ACCESS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

const contract = getContract({
  client,
  chain: sepolia,
  address: ACCESS_TOKEN_ADDRESS,
});

export default function Profile() {
  const { account, profile, loading } = useAximAuth();
  const activeChain = useActiveWalletChain();
  const isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';

  const { data: balanceData, isLoading: balanceLoading } = useReadContract({
    contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: account ? [account.address] : ["0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: isWeb3Enabled && !!account },
  });

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
                 {generators.map((doc) => (
                    <a key={doc.id} href={ensureSafeProtocol(doc.externalUrl ? `${doc.externalUrl}?source=axim_hub` : "#")} target="_blank" rel="noopener noreferrer" className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-axim-teal/50 transition-colors group flex flex-col gap-2 rounded-sm cursor-pointer block">
                       <div className="flex items-center gap-3">
                         <SafeIcon icon={LuIcons[doc.iconName] || LuIcons.LuFileText} className="text-axim-teal w-5 h-5" />
                         <span className="font-bold text-sm text-white group-hover:text-axim-teal transition-colors uppercase tracking-wider">{doc.title}</span>
                       </div>
                       <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{doc.desc}</p>
                    </a>
                 ))}
               </div>
            )}
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
