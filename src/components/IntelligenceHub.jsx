import React from 'react';
import { motion } from 'framer-motion';

export default function IntelligenceHub() {
  return (
    <section className="relative z-0 w-full h-[calc(100vh-4rem)] flex flex-col pt-20 pb-4 overflow-hidden">
      <div className="w-full mx-auto px-0 md:px-6 flex-grow flex flex-col h-full max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 shrink-0"
        >
          <span className="section-label">Digital Hub</span>
          <h2 className="section-title !mb-0">Intelligence Briefs & AI Triage</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="w-full flex-grow flex flex-col bg-glass backdrop-blur-xl saturate-150 border border-subtle hover:border-active transition duration-300 group rounded-sm overflow-hidden shadow-2xl relative z-0"
        >
          {/* Chatbase Iframe Embed */}
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/xYiQ2yI2XeGmRLzRUkNvP"
            width="100%"
            height="100%"
            frameBorder="0"
            className="flex-grow w-full h-full"
            title="AXiM Systems Intelligence AI"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
