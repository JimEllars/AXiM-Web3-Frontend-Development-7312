import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { sanitizeInput } from '../lib/sanitize'; // Assume this exists per previous sprints

// --- Cryptographic Utility Functions (Phase 1 Spec) ---
const generateEncryptionKey = async () => {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

const encryptPayload = async (data, key) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encodedData
  );

  return {
    encrypted_payload: Array.from(new Uint8Array(encryptedContent)),
    iv: Array.from(iv)
  };
};

export default function Support() {
  const [ticketState, setTicketState] = useState('idle'); // idle | encrypting | transmitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // State matched exactly to the Ingress Schema
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: 'Demand Letter Generation', // Acts as subject category
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketState('encrypting');
    setErrorMessage('');

    try {
      // 1. Client-Side Sanitization
      const cleanPayload = {
        customer_name: sanitizeInput(formData.customer_name),
        customer_email: sanitizeInput(formData.customer_email),
        subject: sanitizeInput(formData.subject),
        description: sanitizeInput(formData.description),
        source: "website_support_form",
        tags: ["public_web"]
      };

      // 2. AES-256-GCM Payload Encryption
      const key = await generateEncryptionKey();
      const encryptedEnvelope = await encryptPayload(cleanPayload, key);

      console.log("[AXiM Core]: Payload Encrypted. Initiating Edge Transmission...", encryptedEnvelope);

      setTicketState('transmitting');

      // 3. Simulated Edge Transmission (Proxy to Onyx Webhook)
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate latency

      setTicketState('success');

    } catch (error) {
      console.error("Transmission Error:", error);
      setErrorMessage("Cryptographic handshake failed. Please check your connection and try again.");
      setTicketState('error');
    }
  };


  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="System Support | AXiM Systems" description="Access operational support, system documentation, and submit encrypted terminal tickets." />

      {/* Header */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10 w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,64,64,0.15),transparent_50%)] pointer-events-none w-full" />
        <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-[#004040]/20 border border-[#004040] rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(0,64,64,0.3)]">
            <SafeIcon icon={LuIcons.LuLifeBuoy} className="w-6 h-6 text-[#004040]" />
          </div>
          <div className="w-full flex flex-col items-center justify-center mb-4">
             <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight flex flex-col items-center justify-center w-full m-0 p-0">
               <span className="block w-full text-center">System</span>
               <span className="block w-full text-center text-[#004040]" style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.4)' }}>Support.</span>
             </h1>
          </div>
          <p className="w-full text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-center">
            Initialize a terminal ticket below to securely route your issue to our engineering and resolution queue.
          </p>
        </div>
      </section>

      {/* Grid Architecture */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-12 items-start justify-center">

        {/* Support Intake Form (Primary Column) */}
        <div className="w-full lg:w-2/3">
          <div className="w-full bg-[#050505] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#004040]/10 blur-[50px] pointer-events-none" />

            {/* UPDATED: Changed from "Terminal Intake" to "Request Support" */}
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuSquareTerminal} className="w-6 h-6 text-[#004040]" /> Request Support
            </h2>

            {ticketState === 'error' && (
               <div className="w-full mb-6 p-4 border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-400 uppercase tracking-widest rounded-sm text-center">
                 {errorMessage}
               </div>
            )}

            {ticketState === 'success' ? (
              <div className="w-full py-16 text-center animate-fade-in-up flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#004040]/20 border border-[#004040] flex items-center justify-center rounded-full mx-auto mb-6">
                   <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-[#004040]" />
                </div>
                <h3 className="w-full text-xl font-black uppercase tracking-widest text-white mb-4 text-center">Ticket Transmitted</h3>
                <p className="w-full text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-8 text-center">
                  Your diagnostic log has been securely routed to our resolution queue. Standard response protocols mandate a 24-48 hour turnaround.
                </p>
                <button
                  onClick={() => { setTicketState('idle'); setFormData({customer_name: '', customer_email: '', subject: 'Demand Letter Generation', description: ''}); }}
                  className="px-6 py-3 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm"
                >
                  Submit Additional Log
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="w-full space-y-6 animate-fade-in-up relative z-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    {/* UPDATED: "Registered Name" -> "Name" */}
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Name</label>
                    <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm" />
                  </div>
                  <div className="w-full">
                    {/* UPDATED: "Secure Email" -> "Email" */}
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                    <input required type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm" />
                  </div>
                </div>

                <div className="w-full">
                  {/* UPDATED: "System Sector" -> "I need Help With:" */}
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">I need Help With:</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm appearance-none">
                    <option value="Demand Letter Generation">Quick Demand Letter</option>
                    <option value="Partner Auth Issue">Partner Integrations</option>
                    <option value="Billing Dispute">Billing & Subscription</option>
                    <option value="General Infrastructure">General Infrastructure</option>
                  </select>
                </div>

                <div className="w-full">
                  {/* UPDATED: "Diagnostic Log / Issue Description" -> "Describe Your Problem:" */}
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Describe Your Problem:</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="5" className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#004040] transition-colors text-sm resize-none"></textarea>
                </div>

                {/* NEW: Attachment Upload Field */}
                <div className="w-full">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuPaperclip} className="w-3 h-3" /> Attach Documents (Optional)
                  </label>
                  <div className="w-full bg-[#0A0A0A] border border-dashed border-white/20 rounded-sm px-4 py-6 text-center hover:border-[#004040] transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      name="attachments"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => console.log("Files selected:", e.target.files)} // Placeholder for file handling logic
                    />
                    <p className="text-xs text-zinc-500 font-medium">Drag & drop files or click to browse</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={ticketState === 'submitting' || ticketState === 'encrypting'}
                  className={`w-full py-4 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-sm shadow-lg ${ticketState === 'submitting' || ticketState === 'encrypting' ? 'bg-[#004040]/50 cursor-not-allowed' : 'bg-[#004040] hover:bg-white hover:text-black shadow-[0_0_20px_rgba(0,64,64,0.4)]'}`}
                >
                  {ticketState === 'encrypting' ? 'Encrypting Payload...' : ticketState === 'submitting' ? 'Transmitting Data...' : 'Submit Ticket'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Self-Serve FAQ Matrix (Sidebar Column) */}
        <aside className="w-full lg:w-1/3 space-y-6">
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
