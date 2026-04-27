import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import SEO from '../components/SEO';
import { useAximStore } from '../store/useAximStore';

const { LuActivity, LuShieldCheck, LuZap, LuBuilding, LuUser, LuMail, LuMapPin, LuCheckCircle2, LuNetwork, LuSun, LuBattery } = LuIcons;


  const partnerSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Enterprise Telecommunications",
      "name": "AXiM Enterprise Fiber Connectivity",
      "description": "High-performance symmetrical gigabit fiber networks featuring 99.99% Uptime SLAs and future-proof infrastructure for enterprise ecosystems.",
      "provider": {
        "@type": "Organization",
        "name": "AXiM Systems",
        "url": "https://axim.us.com"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Fiber Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Business Gigabit Internet"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Enterprise 10G Data Links"
            }
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Renewable Energy Infrastructure",
      "name": "AXiM Solar & Smart Grids",
      "description": "Utility-scale solar arrays and commercial smart grid integrations managed via real-time AXiM Core telemetry for optimal sustainable yield.",
      "provider": {
        "@type": "Organization",
        "name": "AXiM Systems",
        "url": "https://axim.us.com"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      }
    }
  ];

export default function Partners() {
  const submitPartnerLead = useAximStore((state) => state.submitPartnerLead);

    // Fiber Form State
  const [fiberData, setFiberData] = useState({
    companyName: '',
    primaryContact: '',
    emailAddress: '',
    serviceLocation: '',
    requiredBandwidth: 'Select Bandwidth',
    currentISP: ''
  });
  const [isFiberSubmitted, setIsFiberSubmitted] = useState(false);

  // Solar Form State
  const [solarData, setSolarData] = useState({
    companyName: '',
    primaryContact: '',
    emailAddress: '',
    facilityAddress: '',
    facilitySquareFootage: '',
    estimatedEnergySpend: ''
  });
  const [isSolarSubmitted, setIsSolarSubmitted] = useState(false);

  const handleFiberChange = (e) => setFiberData({ ...fiberData, [e.target.name]: e.target.value });
  const handleSolarChange = (e) => setSolarData({ ...solarData, [e.target.name]: e.target.value });

  const handleFiberSubmit = (e) => {
    e.preventDefault();
    submitPartnerLead({ ...fiberData, serviceInterest: 'Fiber Connectivity' });
    setIsFiberSubmitted(true);
    setTimeout(() => setIsFiberSubmitted(false), 5000);
    setFiberData({ companyName: '', primaryContact: '', emailAddress: '', serviceLocation: '', requiredBandwidth: 'Select Bandwidth', currentISP: '' });
  };

  const handleSolarSubmit = (e) => {
    e.preventDefault();
    submitPartnerLead({ ...solarData, serviceInterest: 'Solar Infrastructure' });
    setIsSolarSubmitted(true);
    setTimeout(() => setIsSolarSubmitted(false), 5000);
    setSolarData({ companyName: '', primaryContact: '', emailAddress: '', facilityAddress: '', facilitySquareFootage: '', estimatedEnergySpend: '' });
  };

  const benefits = [
    {
      title: 'Symmetrical Gigabit Speeds',
      description: 'Ultra-fast, equally proportioned upload and download bandwidth designed for heavy cloud workloads.',
      icon: LuActivity
    },
    {
      title: '99.99% Uptime SLA',
      description: 'Enterprise-grade reliability guarantees with proactive monitoring and dedicated support.',
      icon: LuShieldCheck
    },
    {
      title: 'Future-Proof Infrastructure',
      description: 'Scalable fiber network built to support Web3, AI processing, and vast edge deployments.',
      icon: LuZap
    }
  ];

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      <SEO title="Enterprise Connectivity & Fiber Partners | AXiM Systems" customSchema={partnerSchemas} url="https://axim.us.com/partners" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col items-center text-center"
      >
        <div className="section-label mb-4">AXiM Physical Infrastructure</div>
        <h1 className="section-title mb-8">Enterprise-Grade Fiber Connectivity</h1>
        <p className="text-zinc-400 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
          Unlock uncompromised performance for your organization. AXiM's dedicated fiber partnerships deliver ultra-low latency, symmetrical bandwidth, and the reliability required for modern distributed systems.
        </p>
      </motion.section>

      {/* Benefits Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-teal/30 transition-all flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 text-white group-hover:text-axim-teal group-hover:border-axim-teal/30 transition-colors shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <SafeIcon icon={benefit.icon} className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-widest mb-4">{benefit.title}</h3>
              <p className="text-zinc-500 font-mono text-xs leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </motion.section>


      {/* Infrastructure Specs */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Connectivity Tiers</h2>
          <p className="text-zinc-400 font-mono text-xs">Select the infrastructure appropriate for your deployment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm hover:border-white/30 transition-all flex flex-col items-center text-center">
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-2">Business Gigabit</h3>
            <div className="text-axim-teal font-mono text-xl mb-4">1 Gbps</div>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed mb-6">Standard symmetrical connection for branch offices and mid-sized deployments.</p>
            <ul className="text-left w-full space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> Symmetrical Bandwidth</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> 99.9% Uptime SLA</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> Standard Support</li>
            </ul>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="p-8 bg-white/5 backdrop-blur-xl border border-axim-teal shadow-[0_0_30px_rgba(0,229,255,0.1)] rounded-sm relative flex flex-col items-center text-center transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-axim-teal text-black text-[0.55rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">Recommended</div>
            <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2 mt-4">Enterprise 10G</h3>
            <div className="text-axim-teal font-mono text-2xl mb-4">10 Gbps</div>
            <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">High-capacity interconnects for data centers, trading floors, and heavy AI processing.</p>
            <ul className="text-left w-full space-y-3 font-mono text-xs text-zinc-300">
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> Symmetrical Bandwidth</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> 99.99% Uptime SLA</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> Dedicated NOC Support</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-teal" /> AXiM Core Integration</li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-teal/30 transition-all flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-2">Inquire for more speeds</h3>
            <div className="text-axim-teal font-mono text-sm mb-4">Custom SLAs & Infrastructure</div>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed mb-6">Reach out to our engineering team for specialized multi-gigabit setups.</p>
            <button onClick={() => { document.getElementById('partner-form').scrollIntoView({ behavior: 'smooth' }); }} className="mt-auto px-4 py-2 border border-white/10 hover:border-axim-teal/50 hover:bg-axim-teal/10 hover:text-axim-teal text-white rounded-sm transition-all font-mono text-xs uppercase tracking-widest">
              Contact Us
            </button>
          </div>
        </div>
      </motion.section>      {/* Solar Infrastructure Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16"
      >
        <div className="text-center mb-12">
          <div className="section-label text-axim-gold mb-4 border-axim-gold/30">AXiM Energy Networks</div>
          <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Energy Infrastructure & Solar Partnerships</h2>
          <p className="text-zinc-400 font-mono text-xs max-w-2xl mx-auto">Physical assets powering the next generation of compute.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 border-t-2 border-t-axim-gold/50 rounded-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-axim-gold/30 flex items-center justify-center mb-6 text-axim-gold shadow-[0_0_15px_rgba(255,234,0,0.1)]">
              <SafeIcon icon={LuSun} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-4">Utility-Scale Arrays</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed">Large-scale solar installations designed to provide consistent, robust power yields to our digital infrastructure ecosystem.</p>
          </div>

          <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 border-t-2 border-t-axim-gold/50 rounded-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-axim-gold/30 flex items-center justify-center mb-6 text-axim-gold shadow-[0_0_15px_rgba(255,234,0,0.1)]">
              <SafeIcon icon={LuNetwork} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-4">Smart Grid Telemetry</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed">Integrated real-time reporting metrics injected directly into AXiM Core for automated load balancing and yield predictions.</p>
          </div>

          <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 border-t-2 border-t-axim-gold/50 rounded-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-axim-gold/30 flex items-center justify-center mb-6 text-axim-gold shadow-[0_0_15px_rgba(255,234,0,0.1)]">
              <SafeIcon icon={LuBattery} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-4">Sustainable Yield</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed">Align physical resources with on-chain accountability via Web3 smart contracts to ensure completely transparent energy consumption.</p>
          </div>
        </div>
      </motion.section>

      {/* Solar Lead Capture Form */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl mx-auto px-6 md:px-12 py-10"
      >
        <div className={`p-8 md:p-12 bg-white/5 backdrop-blur-xl border transition-all duration-500 rounded-sm ${isSolarSubmitted ? 'border-axim-gold/50 shadow-[0_0_30px_rgba(255,234,0,0.1)]' : 'border-white/10'}`}>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Request Solar Integration</h2>
            <p className="text-zinc-400 font-mono text-xs">Evaluate physical infrastructure for smart grid and solar deployment.</p>
          </div>
          <form id="solar-form" onSubmit={handleSolarSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuBuilding} className="w-3 h-3" /> Company Name</label>
                <input type="text" name="companyName" value={solarData.companyName} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="Acme Corp" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuUser} className="w-3 h-3" /> Primary Contact</label>
                <input type="text" name="primaryContact" value={solarData.primaryContact} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="Jane Doe" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuMail} className="w-3 h-3" /> Email Address</label>
              <input type="email" name="emailAddress" value={solarData.emailAddress} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="jane@acmecorp.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuMapPin} className="w-3 h-3" /> Facility Address</label>
              <input type="text" name="facilityAddress" value={solarData.facilityAddress} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="123 Industrial Pkwy, Austin, TX" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuBuilding} className="w-3 h-3" /> Facility Square Footage</label>
                <input type="text" name="facilitySquareFootage" value={solarData.facilitySquareFootage} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="e.g. 50,000" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2"><SafeIcon icon={LuBattery} className="w-3 h-3" /> Est. Monthly Energy Spend</label>
                <input type="text" name="estimatedEnergySpend" value={solarData.estimatedEnergySpend} onChange={handleSolarChange} required className="bg-black/50 border border-white/20 p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-gold/50 transition-colors" placeholder="$5,000+" />
              </div>
            </div>
            <button type="submit" className={`mt-4 py-4 px-6 rounded-sm font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${isSolarSubmitted ? 'bg-axim-gold/10 text-axim-gold border border-axim-gold/30' : 'bg-axim-gold text-black hover:bg-white hover:text-black border border-transparent'}`}>
              {isSolarSubmitted ? <><SafeIcon icon={LuCheckCircle2} className="w-4 h-4" /> Request Received</> : 'Submit Infrastructure Request'}
            </button>
          </form>
        </div>
      </motion.section>


      {/* Ecosystem Integration */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16"
      >
        <div className="p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 border-l-2 border-l-axim-gold rounded-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-24 h-24 shrink-0 rounded-full bg-black/50 border border-axim-gold/30 flex items-center justify-center text-axim-gold shadow-[0_0_20px_rgba(255,234,0,0.1)]">
            <SafeIcon icon={LuNetwork} className="w-10 h-10" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-black uppercase text-white tracking-widest mb-3">AXiM Core Synergy</h3>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-4">
              Enterprise 10G and Dark Fiber tiers natively integrate with AXiM Core telemetry. Leverage automated failover routing, proactive AI-driven network optimization, and real-time dashboard analytics directly from your existing AXiM hub interface.
            </p>
            <div className="inline-block px-4 py-1.5 bg-axim-gold/10 border border-axim-gold/30 text-axim-gold text-[0.65rem] font-mono uppercase tracking-widest rounded-sm">
              Requires Onyx mk3 Orchestration
            </div>
          </div>
        </div>
      </motion.section>


    </div>
  );
}
