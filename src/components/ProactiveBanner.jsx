import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuAlertTriangle, LuArrowRight } = LuIcons;

export default function ProactiveBanner() {
  const { userSession, isSessionLoading } = useAximStore(
    useShallow((state) => ({
      userSession: state.userSession,
      isSessionLoading: state.isSessionLoading,
    }))
  );

  // Show nothing if loading or if user is not authenticated
  if (isSessionLoading || !userSession) return null;

  // We only care if health_index is present and below 40
  const isHealthy = typeof userSession.health_index !== 'number' || userSession.health_index >= 40;

  return (
    <AnimatePresence>
      {!isHealthy && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-axim-gold text-black px-4 py-3 relative z-50 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 font-mono text-sm max-w-[1200px] mx-auto w-full">
            <SafeIcon icon={LuAlertTriangle} className="w-5 h-5 shrink-0" />
            <span className="font-bold">System Alert:</span>
            <span className="opacity-90">We've detected friction in your workflow.</span>
            <a
              href="mailto:support@axim.us.com"
              className="ml-auto flex items-center gap-2 bg-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Click here for immediate technical assistance <SafeIcon icon={LuArrowRight} className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
