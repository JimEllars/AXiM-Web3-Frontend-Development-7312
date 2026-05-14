import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import GlobalLoader from '../components/GlobalLoader';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadArticles = async () => {
      try {
        const data = await fetchPosts({ per_page: 15 });
        if (isMounted) {
          setArticles(data || []);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };
    loadArticles();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) return <GlobalLoader />;
  if (!articles || articles.length === 0) return <div className="text-white text-center py-20 font-mono">No articles found.</div>;

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Articles | Smart Systems" description="Strategic articles, software spotlights, and updates." />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            AXiM <span className="text-axim-purple">Articles.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Strategic insights, platform updates, and tactical blueprints for scaling your decentralized edge architecture.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hub Hero */}
        <a href={`/article/${heroArticle.slug}`} className="block relative border border-white/10 bg-black overflow-hidden group min-h-[500px] flex flex-col justify-end p-8 md:p-16 hover:border-axim-purple/50 transition-colors mb-6 shadow-2xl">
            {heroArticle._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={heroArticle._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-axim-purple/80 to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

            <div className="relative z-10 max-w-4xl">
              <div className="text-xs font-mono text-axim-gold mb-4 uppercase tracking-widest bg-axim-gold/10 border border-axim-gold/20 inline-block px-3 py-1 rounded-sm">Featured Article</div>
              <h3 className="text-4xl md:text-6xl font-black text-white mb-4 group-hover:text-axim-purple transition-colors leading-tight" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(heroArticle.title?.rendered || '')}} />
              <div className="text-sm md:text-base text-zinc-300 line-clamp-3 mb-6" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(heroArticle.excerpt?.rendered || '')}} />
            </div>
        </a>

        {/* Hub Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article, index) => {
            const overlayColors = ["from-slate-800/80", "from-axim-purple/80", "from-zinc-800/80"];
            const overlayClass = overlayColors[index % overlayColors.length];

            return (
              <a key={article.id} href={`/article/${article.slug}`} className="relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-8 min-h-[300px] shadow-lg">
                {article._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <img src={article._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                )}
                <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass} to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

                <div className="relative z-10 mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[0.55rem] font-mono text-axim-gold uppercase tracking-widest bg-axim-gold/10 border border-axim-gold/20 px-2 py-1 rounded-sm">
                      Recent
                    </div>
                    <div className="text-[0.6rem] font-mono text-zinc-400 uppercase tracking-widest">
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-axim-purple transition-colors leading-tight" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || '')}} />
                  <div className="text-sm text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
