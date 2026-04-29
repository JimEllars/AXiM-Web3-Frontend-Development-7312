import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { generators } from '../data/companyOfferings';
import SEO from '../components/SEO';
import { useAximStore } from '../store/useAximStore';
import { Helmet } from 'react-helmet-async';
import { useAximAuth } from '../hooks/useAximAuth';
import { useState } from 'react';

const { LuGraduationCap, LuArrowRight, LuClock, LuTrendingUp, LuFileText, LuLock, LuUnlock } = LuIcons;

const courses = [
  {
    id: 'C_SALES101',
    title: 'Sales 101',
    desc: 'Foundational strategies for high-conversion B2B and B2C engagements. Master the basics of objection handling and closing.',
    level: 'Beginner',
    time: '4 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_MODERN',
    title: 'Sales Modernization',
    desc: 'Transitioning legacy sales pipelines into high-velocity digital frameworks. Learn to use automation, CRM synergy, and intent data.',
    level: 'Intermediate',
    time: '6 Hours',
    icon: LuGraduationCap
  },
  {
    id: 'C_PSYCH',
    title: 'Sales Psychology',
    desc: 'Deep dive into cognitive biases, buyer motivation, and emotional intelligence in negotiations and deal structuring.',
    level: 'Advanced',
    time: '8 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_AI',
    title: 'Leveraging AI for Sales',
    desc: 'Deploy bespoke AI models to pre-qualify leads, generate outreach copy, and automate follow-ups. Build your automated machine.',
    level: 'Advanced',
    time: '10 Hours',
    icon: LuGraduationCap
  }
];


