import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ArticleCard({ article, index = 0 }) {
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

  // Highly Saturated JIT-Proof Inline CSS Gradients
  // Solid base layer fading into a heavy colored top layer
  const overlayGradients = [
    "linear-gradient(to top, rgba(30, 58, 138, 1), rgba(15, 23, 42, 0.6))",   // Deep Royal Blue
    "linear-gradient(to top, rgba(147, 51, 234, 1), rgba(15, 23, 42, 0.6))",  // Vivid AXiM Purple
    "linear-gradient(to top, rgba(0, 64, 64, 1), rgba(15, 23, 42, 0.6))"      // Rich Phthalo Green
  ];

  const activeGradient = overlayGradients[index % 3] || overlayGradients[1]; // Fallback to purple if NaN

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group bg-[#050505] border border-white/5 rounded-sm overflow-hidden shadow-xl hover:border-white/20 transition-all duration-500 flex flex-col h-full relative block"
    >

      {/* Image Container with Fallback Background */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-900 border-b border-white/10">

        {/* Base Image */}
        <img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 bg-[#0F172A]"
          loading="lazy"
        />

        {/* Saturated Color Overlay (Forced 100% opacity, fading on hover) */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 opacity-100 group-hover:opacity-20 mix-blend-normal"
          style={{ backgroundImage: activeGradient }}
        />

        <div className="absolute top-4 left-4 z-20">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[0.55rem] font-mono uppercase tracking-widest text-white rounded-sm shadow-lg">
            {date}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#050505]">
        <h2
          className="text-lg font-black uppercase tracking-tight text-white mb-3 line-clamp-2 group-hover:text-axim-purple transition-colors leading-tight"
          dangerouslySetInnerHTML={{ __html: article.title?.rendered || "Intelligence Briefing" }}
        />

        <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-medium line-clamp-3 flex-grow">
          {cleanExcerpt}
        </p>

        <div className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors pt-4 border-t border-white/5 w-full">
          Access Briefing <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1 text-axim-purple" />
        </div>
      </div>
    </Link>
  );
}
