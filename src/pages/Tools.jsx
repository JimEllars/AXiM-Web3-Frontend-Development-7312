import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function Tools() {
  const toolsList = [
    {
      title: "Quick Demand Letter",
      desc: "Generate legally formatted, aggressive demand letters in minutes. Stop waiting on expensive retainers and force immediate action.",
      features: ["Instant PDF Generation", "Legally formatted structure", "Custom variable injection", "No retainer required"],
      link: "https://quickdemandletter.com/start",
      icon: LuIcons.LuShieldCheck,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black",
      isExternal: true
    },
    {
      title: "Mutual NDA Generator",
      desc: "Protect your intellectual property. Generate a balanced, enterprise-grade Mutual Non-Disclosure Agreement before entering into negotiations.",
      features: ["Symmetric legal protection", "Instant extraction", "Software/IP focused", "Print-ready format"],
      link: "/tools/nda",
      icon: LuIcons.LuFileCode2,
      color: "text-[#004040]",
      bgHover: "hover:border-[#004040]/50",
      btnClass: "bg-[#004040] text-white hover:bg-white hover:text-black",
      isExternal: false
    },
    {
      title: "Autonomous Pay Stub System",
      desc: "Standardize your payroll documentation. Input earnings and deductions to generate instant, mathematically verified pay stubs.",
      features: ["Automated deduction logic", "Standardized accounting layout", "Instant PDF export", "Compliance ready"],
      link: "/tools/paystub",
      icon: LuIcons.LuFileText,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black",
      isExternal: false
    }
  ];

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubscribed(true);
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Ai Tools & Utilities | AXiM Systems"
        description="Access AXiM's suite of proprietary business micro-apps. Generate legal documentation, standardize payroll, and accelerate your operations."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-purple to-[#DB2777]">Ai Tools.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            A suite of standalone, proprietary micro-applications engineered to eliminate operational friction and standardize business documentation.
          </p>
        </div>
      </section>

      {/* High-Contrast Grid Hub */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolsList.map((tool, idx) => (
             tool.isExternal ? (
               <a key={idx} href={tool.link} target="_blank" rel="noopener noreferrer" className={`group block bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden ${tool.bgHover}`}>
                  <div className={`w-12 h-12 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 ${tool.color === 'text-axim-purple' ? 'bg-gradient-to-br from-axim-purple to-indigo-600' : tool.color === 'text-[#DB2777]' ? 'bg-gradient-to-br from-[#DB2777] to-pink-600' : 'bg-gradient-to-br from-[#004040] to-teal-800'}`}>
                    <SafeIcon icon={tool.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between transition-colors ${tool.color.replace('text-', 'group-hover:text-')}`}>
                    {tool.title} <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-3">
                    {tool.desc}
                  </p>
               </a>
             ) : (
               <Link key={idx} to={tool.link} className={`group block bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden ${tool.bgHover}`}>
                  <div className={`w-12 h-12 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 ${tool.color === 'text-axim-purple' ? 'bg-gradient-to-br from-axim-purple to-indigo-600' : tool.color === 'text-[#DB2777]' ? 'bg-gradient-to-br from-[#DB2777] to-pink-600' : 'bg-gradient-to-br from-[#004040] to-teal-800'}`}>
                    <SafeIcon icon={tool.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between transition-colors ${tool.color.replace('text-', 'group-hover:text-')}`}>
                    {tool.title} <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-3">
                    {tool.desc}
                  </p>
               </Link>
             )
          ))}
        </div>
      </section>

      {/* Deep-Dive Alternating Layout Array */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {toolsList.map((tool, index) => (
          <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
            <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${tool.bgHover}`}>
               <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 opacity-10 blur-[60px] pointer-events-none ${tool.color.replace('text-', 'bg-')}`} />
               <SafeIcon icon={tool.icon} className={`w-12 h-12 mb-6 relative z-10 ${tool.color}`} />
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">{tool.title}</h2>
               <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10">{tool.desc}</p>

               <ul className="space-y-3 mb-10 relative z-10">
                 {tool.features.map((feature, fIndex) => (
                   <li key={fIndex} className="flex items-center text-xs font-mono text-zinc-300 uppercase tracking-widest">
                     <div className={`w-1.5 h-1.5 rounded-full mr-3 ${tool.color.replace('text-', 'bg-')}`} />
                     {feature}
                   </li>
                 ))}
               </ul>

               {tool.isExternal ? (
                 <a href={tool.link} target="_blank" rel="noopener noreferrer" className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Initialize Tool <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-3 h-3" />
                 </a>
               ) : (
                 <Link to={tool.link} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Explore Integration <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
                 </Link>
               )}
            </div>

            {/* Visual Abstraction Container */}
            <div className="flex-1 hidden md:flex justify-center">
               <div className="w-full max-w-sm aspect-square bg-[#050505] border border-white/5 rounded-full flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                  <div className={`absolute inset-4 rounded-full border border-dashed opacity-20 animate-spin-slow ${tool.color.replace('text-', 'border-')}`} />
                  <SafeIcon icon={tool.icon} className={`w-24 h-24 opacity-20 ${tool.color}`} />
               </div>
            </div>
          </div>
        ))}
      </section>

      {/* Educational Modules / Courses */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
          <SafeIcon icon={LuIcons.LuGraduationCap} className="w-5 h-5 text-axim-gold" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Enterprise Academy</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-12 bg-axim-gold/5 border border-axim-gold/20 rounded-xl p-12 text-center relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(240,255,0,0.05)]">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(240,255,0,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

              <div className="w-12 h-12 border-2 border-axim-gold/30 rounded-full flex items-center justify-center mb-6 relative z-10 bg-black">
                <SafeIcon icon={LuIcons.LuLock} className="w-4 h-4 text-axim-gold" />
              </div>

              <h3 className="text-xl md:text-2xl font-black text-axim-gold uppercase tracking-widest mb-3 relative z-10">Curriculum Compiling</h3>

              <p className="text-zinc-400 text-sm max-w-md mx-auto relative z-10 leading-relaxed mb-8">
                High-impact operational courses and playbooks are currently undergoing structural review by our engineering team. Awaiting release.
              </p>

              {subscribed ? (
                <div className="relative z-10 inline-flex flex-col items-center px-8 py-3 bg-axim-gold/10 border border-axim-gold shadow-lg">
                  <span className="font-bold text-axim-gold uppercase tracking-widest text-xs flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCheck} className="w-4 h-4" /> Subscription Confirmed
                  </span>
                  <span className="text-[10px] text-axim-gold/70 font-mono mt-1">You have been securely added to our network.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col items-center gap-2 w-full max-w-sm mx-auto">
                  <div className="flex w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@enterprise.com"
                      className="w-full bg-black border border-axim-gold/30 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-gold transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-axim-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg min-w-[60px]"
                    >
                      {isSubmitting ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs font-mono">Submission failed. Retry.</p>}
                </form>
              )}
           </div>
        </div>
      </section>
    </div>
  );
}
