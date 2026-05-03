import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  { id: 1, text: "The tools saved us hours of back-and-forth. Extremely intuitive.", author: "Sarah J.", role: "Operations Director" },
  { id: 2, text: "Having all our business documents generated instantly is a game-changer.", author: "Marcus T.", role: "Founder" },
  { id: 3, text: "The infrastructure just works. Fast, secure, and the output is top-tier.", author: "Elena R.", role: "Tech Lead" }
];

export default function Reviews() {
  return (
    <div className="w-full max-w-7xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-black text-white tracking-tighter mb-10 text-center">What People Are Saying</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4, ease: "circOut" }} className="p-6 bg-white/5 border border-white/10 hover:border-axim-purple/50 transition-colors">
            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">"{review.text}"</p>
            <div>
              <p className="text-axim-gold font-bold text-sm">{review.author}</p>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{review.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
