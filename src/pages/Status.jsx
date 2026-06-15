import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Status() {
  const services = [
    { name: "AXiM Core Proxy", status: "Operational", uptime: "99.99%", latency: "24ms" },
    { name: "Onyx Edge Workers", status: "Operational", uptime: "100%", latency: "18ms" },
    { name: "Operator Database Vault", status: "Operational", uptime: "99.98%", latency: "42ms" },
    { name: "Content Delivery Network", status: "Operational", uptime: "100%", latency: "12ms" },
    { name: "AI Cognitive Routing", status: "Operational", uptime: "99.95%", latency: "115ms" }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="System Status | AXiM Systems" description="Real-time operational status and network telemetry for the AXiM infrastructure." />

      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            All Systems <span className="text-green-500">Operational.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Real-time monitoring of AXiM infrastructure, API endpoints, and global edge network routing.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-8 mt-16">
        <div className="bg-[#050505] border border-white/10 p-8 rounded-sm shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuServer} className="w-5 h-5 text-zinc-500" /> Microservice Telemetry
            </h2>
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500">Last updated: Just Now</span>
          </div>

          <div className="space-y-4">
            {services.map((service, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-sm hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{service.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest">Uptime</div>
                    <div className="text-xs font-bold text-zinc-300">{service.uptime}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest">Latency</div>
                    <div className="text-xs font-bold text-zinc-300">{service.latency}</div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-xs font-black text-green-500 uppercase tracking-widest">{service.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-axim-purple/5 border border-axim-purple/20 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between text-center md:text-left">
             <div>
               <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Experiencing Anomalies?</h4>
               <p className="text-[0.7rem] text-zinc-400 font-mono tracking-widest uppercase">Report network degradation directly to the engineering team.</p>
             </div>
             <a href="/support" className="px-6 py-3 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-lg whitespace-nowrap">
               Open Support Ticket
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
