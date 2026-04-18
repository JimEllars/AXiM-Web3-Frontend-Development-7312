import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import FleetMap from '../components/FleetMap';
import B2BRegistrationModal from '../components/B2BRegistrationModal';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import OnyxIntegrationAssistant from '../components/OnyxIntegrationAssistant';

const { LuTerminal, LuShieldCheck, LuZap, LuCode, LuServer, LuNetwork } = LuIcons;

export default function PartnerPortal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volume, setVolume] = useState(1000);

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    "name": "AXiM Systems API",
    "description": "High-availability software service and document orchestration for enterprise.",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Systems"
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
      <SEO
        title="B2B API Partners"
        description="AXiM API Side Door. High-availability document orchestration and B2B workflows."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/20 text-axim-gold text-[0.65rem] font-mono uppercase tracking-widest mb-6">
          <SafeIcon icon={LuNetwork} className="w-3 h-3" />
          Enterprise Side Door
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          AXiM API <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-gold to-axim-teal">Side Door</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
          Bypass the public UI. Integrate our high-availability document orchestration and zero-trust fulfillment directly into your internal systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
            <SafeIcon icon={LuTerminal} className="text-axim-teal" />
            Live API Preview
          </h2>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden font-mono text-xs">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              <span className="ml-2 text-zinc-500 uppercase tracking-widest text-[0.55rem]">POST /v1/orchestrate/demand</span>
            </div>
            <div className="p-4 text-zinc-300 overflow-x-auto">
              <pre>
<span className="text-axim-teal">curl</span> -X POST https://api.axim.us.com/v1/orchestrate/demand \
  -H <span className="text-axim-gold">"Authorization: Bearer sk_live_..."</span> \
  -H <span className="text-axim-gold">"Content-Type: application/json"</span> \
  -d '{"{"}
    <span className="text-axim-green">"client_ref"</span>: "ENT-992",
    <span className="text-axim-green">"payload"</span>: {"{"}
      "type": "demand_letter",
      "variables": {"{"}
        "recipient": "Corp Inc",
        "amount": 5000
      {"}"}
    {"}"}
  {"}"}'
              </pre>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setIsModalOpen(true)} className="flex-1 py-3 px-6 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors text-center border border-white">
               Request Access
             </button>
             <a href="#" className="flex-1 py-3 px-6 bg-transparent text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors text-center border border-white/20">
               View Docs
             </a>
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
             <SafeIcon icon={LuServer} className="text-axim-gold" />
             Infrastructure Status
           </h2>
           <FleetMap />
        </div>
      </div>

      <div className="mb-20 bg-white/5 border border-white/10 p-8 rounded-sm">
        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-8">
          <SafeIcon icon={LuZap} className="text-axim-teal" />
          ROI Calculator
        </h2>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold uppercase tracking-widest text-zinc-300">Monthly Document Volume</label>
              <span className="text-xl font-mono text-axim-teal">{volume.toLocaleString()}</span>
            </div>
            <div className="relative w-full h-2 bg-white/10 rounded-lg cursor-pointer"
                 onPointerDown={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                   const pct = x / rect.width;
                   setVolume(Math.round((pct * 9900 + 100) / 100) * 100);
                 }}
                 onPointerMove={(e) => {
                   if (e.buttons === 1) {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                     const pct = x / rect.width;
                     setVolume(Math.round((pct * 9900 + 100) / 100) * 100);
                   }
                 }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-axim-teal rounded-lg"
                animate={{ width: `${((volume - 100) / 9900) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.div
                className="absolute top-1/2 -mt-2.5 -ml-2.5 w-5 h-5 bg-white rounded-full shadow border-2 border-axim-teal"
                animate={{ left: `${((volume - 100) / 9900) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-[0.65rem] font-mono text-zinc-500 uppercase mb-2">Traditional Cost ($150/doc)</div>
              <div className="text-2xl font-mono text-zinc-400">${(volume * 150).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[0.65rem] font-mono text-zinc-500 uppercase mb-2">AXiM API Cost ($10/doc)</div>
              <div className="text-2xl font-mono text-white">${(volume * 10).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[0.65rem] font-mono text-axim-teal uppercase mb-2">Monthly Savings</div>
              <div className="text-3xl font-mono font-bold text-axim-teal">${(volume * 140).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-white/5 bg-white/5 group hover:border-axim-teal/30 transition-colors">
          <SafeIcon icon={LuCode} className="w-6 h-6 text-axim-teal mb-4" />
          <h3 className="font-bold uppercase text-sm mb-2">Document Orchestration</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Generate legally structured PDFs, automate dispatch via USPS/email, and manage signatures entirely via REST API.
          </p>
        </div>
        <div className="p-6 border border-white/5 bg-white/5 group hover:border-axim-purple/30 transition-colors">
          <SafeIcon icon={LuShieldCheck} className="w-6 h-6 text-axim-purple mb-4" />
          <h3 className="font-bold uppercase text-sm mb-2">Zero-Trust Fulfillment</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            All data is encrypted in transit and at rest. PII is sanitized automatically before reaching our edge fulfillment workers.
          </p>
        </div>
        <div className="p-6 border border-white/5 bg-white/5 group hover:border-axim-gold/30 transition-colors">
          <SafeIcon icon={LuZap} className="w-6 h-6 text-axim-gold mb-4" />
          <h3 className="font-bold uppercase text-sm mb-2">Automated B2B Billing</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Volume-based metering with granular webhooks. Pay only for successful document generations or API calls.
          </p>
        </div>
      </div>

      <B2BRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <OnyxIntegrationAssistant />
    </div>
  );
}
