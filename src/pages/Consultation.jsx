import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Consultation() {
  const [step, setStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    details: ''
  });

  const consultationTracks = [
    {
      id: "ai",
      title: "AI Integration",
      desc: "Deploy custom LLMs, autonomous agents, and intelligent triage systems.",
      icon: LuIcons.LuBot,
      color: "text-[#DB2777]",
      borderHover: "hover:border-[#DB2777]"
    },
    {
      id: "business",
      title: "Business Development",
      desc: "Scale operations, optimize revenue loops, and integrate partner networks.",
      icon: LuIcons.LuBriefcase,
      color: "text-axim-gold",
      borderHover: "hover:border-axim-gold"
    },
    {
      id: "software",
      title: "Software Architecture",
      desc: "Build proprietary platforms, visual automation systems, and web3 nodes.",
      icon: LuIcons.LuCode,
      color: "text-axim-purple",
      borderHover: "hover:border-axim-purple"
    },
    {
      id: "leadership",
      title: "Leadership Training",
      desc: "Executive coaching, team scaling, and operational management protocols.",
      icon: LuIcons.LuUsers,
      color: "text-[#004040]",
      borderHover: "hover:border-[#004040]"
    }
  ];

  const handleTrackSelection = (trackId) => {
    setSelectedTrack(trackId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual webhook/CRM routing logic
    console.log("Submitting Payload:", { track: selectedTrack, data: formData });
    setStep(3); // Move to success state
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Request Consultation | AXiM Systems"
        description="Schedule a strategic consultation with AXiM Systems. Select your operational focus area to begin the protocol."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none mb-4">
            Initiate <span className="text-axim-purple">Protocol.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            To ensure maximum efficiency, please identify the primary operational vector you wish to optimize during our consultation.
          </p>
        </div>
      </section>

      {/* Multi-Step Funnel Container */}
      <section className="max-w-4xl mx-auto px-6 mt-16">

        {/* Step 1: Selection Grid */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-white">1. Select Consultation Vector</h2>
              <span className="text-xs font-mono text-zinc-500">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consultationTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelection(track.id)}
                  className={`group text-left bg-[#050505] border border-white/10 p-8 rounded-sm transition-all duration-300 shadow-xl ${track.borderHover} hover:bg-white/5`}
                >
                  <SafeIcon icon={track.icon} className={`w-8 h-8 mb-4 ${track.color}`} />
                  <h3 className="text-white font-black uppercase tracking-tight text-lg mb-2">{track.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{track.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Custom Intake Form */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white transition-colors">
                  <SafeIcon icon={LuIcons.LuArrowLeft} className="w-5 h-5" />
                </button>
                2. Configure Parameters
              </h2>
              <span className="text-xs font-mono text-axim-purple">
                Vector: {consultationTracks.find(t => t.id === selectedTrack)?.title}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#050505] border border-white/10 p-8 rounded-sm shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-axim-purple transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-axim-purple transition-colors text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Corporate Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-axim-purple transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Company Name</label>
                  <input required type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-axim-purple transition-colors text-sm" />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Operational Context</label>
                <textarea required name="details" value={formData.details} onChange={handleInputChange} rows="4" placeholder="Briefly describe the friction points you are experiencing..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-axim-purple transition-colors text-sm resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                Transmit Request
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success State */}
        {step === 3 && (
          <div className="animate-fade-in-up text-center bg-[#050505] border border-white/10 p-12 rounded-sm shadow-2xl">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500 flex items-center justify-center rounded-full mx-auto mb-6">
               <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Transmission Successful</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
              Your consultation request regarding <strong>{consultationTracks.find(t => t.id === selectedTrack)?.title}</strong> has been routed to our triage team. You will receive an encrypted scheduling link shortly.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}
