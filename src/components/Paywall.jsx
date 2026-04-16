import React from 'react';
import { motion } from 'framer-motion';
import { useActiveAccount } from "thirdweb/react";
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuLock, LuUnlock, LuWallet, LuCreditCard } = LuIcons;

export default function Paywall({ price, productId, web3Gate, children }) {
  const account = useActiveAccount();

  // Temporary mock logic for checking if unlocked
  // If web3Gate is required and we have an account, assume unlocked for now
  // In future: proper contract/NFT ownership check based on web3Gate config
  const isUnlocked = account ? true : false;

  if (isUnlocked) {
    return (
      <div className="relative group">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-axim-green bg-black/50 px-3 py-1 rounded border border-axim-green/30 backdrop-blur">
          <SafeIcon icon={LuUnlock} className="w-4 h-4" />
          <span className="text-xs font-mono uppercase font-bold tracking-wider">Access Granted</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col group">
      {/* Dimmed Children in Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-[2px] transition-all group-hover:blur-[4px]">
        {children}
      </div>

      {/* Paywall Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center bg-black/60 backdrop-blur-sm border border-subtle">
        <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/30 mb-6 shadow-[0_0_20px_rgba(255,234,0,0.15)]">
          <SafeIcon icon={LuLock} className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-white">Encrypted Protocol</h3>
        <p className="text-zinc-400 text-sm mb-8 max-w-[280px]">
          Access requires protocol clearance. Connect Web3 Wallet or purchase direct access.
        </p>

        <div className="flex flex-col w-full max-w-[240px] gap-3">
          {web3Gate && (
            <button className="w-full py-3 bg-white/5 border border-white/10 hover:border-axim-teal/50 hover:bg-axim-teal/10 text-white text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <SafeIcon icon={LuWallet} className="w-4 h-4" /> Verify Web3 ID
            </button>
          )}

          <button className="w-full py-3 bg-axim-gold/10 border border-axim-gold/30 hover:bg-axim-gold hover:text-black text-axim-gold text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            <SafeIcon icon={LuCreditCard} className="w-4 h-4" /> Unlock for ${parseFloat(price).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
