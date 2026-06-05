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

  const rawExcerpt = article.excerpt?.rendered || "";
  const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').split(' ').slice(0, 20).join(' ') + '...';

  // Dynamic Tri-Color Overlay Logic
  // 0 = Dark Royal Blue, 1 = AXiM Purple, 2 = Phthalo Green
  const colorCycle = index % 3;
  let overlayGradient = "";

  if (colorCycle === 0) {
    overlayGradient = "from-[#1E3A8A]/80 to-transparent"; // Dark Royal Blue
  } else if (colorCycle === 1) {
    overlayGradient = "from-axim-purple/80 to-transparent"; // AXiM Purple
  } else {
    overlayGradient = "from-[#004040]/80 to-transparent"; // Phthalo Green
  }

  return (
    <article className="group bg-[#050505] border border-white/5 rounded-sm overflow-hidden shadow-xl hover:border-white/20 transition-all duration-500 flex flex-col h-full relative">

      {/* Dynamic Image Overlay Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-900 border-b border-white/10">
        <img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          loading="lazy"
        />
        {/* Tri-Color Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} mix-blend-multiply opacity-80 group-hover:opacity-40 transition-opacity duration-500`} />

        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[0.55rem] font-mono uppercase tracking-widest text-white rounded-sm">
            {date}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2
          className="text-lg font-black uppercase tracking-tight text-white mb-3 line-clamp-2 group-hover:text-axim-purple transition-colors leading-tight"
          dangerouslySetInnerHTML={{ __html: article.title?.rendered }}
        />

        <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-medium line-clamp-3 flex-grow">
          {cleanExcerpt}
        </p>

        <Link
          to={`/article/${article.slug}`}
          className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-white hover:text-axim-purple transition-colors pt-4 border-t border-white/5 w-full"
        >
          Access Briefing <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
