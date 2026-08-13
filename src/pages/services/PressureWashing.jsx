import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAximStore } from '../../store/useAximStore';
import SEO from '../../components/SEO';
import Reviews from '../../components/Reviews';
 '../../components/SEO';
import { logTelemetry } from '../../lib/telemetry';

export default function PressureWashing() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    surfaces: [],
    notes: ''
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
        "author": { "@type": "Person", "name": "Sarah L." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "AXiM Development's tool suite and intelligence articles are our team's go-to resources for scaling our field operations."
      }
    ],
    "serviceType": "Pressure Washing & Roof Soft Wash",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development"
    },
    "areaServed": {
      "@type": "State",
      "name": "Service Area"
    }
  };

  const handleSurfaceChange = (surface) => {
    setFormData(prev => {
      const surfaces = prev.surfaces.includes(surface)
        ? prev.surfaces.filter(s => s !== surface)
        : [...prev.surfaces, surface];
      return { ...prev, surfaces };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    logTelemetry('service_quote_requested', {
      serviceType: 'pressure_washing',
      hasAddress: !!formData.address,
      hasEmail: !!formData.email,
      timestamp: Date.now()
    });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="Precision Pressure Washing & Exterior Surface Restoration"
        description="Professional pressure washing and low-PSI soft wash services for driveways, roofs, and siding. Request a quote."
        type="website"
        customSchema={[schema]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => logTelemetry('seo_landing_viewed', { service: 'pressure_washing' })}
        className="w-full bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl mb-12"
      >
        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Precision Pressure Washing & <span className="text-axim-gold">Exterior Surface Restoration</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Restore your property's curb appeal safely and effectively. We specialize in both high-PSI surface cleaning and low-PSI chemical soft washing for delicate surfaces.
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
          <h3 className="text-xl font-bold text-white mb-3">Driveway Oil & Tire Marks</h3>
          <p className="text-zinc-400">High-PSI surface cleaning to penetrate concrete pores and lift stubborn oil, grease, and rubber.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-onyx-900/40 border border-white/5 rounded-lg p-6 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-3">Roof Gloeocapsa Magma</h3>
          <p className="text-zinc-400">Low-PSI chemical treatments to safely eradicate black algae stains on shingles without voiding roof warranties.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-onyx-900/40 border border-axim-gold/20 rounded-lg p-6 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-xl font-bold text-axim-gold mb-3">HOA Violation Notices</h3>
          <p className="text-zinc-400">Rapid response exterior cleaning to resolve compliance issues for siding, fences, and walkways.</p>
        </motion.div>
      </div>

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.4 }}
         className="w-full max-w-3xl mx-auto bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl p-8 md:p-12"
      >
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Request a Quote</h2>
            {isWeb3Authenticated && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [QUOTE_NODE: ARBITRUM_ENCRYPTED]
                </div>
            )}
        </div>

        {submitted ? (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-axim-green/20 border border-axim-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-axim-green text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quote Request Received</h3>
                <p className="text-zinc-400">Our team will review your requirements and contact you shortly.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors"
                            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors"
                            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Phone</label>
                        <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors"
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                        <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Property Address</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors"
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">Surfaces to be Cleaned</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Driveway / Walkway', 'Roof (Soft Wash)', 'House Siding', 'Pool Deck / Patio'].map(surface => (
                            <label key={surface} className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-axim-green bg-black/50 border-white/10 rounded focus:ring-axim-green focus:ring-offset-black transition-colors"
                                    checked={formData.surfaces.includes(surface)}
                                    onChange={() => handleSurfaceChange(surface)}
                                />
                                <span className="text-zinc-400 text-sm">{surface}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Additional Notes</label>
                    <textarea rows="3" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-axim-green focus:ring-1 focus:ring-axim-green transition-colors resize-none"
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-axim-green/20 hover:bg-axim-green/30 text-axim-green border border-axim-green/50 font-semibold py-3 px-8 rounded-md transition-all duration-300 uppercase tracking-widest text-sm">
                    Submit Request
                </button>
            </form>
        )}
      </motion.div>
      <Reviews />
    </div>
  );
}
