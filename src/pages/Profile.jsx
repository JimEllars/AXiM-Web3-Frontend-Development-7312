import React from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import ProfileCard from '../components/ProfileCard';
import ProfileMenuButton from '../components/ProfileMenuButton';
import InfoPanel from '../components/InfoPanel';
import { ConnectButton } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";

const { LuUser, LuKey, LuShieldAlert, LuDatabase, LuHardDrive, LuSettings } = LuIcons;

export default function Profile() {
  const { account, profile, loading } = useAximAuth();

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
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-80 space-y-6">
          <ProfileCard address={account.address} clearanceLevel={profile?.clearance_level} />

          <div className="bg-glass border border-subtle p-6 space-y-4">
            <ProfileMenuButton icon={LuSettings} label="System Settings" />
            <ProfileMenuButton icon={LuKey} label="API Keys" />
            <ProfileMenuButton icon={LuShieldAlert} label="Terminate Session" danger={true} />
          </div>
        </div>

        <div className="flex-grow space-y-8">
          <InfoPanel icon={LuDatabase} iconColor="text-axim-gold" title="Node Association">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Primary Region</div>
                <div className="font-bold text-white tracking-widest uppercase">US-NORTH-2</div>
              </div>
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Data Integrity</div>
                <div className="font-bold text-axim-green tracking-widest uppercase">VERIFIED</div>
              </div>
            </div>
          </InfoPanel>

          <InfoPanel icon={LuHardDrive} iconColor="text-axim-purple" title="Infrastructure Yield">
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[0.7rem] font-mono text-zinc-500 uppercase">Total Participation</span>
                <span className="text-2xl font-black text-white">1,240 AXM</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[0.7rem] font-mono text-zinc-500 uppercase">Governance Quorum Participation</span>
                <span className="text-2xl font-black text-axim-gold">82%</span>
              </div>
            </div>
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}