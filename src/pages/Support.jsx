import React, { useState } from "react";
import { sanitizeInput } from "../lib/sanitize";
import { encryptPayload } from "../lib/crypto";
import DatabaseUplinkError from "../common/DatabaseUplinkError";

import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import SafeIcon from "../common/SafeIcon";
import * as LuIcons from "react-icons/lu";
import { logTelemetry } from "../lib/telemetry";
import { useAximStore } from "../store/useAximStore";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    issue: "",
    priority: "Technical",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [networkFault, setNetworkFault] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Attachment exceeds 5MB file limit.");
        return;
      }
      setErrorMsg(null);
      setFormData({ ...formData, attachment: file });
    }
  };

  const { showToast } = useAximStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const sanitizedSubject = sanitizeInput(formData.subject);
      const sanitizedDescription = sanitizeInput(formData.issue);
      const sanitizedEmail = sanitizeInput(formData.email);
      const sanitizedName = sanitizeInput(formData.name);

      const payload = {
        subject: sanitizedSubject,
        description: sanitizedDescription,
        customer_email: sanitizedEmail,
        customer_name: sanitizedName,
        source: "website_support_form",
        tags: ["public_web"],
      };

      const encryptedPayload = await encryptPayload(
        payload,
        import.meta.env.VITE_AXIM_ONYX_SECRET || "fallback_secret",
      );

      const response = await fetch(import.meta.env.VITE_SUPPORT_WEBHOOK || "/v1/webhooks/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted_payload: encryptedPayload }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      logTelemetry("SUPPORT_TICKET_SUBMITTED", {
        subject: sanitizedSubject,
        priority: formData.priority,
      });
      showToast("Support ticket securely routed to AXiM Triage", "success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        issue: "",
        priority: "Technical",
        attachment: null,
      });
    } catch (err) {
      console.error("Support Submission Failed:", err);
      setNetworkFault(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How do I access my generated documents?",
      a: "Navigate to your Profile Dashboard. All parsed legal and financial documents are securely encrypted and available there for download.",
    },
    {
      q: "Are the generated documents legally binding?",
      a: "AXiM generators provide structural efficiency and standardized formatting. However, we always recommend consulting independent legal counsel to guarantee jurisdictional compliance.",
    },
    {
      q: "How do I request a custom integration?",
      a: "Enterprise scaling requires a dedicated strategy session. Submit a request via our Consultation page to speak directly with an architect.",
    },
  ];

  const wikiCategories = [
    {
      title: "User Guides",
      icon: LuIcons.LuBookOpen,
      desc: "Step-by-step tutorials for navigating the AXiM Hub.",
    },
    {
      title: "API Documentation",
      icon: LuIcons.LuCode,
      desc: "Endpoints and integration guides for developers.",
    },
    {
      title: "Billing & Subscriptions",
      icon: LuIcons.LuCreditCard,
      desc: "Manage your account settings and invoices.",
    },
    {
      title: "Security & Privacy",
      icon: LuIcons.LuShieldCheck,
      desc: "Overview of our encryption and data handling protocols.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Decentralized Customer Support | AXiM Systems"
        description="Get help with your AXiM tools, manage tickets, and access documentation."
        customSchema={[faqSchema]}
      />

      {networkFault && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
        </div>
      )}

      {networkFault && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
        </div>
      )}

      <section className="pt-32 pb-16 relative overflow-hidden border-b border-white/10 bg-black w-full flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center w-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-axim-purple/10 border border-axim-purple/30 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
            <SafeIcon
              icon={LuIcons.LuLifeBuoy}
              className="w-8 h-8 text-axim-purple"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4 w-full flex flex-col items-center justify-center text-center">
            Help <span className="text-axim-purple">Center.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Submit a support ticket, browse frequently asked questions, or
            access our comprehensive documentation library.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Support Form */}
        <div className="lg:col-span-5">
          <div className="bg-black border border-white/10 p-8 rounded-sm shadow-xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-2">
                <SafeIcon
                  icon={LuIcons.LuMail}
                  className="w-5 h-5 text-axim-purple"
                />{" "}
                Contact Support
              </h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Fill out the form below. Please include screenshots or files if
                it helps explain your request.
              </p>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest flex items-start gap-2 rounded-sm">
                  <SafeIcon
                    icon={LuIcons.LuTriangleAlert}
                    className="w-4 h-4 shrink-0"
                  />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm shadow-lg mt-4"
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
                  className="bg-black border border-white/10 p-6 rounded-sm hover:border-axim-gold/50 transition-colors shadow-lg"
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
                  className="group cursor-pointer bg-[#0F172A] border border-white/5 p-6 rounded-sm hover:border-axim-purple/50 transition-colors shadow-lg relative overflow-hidden"
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
      </div>
    </div>
  );
}
