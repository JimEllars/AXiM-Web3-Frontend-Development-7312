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

  // Bulletproof fallback string
  const rawExcerpt = article.excerpt?.rendered || "AXiM Systems Internal Briefing Data. Secure payload initialized.";
  const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').split(' ').slice(0, 20).join(' ') + '...';

  // JIT-Proof Inline CSS Gradients
  // 0 = Dark Royal Blue, 1 = AXiM Purple, 2 = Phthalo Green
  const overlayGradients = [
    "linear-gradient(to top, rgba(30, 58, 138, 0.95), rgba(5, 5, 5, 0.1))",   // Royal Blue
    "linear-gradient(to top, rgba(147, 51, 234, 0.95), rgba(5, 5, 5, 0.1))",  // Purple
    "linear-gradient(to top, rgba(0, 64, 64, 0.95), rgba(5, 5, 5, 0.1))"      // Phthalo Green
  ];

  const activeGradient = overlayGradients[index % 3];

  return (
    <article className="group bg-[#050505] border border-white/5 rounded-sm overflow-hidden shadow-xl hover:border-white/20 transition-all duration-500 flex flex-col h-full relative">

      {/* Image Container with Fallback Background color */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-800 border-b border-white/10">

        {/* Base Image with absolute positioning */}
        <img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 bg-[#0F172A]"
          loading="lazy"
        />

        {/* JIT-Proof Color Overlay */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 opacity-90 group-hover:opacity-20"
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
          className="text-lg font-black uppercase tracking-tight text-white mb-3 line-clamp-2 group-hover:text-white transition-colors leading-tight"
          dangerouslySetInnerHTML={{ __html: article.title?.rendered }}
        />

        <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-medium line-clamp-3 flex-grow">
          {cleanExcerpt}
        </p>

        <Link
          to={`/article/${article.slug}`}
          className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors pt-4 border-t border-white/5 w-full group/link"
        >
          Access Briefing <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
