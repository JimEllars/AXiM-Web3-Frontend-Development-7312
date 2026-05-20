import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Terms() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Terms & Compliance | AXiM Systems" description="Legal infrastructure, terms of service, and privacy policies." />

      <section className="pt-32 pb-16 relative border-b border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <SafeIcon icon={LuIcons.LuScale} className="w-8 h-8 text-axim-purple mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-zinc-500">Compliance.</span>
          </h1>
          <p className="text-zinc-400 text-sm font-mono tracking-widest uppercase">Last Updated: Phase 1.0 Deployment</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-axim-purple hover:prose-a:text-white prose-a:transition-colors">

          <h2>1. Ecosystem Protocol</h2>
          <p>By accessing the AXiM Hub infrastructure, you are entering a secure, decentralized digital environment. These terms govern the usage of all proprietary software suites, intelligence briefings, and partner networking funnels provided herein.</p>

          <h2>2. Digital Products & Usage</h2>
          <p>The automated generators (including but not limited to the Mutual NDA, Demand Letter, and Pay Stub systems) are provided for structural efficiency. They do not constitute formal legal or financial advice. Operators assume all liability for the deployment of generated assets.</p>

          <h2>3. Data Privacy & Telemetry</h2>
          <p>AXiM Systems utilizes autonomous telemetry to monitor system health and node uptime. No personally identifiable information (PII) is sold or traded. Your connection ID and session tokens are encrypted within your local client state until actively purged.</p>

          <h2>4. Partner Network Integrity</h2>
          <p>Certain funnels route operators to vetted third-party infrastructure (e.g., Make.com, Powur Solar). AXiM maintains affiliate partnerships with these entities. Proceeding through an external gateway shifts governance to the respective partner's compliance protocols.</p>

          <hr className="border-white/10 my-12" />

          <p className="text-center font-mono text-xs text-zinc-500">
             For formal compliance inquiries or data deletion requests, initiate a secure transmission to <a href="mailto:support@axim.us.com">support@axim.us.com</a>.
          </p>

        </div>

        <div className="mt-16 text-center">
           <Link to="/" className="inline-flex items-center px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors">
             Return to Dashboard
           </Link>
        </div>
      </section>
    </div>
  );
}
