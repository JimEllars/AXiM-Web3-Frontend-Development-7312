import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import FleetMap from '../components/FleetMap';
import B2BRegistrationModal from '../components/B2BRegistrationModal';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import OnyxIntegrationAssistant from '../components/OnyxIntegrationAssistant';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';

const { LuTerminal, LuShieldCheck, LuZap, LuCode, LuServer, LuNetwork, LuCreditCard, LuDatabase, LuArrowRight } = LuIcons;

export default function PartnerPortal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [volume, setVolume] = useState(1000);
  const [apiUsageData, setApiUsageData] = useState([]);
  const [estimatedInvoice, setEstimatedInvoice] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const userSession = useAximStore((state) => state.userSession);
  const { session } = useAximAuth();

  useEffect(() => {
    // Fetch user's API usage data from the AXiM Core endpoint
    const fetchUsageData = async () => {
      try {
        const response = await fetch('https://api.axim.us.com/v1/functions/api-usage', {
            headers: {
                ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
            }
        });
        if (response.ok) {
            const data = await response.json();
            setApiUsageData(data.usage || []);
            setEstimatedInvoice(data.estimatedInvoice || 0);
        } else {
            // Mock data fallback
            const mockData = Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                compute: Math.floor(Math.random() * 500) + 100
            }));
            setApiUsageData(mockData);
            const totalCompute = mockData.reduce((acc, curr) => acc + curr.compute, 0);
            setEstimatedInvoice((totalCompute * 0.015).toFixed(2));
        }
      } catch (err) {
         console.error("Failed to fetch API usage", err);
      }
    };

    fetchUsageData();
  }, [session]);

  const handleManageBilling = async () => {
    setIsRedirecting(true);
    try {
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
        }
      } else {
        console.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Billing redirect error:", error);
    } finally {
        setIsRedirecting(false);
    }
  };

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

      {/* Partner Consumption & Billing Dashboard */}
      <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6 rounded-sm space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                 <SafeIcon icon={LuDatabase} className="text-axim-teal" />
                 30-Day API Compute
              </h2>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={apiUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '12px' }}
                            itemStyle={{ color: '#3aaa74' }}
                            cursor={{ fill: '#ffffff10' }}
                          />
                          <Bar dataKey="compute" fill="#3aaa74" radius={[2, 2, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="flex flex-col gap-6">
              <div className="bg-axim-teal/10 border border-axim-teal/20 p-6 rounded-sm flex-1 flex flex-col justify-center">
                  <h3 className="text-sm font-mono text-axim-teal uppercase mb-2">Estimated Next Invoice</h3>
                  <div className="text-4xl font-black text-white tracking-widest mb-2">${estimatedInvoice}</div>
                  <p className="text-xs text-zinc-400">Based on current consumption rate.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-sm flex-1 flex flex-col justify-center items-center text-center">
                  <SafeIcon icon={LuCreditCard} className="w-8 h-8 text-axim-gold mb-4" />
                  <h3 className="text-sm font-bold uppercase text-white mb-4">Billing & Subscriptions</h3>
                  <button
                    onClick={handleManageBilling}
                    disabled={isRedirecting}
                    className="w-full py-3 px-4 bg-axim-gold text-black font-bold uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRedirecting ? 'Connecting...' : 'Manage Billing (Stripe)'} <SafeIcon icon={LuArrowRight} />
                  </button>
              </div>
          </div>
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
