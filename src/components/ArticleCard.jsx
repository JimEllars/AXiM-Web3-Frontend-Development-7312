import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import WPImage from './WPImage';

export default function ArticleCard({ article, isHero = false }) {
  // NEW UNIVERSAL FALLBACK THUMBNAIL
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";

  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
  const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";

  return (
    <Link to={`/article/${article.slug}`} className={`relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-8 shadow-lg rounded-sm ${isHero ? 'min-h-[450px] lg:col-span-2' : 'min-h-[300px]'}`}>
      <WPImage src={imageUrl} alt={article.title?.rendered || "Article"} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />

      <div className="absolute inset-0 bg-gradient-to-b from-axim-purple/80 to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

      <div className="relative z-10 mt-auto">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
          <div className="text-[0.6rem] font-mono text-zinc-400 uppercase tracking-widest border-l-2 border-axim-purple pl-2">
            {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-[0.55rem] font-mono text-axim-gold uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-sm">
            {authorName}
          </div>
        </div>
        <h3 className={`${isHero ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} font-black text-white mb-3 group-hover:text-axim-purple transition-colors leading-tight line-clamp-2`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || 'Untitled Article')}} />
        <div className="text-sm text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
      </div>
    </Link>
  );
}
