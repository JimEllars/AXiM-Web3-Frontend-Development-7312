import React from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuCalendar, LuMail, LuPhone, LuArrowRight, LuBuilding2 } = LuIcons;

export default function Consultation() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', company: '', message: '' });

      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-20">
        <span className="section-label">Strategic Advisory</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Request Consultation</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
          Connect with our enterprise architects and business strategists to discuss bespoke solutions, infrastructure scaling, and operational modernization for your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 pointer-events-none" />

            <h3 className="text-2xl font-black uppercase mb-8">Direct Access</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded text-axim-gold">
                  <SafeIcon icon={LuCalendar} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Schedule Call</h4>
                  <p className="text-zinc-400 text-sm">Select a time on our calendar for an initial discovery session.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded text-axim-gold">
                  <SafeIcon icon={LuMail} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Email Protocol</h4>
                  <p className="text-zinc-400 text-sm">strategy@axim.us.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded text-axim-gold">
                  <SafeIcon icon={LuBuilding2} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Headquarters</h4>
                  <p className="text-zinc-400 text-sm">Global Remote Operations<br />Enterprise Division</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8">
            <h3 className="text-2xl font-black uppercase mb-8">Initiate Request</h3>

            {isSuccess ? (
              <div className="bg-axim-gold/10 border border-axim-gold/30 p-6 text-center">
                <div className="w-16 h-16 bg-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-axim-gold">
                  <SafeIcon icon={LuArrowRight} className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold uppercase text-axim-gold mb-2">Request Received</h4>
                <p className="text-zinc-400">Our strategic team will review your inquiry and initiate contact within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Primary Contact</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Comms Channel</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors"
                      placeholder="Corporate Email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Organization</label>
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Strategic Objectives</label>
                  <textarea
                    name="message"
                    required
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors resize-none"
                    placeholder="Detail your primary challenges or scaling objectives..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-axim-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Transmitting...' : 'Submit Request'} <SafeIcon icon={LuArrowRight} />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
