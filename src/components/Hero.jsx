import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import BackgroundEffects from './BackgroundEffects';

export default function Hero() {
  return (
    <motion.section
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.2 }}
         variants={{
           hidden: { opacity: 0 },
           visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
         }}
         className="relative min-h-[85vh] w-full flex flex-col justify-start overflow-hidden bg-bg-void pt-24 md:pt-30"
         onViewportEnter={() => {
           logTelemetry('home_hero_viewed', { timestamp: Date.now() });
         }}
       >
      <BackgroundEffects />
      
      {/* Absolute Centering Wrapper */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center">

        {/* Status Badge */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-center space-x-2 px-4 py-1.5 bg-white/5 border border-white/10 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-8 rounded-sm backdrop-blur-sm">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
          <span>AXiM Network Active</span>
        </motion.div>

        {/* Bulletproof Centered Headline - Animation Isolated from Flex Container */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="w-full flex flex-col items-center justify-center text-center mb-6">
          <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[1.1] m-0 p-0 text-center flex flex-col items-center">
              <span className="block text-white text-center">Work Smarter.</span>
            </h1>
          </div>
        </motion.div>

        {/* Subheadline */}
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="w-full max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-relaxed mb-10 font-bold uppercase tracking-widest text-center">
          Accelerate Your Personal, Professional, and Business Systems with the AXiM Development Advantage.
        </motion.p>

        {/* Updated CTAs */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            to="/tools"
            onClick={() => logTelemetry('hero_cta_clicked', { target: 'tools_directory' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.3)] w-full sm:w-auto text-center"
          >
            Explore Tools <SafeIcon icon={LuIcons.LuWrench} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            to="/consultation"
            onClick={() => logTelemetry('hero_cta_clicked', { target: 'consultation' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Consultation <SafeIcon icon={LuIcons.LuPhone} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            onClick={() => logTelemetry('hero_cta_clicked', { target: 'web3_games' })}
            to="/games"
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-axim-green/50 text-axim-green text-xs font-black uppercase tracking-widest hover:bg-axim-green hover:text-black transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Web3 Games <SafeIcon className="ml-3 w-4 h-4" icon={LuIcons.LuGamepad2}/>
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
}
