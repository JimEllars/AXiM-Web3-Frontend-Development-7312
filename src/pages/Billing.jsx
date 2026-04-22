import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';

const { LuCreditCard, LuDatabase, LuShieldCheck, LuArrowRight } = LuIcons;

export default function Billing() {
  const userSession = useAximStore((state) => state.userSession);
  const { profile } = useAximAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const tier = profile?.clearance_level >= 2 || userSession?.is_premium ? "Enterprise Core" : "Standard Tier";
  const credits = profile?.api_credits || 1000;

  const handleManageBilling = async () => {
    setIsRedirecting(true);
    try {
      // Simulate endpoint call
      const response = await fetch('https://api.axim.us.com/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userSession?.session_token && { 'Authorization': `Bearer ${userSession.session_token}` })
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No URL returned from portal session creation");
          setIsRedirecting(false);
        }
      } else {
        console.error("Failed to create portal session");
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Billing redirect error:", error);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Billing Management" description="Manage your AXiM ecosystem subscription and billing." />

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <SafeIcon icon={LuCreditCard} className="text-axim-teal" />
          Billing Operations
        </h1>
        <p className="text-zinc-500 text-sm">Manage your subscription, view credits, and update payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Subscription Tier Card */}
        <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.1)]">
              <SafeIcon icon={LuShieldCheck} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-mono text-zinc-500 uppercase">Current Tier</h3>
              <div className="text-2xl font-black text-white tracking-widest">{tier}</div>
            </div>
          </div>
          <p className="text-zinc-400 text-sm mb-6 relative z-10">
            Your current tier grants you access to core platform features and document generators.
          </p>
        </div>

        {/* API Credits Card */}
        <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-axim-teal/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-teal/10 transition-colors pointer-events-none" />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-axim-teal/10 flex items-center justify-center text-axim-teal border border-axim-teal/40 shadow-[0_0_15px_rgba(58,170,116,0.1)]">
              <SafeIcon icon={LuDatabase} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-mono text-zinc-500 uppercase">Remaining Credits</h3>
              <div className="text-2xl font-black text-white tracking-widest">{credits}</div>
            </div>
          </div>
          <p className="text-zinc-400 text-sm mb-6 relative z-10">
            Credits are used for generating legal documents and running automated API functions.
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl saturate-150 border border-white/10 p-8 rounded-sm text-center flex flex-col items-center">
        <h3 className="text-xl font-black uppercase mb-4 text-white">Manage Payment Methods</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8">
          Update your credit card on file, download past invoices, or change your billing address securely via Stripe Customer Portal.
        </p>
        <button
          onClick={handleManageBilling}
          disabled={isRedirecting}
          className="px-8 py-4 bg-axim-gold text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting ? 'Connecting...' : 'Access Stripe Portal'} <SafeIcon icon={LuArrowRight} />
        </button>
      </div>
    </div>
  );
}
