import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Support() {
  const [ticketState, setTicketState] = useState('idle'); // idle | submitting | success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sector: 'Demand Letter',
    priority: 'Standard',
    issue: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketState('submitting');

    // Placeholder for actual API Webhook / Formspree / CRM Integration
    console.log("Transmitting Support Payload:", formData);

    // Simulate network delay
    setTimeout(() => {
      setTicketState('success');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="System Support | AXiM Systems" description="Access operational support, system documentation, and submit terminal tickets." />

      {/* Header */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,64,64,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-[#004040]/20 border border-[#004040] rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(0,64,64,0.3)]">
            <SafeIcon icon={LuIcons.LuLifeBuoy} className="w-6 h-6 text-[#004040]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-[#004040]" style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.4)' }}>Support.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Initialize a terminal ticket below to securely route your issue to our engineering and resolution queue.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Support Intake Form (Primary Column) */}
        <div className="lg:col-span-8">
          <div className="bg-[#050505] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#004040]/5 blur-[50px] pointer-events-none" />

            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuSquareTerminal} className="w-6 h-6 text-[#004040]" /> Terminal Intake
            </h2>

            {ticketState === 'success' ? (
              <div className="py-16 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-[#004040]/20 border border-[#004040] flex items-center justify-center rounded-full mx-auto mb-6">
                   <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-[#004040]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-4">Ticket Transmitted</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
                  Your diagnostic log has been securely routed to our resolution queue. Standard response protocols mandate a 24-48 hour turnaround.
                </p>
                <button
                  onClick={() => setTicketState('idle')}
                  className="px-6 py-3 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm"
                >
                  Submit Additional Log
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Registered Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Secure Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">System Sector</label>
                    <select name="sector" value={formData.sector} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm appearance-none">
                      <option value="Demand Letter">Quick Demand Letter</option>
                      <option value="Partner Auth">Partner Integrations</option>
                      <option value="Billing">Billing & Subscription</option>
                      <option value="Other">General Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Protocol Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm appearance-none">
                      <option value="Standard">Standard (24-48h)</option>
                      <option value="High">High (System Outage)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Diagnostic Log / Issue Description</label>
                  <textarea required name="issue" value={formData.issue} onChange={handleInputChange} rows="5" className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm resize-none"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={ticketState === 'submitting'}
                  className={`w-full py-4 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-sm shadow-lg ${ticketState === 'submitting' ? 'bg-[#004040]/50 cursor-not-allowed' : 'bg-[#004040] hover:bg-white hover:text-black shadow-[0_0_20px_rgba(0,64,64,0.4)]'}`}
                >
                  {ticketState === 'submitting' ? 'Transmitting Data...' : 'Submit Ticket'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Self-Serve FAQ Matrix (Sidebar Column) */}
        <aside className="lg:col-span-4 space-y-6">
          <h3 className="text-white font-black uppercase tracking-widest text-sm border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
            <SafeIcon icon={LuIcons.LuSearch} className="w-4 h-4 text-zinc-500" /> Self-Serve Matrix
          </h3>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-sm hover:border-[#004040]/30 transition-colors">
            <h4 className="text-white font-bold text-xs uppercase tracking-tight mb-2">Demand Letter Access</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Generated documents are instantly provided via secure PDF link and backed up to your registered email.</p>
          </div>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-sm hover:border-[#004040]/30 transition-colors">
            <h4 className="text-white font-bold text-xs uppercase tracking-tight mb-2">Partner Integrations</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">To initialize AI or automation systems, navigate to the specific Partner Hub and deploy the connection parameters.</p>
          </div>
        </aside>

      </section>
    </div>
  );
}
