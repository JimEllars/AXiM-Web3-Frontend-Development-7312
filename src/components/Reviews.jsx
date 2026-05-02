import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "AXiM Systems seamlessly integrated decentralized identity protocols into our enterprise infrastructure, enhancing both security and operational transparency.",
    author: "Elena Rodriguez",
    role: "Chief Technology Officer",
    initials: "ER"
  },
  {
    id: 2,
    quote: "The automated document generation capabilities reduced our legal overhead by 40%. The UI is clean, intuitive, and built for modern demands.",
    author: "Marcus Chen",
    role: "Director of Operations",
    initials: "MC"
  },
  {
    id: 3,
    quote: "Deploying the AXiM Micro-SaaS hubs within our ecosystem allowed us to monetize our existing user base without custom development.",
    author: "Sarah Jenkins",
    role: "Founder",
    initials: "SJ"
  }
];

export default function Reviews() {
  return (
    <section className="py-20 bg-bg-void border-t border-white/10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-axim-purple/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ecosystem Integrity</h2>
          <p className="text-zinc-400 font-mono text-sm max-w-2xl mx-auto uppercase tracking-widest">
            Verified deployments across our client infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-axim-purple/30"
            >
              {/* Subtle top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-axim-purple/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-axim-purple font-mono text-lg font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
