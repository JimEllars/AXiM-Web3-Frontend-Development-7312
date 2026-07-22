import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function PartnerPromo({ partnerName, title, description, learnMorePath, startNowUrl, theme = 'purple', onClick }) {
  const isGold = theme === 'gold';
  const bgClass = isGold ? 'from-axim-gold/10 border-axim-gold/30' : 'from-[#9333EA]/10 border-[#9333EA]/30';
  const textClass = isGold ? 'text-axim-gold' : 'text-[#DB2777]';
  const btnClass = isGold ? 'bg-axim-gold text-black hover:bg-white' : 'bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white hover:scale-105 shadow-[0_0_20px_rgba(219,39,119,0.3)]';

  return (
    <motion.div onClick={onClick} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={`w-full max-w-7xl mx-auto my-16 p-8 md:p-12 bg-black border border-white/10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors`}>
      <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full bg-gradient-to-r ${bgClass} to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="max-w-2xl relative z-10">
        <div className={`font-mono text-xs uppercase tracking-widest mb-4 ${textClass} font-bold flex items-center gap-2`}>
           <SafeIcon icon={LuIcons.LuNetwork} className="w-4 h-4" /> Official Partner: {partnerName}
        </div>
        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">{title}</h3>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 relative z-10">
        <Link to={learnMorePath} className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors text-center flex justify-center items-center"
          onClick={(e) => {
            logTelemetry('partner_promo_action_triggered', { partner: partnerName, action: 'learn_more', path: learnMorePath });
          }}>
          Learn More
        </Link>
        {startNowUrl && startNowUrl.startsWith('/') ? (
          <Link to={startNowUrl} className={`px-8 py-4 font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 ${btnClass}`}
            onClick={(e) => {
              logTelemetry('partner_promo_action_triggered', { partner: partnerName, action: 'start_now', url: startNowUrl });
            }}>
            Start Now <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
          </Link>
        ) : (
          startNowUrl && (
            <a href={startNowUrl} target="_blank" rel="noopener noreferrer" className={`px-8 py-4 font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 ${btnClass}`}
              onClick={(e) => {
                e.preventDefault();
                logTelemetry('partner_promo_action_triggered', { partner: partnerName, action: 'start_now', url: startNowUrl });
                setTimeout(() => {
                  window.open(startNowUrl + (startNowUrl.includes('?') ? '&' : '?') + 'via=axim_hub', '_blank');
                }, 150);
              }}>
              Start Now <SafeIcon icon={LuIcons.LuExternalLink} className="w-4 h-4" />
            </a>
          )
        )}
      </div>
    </motion.div>
  );
}
