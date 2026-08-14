import React from 'react';
import { useAximStore } from '../../store/useAximStore.js';
import { logTelemetry } from '../../lib/telemetry.js';
import * as LuIcons from 'lucide-react';
import SafeIcon from '../../common/SafeIcon.jsx';

export default function DigitalProductLayout({ title, description, price, type, curriculum, coverGradient, onPrimaryAction }) {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  return (
    <div className="min-h-screen bg-bg-void text-zinc-300 pt-24 pb-20 relative overflow-hidden">
      {/* Background Subtle glow */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-axim-purple/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="mb-12">
           <span className="text-[10px] font-mono uppercase tracking-widest text-axim-purple border border-axim-purple/30 px-3 py-1 rounded-sm bg-axim-purple/5">
             {type}
           </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Cover Graphic */}
          <div className={`aspect-[4/5] rounded-md border border-white/10 relative overflow-hidden group flex items-center justify-center p-8 bg-gradient-to-br ${coverGradient}`}>
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

             {/* Mock Title on Cover */}
             <div className="relative z-10 text-center border border-white/20 bg-black/50 backdrop-blur-md p-8 shadow-2xl">
                 <SafeIcon icon={LuIcons.GraduationCap} className="w-12 h-12 text-white/80 mx-auto mb-6" />
                 <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 leading-tight">{title}</h2>
                 <div className="w-12 h-1 bg-axim-gold mx-auto mt-6" />
             </div>
          </div>

          {/* Right Column: Details & Checkout */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
              {title}
            </h1>

            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              {description}
            </p>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-8 mb-10">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.List} className="w-4 h-4 text-axim-purple" />
                 Course Curriculum
               </h3>
               <ul className="space-y-4">
                 {curriculum.map((item, index) => (
                   <li key={index} className="flex items-start gap-3">
                      <span className="text-axim-purple font-mono text-sm mt-0.5">{(index + 1).toString().padStart(2, '0')}.</span>
                      <span className="text-zinc-300 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="sticky bottom-6 bg-bg-void/90 backdrop-blur-md p-6 border border-white/10 rounded-sm shadow-2xl">
               <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Total Investment</span>
                    <span className="text-3xl font-black text-white">{price}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 px-2 py-1 bg-emerald-400/10 border border-emerald-400/30 rounded-sm">Instant Access</span>
               </div>

               <button
                 onClick={onPrimaryAction}
                 className="w-full py-4 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center justify-center gap-3 rounded-sm shadow-[0_0_20px_rgba(240,255,0,0.2)]"
               >
                  Unlock Access - {price}
                  <SafeIcon icon={LuIcons.ArrowRight} className="w-4 h-4" />
               </button>

               {isWeb3Authenticated && (
                 <button
                   onClick={() => console.log("Init Web3 Tx")}
                   className="mt-3 w-full py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 font-mono text-xs uppercase tracking-widest rounded-sm hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                 >
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                   Pay with Arbitrum USDC [0.00 Gas]
                 </button>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
