import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PartnerPromo from '../components/PartnerPromo';
import SEO from '../components/SEO';
import { logTelemetry, logHighPriorityTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';
import Reviews from '../components/Reviews.jsx';
import NewsFeed from '../components/NewsFeed.jsx';
import CategoryArticleFeed from '../components/CategoryArticleFeed.jsx';


export default function Business() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const businessSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Enterprise Business Development",
      "description": "Scaling enterprise revenue and B2B systems. Access our suite of commercial services, intelligence articles, and dedicated apps & tools."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "B2B Legal Automation",
      "description": "Generate external legal documentation rapidly."
    }
  ];


  useEffect(() => {
    logTelemetry('category_hub_viewed', { category: 'business' });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AXiM Business Development Hub",
    "description": "Enterprise B2B commercial services, tools, and intelligence."
  };

  return (
    <div className="min-h-screen bg-bg-void text-white font-sans selection:bg-axim-gold/30">
      <SEO
        title="Business Development Hub | AXiM Development"
        description="Scaling enterprise revenue and B2B systems through intelligent applications and commercial services."
        schema={schema}
      />

      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-axim-gold/10 via-bg-void to-bg-void pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              AXiM Business<br />Development Engine
            </h1>
          {isWeb3Authenticated && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-axim-purple/10 border border-axim-purple/30 font-mono text-[10px] text-axim-purple uppercase tracking-widest rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [BUSINESS_NODE: SALES_ENGINE_VERIFIED]
            </div>
          )}

            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
              Scaling enterprise revenue and B2B systems. Access our suite of commercial services, intelligence articles, and dedicated apps & tools.
            </p>

            {isWeb3Authenticated && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-6 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [BUSINESS_NODE: ENTERPRISE_ROUTING_ACTIVE]
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">


          {/* B2B Intelligence & Articles Card */}
          <Link to="/articles" className="group relative bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden shadow-xl hover:bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuChartLine} className="w-8 h-8 text-axim-gold mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">B2B Intelligence</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">Strategic business news, enterprise analysis, and actionable scaling articles.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
              <span>Read Articles</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <PartnerPromo
          partnerName="Make.com"
          title="Automate B2B Workflows"
          description="Connect apps and build automated systems visually, designed specifically for growing business infrastructures."
          learnMorePath="/partners/make"
          startNowUrl="/partners/make"
          theme="purple"
          onClick={() => logTelemetry('partner_promo_viewed', { partner: 'Make.com', location: 'Business' })}
        />

        {/* Apps & Tools Section */}
        <div className="relative pt-8 mt-12 border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-bg-void">
            <span className="text-[10px] font-mono uppercase tracking-widest text-axim-gold border border-axim-gold/30 px-2 py-1 rounded-sm bg-axim-gold/5">
              Apps & Tools
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="group relative bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <SafeIcon icon={LuIcons.LuFileText} className="w-8 h-8 text-axim-gold mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">Quick Demand Letter</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Generate external legal documentation rapidly.</p>
              <a
                href="https://quickdemandletter.com/start?via=axim_hub"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logTelemetry('external_tool_intent', { tool: 'quick_demand_letter' })}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-axim-gold/30 bg-axim-gold/10 text-axim-gold hover:bg-axim-gold hover:text-black mt-auto"
              >
                Open Tool
                <SafeIcon icon={LuIcons.LuExternalLink} className="w-3 h-3 ml-2" />
              </a>
            </div>

            {/* Automated Canvassing Masterclass Card */}
            <div className="group relative bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <SafeIcon icon={LuIcons.LuMapPin} className="w-8 h-8 text-axim-gold mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">Automated Canvassing Masterclass</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Deploy ground game teams efficiently.</p>
              <Link
                to="/store"
                onClick={() => {
                  logTelemetry('store_category_intent', { module: 'canvassing_masterclass' });
                }}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-axim-gold/30 bg-axim-gold/10 text-axim-gold hover:bg-axim-gold hover:text-black mt-auto"
              >
                View Details
              </Link>
            </div>

          </div>
        </div>

        {/* Courses Section */}
        <div className="relative pt-8 mt-12 border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-bg-void">
            <span className="text-[10px] font-mono uppercase tracking-widest text-axim-gold border border-axim-gold/30 px-2 py-1 rounded-sm bg-axim-gold/5">
              Courses
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Sales Modernization Course Card */}
            <div className="group relative bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xl hover:bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <SafeIcon icon={LuIcons.LuTrendingUp} className="w-8 h-8 text-axim-gold mb-4" />
              <h2 className="text-lg font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">Sales Modernization Course</h2>
              <p className="text-sm text-zinc-400 mb-6 font-medium flex-grow">Learn advanced sales techniques.</p>
              <a
                href="https://etsy.com/shop/aximdevelopment"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logTelemetry('external_course_intent', { course: 'sales_modernization' })}
                className="w-full relative z-10 inline-flex items-center justify-center px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border border-axim-gold/30 bg-axim-gold/10 text-axim-gold hover:bg-axim-gold hover:text-black mt-auto"
              >
                View on Etsy
                <SafeIcon icon={LuIcons.LuExternalLink} className="w-3 h-3 ml-2" />
              </a>
            </div>

          </div>
        </div>

      </section>


      <section className="relative pt-12 pb-12 z-20">
        <NewsFeed title="Latest Business Intelligence" categorySlug="business-development" limit={3} />
      </section>


      <CategoryArticleFeed
        categorySlug="business-development"
        sectionTitle="Business Development Insights"
        sectionSubtitle="Executive playbooks, market expansion strategies, and capital allocation models."
        limit={3}
      />

      <section className="w-full bg-gradient-to-r from-[#050505] to-[#0A0A0A] border-t border-b border-white/10 py-16 text-center relative z-10">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Ready to deploy your Business infrastructure?</h2>
        <Link
          to="/consultation?pillar=business"
          onClick={() => logHighPriorityTelemetry('consultation_intent', { pillar: 'Business' })}
          className="inline-flex items-center gap-2 px-8 py-4 bg-axim-gold text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-sm shadow-[0_0_20px_rgba(255,189,20,0.3)]"
        >
          Schedule Consultation <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
        </Link>
      </section>
</div>
  );
}