export default function Tools() {
      const userSession = useAximStore((state) => state.userSession);
  const { profile } = useAximAuth();

  // Simulate premium access via profile clearance_level or a specific flag.
  // We'll treat clearance_level >= 2 as premium for the simulation,
  // or userSession.is_premium

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": generators.map((doc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": doc.title,
        "description": doc.desc,
        "applicationCategory": "BusinessApplication",
        "url": doc.externalUrl
      }
    }))
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Premium Legal & Financial Tools | AXiM Systems"
        description="Access AXiM's comprehensive suite of document generators and elite training courses."
       url="https://axim.us.com/tools"/>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="mb-20">
        <span className="section-label">Academy & Infrastructure</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Tools Showroom</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
          Access AXiM's comprehensive suite of document generators and elite training courses. Deploy robust legal frameworks and master modern business strategies.
        </p>
      </div>

      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-axim-gold border border-white/10">
            <SafeIcon icon={LuFileText} className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Product Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {generators.map((doc, idx) => {
            const isInternal = doc.externalUrl && doc.externalUrl.startsWith('/tools');

            // For internal tools, we don't apply auth handoff here, that happens on the landing page
            const destUrl = isInternal
              ? doc.externalUrl
              : doc.externalUrl && doc.externalUrl !== "#"
                ? `${doc.externalUrl}?source=axim_hub${userSession?.session_token ? `&auth_handoff=${userSession.session_token}` : ''}`
                : "#";

            const isLicensed = userSession?.clearance_level >= 2 || userSession?.is_premium;
            const statusLabel = isLicensed ? 'PRODUCING_BYPRODUCT' : 'UNIT_AVAILABLE';

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className={`group bg-white/5 backdrop-blur-xl saturate-150 border ${isLicensed ? 'border-axim-teal/50 shadow-[0_0_15px_rgba(45,212,191,0.2)] animate-pulse [animation-duration:3s]' : 'border-white/10'} hover:border-axim-teal hover:shadow-[0_0_15px_#2dd4bf] transition-all relative overflow-hidden flex flex-col h-full rounded-md`}
              >
                <div className="p-8 flex flex-col h-full cursor-pointer relative z-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

                  {/* Badges for specific generators */}
                  {(doc.id === 'G_DEMAND' || doc.id === 'G_NDA') && (
                    <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-axim-teal text-black text-[0.65rem] font-bold uppercase tracking-widest rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]">
                      {doc.id === 'G_DEMAND' ? 'Trending' : 'Popular'}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-axim-teal/10 flex items-center justify-center text-axim-teal border border-axim-teal/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
                      <SafeIcon icon={LuIcons[doc.iconName] || LuIcons.LuFileText} className="w-7 h-7" />
                    </div>
                  </div>



                  <h3 className="text-2xl font-black uppercase mb-2 relative z-10 group-hover:text-axim-teal transition-colors">{doc.title}</h3>
                  <div className="mb-4 relative z-10">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border ${isLicensed ? 'bg-axim-teal/10 text-axim-teal border-axim-teal/30 shadow-[0_0_8px_rgba(45,212,191,0.5)] animate-pulse' : 'bg-zinc-900 text-zinc-500 border-zinc-700'}`}>
                      {isLicensed && <SafeIcon icon={LuLock} className="w-3 h-3" />}
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 flex-grow">
                    {doc.desc}
                  </p>

                  {isInternal ? (
                    <Link
                      to={destUrl}
                      className={`w-full py-4 mt-auto border font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 relative z-10 group/btn ${isLicensed ? 'border-axim-teal text-axim-teal shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:bg-axim-teal hover:text-black hover:shadow-[0_0_25px_rgba(45,212,191,0.8)] hover:scale-[1.02]' : 'border-axim-gold/50 text-axim-gold hover:border-axim-gold hover:text-axim-gold hover:shadow-[0_0_10px_rgba(255,234,0,0.5)]'}`}
                    >
                      {isLicensed ? (
                        <>Launch Tool <SafeIcon icon={LuArrowRight} /></>
                      ) : (
                        <>Request Authorization <SafeIcon icon={LuLock} className="group-hover/btn:hidden w-4 h-4" /><SafeIcon icon={LuUnlock} className="hidden group-hover/btn:block w-4 h-4" /></>
                      )}
                    </Link>
                  ) : (
                    <a
                      href={destUrl}
                      target={destUrl !== "#" ? "_blank" : undefined}
                      rel={destUrl !== "#" ? "noopener noreferrer" : undefined}
                      className={`w-full py-4 mt-auto border font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 relative z-10 group/btn ${isLicensed ? 'border-axim-teal text-axim-teal shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:bg-axim-teal hover:text-black hover:shadow-[0_0_25px_rgba(45,212,191,0.8)] hover:scale-[1.02]' : 'border-axim-gold/50 text-axim-gold hover:border-axim-gold hover:text-axim-gold hover:shadow-[0_0_10px_rgba(255,234,0,0.5)]'}`}
                    >
                      {isLicensed ? (
                        <>Launch Tool <SafeIcon icon={LuArrowRight} /></>
                      ) : (
                        <>Request Authorization <SafeIcon icon={LuLock} className="group-hover/btn:hidden w-4 h-4" /><SafeIcon icon={LuUnlock} className="hidden group-hover/btn:block w-4 h-4" /></>
                      )}
                    </a>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-axim-gold border border-white/10">
            <SafeIcon icon={LuGraduationCap} className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Academy Frameworks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-white/5 backdrop-blur-xl saturate-150 border border-white/10 p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden flex flex-col h-full rounded-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-axim-gold">
                  <SafeIcon icon={course.icon} className="w-8 h-8" />
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400">
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1 text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest">
                    <SafeIcon icon={LuClock} className="w-3 h-3" /> {course.time}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-black uppercase mb-4 relative z-10 group-hover:text-axim-gold transition-colors">{course.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 flex-grow">
                {course.desc}
              </p>

              <a href="#" target="_blank" rel="noopener noreferrer" className="w-full py-4 mt-auto border border-axim-gold/30 text-axim-gold font-bold uppercase text-xs tracking-widest group-hover:bg-axim-gold group-hover:text-black group-hover:animate-pulse transition-all flex items-center justify-center gap-2 relative z-10">
                Enroll Protocol <SafeIcon icon={LuArrowRight} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Articles Widget */}
      <section className="py-16 relative z-10 border-t border-subtle mt-16 bg-white/5 backdrop-blur-xl saturate-150">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-axim-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-axim-teal border border-axim-teal/30">
            <SafeIcon icon={LuIcons.LuNewspaper} className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black uppercase mb-4 text-white">Read AXiM Articles</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
            Stay updated with comprehensive insights, updates, and research from the AXiM ecosystem.
          </p>
          <Link to="/articles" className="btn btn-outline inline-flex hover:border-axim-teal hover:text-axim-teal">
            Read Articles <SafeIcon icon={LuIcons.LuArrowRight} />
          </Link>
        </div>
      </section>

    </div>
  );
}
