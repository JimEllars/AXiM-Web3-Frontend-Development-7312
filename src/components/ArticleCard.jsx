import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ArticleCard({ article, index = 0, priority = false }) {
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const defaultImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const finalImage = imageUrl || defaultImage;

  const date = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const rawExcerpt = article.excerpt?.rendered || "AXiM Systems Internal Briefing Data. Secure payload initialized.";
  const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').split(' ').slice(0, 20).join(' ') + '...';

  // Highly Saturated Overlays - Lighter colored top, fading into deep dark slate at the bottom for text contrast
  const overlayGradients = [
    "linear-gradient(to bottom, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.95))",   // Rich Royal Blue
    "linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(15, 23, 42, 0.95))",  // Deep AXiM Purple
    "linear-gradient(to bottom, rgba(0, 64, 64, 0.5), rgba(15, 23, 42, 0.95))"      // Deep Phthalo Green
  ];

  const activeGradient = overlayGradients[index % 3] || overlayGradients[1];

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group bg-[#050505] border border-white/5 rounded-sm overflow-hidden shadow-xl hover:border-white/20 transition-all duration-500 flex flex-col h-full relative block"
    >

      {/* Reduced Height Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#0F172A] border-b border-white/10 flex flex-col justify-end p-6">

        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
        />

        {/* Saturated Color Overlay */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 opacity-100 group-hover:opacity-60 mix-blend-multiply"
          style={{ backgroundImage: activeGradient }}
        />

        <div className="absolute top-4 left-4 z-20">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[0.55rem] font-mono uppercase tracking-widest text-white rounded-sm shadow-lg">
            {date}
          </span>
        </div>

        {/* Shifted Headline */}
        <h2
          className="relative z-20 text-lg sm:text-xl font-black uppercase tracking-tight text-white line-clamp-2 group-hover:text-white transition-colors leading-tight drop-shadow-md"
          dangerouslySetInnerHTML={{ __html: article.title?.rendered || "Intelligence Briefing" }}
        />
      </div>

      {/* Lower Sub-Text Section */}
      <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#050505]">
        <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-medium line-clamp-3 flex-grow">
          {cleanExcerpt}
        </p>

        <div className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors pt-4 border-t border-white/5 w-full">
          Access Briefing <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1 text-axim-purple" />
        </div>
      </div>
    </Link>
  );
}
