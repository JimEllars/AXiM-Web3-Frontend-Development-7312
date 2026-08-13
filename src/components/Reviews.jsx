import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { LuStar } from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';

export default function Reviews() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const reviews = [
    {
      name: "Marcus V.",
      company: "Enterprise Sales Director",
      rating: 5,
      text: "The Nexus CRM and automated lead routing systems completely transformed our pipeline. Conversion rates are up 38% since onboarding."
    },
    {
      name: "Sarah L.",
      company: "Verified Operator",
      rating: 5,
      text: "AXiM Development's tool suite and intelligence articles are our team's go-to resources for scaling our field operations."
    },
    {
      name: "James R.",
      company: "B2B Solutions Manager",
      rating: 5,
      text: "Exceptional telemetry tracking and edge performance. The ability to manage our entire canvassing network from one command center is invaluable."
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className="text-axim-gold font-bold">5.0</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <SafeIcon key={i} icon={LuStar} className="w-4 h-4 text-axim-gold fill-axim-gold" />
              ))}
            </div>
            <span className="text-zinc-400 text-sm border-l border-white/20 pl-2">128 Verified Reviews</span>
          </div>
          {isWeb3Authenticated && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              [REVIEWS: VERIFIED_ON_CHAIN]
            </div>
          )}
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Verified Client Excellence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-onyx-900/60 border border-white/10 rounded-lg p-6 backdrop-blur-md flex flex-col h-full"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <SafeIcon key={j} icon={LuStar} className="w-4 h-4 text-axim-gold fill-axim-gold" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 flex-grow">"{review.text}"</p>
              <div className="mt-auto border-t border-white/10 pt-4">
                <div className="font-bold text-white">{review.name}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{review.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
