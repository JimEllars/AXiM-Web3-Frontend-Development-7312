import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import SEO from '../components/SEO';

const { LuTerminal, LuArrowRight, LuLayoutDashboard } = LuIcons;

export default function NotFound() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      <SEO
        title="404 - Not Found | AXiM Hub"
        description="The requested infrastructure node could not be located."
      />

      <div className="max-w-[800px] w-full px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <SafeIcon icon={LuTerminal} className="w-10 h-10 text-red-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 font-mono"
        >
          <span className="text-red-500">404</span> // ROUTE_NOT_FOUND
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-zinc-400 font-mono tracking-wide mb-12 max-w-lg"
        >
          The requested infrastructure node could not be located. Connection severed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link
            to="/"
            className="btn btn-outline hover:border-axim-purple hover:text-axim-purple w-full sm:w-auto flex justify-center items-center gap-2"
          >
            Return to Hub <SafeIcon icon={LuArrowRight} className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-outline hover:border-axim-gold hover:text-axim-gold w-full sm:w-auto flex justify-center items-center gap-2"
          >
            Access Dashboard <SafeIcon icon={LuLayoutDashboard} className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
