import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../../common/SafeIcon';
import SEO from '../../components/SEO';
import { useAximStore } from '../../store/useAximStore';
import { generateWorkerLaunchUrl } from '../../lib/auth-handoff';

const { LuShieldCheck, LuZap, LuFileText, LuArrowRight } = LuIcons;

export default function NdaGeneratorLanding() {
  const userSession = useAximStore((state) => state.userSession);
  const launchUrl = generateWorkerLaunchUrl('https://nda.axim.us.com/', userSession);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "NDA Generator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "description": "Enterprise Non-Disclosure Agreements generated in seconds. Legally compliant and heavily tailored for B2B ops.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "124"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is this legally binding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Our standard NDA templates have been drafted alongside legal professionals and are legally binding across standard jurisdictions."
            }
          },
          {
            "@type": "Question",
            "name": "How is my data secured?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your session is securely handed off to our processing engine via token exchange. All inputs are temporarily processed in memory and immediately discarded upon document generation."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize the clauses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The generator handles standard parameters out of the box. For customized clauses or specific state-level tailoring, you will need to amend the final PDF output or engage full enterprise consultation."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      <SEO
        title="Enterprise NDA Generator | AXiM Hub"
        description="Generate standard Non-Disclosure Agreements for B2B ops instantly."
        url="https://axim.us.com/tools/nda"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <SafeIcon icon={LuShieldCheck} className="text-axim-purple w-4 h-4" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Enterprise Tool</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
        >
          Enterprise Non-Disclosure Agreements <span className="text-axim-purple">in Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-2xl mb-12"
        >
          Deploy legally robust, standard Non-Disclosure Agreements for your B2B operations without the overhead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <a
            href={launchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-axim-purple text-black font-black uppercase tracking-widest hover:bg-axim-purple/90 transition-colors rounded-sm shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          >
            Launch Application <SafeIcon icon={LuArrowRight} className="w-5 h-5" />
          </a>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-[1200px] px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">How it Works</h2>
          <p className="text-zinc-400">Streamlined deployment. Zero friction.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-axim-purple/30 -z-10 -translate-y-1/2"></div>

          {[
            { step: '01', title: 'Input Parameters', desc: 'Provide entity names, effective dates, and jurisdiction via a secure form.' },
            { step: '02', title: 'AI Processing', desc: 'Our engine extracts and maps variables to the standard legal framework.' },
            { step: '03', title: 'Secure Output', desc: 'Instantly download your finalized, ready-to-sign PDF document.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 w-full bg-bg-void/80 backdrop-blur-xl border border-white/10 p-6 rounded-sm text-center shadow-[0_0_15px_rgba(45,212,191,0.05)] relative"
            >
              <div className="w-12 h-12 mx-auto bg-axim-purple/10 border border-axim-purple/30 rounded-full flex items-center justify-center text-axim-purple font-mono font-bold mb-4">
                {item.step}
              </div>
              <h4 className="text-lg font-bold text-white uppercase mb-2">{item.title}</h4>
              <p className="text-sm text-zinc-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-[800px] px-6 pb-32 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Is this legally binding?', a: 'Yes. Our standard NDA templates have been drafted alongside legal professionals and are legally binding across standard jurisdictions.' },
            { q: 'How is my data secured?', a: 'Your session is securely handed off to our processing engine via token exchange. All inputs are temporarily processed in memory and immediately discarded upon document generation.' },
            { q: 'Can I customize the clauses?', a: 'The generator handles standard parameters out of the box. For customized clauses or specific state-level tailoring, you will need to amend the final PDF output or engage full enterprise consultation.' }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-sm"
            >
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                 <SafeIcon icon={LuShieldCheck} className="text-axim-purple w-4 h-4" />
                 {faq.q}
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed ml-6">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-[1200px] px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-purple/50 transition-colors"
          >
            <SafeIcon icon={LuZap} className="text-axim-purple w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-zinc-400">Generate complex legal documents in a fraction of the time. Input your parameters and receive a ready-to-sign PDF.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-purple/50 transition-colors"
          >
            <SafeIcon icon={LuFileText} className="text-axim-purple w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">AI Extraction</h3>
            <p className="text-zinc-400">Intelligent parsing ensures all necessary clauses and entity information are correctly populated without manual review.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-purple/50 transition-colors"
          >
            <SafeIcon icon={LuShieldCheck} className="text-axim-purple w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Legal Compliance</h3>
            <p className="text-zinc-400">Drafted alongside legal professionals to ensure your intellectual property is protected across standard jurisdictions.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
