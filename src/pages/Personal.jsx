import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PartnerPromo from '../components/PartnerPromo';
import { useAximStore } from '../store/useAximStore';
import SEO from '../components/SEO';
import { logTelemetry, trackEvent, logHighPriorityTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import Reviews from '../components/Reviews.jsx';

import CategoryArticleFeed from '../components/CategoryArticleFeed.jsx';



const AssessmentModule = () => {
  const [step, setStep] = React.useState(0);
  const [scores, setScores] = React.useState({ strategic: 0, execution: 0, risk: 0, sovereignty: 0, resilience: 0 });
  const [result, setResult] = React.useState(null);

  const questions = [
    { id: 'strategic', text: 'How far ahead do you typically plan your primary objectives?', options: [{ label: '1-3 Months', val: 1 }, { label: '1 Year', val: 2 }, { label: '3-5 Years', val: 3 }, { label: 'Decades', val: 4 }] },
    { id: 'execution', text: 'When faced with a complex roadblock, your first reaction is to:', options: [{ label: 'Research', val: 1 }, { label: 'Delegate', val: 2 }, { label: 'Build a prototype', val: 3 }, { label: 'Force through it', val: 4 }] },
    { id: 'risk', text: 'Your approach to high-stakes decisions is best described as:', options: [{ label: 'Highly Cautious', val: 1 }, { label: 'Calculated', val: 2 }, { label: 'Opportunistic', val: 3 }, { label: 'Aggressive', val: 4 }] },
    { id: 'sovereignty', text: 'How important is absolute ownership (data, finance, IP) to your operations?', options: [{ label: 'Nice to have', val: 1 }, { label: 'Important', val: 2 }, { label: 'Critical', val: 3 }, { label: 'Non-negotiable', val: 4 }] },
    { id: 'resilience', text: 'After a significant failure, how long does it take you to deploy a v2?', options: [{ label: 'Months', val: 1 }, { label: 'Weeks', val: 2 }, { label: 'Days', val: 3 }, { label: 'Hours', val: 4 }] }
  ];

  React.useEffect(() => {
    const saved = localStorage.getItem('axim_assessment_result');
    if (saved) setResult(JSON.parse(saved));
  }, []);

  const handleSelect = (val, qId) => {
    setScores(prev => ({ ...prev, [qId]: val }));
    if (step === 0) {
      trackEvent('personality_test_started');
    }

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      computeResult({ ...scores, [qId]: val });
    }
  };

  const computeResult = (finalScores) => {
    const total = Object.values(finalScores).reduce((a, b) => a + b, 0);
    let archetype = 'Strategist';
    if (total > 16) archetype = 'Architect';
    else if (total > 12) archetype = 'Vanguard';
    else if (total > 8) archetype = 'Catalyst';

    const res = { archetype, scores: finalScores, completedAt: new Date().toISOString() };
    setResult(res);
    localStorage.setItem('axim_assessment_result', JSON.stringify(res));
    trackEvent('personality_test_completed', { archetype });
  };

  const reset = () => {
    setStep(0);
    setScores({ strategic: 0, execution: 0, risk: 0, sovereignty: 0, resilience: 0 });
    setResult(null);
    localStorage.removeItem('axim_assessment_result');
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 backdrop-blur-md bg-slate-900/60 border border-cyan-500/20 rounded-xl max-w-2xl mx-auto my-12 text-center">
        <h3 className="text-xl text-cyan-400 font-mono mb-2">ASSESSMENT COMPLETE</h3>
        <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-wider">{result.archetype}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(result.scores).map(([key, val]) => (
            <div key={key} className="bg-black/40 p-4 rounded-lg border border-white/5">
              <div className="text-xs text-slate-400 uppercase mb-2">{key}</div>
              <div className="text-2xl font-mono text-axim-purple">{val * 25}%</div>
            </div>
          ))}
        </div>
        <p className="text-slate-300 mb-8">
          Your profile indicates a strong leaning towards {result.archetype.toLowerCase()} methodologies. Integrate your findings with the AXiM ecosystem to maximize output velocity.
        </p>
        <button onClick={reset} className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded transition-colors text-sm font-mono text-slate-300">
          RECALIBRATE
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[step];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 backdrop-blur-md bg-slate-900/60 border border-cyan-500/20 rounded-xl max-w-2xl mx-auto my-12">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg text-cyan-400 font-mono">SYSTEM CALIBRATION</h3>
        <div className="text-sm text-slate-500 font-mono">PHASE 0{step + 1} // 05</div>
      </div>

      <div className="w-full bg-black/40 h-1 mb-8 rounded overflow-hidden">
        <motion.div
          className="h-full bg-cyan-500"
          initial={{ width: `${(step / 5) * 100}%` }}
          animate={{ width: `${((step + 1) / 5) * 100}%` }}
        />
      </div>

      <h2 className="text-2xl font-medium text-white mb-8">{currentQ.text}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt.val, currentQ.id)}
            className="p-4 bg-black/40 border border-white/5 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all text-left group"
          >
            <div className="text-xs font-mono text-cyan-700 mb-1 group-hover:text-cyan-400">OPT_{i+1}</div>
            <div className="text-slate-300 group-hover:text-white">{opt.label}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};


