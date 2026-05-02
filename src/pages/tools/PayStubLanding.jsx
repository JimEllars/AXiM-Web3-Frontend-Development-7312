import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../../common/SafeIcon';
import SEO from '../../components/SEO';
import { useAximStore } from '../../store/useAximStore';
import { generateWorkerLaunchUrl } from '../../lib/auth-handoff';

const { LuDatabase, LuZap, LuFileText, LuShieldCheck, LuArrowRight } = LuIcons;

export default function PayStubLanding() {
  const userSession = useAximStore((state) => state.userSession);
  const launchUrl = generateWorkerLaunchUrl('https://paystub.axim.us.com', userSession);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Pay Stub Generator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "4.00",
          "priceCurrency": "USD"
        },
        "description": "Verifiable Pay Stub Generation Tool for independent contractors and small businesses.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "87"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are these verification-ready?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The generated stubs use standard accounting formats and verifiable calculations accepted by most institutions."
            }
          },
          {
            "@type": "Question",
            "name": "Do you store employee data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Data is processed ephemerally during document generation. We do not persist PII or financial data after the PDF is created."
            }
          },
          {
            "@type": "Question",
            "name": "Can I bulk generate stubs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Currently, the standard tool supports single document generation. For bulk processing, you must utilize the Enterprise API access."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      <SEO
        title="Verifiable Pay Stub Generator | AXiM Hub"
        description="Generate professional, verifiable pay stubs instantly for just $4.00."
        url="https://axim.us.com/tools/paystub"
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
          <SafeIcon icon={LuDatabase} className="text-axim-purple w-4 h-4" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Financial Tool</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
        >
          Verifiable Pay Stubs <span className="text-axim-purple">in Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-2xl mb-12"
        >
          Generate accurate, professional pay stubs with automatic tax calculations and verifiable data structures.
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
          <p className="mt-4 text-sm text-zinc-500 font-mono tracking-widest">$4.00 Per Document</p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-[1200px] px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">How it Works</h2>
          <p className="text-zinc-400">Accurate calculations. Immediate delivery.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-axim-gold/30 -z-10 -translate-y-1/2"></div>

          {[
            { step: '01', title: 'Input Parameters', desc: 'Enter employee details, pay period, and gross earnings.' },
            { step: '02', title: 'AI Processing', desc: 'Engine computes standard federal, state, and local tax withholdings.' },
            { step: '03', title: 'Secure Output', desc: 'Download a clean, professional PDF suitable for financial verification.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 w-full bg-bg-void/80 backdrop-blur-xl border border-white/10 p-6 rounded-sm text-center shadow-[0_0_15px_rgba(255,234,0,0.05)] relative"
            >
              <div className="w-12 h-12 mx-auto bg-axim-gold/10 border border-axim-gold/30 rounded-full flex items-center justify-center text-axim-gold font-mono font-bold mb-4">
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
            { q: 'Are these verification-ready?', a: 'Yes. The generated stubs use standard accounting formats and verifiable calculations accepted by most institutions.' },
            { q: 'Do you store employee data?', a: 'No. Data is processed ephemerally during document generation. We do not persist PII or financial data after the PDF is created.' },
            { q: 'Can I bulk generate stubs?', a: 'Currently, the standard tool supports single document generation. For bulk processing, you must utilize the Enterprise API access.' }
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
                 <SafeIcon icon={LuShieldCheck} className="text-axim-gold w-4 h-4" />
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
            <h3 className="text-xl font-bold text-white mb-3">Instant Calculations</h3>
            <p className="text-zinc-400">Automatic computation of federal, state, and local taxes based on your inputs. No manual math required.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-purple/50 transition-colors"
          >
            <SafeIcon icon={LuFileText} className="text-axim-purple w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Professional Format</h3>
            <p className="text-zinc-400">Outputs clean, standardized PDF documents accepted by landlords, financial institutions, and agencies.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:border-axim-purple/50 transition-colors"
          >
            <SafeIcon icon={LuShieldCheck} className="text-axim-purple w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Secure Handoff</h3>
            <p className="text-zinc-400">Your session is securely handed off to our processing engine, ensuring your financial data remains private.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
