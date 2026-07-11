import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../lib/wp-fetch';
import DOMPurify from 'isomorphic-dompurify';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import SEO from '../components/SEO';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import WPImage from '../components/WPImage';
import NewsFeed from '../components/NewsFeed';
import SystemBreadcrumb from '../components/SystemBreadcrumb'; // Adding this as user included it in their import list, though it may not be used or used in existing UI. Wait, let me check if it's used in the bottom part.

export default function Article() {
  const navigate = useNavigate();
  const addToast = useAximStore(state => state.addToast);
  const recordReadSession = useAximStore(state => state.recordReadSession);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title?.rendered?.replace(/<[^>]+>/g, '') || 'AXiM Systems',
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          addToast('Link Copied', 'success');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      addToast('Link Copied', 'success');
    }
  };

const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoggedCompletion, setHasLoggedCompletion] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.85 && !hasLoggedCompletion) {
      setHasLoggedCompletion(true);
      logTelemetry('article_completed', { slug });
      if (article) {
        const rawContent = article?.content?.rendered || article?.content || "";
        const cleanContent = rawContent.replace(/<[^>]+>/g, '');
        const readTime = Math.max(1, Math.ceil((cleanContent.split(' ').length || 0) / 200));
        recordReadSession(readTime);
      }
    }
  });

  useEffect(() => {
    let isMounted = true;
    async function loadArticle() {
      setIsLoading(true);
      try {
        const [mainRes, recentRes] = await Promise.all([
          fetchPosts({ slug, _embed: 1 }),
          fetchPosts({ per_page: 4, _embed: 1 })
        ]);

        if (isMounted) {
          if (mainRes && mainRes.length > 0) {
            setArticle(mainRes[0]);
          } else {
            setError("Article not found.");
          }
          if (recentRes) {
            setRecentArticles(recentRes.filter(p => p.slug !== slug).slice(0, 3));
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadArticle();
    return () => { isMounted = false; };
  }, [slug]);

  // FORCE DOM TITLE SYNC: Ensures the browser tab dynamically updates to the specific article title
  useEffect(() => {
    if (article && article.title?.rendered) {
      // Strip WordPress HTML entities natively
      const cleanTitle = article.title.rendered.replace(/<[^>]+>/g, '');
      document.title = `${cleanTitle} | AXiM Systems`;
    }
  }, [article]);

  // 1. STRICT SHIELD: Handle Error State FIRST
  if (error) {
    return (
      <div className="min-h-screen bg-bg-void pt-32 px-6 flex justify-center items-start">
        <div className="bg-[#050505] border border-red-500/20 p-8 rounded-sm max-w-lg w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">System Malfunction</h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">{error}</p>
          <Link to="/articles" className="inline-block mt-6 px-6 py-2 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  // 2. STRICT SHIELD: Handle Loading/Null State SECOND
  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-bg-void pt-32 px-6 flex justify-center items-start">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#004040]/30 border-t-[#004040] rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Decrypting Protocol...</p>
        </div>
      </div>
    );
  }

  // 3. SAFE EXECUTION: The component will ONLY reach this point if `article` is a fully loaded object.
  // It is now safe to declare variables that rely on the article object.
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
  const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Clean titles and excerpts for schema and meta tags
  const cleanTitle = article.title?.rendered?.replace(/<[^>]+>/g, '') || 'Intelligence Briefing';
  const cleanExcerpt = article.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 'AXiM Systems Intelligence Briefing';

  // Construct AIO/SEO Rich Snippet Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": cleanTitle,
    "image": [imageUrl],
    "datePublished": article.date,
    "dateModified": article.modified || article.date,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://axim.us.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    },
    "description": cleanExcerpt
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-axim-purple z-[100] shadow-[0_0_15px_rgba(147,51,234,0.6)] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <SEO
        title={`${cleanTitle} | AXiM Systems`}
        description={cleanExcerpt}
        image={imageUrl}
        type="article"
        url={window.location.href}
        customSchema={[articleSchema]}
        publishedTime={new Date(article.date).toISOString()}
      />

      {/* Hero Header with Multi-Color Overlay */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-end pb-16 border-b border-white/10">
        <WPImage post={article} src={imageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover grayscale-[30%]" />

        {/* Vibrant Multi-Color Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/70 via-[#DB2777]/50 to-axim-gold/40 mix-blend-overlay z-0" />
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
        <article className="lg:col-span-8">
              {/* WordPress Core Content Render (Restored Typography) */}
              <div
                className="prose prose-invert prose-axim max-w-3xl mx-auto prose-a:text-axim-purple prose-headings:font-black prose-img:rounded-md"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content?.rendered || '') }}
              />
        </article>

        {/* Dynamic High-Converting Sidebar */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Metadata Block */}
          <div className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
              <div className="w-12 h-12 bg-gradient-to-br from-axim-purple to-[#DB2777] rounded flex items-center justify-center shadow-[0_0_15px_rgba(219,39,119,0.3)]">
                <SafeIcon icon={LuIcons.LuUser} className="w-5 h-5 text-white" />
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

          {/* Primary Conversion Funnel - Demand Letter Promo */}
           <div className="bg-gradient-to-br from-[#050505] to-[#0A0A0A] border border-axim-purple/30 p-8 rounded-sm shadow-[0_10px_30px_rgba(147,51,234,0.1)] relative overflow-hidden group hover:border-axim-purple/60 transition-colors">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-axim-purple/10 blur-[30px] pointer-events-none group-hover:bg-axim-purple/20 transition-all duration-500" />
             <div className="flex items-center gap-3 mb-4 relative z-10">
               <div className="w-8 h-8 bg-axim-purple/20 border border-axim-purple flex items-center justify-center rounded-sm">
                  <SafeIcon icon={LuIcons.LuScale} className="w-4 h-4 text-axim-purple" />
               </div>
               <h3 className="text-white font-black uppercase tracking-widest text-sm">Protect Your Revenue</h3>
             </div>
             <p className="text-xs text-zinc-300 leading-relaxed mb-6 font-medium relative z-10">
               Dealing with unpaid invoices, scope creep, or breach of contract? Skip the slow, expensive legal retainers. Generate a professionally formatted demand letter in minutes to command attention and resolve friction.
             </p>
             <a
               href="https://quickdemandletter.com/start"
               target="_blank"
               rel="noopener noreferrer"
               className="relative z-10 flex items-center justify-center w-full py-4 px-4 bg-axim-purple text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-widest transition-all rounded-sm shadow-lg"
             >
               Start Demand Letter <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-4 h-4" />
             </a>
           </div>

          {/* Ecosystem Tools */}
          <div className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl">
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuWrench} className="w-4 h-4 text-zinc-500" /> Ecosystem Tools
             </h4>
             <div className="space-y-4">
               <Link to="/tools/nda" className="flex items-center gap-4 p-4 bg-[#0F172A] border border-white/5 hover:border-axim-purple/50 transition-colors rounded-sm group shadow-md">
                 <div className="w-8 h-8 rounded bg-gradient-to-br from-axim-purple to-[#DB2777] flex items-center justify-center shrink-0">
                    <SafeIcon icon={LuIcons.LuShieldCheck} className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Mutual NDA</span>
               </Link>
               <Link to="/tools/paystub" className="flex items-center gap-4 p-4 bg-[#0F172A] border border-white/5 hover:border-axim-purple/50 transition-colors rounded-sm group shadow-md">
                 <div className="w-8 h-8 rounded bg-gradient-to-br from-[#DB2777] to-red-600 flex items-center justify-center shrink-0">
                    <SafeIcon icon={LuIcons.LuFileText} className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Auto Pay Stub</span>
               </Link>
             </div>
          </div>

          {/* Partner Network */}
          <div className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl">
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuNetwork} className="w-4 h-4 text-zinc-500" /> Partner Network
             </h4>
             <div className="space-y-4">
               <Link to="/partners/make" className="flex items-center gap-4 p-4 bg-[#0F172A] border border-white/5 hover:border-axim-purple/50 transition-colors rounded-sm group shadow-md">
                 <div className="w-8 h-8 rounded bg-gradient-to-br from-axim-purple to-indigo-600 flex items-center justify-center shrink-0">
                    <SafeIcon icon={LuIcons.LuCpu} className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Make.com</span>
               </Link>
               <Link to="/partners/powur-solar" className="flex items-center gap-4 p-4 bg-[#0F172A] border border-white/5 hover:border-axim-gold/50 transition-colors rounded-sm group shadow-md">
                 <div className="w-8 h-8 rounded bg-gradient-to-br from-axim-gold to-yellow-600 flex items-center justify-center shrink-0">
                    <SafeIcon icon={LuIcons.LuSun} className="w-4 h-4 text-black" />
                 </div>
                 <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Powur Solar</span>
               </Link>
             </div>
          </div>

          {/* Recent Articles */}
          {recentArticles.length > 0 && (
            <div className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl">
               <h4 className="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuBookOpen} className="w-4 h-4 text-zinc-500" /> Recent Reads
               </h4>
               <div className="space-y-5">
                 {recentArticles.map(post => {
                   const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
                   return (
                     <Link key={post.id} to={`/article/${post.slug}`} className="flex gap-4 group items-center border-b border-white/5 pb-5 last:border-0 last:pb-0">
                       <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden border border-white/10 relative">
                         <WPImage post={post} src={thumb} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-axim-purple/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                       </div>
                       <h5 className="text-xs font-bold text-zinc-300 group-hover:text-axim-purple transition-colors leading-snug line-clamp-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.title?.rendered)}} />
                     </Link>
                   )
                 })}
               </div>
            </div>
          )}

        </aside>
      </div>

      {/* End of Page Firehose */}
      <div className="mt-20 bg-black border-t border-white/10 pt-16 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
         <NewsFeed limit={3} title="Continue Reading" hidePagination={true} />
      </div>

      {/* Sticky Action Pill */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 rounded-full bg-onyx-900/80 border border-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
      >
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          title="Back to Articles"
        >
          <SafeIcon icon={LuIcons.LuArrowLeft} className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-white/10" />
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          title="Share Article"
        >
          <SafeIcon icon={LuIcons.LuShare2} className="w-5 h-5" />
        </button>
      </motion.div>

    </div>
  );
}
