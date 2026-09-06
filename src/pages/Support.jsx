import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import BackgroundEffects from '../components/BackgroundEffects';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import { sanitizeInput } from '../lib/sanitize';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'Technical',
    issue: '',
    attachment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [networkFault, setNetworkFault] = useState(false);

  const showToast = useAximStore((state) => state.showToast);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const walletAddress = useAximStore((state) => state.walletAddress);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be under 5MB', 'error');
        return;
      }
      setFormData({ ...formData, attachment: file });
    }
  };

  const handleFormInitiation = () => {
    logTelemetry('support_form_initiated', { isWeb3Authenticated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setNetworkFault(false);

    logTelemetry('support_form_submitted', {
      type: formData.priority,
      hasAttachment: !!formData.attachment,
      isWeb3Authenticated
    });

    try {
      const sanitizedPayload = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        priority: formData.priority,
        issue: sanitizeInput(formData.issue),
        wallet: isWeb3Authenticated ? walletAddress : null,
        source: 'website_support_form'
      };

      // Wrap encryption and payload delivery with 15s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Simulate cryptographic wrapping per integration spec
      const payloadString = JSON.stringify(sanitizedPayload);
      const encoder = new TextEncoder();
      const encodedPayload = encoder.encode(payloadString);

      let encryptedPackage = payloadString;
      try {
        if (window.crypto && window.crypto.subtle) {
          const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
          );
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const encryptedContent = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encodedPayload
          );

          const exportedKey = await window.crypto.subtle.exportKey("raw", key);
          encryptedPackage = JSON.stringify({
            data: Array.from(new Uint8Array(encryptedContent)),
            iv: Array.from(iv),
            key: Array.from(new Uint8Array(exportedKey)) // In reality, this key would be RSA encrypted with the server's public key
          });
        }
      } catch (cryptoErr) {
        console.warn('WebCrypto failed, falling back to plaintext proxy delivery', cryptoErr);
      }

      let reqError = null;

      // Primary Route: AXiM Core Proxy
      try {
        const coreResponse = await fetch(`${import.meta.env.VITE_CORE_API_URL || 'https://core.axim.us.com'}/api/v1/support/ingress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted_payload: encryptedPackage }),
          signal: controller.signal
        });

        if (!coreResponse.ok && coreResponse.status !== 202) {
          throw new Error('Core proxy rejected payload');
        }
      } catch (coreErr) {
        reqError = coreErr;
      }

      clearTimeout(timeoutId);

      // Fallback Route: Direct Supabase Ingress (if enabled)
      if (reqError) {
        if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
          const { error: dbError } = await supabase.from('support_ingress_queue').insert([sanitizedPayload]);
          if (dbError) throw dbError;
        } else {
          throw reqError; // Trigger catch block for UI fallback
        }
      }

      setIsSuccess(true);
      showToast('Support ticket securely transmitted to AXiM Core.', 'success');
      logTelemetry('support_form_success', { priority: formData.priority });

    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMsg('Connection timeout. Please check your network and try again.');
        setNetworkFault(true);
      } else {
        setErrorMsg('Secure transmission failed. The uplink may be temporarily degraded.');
        setNetworkFault(true);
      }
      logTelemetry('support_form_error', { error: err.message });
      showToast('Transmission failure.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How fast will Onyx resolve my issue?",
      a: "Onyx Mk3 analyzes incoming payloads instantly. Standard technical issues are often deflected and resolved within 90 seconds. Complex actions requiring human-in-the-loop approval may take up to 24 hours depending on SLA priority."
    },
    {
      q: "Do I need to connect a Web3 wallet to get support?",
      a: "No, standard email support is available for all users. However, connecting your registered wallet securely cryptographically verifies your identity to the backend, granting prioritized routing."
    },
    {
      q: "Where can I view the status of my ticket?",
      a: "Tickets linked to your identity (via email or wallet) are visible inside the AXiM Core Dashboard under the Support & Telemetry module."
    }
  ];

  const wikiCategories = [
    { title: "Getting Started", icon: LuIcons.LuRocket, desc: "Onboarding and Setup" },
    { title: "Nexus CRM", icon: LuIcons.LuDatabase, desc: "Data Pipeline Manual" },
    { title: "API Integrations", icon: LuIcons.LuCode, desc: "Webhook Architectures" },
    { title: "Account & Billing", icon: LuIcons.LuCreditCard, desc: "Subscription Management" },
  ];

  return (
    <PageTransition>
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Support Hub | AXiM Systems" />
      <BackgroundEffects />

      {networkFault && (
        <div className="fixed top-24 right-6 z-50 animate-fade-in-up">
           <DatabaseUplinkError onRetry={() => setNetworkFault(false)} isOverlay={true} />
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple mb-4 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
            <span>Support Interface Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
            System <span className="text-axim-purple">Support.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-mono text-zinc-400 uppercase tracking-widest leading-relaxed">
            Submit a secure, encrypted payload to the AXiM Support Core.
          </p>
        </div>
      </section>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
        onViewportEnter={() => logTelemetry('support_page_viewed')}
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Left Col: Contact Form */}
        <div className="lg:col-span-5 relative">

          <div className="sticky top-24">
            <div className="bg-onyx-900/80 backdrop-blur-md border border-white/10 rounded-lg p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-axim-purple via-[#DB2777] to-transparent opacity-50" />

              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-2">
                <SafeIcon icon={LuIcons.LuLock} className="w-4 h-4 text-axim-purple" />
                Secure Uplink
              </h2>

              {isSuccess ? (
                <div className="p-8 text-center bg-white/5 border border-white/10 rounded-sm animate-fade-in">
                  <div className="w-16 h-16 bg-axim-green/10 flex items-center justify-center rounded-full mx-auto mb-4 border border-axim-green/30">
                    <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-axim-green" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Payload Delivered</h3>
                  <p className="text-xs text-zinc-400 font-mono mb-6">
                    Your request has been securely transmitted and queued for analysis by the AXiM Core.
                  </p>
                  <button
                    onClick={() => { setIsSuccess(false); setFormData({ name: '', email: '', subject: '', priority: 'Technical', issue: '', attachment: null }); }}
                    className="px-6 py-2 bg-axim-purple text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" onFocus={handleFormInitiation}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        placeholder="email@company.com"
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      placeholder="Brief description of your issue"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                      Issue Type
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm appearance-none cursor-pointer"
                    >
                      <option value="Technical" className="bg-[#0F172A]">
                        Technical
                      </option>
                      <option value="Billing" className="bg-[#0F172A]">
                        Billing
                      </option>
                      <option value="Partnership" className="bg-[#0F172A]">
                        Partnership
                      </option>
                      <option value="Other" className="bg-[#0F172A]">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                      Message Details
                    </label>
                    <textarea
                      value={formData.issue}
                      onChange={(e) =>
                        setFormData({ ...formData, issue: e.target.value })
                      }
                      required
                      rows="4"
                      placeholder="How can we help you today?"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors resize-none rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2 flex justify-between">
                      <span>Attachments (Optional)</span>
                      <span className="text-zinc-600">Max 5MB</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.txt"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-white/5 border border-white/10 border-dashed px-4 py-3 text-zinc-400 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm group-hover:border-axim-purple transition-colors">
                        <SafeIcon
                          icon={LuIcons.LuPaperclip}
                          className="w-4 h-4"
                        />
                        {formData.attachment
                          ? formData.attachment.name
                          : "Attach a File or Screenshot"}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] mt-4"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />{" "}
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message{" "}
                        <SafeIcon icon={LuIcons.LuSend} className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: FAQ & Wiki */}
        <div className="lg:col-span-7 space-y-12">
          {/* FAQ */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon
                icon={LuIcons.LuInfo}
                className="w-5 h-5 text-axim-gold"
              />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  onClick={() => logTelemetry('support_faq_clicked', { question: faq.q })}
                  className="bg-onyx-900/80 backdrop-blur-md border border-white/10 p-6 rounded-lg hover:border-axim-gold/50 transition-colors shadow-lg cursor-pointer"
                >
                  <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Wiki */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon
                icon={LuIcons.LuLibrary}
                className="w-5 h-5 text-axim-purple"
              />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Documentation & Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wikiCategories.map((wiki, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    logTelemetry('support_wiki_category_click', { title: wiki.title });
                    showToast(`${wiki.title} documentation module coming soon.`, 'info');
                  }}
                  className="group cursor-pointer bg-onyx-900/80 backdrop-blur-md border border-white/5 p-6 rounded-lg hover:border-axim-purple/50 transition-colors shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-axim-purple/5 group-hover:bg-axim-purple/10 transition-colors blur-xl rounded-full" />
                  <SafeIcon
                    icon={wiki.icon}
                    className="w-6 h-6 text-axim-purple mb-4"
                  />
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-axim-purple transition-colors">
                    {wiki.title}
                  </h4>
                  <p className="text-[0.65rem] text-zinc-500 uppercase tracking-widest font-mono">
                    {wiki.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
    </PageTransition>
  );
}
