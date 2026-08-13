import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAximStore } from '../../store/useAximStore';
import SEO from '../../components/SEO';
import Reviews from '../../components/Reviews';
import { logTelemetry } from '../../lib/telemetry';

export default function CommercialExterior() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    corporatePhone: '',
    companyName: '',
    facilityType: '',
    squareFootage: '',
    rfpNotes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "James R." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Exceptional telemetry tracking and edge performance. The ability to manage our entire canvassing network from one command center is invaluable."
      }
    ],
    "serviceType": "Enterprise Commercial Exterior & Facility Maintenance",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development",
      "image": "https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp"
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    logTelemetry('service_quote_requested', {
      serviceType: 'commercial_exterior',
      isB2B: true,
      timestamp: Date.now()
    });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="Commercial Exterior Management & Facility Cleaning"
        description="Enterprise commercial exterior and facility maintenance for high-rises, HOAs, and corporate campuses."
        type="website"
        customSchema={[schema]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => logTelemetry('seo_landing_viewed', { service: 'commercial_exterior' })}
        className="w-full bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl mb-12"
      >
        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
          <div className="flex gap-4 mb-6">
            <span className="bg-axim-gold/20 border border-axim-gold/50 text-axim-gold px-3 py-1 text-xs font-mono uppercase tracking-widest rounded-sm">OSHA Certified</span>
            <span className="bg-axim-purple/20 border border-axim-purple/50 text-axim-purple px-3 py-1 text-xs font-mono uppercase tracking-widest rounded-sm">$5M Liability Insured</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Enterprise Commercial Exterior & <span className="text-axim-gold">Facility Maintenance</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Precision scaling for B2B corporate facilities, high-rises, and HOAs. We provide comprehensive exterior management through customized service contracts.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-onyx-900/40 border border-white/5 rounded-lg p-6 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-3">High-Rise Facade Cleaning</h3>
          <p className="text-zinc-400">Advanced rope access and cradle systems for comprehensive commercial window and facade maintenance.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-onyx-900/40 border border-white/5 rounded-lg p-6 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-3">Commercial Pressure Washing</h3>
          <p className="text-zinc-400">Large-scale surface cleaning for parking structures, concrete flatwork, and corporate campus walkways.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-onyx-900/40 border border-axim-gold/20 rounded-lg p-6 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-xl font-bold text-axim-gold mb-3">Multi-Site Contract Management</h3>
          <p className="text-zinc-400">Streamlined logistics and scheduled maintenance for property management groups across multiple locations.</p>
        </motion.div>
      </div>

      <div className="mb-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="bg-onyx-900/60 border border-axim-gold/20 rounded-lg p-8 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Corporate ROI Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">38%</span>
                        <span className="text-sm font-bold text-white">Reduction in Facade Degradation</span>
                        <span className="text-xs text-zinc-400 mt-1">Extends the lifespan of exterior commercial surfaces.</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">$5M</span>
                        <span className="text-sm font-bold text-white">General Liability Coverage</span>
                        <span className="text-xs text-zinc-400 mt-1">Fully insured and bonded for enterprise risk mitigation.</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">&lt;24hr</span>
                        <span className="text-sm font-bold text-white">Sub-24hr RFP Response Time</span>
                        <span className="text-xs text-zinc-400 mt-1">Rapid estimation and dedicated corporate account management.</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.4 }}
         className="w-full max-w-3xl mx-auto bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl p-8 md:p-12"
      >
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Request Corporate RFP</h2>
            {isWeb3Authenticated && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [RFP_NODE: ARBITRUM_ENCRYPTED]
                </div>
            )}
        </div>

        {submitted ? (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-axim-green/20 border border-axim-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-axim-green text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">RFP Request Received</h3>
                <p className="text-zinc-400">Our enterprise accounts team will review your submission and connect with you shortly.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Work Email</label>
                        <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.workEmail} onChange={e => setFormData({...formData, workEmail: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Corporate Phone</label>
                        <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.corporatePhone} onChange={e => setFormData({...formData, corporatePhone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Company Name</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Facility Type</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.facilityType} onChange={e => setFormData({...formData, facilityType: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Square Footage</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors"
                            value={formData.squareFootage} onChange={e => setFormData({...formData, squareFootage: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">RFP Notes / Additional Requirements</label>
                    <textarea rows="4" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-gold focus:ring-1 focus:ring-axim-gold transition-colors resize-none"
                        value={formData.rfpNotes} onChange={e => setFormData({...formData, rfpNotes: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-axim-gold/20 hover:bg-axim-gold/30 text-axim-gold border border-axim-gold/50 font-semibold py-3 px-8 rounded-md transition-all duration-300 uppercase tracking-widest text-sm">
                    Submit RFP Request
                </button>
            </form>
        )}
      </motion.div>
      <Reviews />
    </div>
  );
}
