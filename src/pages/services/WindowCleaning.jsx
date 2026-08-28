import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximStore } from '../../store/useAximStore';
import SEO from '../../components/SEO';
import Reviews from '../../components/Reviews';
import { logTelemetry } from '../../lib/telemetry';
import SafeIcon from '../../common/SafeIcon';
import { LuCircleCheck, LuShieldCheck, LuDroplets, LuSun, LuWind, LuChevronDown, LuChevronUp } from 'react-icons/lu';

export default function WindowCleaning() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stories: '',
    windowCount: '',
    package: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
  addOns: []});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

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
        "author": { "@type": "Person", "name": "Marcus V." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "The Nexus CRM and automated lead routing systems completely transformed our pipeline. Conversion rates are up 38% since onboarding."
      }
    ],
    "serviceType": "Window Cleaning",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development"
    },
    "areaServed": {
      "@type": "State",
      "name": "Service Area"
    }
  };


  const handleAddOnChange = (addOn) => {
      setFormData(prev => {
          const addOns = prev.addOns.includes(addOn)
              ? prev.addOns.filter(a => a !== addOn)
              : [...prev.addOns, addOn];
          return { ...prev, addOns };
      });
  };

  const handleNextStep = () => {
    logTelemetry('window_cleaning_funnel_step_completed', { step, package: formData.package });
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logTelemetry('window_cleaning_quote_submitted', {
      stories: formData.stories,
      package: formData.package,
            addOnsCount: formData.addOns?.length || 0,
      hasAddress: !!formData.address,
      timestamp: Date.now()
    });
    setIsSubmitted(true);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is your 7-Day Rain Guarantee?",
      answer: "If it rains within 7 days of our service and spots your windows, we will come back and touch up the affected outside windows for free."
    },
    {
      question: "Are your cleaning methods safe for pets and plants?",
      answer: "Yes! We use 100% deionized purified water technology with no harsh chemicals or soapy residue, making it completely safe for your pets and landscaping."
    },
    {
      question: "Do I need to be home for exterior cleaning?",
      answer: "For exterior-only services, you do not need to be home as long as we have access to the windows and screens are removed or accessible. For interior services, someone will need to be present."
    },
    {
      question: "How should I prepare for interior window cleaning?",
      answer: "Please remove any fragile items from window sills and ensure there is a clear path to the windows. We will handle the rest, including carefully moving light furniture if necessary."
    }
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="Professional Window Cleaning Services | AXiM Development"
        description="Get a crystal clear view with our professional window cleaning services. Request a quote today."
        type="website"
        customSchema={[schema]}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => {
            logTelemetry('seo_landing_viewed', { service: 'window_cleaning' });
            logTelemetry('window_cleaning_quote_started');
        }}
        className="w-full bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl mb-16"
      >
        <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Pure Clarity <span className="text-axim-gold">Residential Window Care</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Transform your home's curb appeal with streak-free, pure-water exterior and interior window detailing.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
                <SafeIcon icon={LuCircleCheck} className="text-axim-green" /> 100% Streak-Free Guarantee
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
                <SafeIcon icon={LuCircleCheck} className="text-axim-green" /> 7-Day Rain Protection
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
                <SafeIcon icon={LuShieldCheck} className="text-axim-gold" /> HOA & Property Compliant
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
                <SafeIcon icon={LuShieldCheck} className="text-axim-gold" /> Licensed & Fully Insured
            </span>
          </div>

          <button
            onClick={() => document.getElementById('quote-funnel').scrollIntoView({ behavior: 'smooth' })}
            className="bg-axim-purple hover:bg-axim-purple/80 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] uppercase tracking-widest text-sm"
          >
            Start Your Free Quote
          </button>
        </div>
      </motion.div>

      {/* Educative / Value Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-onyx-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-md"
        >
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-md flex items-center justify-center mb-6">
                <SafeIcon icon={LuSun} className="text-red-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Hard Water Hazard</h3>
            <p className="text-zinc-400 text-sm">
                Mineral deposits and sprinkler overspray etch into glass over time, causing permanent damage. Regular cleaning protects your windows from oxidation and degradation.
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-onyx-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-md"
        >
            <div className="w-12 h-12 bg-axim-green/10 border border-axim-green/20 rounded-md flex items-center justify-center mb-6">
                <SafeIcon icon={LuDroplets} className="text-axim-green w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Purified Water Technology</h3>
            <p className="text-zinc-400 text-sm">
                We use 100% deionized water that acts as a magnet for dirt. It cleans without harsh chemicals or soapy residue, leaving a perfectly clear, streak-free finish.
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-onyx-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-md"
        >
            <div className="w-12 h-12 bg-axim-purple/10 border border-axim-purple/20 rounded-md flex items-center justify-center mb-6">
                <SafeIcon icon={LuWind} className="text-axim-purple w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Complete System Care</h3>
            <p className="text-zinc-400 text-sm">
                We don't just wash the glass. Our comprehensive service includes deep cleaning of screens, wiping down tracks, detailing sills, and cleaning the window frames.
            </p>
        </motion.div>
      </div>

      {/* Funnel Container */}
      <div id="quote-funnel" className="w-full max-w-4xl mx-auto bg-onyx-900/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl mb-16 relative">
         {/* Web3 Badge */}
         {isWeb3Authenticated && (
            <div className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [SERVICES_NODE: VERIFIED_LEAD_UPLINK]
            </div>
         )}

         <div className="p-8 md:p-12">
            {!isSubmitted ? (
                <>
                <div className="mb-8 flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-axim-green -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                    {[1, 2, 3].map((num) => (
                        <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-colors ${step >= num ? 'bg-axim-green border-axim-green text-black' : 'bg-[#050505] border-white/20 text-zinc-500'}`}>
                            {num}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Step 1: Property Profile</h2>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-zinc-300">How many stories is your home?</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['1-Story', '2-Story', '3-Story'].map((story) => (
                                        <button
                                            key={story}
                                            type="button"
                                            onClick={() => setFormData({...formData, stories: story})}
                                            className={`py-3 px-4 rounded-md border text-sm font-medium transition-all ${formData.stories === story ? 'bg-axim-green/20 border-axim-green text-axim-green' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'}`}
                                        >
                                            {story}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="block text-sm font-medium text-zinc-300">Estimated Window Count (Optional)</label>
                                <select
                                    name="windowCount"
                                    value={formData.windowCount}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors"
                                >
                                    <option value="" className="bg-[#050505]">&lt; Select Count &gt;</option>
                                    <option value="<15" className="bg-[#050505]">Less than 15</option>
                                    <option value="15-30" className="bg-[#050505]">15 - 30 windows</option>
                                    <option value="30-50" className="bg-[#050505]">30 - 50 windows</option>
                                    <option value="50+" className="bg-[#050505]">50+ windows</option>
                                </select>
                            </div>

                            <button
                                onClick={handleNextStep}
                                disabled={!formData.stories}
                                className="w-full mt-8 bg-axim-purple hover:bg-axim-purple/80 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-md transition-all uppercase tracking-widest text-sm"
                            >
                                Next Step →
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Step 2: Service Package</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'Standard Exterior', title: 'Standard Exterior', desc: 'Exterior glass cleaning with purified water.' },
                                    { id: 'Full Interior/Exterior', title: 'Full In & Out', desc: 'Interior and exterior glass cleaning.' },
                                    { id: 'Ultimate Detail', title: 'Ultimate Detail', desc: 'In & Out + Screens, Tracks & Sills deep clean.' }
                                ].map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        type="button"
                                        onClick={() => setFormData({...formData, package: pkg.id})}
                                        className={`flex flex-col p-6 rounded-lg border text-left transition-all ${formData.package === pkg.id ? 'bg-axim-green/10 border-axim-green' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <h4 className={`font-bold mb-2 ${formData.package === pkg.id ? 'text-axim-green' : 'text-white'}`}>{pkg.title}</h4>
                                        <p className="text-xs text-zinc-400">{pkg.desc}</p>
                                    </button>
                                ))}
                            </div>


                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-3">Frequently Combined Add-Ons</label>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Solar Panel Surface Wash (Custom Quote)', value: 'solar_panel' },
                                            { label: 'Driveway Pressure Wash (Custom Quote)', value: 'driveway' },
                                            { label: 'Screen Deep Detail & UV Barrier (Custom Quote)', value: 'screen_detail' }
                                        ].map(addon => (
                                            <label key={addon.value} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-axim-green bg-black/50 border-white/10 rounded focus:ring-axim-green focus:ring-offset-black transition-colors"
                                                    checked={formData.addOns.includes(addon.value)}
                                                    onChange={() => handleAddOnChange(addon.value)}
                                                />
                                                <span className="text-zinc-400 text-sm">{addon.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handlePrevStep}
                                    className="px-6 py-4 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    disabled={!formData.package}
                                    className="flex-1 bg-axim-purple hover:bg-axim-purple/80 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-md transition-all uppercase tracking-widest text-sm"
                                >
                                    Final Step →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Step 3: Contact & Scheduling</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">First Name</label>
                                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Last Name</label>
                                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Phone</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Property Address</label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Preferred Date (Optional)</label>
                                    <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-white focus:outline-none focus:border-axim-green transition-colors" />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="px-6 py-4 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-axim-green hover:bg-axim-green/80 text-black font-bold py-4 rounded-md transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-axim-green/20 rounded-full flex items-center justify-center mb-6">
                        <SafeIcon icon={LuCircleCheck} className="w-10 h-10 text-axim-green" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Request Received!</h2>
                    <p className="text-zinc-400 max-w-md mx-auto mb-8">
                        Thank you for choosing AXiM Development. We're reviewing your property profile and will reach out shortly to finalize your quote and scheduling.
                    </p>
                    <button
                        onClick={() => { setStep(1); setIsSubmitted(false); setFormData({stories:'', windowCount:'', package:'', firstName:'', lastName:'', phone:'', email:'', address:'', preferredDate:'', addOns: []}); }}
                        className="text-axim-green hover:text-white text-sm font-mono tracking-widest uppercase transition-colors border-b border-axim-green/50 hover:border-white pb-1"
                    >
                        Submit Another Request
                    </button>
                </motion.div>
            )}
         </div>
      </div>

      {/* Tiered Pricing Section */}
      <div className="mb-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="bg-onyx-900/60 border border-axim-gold/20 rounded-lg p-8 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Quantitative Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">99.4%</span>
                        <span className="text-sm font-bold text-white">Pure Water Deionization Purity</span>
                        <span className="text-xs text-zinc-400 mt-1">Leaves absolutely no mineral deposits or spots.</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">7-Day</span>
                        <span className="text-sm font-bold text-white">Rain Touch-Up Protection</span>
                        <span className="text-xs text-zinc-400 mt-1">Complimentary re-cleaning if rain affects visibility.</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-axim-gold mb-2">100%</span>
                        <span className="text-sm font-bold text-white">Streak-Free Guarantee</span>
                        <span className="text-xs text-zinc-400 mt-1">Impeccable clarity ensured on every window.</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Maintenance Plans</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Protect your investment with recurring care schedules tailored for continuous clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-onyx-900/40 border border-white/10 rounded-lg p-8 flex flex-col backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-2">One-Time Deep Clean</h3>
                <p className="text-sm text-zinc-400 mb-6 flex-grow">Perfect for spring cleaning or preparing a property for sale.</p>
                <div className="text-axim-green font-mono text-sm uppercase tracking-widest border-t border-white/10 pt-4">Standard Rate</div>
            </div>

            <div className="bg-onyx-900/60 border border-axim-gold/30 rounded-lg p-8 flex flex-col backdrop-blur-md relative transform md:-translate-y-4 shadow-[0_10px_30px_rgba(234,179,8,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-axim-gold text-black font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2">Bi-Annual Refresh</h3>
                <p className="text-sm text-zinc-400 mb-6 flex-grow">Set it and forget it. Service every 6 months to keep windows pristine year-round.</p>
                <div className="text-axim-gold font-mono text-sm uppercase tracking-widest border-t border-white/10 pt-4">Save 10%</div>
            </div>

            <div className="bg-onyx-900/40 border border-white/10 rounded-lg p-8 flex flex-col backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-2">Quarterly Premier</h3>
                <p className="text-sm text-zinc-400 mb-6 flex-grow">The ultimate protection plan. Ideal for high-exposure homes or commercial properties.</p>
                <div className="text-axim-purple font-mono text-sm uppercase tracking-widest border-t border-white/10 pt-4">Save 20%</div>
            </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-onyx-900/40 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md transition-colors hover:border-white/20">
                    <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex justify-between items-center text-left"
                    >
                        <span className="font-bold text-white">{faq.question}</span>
                        <SafeIcon icon={activeFaq === index ? LuChevronUp : LuChevronDown} className="text-zinc-400" />
                    </button>
                    <AnimatePresence>
                        {activeFaq === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-4 text-zinc-400 text-sm border-t border-white/5"
                            >
                                <div className="pt-4">{faq.answer}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
      </div>

      <Reviews />
    </div>
  );
}
