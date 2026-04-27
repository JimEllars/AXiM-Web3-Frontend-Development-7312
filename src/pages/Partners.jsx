import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import SEO from '../components/SEO';
import { useAximStore } from '../store/useAximStore';

const { LuActivity, LuShieldCheck, LuZap, LuBuilding, LuUser, LuMail, LuMapPin, LuCheckCircle2, LuNetwork } = LuIcons;

export default function Partners() {
  const submitPartnerLead = useAximStore((state) => state.submitPartnerLead);

  const [formData, setFormData] = useState({
    companyName: '',
    primaryContact: '',
    emailAddress: '',
    serviceAddress: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.companyName && formData.primaryContact && formData.emailAddress && formData.serviceAddress) {
      submitPartnerLead(formData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setFormData({ companyName: '', primaryContact: '', emailAddress: '', serviceAddress: '' });
    }
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
      <SEO title="Enterprise Connectivity & Fiber Partners | AXiM Systems" />

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
          <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm hover:border-white/30 transition-all flex flex-col items-center text-center">
            <h3 className="text-lg font-black uppercase text-white tracking-widest mb-2">Custom Dark Fiber</h3>
            <div className="text-axim-gold font-mono text-xl mb-4">Unlimited</div>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed mb-6">Dedicated physical strands for maximum security and virtually unlimited scale.</p>
            <ul className="text-left w-full space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-gold" /> Physical Isolation</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-gold" /> User-Managed Optics</li>
              <li className="flex items-center gap-2"><SafeIcon icon={LuCheckCircle2} className="w-4 h-4 text-axim-gold" /> Sub-Millisecond Latency</li>
            </ul>
          </div>
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

      {/* Lead Capture Form */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl mx-auto px-6 md:px-12 py-20"
      >
        <div className={`p-8 md:p-12 bg-white/5 backdrop-blur-xl border transition-all duration-500 rounded-sm ${isSubmitted ? 'border-axim-green/50 shadow-[0_0_30px_rgba(45,212,191,0.1)]' : 'border-white/10'}`}>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Partner With Us</h2>
            <p className="text-zinc-400 font-mono text-xs">Request a site survey for enterprise fiber deployment.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <SafeIcon icon={LuBuilding} className="w-3 h-3" /> Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="bg-black/50 border border-white/10 rounded-sm p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-teal/50 transition-colors"
                  placeholder="Acme Corp"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <SafeIcon icon={LuUser} className="w-3 h-3" /> Primary Contact
                </label>
                <input
                  type="text"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleChange}
                  required
                  className="bg-black/50 border border-white/10 rounded-sm p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-teal/50 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SafeIcon icon={LuMail} className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
                className="bg-black/50 border border-white/10 rounded-sm p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-teal/50 transition-colors"
                placeholder="jane@acmecorp.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SafeIcon icon={LuMapPin} className="w-3 h-3" /> Service Address / Location
              </label>
              <input
                type="text"
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
                required
                className="bg-black/50 border border-white/10 rounded-sm p-3 font-mono text-sm text-white focus:outline-none focus:border-axim-teal/50 transition-colors"
                placeholder="123 Tech Blvd, San Francisco, CA"
              />
            </div>

            <button
              type="submit"
              className={`mt-4 py-4 px-6 rounded-sm font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                isSubmitted
                  ? 'bg-axim-green/10 text-axim-green border border-axim-green/30'
                  : 'bg-white text-black hover:bg-axim-teal hover:text-black border border-transparent'
              }`}
            >
              {isSubmitted ? (
                <>
                  <SafeIcon icon={LuCheckCircle2} className="w-4 h-4" /> Request Received
                </>
              ) : (
                'Request Site Survey'
              )}
            </button>
          </form>

        </div>
      </motion.section>
    </div>
  );
}