export default function Personal() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const personalSchema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Growth and Psychology Frameworks",
      "description": "Aligning internal systems for high-performance output. Explore cognitive frameworks, personal utility tools, and foundational development strategies."
    }
  ];


  useEffect(() => {
    logTelemetry('category_hub_viewed', { category: 'personal' });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AXiM Personal Development Hub",
    "description": "Personal growth systems, residential home services, and individual utilities."
  };

  return (
    <div className="min-h-screen bg-bg-void text-white font-sans selection:bg-emerald-500/30">
      <SEO
        title="Personal Development Hub | AXiM Development"
        description="Maximizing individual efficiency and property value through targeted services and growth frameworks."
        schema={schema}
      />

      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-bg-void to-bg-void pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Personal Development<br />& Growth Systems
            </h1>
          {isWeb3Authenticated && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
           <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
           [PERSONAL_NODE: GROWTH_FRAMEWORK_VERIFIED]
         </div>
          )}

            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
              Maximizing individual efficiency and property value. Explore our residential services, utility apps, and personal growth frameworks.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="w-full py-16 relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-12 mb-8">
        <div className="backdrop-blur-md bg-slate-900/60 border border-emerald-500/30 shadow-2xl rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full">Core Psychometric Assessment</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">Discover Your Cognitive Blueprint: The AXiM Personality Assessment</h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-3xl">
            Move beyond rigid four-letter stereotypes. The AXiM Personality Test measures all eight Jungian cognitive functions on a continuous spectrum to reveal your authentic mental processing style, shadow functions under stress, and personalized growth trajectory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="border border-white/5 bg-black/40 p-5 rounded-xl">
              <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">Continuous Trait Precision</h3>
              <p className="text-sm text-zinc-400">Graded response scoring across Thinking, Feeling, Sensing, and Intuition.</p>
            </div>
            <div className="border border-white/5 bg-black/40 p-5 rounded-xl">
              <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">Shadow & Stress Mapping</h3>
              <p className="text-sm text-zinc-400">Understand unconscious behavior patterns and triggers.</p>
            </div>
            <div className="border border-white/5 bg-black/40 p-5 rounded-xl">
              <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">Personal Growth Pathways</h3>
              <p className="text-sm text-zinc-400">Actionable developmental guidance tailored to your cognitive archetype.</p>
            </div>
          </div>

          <a href="https://axim.us.com/personalitytest/" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('personality_test_click', { source: 'personal_page' })} className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">Take the Personality Test →</a>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Growth & Psychology Frameworks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

            {/* Overcoming Imposter Syndrome Card */}
            <div className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-[8px] font-mono text-yellow-500 uppercase tracking-widest rounded-sm">
                [IN DEVELOPMENT]
              </div>
              <SafeIcon icon={LuIcons.LuBrain} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Overcoming Imposter Syndrome</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Masterclass on dealing with corporate anxiety and owning your achievements.</p>
              <button
                onClick={() => {
                  logTelemetry('growth_module_intent', { module: 'imposter_syndrome' });
                  useAximStore.getState().addToast({ message: "Added to waitlist", type: "success" });
                }}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black mt-auto"
              >
                Join Waitlist
              </button>
            </div>

            {/* Core Personality Type Quiz Card */}
            <div className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-[8px] font-mono text-yellow-500 uppercase tracking-widest rounded-sm">
                [IN DEVELOPMENT]
              </div>
              <SafeIcon icon={LuIcons.LuClipboardCheck} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Core Personality Type Quiz</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Interactive assessment to discover your operational strengths and weaknesses.</p>
              <button
                onClick={() => {
                  logTelemetry('growth_module_intent', { module: 'personality_quiz' });
                  useAximStore.getState().addToast({ message: "Added to waitlist", type: "success" });
                }}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black mt-auto"
              >
                Join Waitlist
              </button>
            </div>

            {/* Inner Voice Calibration Card */}
            <div className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-[8px] font-mono text-yellow-500 uppercase tracking-widest rounded-sm">
                [IN DEVELOPMENT]
              </div>
              <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Inner Voice Calibration</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Audio/text module for self-alignment and mental recalibration.</p>
              <button
                onClick={() => {
                  logTelemetry('growth_module_intent', { module: 'inner_voice' });
                  useAximStore.getState().addToast({ message: "Added to waitlist", type: "success" });
                }}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black mt-auto"
              >
                Join Waitlist
              </button>
            </div>

        </div>


        <div className="relative pt-8 mt-12 border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-bg-void">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded-sm bg-emerald-500/5">
              Utilities & Services
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property & Home Services Card */}
            <motion.div onViewportEnter={() => logTelemetry('cta_visible', { location: 'hero', page: 'personal' })} viewport={{ once: true }}>
              <Link to="/services" onClick={() => { logTelemetry('personal_gateway_clicked', { gateway: 'property_home' }); logTelemetry('cta_clicked', { location: 'hero', page: 'personal' }); }} className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:bg-white/5 block h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <SafeIcon icon={LuIcons.LuHouse} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Property & Home</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium">Residential exterior services, pressure washing, and property value enhancement.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
                <span>View Services</span>
                <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            </motion.div>

            {/* Individual Utilities Card */}
            <Link to="/store" onClick={() => logTelemetry('personal_gateway_clicked', { gateway: 'individual_utilities' })} className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <SafeIcon icon={LuIcons.LuWrench} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Individual Utilities</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium">Personal document generators, pay stubs, and individual legal tech tools.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
                <span>Access Utilities</span>
                <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Growth Frameworks Card */}
            <Link to="/articles" onClick={() => logTelemetry('personal_gateway_clicked', { gateway: 'growth_frameworks' })} className="group relative bg-[#050505] border border-cyan-500/20 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <SafeIcon icon={LuIcons.LuBookOpen} className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Growth Frameworks</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium">Personal development articles, life-optimization strategies, and mental models.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
                <span>Read Articles</span>
                <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <PartnerPromo
        partnerName="Powur Solar"
        title="Decentralize Your Energy"
        description="Take control of your home's power grid with decentralized solar architecture."
        learnMorePath="/partners/powur-solar"
        startNowUrl="https://powur.com/james.ellars/discover"
        theme="gold"
        onClick={() => logTelemetry('partner_promo_viewed', { partner: 'Powur Solar', location: 'Personal' })}
      />





      <CategoryArticleFeed
        categorySlug="personal-development"
        sectionTitle="Personal Development & Cognitive Mastery"
        sectionSubtitle="Psychometrics, continuous growth protocols, and performance psychology."
        limit={3}
      />

      <section className="w-full bg-gradient-to-r from-[#050505] to-[#0A0A0A] border-t border-b border-cyan-500/20 py-16 text-center relative z-10">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Ready to deploy your Personal infrastructure?</h2>
        <Link
          to="/consultation?pillar=personal"
          onClick={() => logHighPriorityTelemetry('consultation_intent', { pillar: 'Personal' })}
          className="inline-flex items-center gap-2 px-8 py-4 bg-axim-gold text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-sm shadow-[0_0_20px_rgba(255,189,20,0.3)]"
        >
          Schedule Consultation <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
        </Link>
      </section>
</div>
  );
}
