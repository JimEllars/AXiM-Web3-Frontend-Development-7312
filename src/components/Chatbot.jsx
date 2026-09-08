import React from 'react';
import { useAximStore } from '../store/useAximStore';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function Chatbot() {
  const isOpen = useAximStore((state) => state.isChatbotOpen);
  const setIsOpen = useAximStore((state) => state.setIsChatbotOpen);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            logTelemetry('support_drawer_opened');
          }
        }}
        className="fixed bottom-24 right-6 z-[90] bg-axim-purple text-white p-4 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-white hover:text-black transition-colors border border-white/10 flex items-center justify-center group"
        aria-label="Inquire / Support"
      >
        <SafeIcon icon={isOpen ? LuIcons.LuX : LuIcons.LuMessageSquare} className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-6 w-80 bg-onyx-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl z-[90] overflow-hidden animate-fade-in-up">
          <div className="bg-axim-purple p-4 flex items-center gap-3">
            <SafeIcon icon={LuIcons.LuHeadphones} className="w-5 h-5 text-white" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Support & Inquiry</h3>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Our autonomous agents are currently offline. Please use the following channels for assistance.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/support"
                onClick={() => {
                  setIsOpen(false);
                  logTelemetry('support_drawer_support_clicked');
                }}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-axim-purple/50 rounded-sm transition-colors group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-axim-purple transition-colors">Technical Support</span>
                <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4 text-zinc-500 group-hover:text-axim-purple transition-colors" />
              </Link>

              <Link
                to="/consultation"
                onClick={() => {
                  setIsOpen(false);
                  logTelemetry('support_drawer_consultation_clicked');
                }}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-axim-gold/50 rounded-sm transition-colors group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-axim-gold transition-colors">Book Consultation</span>
                <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4 text-zinc-500 group-hover:text-axim-gold transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
