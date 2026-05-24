import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import GlobalLoader from '../components/GlobalLoader';
import SafeIcon from '../common/SafeIcon';
import NewsFeed from '../components/NewsFeed';
import * as LuIcons from 'react-icons/lu';

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadArticle = async () => {
      try {
        // Fetch specific article by slug
        const data = await fetchPosts({ slug, _embed: true });
        if (isMounted) {
          setArticle(data?.length ? data[0] : null);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };
    loadArticle();
    return () => { isMounted = false; };
  }, [slug]);

  if (isLoading) return <GlobalLoader />;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-void">
        <SafeIcon icon={LuIcons.LuSearchX} className="w-12 h-12 text-zinc-600 mb-4" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest">Article Not Found</h1>
        <Link to="/articles" className="mt-6 text-axim-purple font-mono text-sm hover:underline">Return to Articles</Link>
      </div>
    );
  }

  const featuredImageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
  const publishDate = new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // AEO/SEO Rich Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": DOMPurify.sanitize(article.title.rendered, { ALLOWED_TAGS: [] }),
    "image": [featuredImageUrl],
    "datePublished": new Date(article.date).toISOString(),
    "dateModified": new Date(article.modified).toISOString(),
    "author": [{"@type": "Organization", "name": "AXiM Systems", "url": "https://axim.us.com"}],
    "publisher": {"@type": "Organization", "name": "AXiM Systems", "logo": {"@type": "ImageObject", "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"}}
  };

  return (
    <div className="w-full relative z-10 bg-bg-void min-h-screen pb-32">
      <SEO
        title={`${DOMPurify.sanitize(article.title.rendered, { ALLOWED_TAGS: [] })} | AXiM Articles`}
        description={DOMPurify.sanitize(article.excerpt.rendered, { ALLOWED_TAGS: [] })}
        image={featuredImageUrl}
        type="article"
        customSchema={[articleSchema]}
      />

      {/* 1. Editorial Hero */}
      <section className="relative w-full h-[50vh] md:h-[70vh] bg-black border-b border-white/10 overflow-hidden flex flex-col justify-end">
        <img src={featuredImageUrl} alt="Featured Briefing" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-axim-purple/20 mix-blend-overlay z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/80 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pb-12">
          <Link to="/articles" className="inline-flex items-center gap-2 text-axim-purple hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Articles
          </Link>
          <div className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-4">
             <span>{publishDate}</span>
             <span className="w-1 h-1 bg-zinc-600 rounded-full" />
             <span className="text-axim-gold">Published Article</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-tight max-w-5xl" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title.rendered)}} />
        </div>
      </section>

      {/* 2. Content & Sidebar Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: The Article */}
          <article className="lg:col-span-8 prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-axim-purple hover:prose-a:text-axim-gold prose-a:transition-colors prose-img:rounded-md prose-img:border prose-img:border-white/10">
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.content.rendered, { ADD_ATTR: ['target'] })}} />
          </article>

          {/* Right Column: Sticky Sidebar Funnels */}
          <aside className="lg:col-span-4 relative hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-6 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {/* Featured App Promo */}
              <div className="bg-[#050505] border border-axim-gold/30 p-8 rounded-sm shadow-[0_0_30px_rgba(255,234,0,0.05)] relative overflow-hidden group mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/10 blur-[40px] pointer-events-none group-hover:bg-axim-gold/20 transition-colors" />
                <SafeIcon icon={LuIcons.LuScale} className="w-8 h-8 text-axim-gold mb-4 relative z-10" />
                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2 relative z-10">Quick Demand Letter</h3>
                <p className="text-[0.7rem] text-zinc-400 mb-6 leading-relaxed relative z-10 font-mono uppercase tracking-widest">Generate a structurally optimized, formal demand letter in seconds using our autonomous AI. No retainer required.</p>
                <a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer" className="relative z-10 w-full inline-flex justify-center items-center px-4 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-[0.65rem] hover:bg-white transition-colors rounded-sm shadow-lg">
                   Generate For $4.00 <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
                </a>
              </div>

              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
                <SafeIcon icon={LuIcons.LuNetwork} className="w-3 h-3" /> Partner Network
              </div>

              {/* Sidebar Promo: Make.com */}
              <div className="bg-[#0F172A] border border-[#9333EA]/30 rounded-xl p-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#9333EA]/10 blur-[50px] pointer-events-none group-hover:bg-[#9333EA]/20 transition-colors duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-white text-2xl font-black tracking-tight uppercase">make</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 leading-tight">Scale Your Systems</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">Automate your workflows instantly without writing code.</p>
                  <a href="https://www.make.com/en/register?pc=aximpartner" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white font-black uppercase tracking-widest text-[0.65rem] hover:scale-105 transition-transform shadow-lg">
                    Start Free <SafeIcon icon={LuIcons.LuExternalLink} className="ml-2 w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Sidebar Promo: Powur */}
              <div className="bg-black border border-axim-gold/30 rounded-xl p-8 relative overflow-hidden group shadow-2xl mt-4">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-axim-gold/10 blur-[50px] pointer-events-none group-hover:bg-axim-gold/20 transition-colors duration-700" />
                <div className="relative z-10">
                  <SafeIcon icon={LuIcons.LuSun} className="w-8 h-8 text-axim-gold mb-4" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 leading-tight">Decentralize Your Power</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">Transition to Tier-1 residential solar and save up to 50% on utility costs.</p>
                  <Link to="/partners/powur-solar" className="w-full flex items-center justify-center px-4 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-[0.65rem] hover:bg-white transition-colors shadow-lg">
                    Calculate Savings <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* 3. Read Next Loop */}
      <section className="mt-12 pt-12 border-t border-white/10 bg-black/50">
         <div className="max-w-7xl mx-auto">
            <NewsFeed limit={3} title="Recent Articles" />
         </div>
      </section>
    </div>
  );
}
