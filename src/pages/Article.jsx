import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPosts } from '../lib/wp-fetch';
import DOMPurify from 'isomorphic-dompurify';
import SEO from '../components/SEO';
import GlobalLoader from '../components/GlobalLoader';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import WPImage from '../components/WPImage';

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Parallel fetch: Get the main article + 4 recent articles (in case one is the current article)
        const [mainRes, recentRes] = await Promise.all([
          fetchPosts({ slug, _embed: 1 }),
          fetchPosts({ per_page: 4, _embed: 1 })
        ]);

        if (isMounted) {
          if (mainRes && mainRes.length > 0) {
            setArticle(mainRes[0]);
          }
          if (recentRes) {
            // Filter out current article and keep only 3
            setRecentArticles(recentRes.filter(p => p.slug !== slug).slice(0, 3));
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch article data:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    loadContent();
    return () => { isMounted = false; };
  }, [slug]);

  if (isLoading) return <GlobalLoader />;
  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-void text-white font-mono">
      <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-6 h-6 text-axim-purple mr-3" />
      Article not found.
    </div>
  );

  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
  const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Quick Links Data for Sidebar
  const sidebarTools = [
    { title: "Mutual NDA Generator", link: "/tools/nda", icon: LuIcons.LuShieldCheck, color: "text-axim-purple" },
    { title: "Autonomous Pay Stub", link: "/tools/paystub", icon: LuIcons.LuFileText, color: "text-[#DB2777]" }
  ];
  const sidebarPartners = [
    { title: "Make.com Automation", link: "/partners/make", icon: LuIcons.LuCpu, color: "text-[#DB2777]" },
    { title: "Powur Solar Grid", link: "/partners/powur-solar", icon: LuIcons.LuSun, color: "text-axim-gold" }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title={`${article.title?.rendered || 'Article'} | AXiM Systems`}
        description={article.excerpt?.rendered?.replace(/<[^>]+>/g, '') || "AXiM Systems Intelligence Briefing"}
      />

      {/* Hero Header with Multi-Color Overlay */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-end pb-16 border-b border-white/10">
        <WPImage src={imageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover grayscale-[30%]" />

        {/* Vibrant Multi-Color Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/60 via-[#DB2777]/40 to-axim-gold/30 mix-blend-overlay z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/80 to-transparent z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full">
          <Link to="/articles" className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-6 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight max-w-4xl" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered)}} />
        </div>
      </section>

      {/* Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Article Body */}
        <article className="lg:col-span-8 prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-axim-purple hover:prose-a:text-white prose-a:transition-colors prose-img:rounded-sm prose-img:border prose-img:border-white/10">
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.content?.rendered)}} />
        </article>

        {/* Dynamic Sidebar */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Metadata Block */}
          <div className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <SafeIcon icon={LuIcons.LuUser} className="w-5 h-5 text-axim-purple" />
              </div>
              <div>
                <div className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Operator</div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">{authorName}</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zinc-400">
              <span>Logged:</span>
              <span className="text-white">{formattedDate}</span>
            </div>
          </div>

          {/* Featured App Promo (Demand Letter) */}
          <div className="bg-[#050505] border border-axim-gold/30 p-8 rounded-sm shadow-[0_0_30px_rgba(255,234,0,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/10 blur-[40px] pointer-events-none group-hover:bg-axim-gold/20 transition-colors" />
            <SafeIcon icon={LuIcons.LuScale} className="w-8 h-8 text-axim-gold mb-4 relative z-10" />
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2 relative z-10">Quick Demand Letter</h3>
            <p className="text-[0.7rem] text-zinc-400 mb-6 leading-relaxed relative z-10 font-mono uppercase tracking-widest">Generate a structurally optimized, formal demand letter in seconds using our autonomous AI. No retainer required.</p>
            <a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer" className="relative z-10 w-full inline-flex justify-center items-center px-4 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-[0.65rem] hover:bg-white transition-colors rounded-sm shadow-lg">
               Generate For $4.00 <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
            </a>
          </div>

          {/* Ecosystem Tools */}
          <div className="bg-black border border-white/10 p-6 rounded-sm shadow-xl">
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuWrench} className="w-4 h-4 text-zinc-500" /> Ecosystem Tools
             </h4>
             <div className="space-y-3">
               {sidebarTools.map((tool, idx) => (
                 <Link key={idx} to={tool.link} className="flex items-center gap-3 p-3 bg-[#0F172A] border border-white/5 hover:border-axim-purple/50 transition-colors rounded-sm group">
                   <SafeIcon icon={tool.icon} className={`w-4 h-4 ${tool.color}`} />
                   <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">{tool.title}</span>
                 </Link>
               ))}
             </div>
          </div>

          {/* Partner Network */}
          <div className="bg-black border border-white/10 p-6 rounded-sm shadow-xl">
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuNetwork} className="w-4 h-4 text-zinc-500" /> Partner Network
             </h4>
             <div className="space-y-3">
               {sidebarPartners.map((partner, idx) => (
                 <Link key={idx} to={partner.link} className="flex items-center gap-3 p-3 bg-[#0F172A] border border-white/5 hover:border-axim-gold/50 transition-colors rounded-sm group">
                   <SafeIcon icon={partner.icon} className={`w-4 h-4 ${partner.color}`} />
                   <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">{partner.title}</span>
                 </Link>
               ))}
             </div>
          </div>

          {/* Recent Articles */}
          {recentArticles.length > 0 && (
            <div className="bg-black border border-white/10 p-6 rounded-sm shadow-xl">
               <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuBookOpen} className="w-4 h-4 text-zinc-500" /> Recent Reads
               </h4>
               <div className="space-y-4">
                 {recentArticles.map(article => {
                   const thumb = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
                   return (
                     <Link key={article.id} to={`/article/${article.slug}`} className="flex gap-4 group items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                       <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden border border-white/10 relative">
                         <WPImage src={thumb} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-axim-purple/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                       </div>
                       <h5 className="text-xs font-bold text-zinc-300 group-hover:text-axim-purple transition-colors leading-snug line-clamp-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered)}} />
                     </Link>
                   )
                 })}
               </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
