import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuCalendar, LuMail, LuPhone, LuArrowRight, LuArrowLeft, LuBuilding2, LuCheckCircle2 } = LuIcons;

export default function Consultation() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    technicalNeeds: [],
    timeline: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const technicalOptions = [
    'Document Orchestration',
    'Fleet Telemetry',
    'Custom LLM Integration',
    'Web3 Infrastructure',
    'Enterprise Architecture'
  ];

  const toggleTechnicalNeed = (need) => {
    setFormState(prev => {
      const needs = prev.technicalNeeds.includes(need)
        ? prev.technicalNeeds.filter(n => n !== need)
        : [...prev.technicalNeeds, need];
      return { ...prev, technicalNeeds: needs };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://wp.axim.us.com/wp-json/axim/v1/ground-game-assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', company: '', technicalNeeds: [], timeline: '', budget: '', message: '' });
        setStep(1);
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        console.error('Failed to submit consultation request');
      }
    } catch (err) {
      console.error('Network error during submission', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
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
          <div className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8 relative min-h-[450px]">
            <h3 className="text-2xl font-black uppercase mb-6">
              {isSuccess ? 'Initiate Request' : `Step ${step} of 3`}
            </h3>

            {isSuccess ? (
              <div className="bg-axim-gold/10 border border-axim-gold/30 p-6 text-center mt-12">
                <div className="w-16 h-16 bg-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 text-axim-gold">
                  <SafeIcon icon={LuCheckCircle2} className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold uppercase text-axim-gold mb-2">Request Received</h4>
                <p className="text-zinc-400">Our strategic team will review your inquiry and initiate contact within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col justify-between">
                <div className="relative overflow-hidden flex-grow">
                  <AnimatePresence mode="wait" custom={1}>
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="space-y-6 absolute w-full"
                      >
                        <h4 className="text-lg font-bold text-white mb-4">Organization & Identity</h4>
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
                            required
                            value={formState.company}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors"
                            placeholder="Company Name"
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="space-y-6 absolute w-full"
                      >
                        <h4 className="text-lg font-bold text-white mb-4">Technical Needs</h4>
                        <p className="text-sm text-zinc-400 mb-4">Select the domains relevant to your inquiry:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {technicalOptions.map((opt) => (
                            <div
                              key={opt}
                              onClick={() => toggleTechnicalNeed(opt)}
                              className={`p-3 border cursor-pointer transition-colors text-sm ${formState.technicalNeeds.includes(opt) ? 'border-axim-gold bg-axim-gold/10 text-white' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/30'}`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="space-y-6 absolute w-full"
                      >
                        <h4 className="text-lg font-bold text-white mb-4">Timeline & Budget</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Expected Timeline</label>
                            <select
                              name="timeline"
                              value={formState.timeline}
                              onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors appearance-none"
                            >
                              <option value="" disabled>Select Timeline</option>
                              <option value="Immediate">Immediate (0-1 Month)</option>
                              <option value="Short Term">Short Term (1-3 Months)</option>
                              <option value="Medium Term">Medium Term (3-6 Months)</option>
                              <option value="Exploratory">Exploratory / Ongoing</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Budget Range</label>
                            <select
                              name="budget"
                              value={formState.budget}
                              onChange={handleChange}
                              className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors appearance-none"
                            >
                              <option value="" disabled>Select Budget</option>
                              <option value="<$10k">&lt; $10k</option>
                              <option value="$10k-$50k">$10k - $50k</option>
                              <option value="$50k-$250k">$50k - $250k</option>
                              <option value="$250k+">$250k+</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 mb-2">Strategic Objectives</label>
                          <textarea
                            name="message"
                            required
                            value={formState.message}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-axim-gold focus:outline-none transition-colors resize-none"
                            placeholder="Detail your primary challenges or scaling objectives..."
                          ></textarea>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-white/10 z-10 bg-bg-void/50 backdrop-blur-sm">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuArrowLeft} /> Back
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || (step === 1 && (!formState.name || !formState.email || !formState.company))}
                    className="flex-grow py-4 bg-axim-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Transmitting...' : step < 3 ? 'Continue' : 'Submit Request'}
                    {step < 3 ? <SafeIcon icon={LuArrowRight} /> : null}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
