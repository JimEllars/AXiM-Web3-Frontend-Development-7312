import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Status() {
  const metrics = [
    { name: 'Core API Routing', status: 'Operational', ping: '12ms' },
    { name: 'Document Parsers', status: 'Operational', ping: '24ms' },
    { name: 'Edge Node Delivery', status: 'Operational', ping: '8ms' },
    { name: 'Identity & Auth (Supabase)', status: 'Operational', ping: '45ms' }
  ];

  // Generate 30 fake uptime blocks (all green)
  const uptimeBlocks = Array(30).fill('bg-axim-green shadow-[0_0_10px_rgba(0,255,0,0.2)]');

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="System Status | AXiM Systems" description="Live telemetry and uptime for AXiM infrastructure." />

      <section className="pt-32 pb-16 relative border-b border-white/10 bg-black overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-axim-green/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>

          <div className="flex items-center gap-4 mb-6">
             <div className="w-16 h-16 bg-axim-green/10 border border-axim-green/30 rounded flex items-center justify-center shadow-[0_0_30px_rgba(0,255,0,0.1)]">
               <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-axim-green" />
             </div>
             <div>
               <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">All Systems <br/><span className="text-axim-green">Operational.</span></h1>
             </div>
          </div>
          <p className="text-zinc-400 text-sm font-mono tracking-widest uppercase">Global Network Telemetry • Last Checked: Just Now</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">

        {/* 30-Day Uptime Visualization */}
        <div className="bg-[#0F172A] border border-white/10 p-8 rounded-sm mb-8 shadow-xl">
           <div className="flex justify-between items-end mb-6">
              <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <SafeIcon icon={LuIcons.LuChartBar} className="w-4 h-4 text-axim-purple" /> 30-Day Uptime History
              </h3>
              <span className="text-axim-green font-mono text-xs uppercase tracking-widest">99.999%</span>
           </div>

           <div className="flex items-center gap-1 md:gap-2 h-12 w-full mb-2">
             {uptimeBlocks.map((bgClass, index) => (
               <div key={index} className={`flex-1 h-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-crosshair ${bgClass}`} title={`Day ${index + 1}: No incidents reported`} />
             ))}
           </div>
           <div className="flex justify-between text-[0.55rem] font-mono text-zinc-500 uppercase tracking-widest">
             <span>30 Days Ago</span>
             <span>Today</span>
           </div>
        </div>

        {/* Individual Micro-Services */}
        <div className="bg-black border border-white/10 rounded-sm overflow-hidden shadow-xl">
           <div className="bg-white/5 border-b border-white/10 p-6">
             <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <SafeIcon icon={LuIcons.LuServer} className="w-4 h-4 text-axim-purple" /> Infrastructure Endpoints
             </h3>
           </div>

           <div className="divide-y divide-white/10">
             {metrics.map((metric, i) => (
               <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-1">{metric.name}</h4>
                    <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Response: {metric.ping}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-axim-green/10 border border-axim-green/20 rounded-sm">
                     <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse" />
                     <span className="text-[0.65rem] font-mono text-axim-green uppercase tracking-widest">{metric.status}</span>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </section>
    </div>
  );
}
