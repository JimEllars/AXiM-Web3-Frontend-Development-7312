import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';
import * as LuIcons from 'react-icons/lu';

export default function Terms() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeDoc, setActiveDoc] = useState('tos');

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-axim-purple z-50 origin-left" />

      <SEO title="Legal & Compliance | AXiM Systems" />

      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={LuIcons.LuScale} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            Legal & <span className="text-zinc-500">Compliance.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Data privacy, terms of service, and enterprise processing agreements.
          </p>
          {isWeb3Authenticated && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [COMPLIANCE_PROOF: ON-CHAIN VERIFIED]
            </div>
          )}
        </div>
      </section>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 flex flex-col md:flex-row gap-12"
        onViewportEnter={() => {
          logTelemetry('legal_page_viewed', { initialDoc: activeDoc });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Document Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => {
              setActiveDoc('tos');
              logTelemetry('legal_document_switched', { targetDocument: 'tos' });
            }}
            className={`w-full text-left p-4 rounded-sm text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-between ${activeDoc === 'tos' ? 'bg-axim-purple text-white shadow-lg' : 'bg-[#050505] border border-white/10 text-zinc-500 hover:text-white hover:border-axim-purple/50'}`}
          >
            Terms of Service <SafeIcon icon={LuIcons.LuFileText} className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveDoc('privacy');
              logTelemetry('legal_document_switched', { targetDocument: 'privacy' });
            }}
            className={`w-full text-left p-4 rounded-sm text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-between ${activeDoc === 'privacy' ? 'bg-[#DB2777] text-white shadow-lg' : 'bg-[#050505] border border-white/10 text-zinc-500 hover:text-white hover:border-[#DB2777]/50'}`}
          >
            Privacy Policy <SafeIcon icon={LuIcons.LuEyeOff} className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveDoc('dpa');
              logTelemetry('legal_document_switched', { targetDocument: 'dpa' });
            }}
            className={`w-full text-left p-4 rounded-sm text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-between ${activeDoc === 'dpa' ? 'bg-axim-gold text-black shadow-lg' : 'bg-[#050505] border border-white/10 text-zinc-500 hover:text-white hover:border-axim-gold/50'}`}
          >
            Data Processing <SafeIcon icon={LuIcons.LuDatabase} className="w-4 h-4" />
          </button>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-30" />

          <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:text-zinc-400 prose-p:leading-relaxed">

            {activeDoc === 'tos' && (
              <div className="animate-fade-in">
                <h2>Terms of Service</h2>
                <p>Last Updated: October 1, 2026</p>
                <p>Welcome to AXiM Systems. By accessing our decentralized infrastructure, API gateways, or automated documentation portals, you agree to be bound by these operational parameters.</p>
                <h3>1. Operator Responsibilities</h3>
                <p>Operators are entirely responsible for the security of their cryptographic keys, login credentials, and downloaded digital assets from the Operator Vault. AXiM Systems is not liable for unauthorized access resulting from compromised end-user endpoints.</p>
                <h3>2. Service Availability</h3>
                <p>While we engineer our systems for 99.99% uptime via distributed edge nodes, AXiM Systems does not guarantee uninterrupted access and reserves the right to throttle or suspend endpoints to preserve network integrity during anomalous traffic spikes.</p>
                <h3>3. Intellectual Property</h3>
                <p>The core logic engines, front-end matrices, and proprietary tools remain the exclusive property of AXiM Systems. Generation of documents does not transfer ownership of the underlying algorithms.</p>
              </div>
            )}

            {activeDoc === 'privacy' && (
              <div className="animate-fade-in">
                <h2>Privacy Policy</h2>
                <p>Last Updated: October 1, 2026</p>
                <p>AXiM Systems operates on a Zero-Trust architecture principle. We collect only the data strictly necessary to execute your requested operations.</p>
                <h3>Data Ingestion</h3>
                <p>When you utilize our Micro-Apps (NDA Generator, Pay Stub System), your inputs are locally sanitized and transmitted via AES-256-GCM encrypted envelopes. We do not sell, rent, or share your proprietary inputs with external marketing aggregators.</p>
                <h3>Telemetry & Cookies</h3>
                <p>We utilize anonymized edge telemetry to monitor network latency and feature usage. You may opt out of non-essential tracking via your browser preferences without degrading core functionality.</p>
              </div>
            )}

            {activeDoc === 'dpa' && (
              <div className="animate-fade-in">
                <h2>Data Processing Agreement (DPA)</h2>
                <p>This DPA outlines the responsibilities of AXiM Systems acting as a Data Processor on behalf of your enterprise.</p>
                <h3>Sub-Processors</h3>
                <p>AXiM utilizes authorized infrastructure partners (e.g., Cloudflare, Supabase) to route and vault encrypted data. All sub-processors are bound by strict SOC-2 Type II compliance standards.</p>
                <h3>Incident Response</h3>
                <p>In the highly unlikely event of a cryptographic breach or data leak, AXiM Systems will notify affected operators via their registered Secure Comms within 48 hours, providing a detailed Root Cause Analysis (RCA).</p>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
