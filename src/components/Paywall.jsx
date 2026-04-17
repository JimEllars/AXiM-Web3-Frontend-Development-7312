import React, { useState } from 'react';
import { useActiveAccount as thirdwebUseActiveAccount, useReadContract as thirdwebUseReadContract, ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";
import { motion, AnimatePresence } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuLock, LuWallet, LuCreditCard, LuX } = LuIcons;

// Placeholder token contract address
const ACCESS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

const contract = getContract({
  client,
  chain: sepolia,
  address: ACCESS_TOKEN_ADDRESS,
});

export default function Paywall({
  price,
  productId,
  web3Gate,
  children,
  // DI for testing
  useActiveAccount = thirdwebUseActiveAccount,
  useReadContract = thirdwebUseReadContract,
  ConnectButton = ThirdwebConnectButton
}) {
  const account = useActiveAccount();
  const [showModal, setShowModal] = useState(false);

  // Check if they hold the AXiM NFT/Token
  const { data: balanceData, isLoading: balanceLoading } = useReadContract({
    contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: account ? [account.address] : ["0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account && web3Gate },
  });

  const hasAccess = account && balanceData && balanceData > 0n;
  const isLocked = web3Gate && !hasAccess;

  const handleIntercept = (e) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  };

  const handleFiatCheckout = () => {
    window.location.href = `/api/create-checkout-session?productId=${productId}`;
  };

  return (
    <>
      <div
        className="relative group w-full h-full cursor-pointer"
        onClickCapture={handleIntercept}
      >
        {children}
        {isLocked && (
          <div className="absolute top-4 right-4 z-20 text-axim-gold/50 group-hover:text-axim-gold transition-colors">
            <SafeIcon icon={LuLock} className="w-5 h-5" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-axim-gold/30 p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[50px] pointer-events-none" />

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <SafeIcon icon={LuX} className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.1)] mb-6">
                  <SafeIcon icon={LuLock} className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">Protocol Locked</h3>
                <p className="text-zinc-400 text-sm">
                  This tool requires an active AXiM Protocol Pass or a one-time fiat purchase.
                </p>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-4 border border-white/10 bg-white/5 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <SafeIcon icon={LuWallet} className="text-axim-teal" />
                    <span className="font-bold uppercase text-sm tracking-wider">Web3 Access</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">Connect wallet holding AXiM Protocol Pass.</p>
                  <ConnectButton client={client} theme="dark" className="!w-full" />
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-px bg-white/10 flex-grow"></div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-zinc-600">OR</span>
                  <div className="h-px bg-white/10 flex-grow"></div>
                </div>

                <div className="p-4 border border-axim-gold/20 bg-axim-gold/5 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <SafeIcon icon={LuCreditCard} className="text-axim-gold" />
                    <span className="font-bold uppercase text-sm tracking-wider">Fiat Access</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">One-time purchase for single use access.</p>
                  <button
                    onClick={handleFiatCheckout}
                    className="w-full py-3 bg-axim-gold text-black font-bold uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                  >
                    Pay ${price} USD
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
