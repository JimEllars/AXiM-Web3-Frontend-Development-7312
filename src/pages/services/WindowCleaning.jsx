import React from 'react';
import { motion } from 'framer-motion';
import { useAximStore } from '../../store/useAximStore';
import SEO from '../../components/SEO';
import { logTelemetry } from '../../lib/telemetry';

export default function WindowCleaning() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Window Cleaning",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Systems"
    },
    "areaServed": {
      "@type": "State",
      "name": "Service Area"
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="Professional Window Cleaning Services | AXiM Systems"
        description="Get a crystal clear view with our professional window cleaning services. Request a quote today."
        type="website"
        customSchema={[schema]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => logTelemetry('seo_landing_viewed', { service: 'window_cleaning' })}
        className="w-full bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl"
      >
        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Professional Window Cleaning Services
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Enhance the appearance of your property with our top-tier window cleaning solutions. We deliver streak-free, reliable, and professional results tailored to your specific needs.
          </p>
          <button className="bg-axim-purple hover:bg-axim-purple/80 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
            Request Quote
          </button>
        </div>
      </motion.div>

      {isWeb3Authenticated && (
         <div className="fixed bottom-4 right-4 z-50 font-mono text-[8px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-sm select-none inline-flex items-center gap-1 shadow-lg backdrop-blur-sm">
           <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
           [OPERATOR_SES: VERIFIED]
         </div>
       )}
    </div>
  );
}
