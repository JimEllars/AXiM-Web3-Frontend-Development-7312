import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuX, LuCheckCircle, LuArrowRight, LuLoader2 } = LuIcons;

export default function B2BRegistrationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    technicalContactEmail: '',
    expectedMonthlyVolume: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.organizationName) setStep(2);
    else if (step === 2 && formData.technicalContactEmail) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expectedMonthlyVolume) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.axim.us.com/v1/functions/ground-game-assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: 'b2b_registration',
          organization_name: formData.organizationName,
          technical_contact_email: formData.technicalContactEmail,
          expected_monthly_volume: formData.expectedMonthlyVolume
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error('Failed to submit registration');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <SafeIcon icon={LuX} className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">B2B Registration</h2>
          <p className="text-xs text-zinc-400 font-mono">Enterprise API Partner Access</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <SafeIcon icon={LuCheckCircle} className="w-16 h-16 text-axim-teal mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase text-white mb-2">Registration Received</h3>
            <p className="text-sm text-zinc-400">Our enterprise team will review your application and contact you shortly.</p>
            <button
              onClick={onClose}
              className="mt-8 py-3 px-6 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors w-full"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-axim-teal"
                    placeholder="e.g. Acme Corp"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.organizationName}
                    className="w-full py-3 px-6 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                  >
                    Next <SafeIcon icon={LuArrowRight} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Technical Contact Email</label>
                  <input
                    type="email"
                    name="technicalContactEmail"
                    value={formData.technicalContactEmail}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-axim-teal"
                    placeholder="dev@acmecorp.com"
                    autoFocus
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-6 bg-transparent text-white border border-white/20 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.technicalContactEmail}
                      className="flex-1 py-3 px-6 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Next <SafeIcon icon={LuArrowRight} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Expected Monthly Document Volume</label>
                  <select
                    name="expectedMonthlyVolume"
                    value={formData.expectedMonthlyVolume}
                    onChange={handleChange}
                    className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-axim-teal appearance-none"
                  >
                    <option value="" disabled>Select volume range...</option>
                    <option value="1-100">1 - 100 docs / month</option>
                    <option value="101-1000">101 - 1,000 docs / month</option>
                    <option value="1000-10000">1,000 - 10,000 docs / month</option>
                    <option value="10000+">10,000+ docs / month</option>
                  </select>

                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 px-6 bg-transparent text-white border border-white/20 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.expectedMonthlyVolume || loading}
                      className="flex-1 py-3 px-6 bg-axim-teal text-black font-bold uppercase text-xs tracking-widest hover:bg-axim-teal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <SafeIcon icon={LuLoader2} className="animate-spin" /> : 'Submit Request'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${step >= i ? 'bg-axim-teal' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
