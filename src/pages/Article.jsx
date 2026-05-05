import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { motion } from 'framer-motion';
import { fetchPosts, getFeaturedImage } from '../lib/wp-fetch';

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadArticle = async () => {
      try {
        // Utilize the absolute resolver utility instead of manual fetch
        const data = await fetchPosts({ slug: slug });

        if (isMounted) {
          if (data && data.length > 0) {
            setArticle(data[0]);
          } else {
            setIsError(true);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.log("[ARTICLE_UPLINK] Connection degraded.");
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    loadArticle();
    return () => { isMounted = false; };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono text-axim-purple text-xs uppercase tracking-widest">
        <div className="w-8 h-8 border-2 border-axim-purple border-t-transparent rounded-full animate-spin mb-4" />
        ESTABLISHING_SECURE_UPLINK...
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-axim-gold font-mono text-xs uppercase tracking-widest mb-4 px-3 py-1 bg-axim-gold/10 border border-axim-gold/20 rounded-sm">
          [UPLINK_DEGRADED] // INTELLIGENCE_UNAVAILABLE
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Record Not Found</h1>
        <p className="text-zinc-500 mb-8 max-w-md">The requested intelligence briefing could not be retrieved from the decentralized storage bank.</p>
        <Link to="/articles" className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-20 relative z-10"
    >
      <SEO
        title={DOMPurify.sanitize(article.title.rendered, { ALLOWED_TAGS: [] })}
        description={DOMPurify.sanitize(article.excerpt.rendered, { ALLOWED_TAGS: [] })}
        type="article"
      />

      <Link to="/articles" className="inline-flex items-center gap-2 text-axim-purple hover:text-axim-gold font-mono text-xs uppercase tracking-widest transition-colors mb-12 group">
        <SafeIcon icon={LuIcons.LuArrowLeft} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Intelligence Hub
      </Link>

      <header className="mb-12 border-b border-white/10 pb-12">
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
          <span className="flex items-center gap-2 text-axim-gold">
            <div className="w-1.5 h-1.5 bg-axim-gold rounded-full" />
            Verified Record
          </span>
          <span>//</span>
          <time>{new Date(article.date).toLocaleDateString()}</time>
        </div>

        <h1
          className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.title.rendered) }}
        />
      </header>

      <div className="w-full aspect-video md:aspect-[21/9] mb-12 border border-white/10 rounded-sm overflow-hidden bg-gradient-to-br from-axim-deep to-black shadow-[0_0_30px_rgba(125,0,255,0.05)] relative flex items-center justify-center">
        {article._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
          <img
            src={article._embedded['wp:featuredmedia'][0].source_url.replace('http:', 'https:')}
            alt={DOMPurify.sanitize(article.title.rendered, { ALLOWED_TAGS: [] })}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-axim-purple/30 flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" /></svg>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest">AXiM_INTEL_ARCHIVE</span>
          </div>
        )}
      </div>

      <div
        className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-a:text-axim-purple hover:prose-a:text-axim-gold prose-a:transition-colors prose-img:rounded-md prose-img:border prose-img:border-white/10"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.rendered) }}
      />
    </motion.article>
  );
}
