import React from 'react';
import WPImage from './WPImage';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { decodeHtmlEntitiesAndStripTags } from '../lib/sanitize';

export default function ArticleCard({ article, index = 0, priority = false, isHero = false }) {
  const imageUrl = article?.featuredImage || article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const defaultImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const finalImage = imageUrl || defaultImage;

  const date = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const excerptText = article?.excerpt?.rendered || article?.excerpt || "";



  const cleanExcerpt = decodeHtmlEntitiesAndStripTags(excerptText);
  const titleText = article?.title?.rendered || article?.title || "Untitled";

  const cleanTitle = decodeHtmlEntitiesAndStripTags(titleText);

  const calculateReadTime = (text) => Math.max(1, Math.ceil((text?.split(' ').length || 0) / 200));
  const rawContent = article?.content?.rendered || article?.content || excerptText;
  const readTime = calculateReadTime(decodeHtmlEntitiesAndStripTags(rawContent));


  // Highly Saturated Overlays - Lighter colored top, fading into deep dark slate at the bottom for text contrast
  const overlayGradients = [
    "linear-gradient(to bottom, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.95))",   // Rich Royal Blue
    "linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(15, 23, 42, 0.95))",  // Deep AXiM Purple
    "linear-gradient(to bottom, rgba(0, 64, 64, 0.5), rgba(15, 23, 42, 0.95))"      // Deep Phthalo Green
  ];

  const activeGradient = overlayGradients[index % 3] || overlayGradients[1];


  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.slug}`;
    const shareData = { title: cleanTitle, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        logTelemetry('ORGANIC_SHARE_INTENT', { path: `/article/${article.slug}`, method: 'native' });
      } catch (err) {
        console.error('Failed to native share', err);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        useAximStore.getState().addToast('Link copied to clipboard!', 'success');
        logTelemetry('ORGANIC_SHARE_INTENT', { path: `/article/${article.slug}`, method: 'clipboard' });
      }).catch((err) => {
        console.error('Failed to copy link', err);
      });
    }
  };


  return (
    <Link
      to={`/article/${article.slug}`}
      className={`group bg-[#050505] border border-white/5 rounded-sm overflow-hidden shadow-xl hover:border-white/20 transition-all duration-500 flex flex-col relative block ${isHero ? "md:col-span-3 lg:col-span-full flex flex-col md:flex-row gap-6" : "h-full"}`}
    >

      {/* Reduced Height Image Container */}
      <div className={`relative w-full overflow-hidden bg-[#0F172A] flex flex-col justify-end p-6 border-b border-white/10 ${isHero ? "md:w-1/2 md:border-b-0 md:border-r h-64 md:h-auto" : "h-48 sm:h-52"}`}>

        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <WPImage
          post={article}

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


        <div className="absolute top-4 right-4 z-20">
          <button onClick={handleShareClick} className="p-2 bg-black/80 backdrop-blur-sm border border-white/10 text-white rounded-sm shadow-lg hover:bg-white hover:text-black transition-colors" title="Copy Link">
            <SafeIcon icon={LuIcons.LuShare2} className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[0.55rem] font-mono uppercase tracking-widest text-white rounded-sm shadow-lg">
            {date}
          </span>
          <span className="text-zinc-500 text-[0.65rem] font-medium drop-shadow-md bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm">
            &bull; {readTime} min read
          </span>
        </div>

        {/* Shifted Headline */}
        <h2 className="relative z-20 text-lg sm:text-xl font-black uppercase tracking-tight text-white line-clamp-2 group-hover:text-white transition-colors leading-tight drop-shadow-md">
          {cleanTitle}
        </h2>
      </div>

      {/* Lower Sub-Text Section */}
      <div className={`p-6 flex flex-col flex-grow relative z-10 bg-[#050505] ${isHero ? "md:w-1/2 md:justify-center md:p-10" : ""}`}>
        <p className={`text-zinc-400 text-xs leading-relaxed font-medium flex-grow ${isHero ? "mb-8 line-clamp-6 md:text-sm" : "mb-6 line-clamp-3"}`}>
          {cleanExcerpt}
        </p>

        <div className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors pt-4 border-t border-white/5 w-full">
          Access Briefing <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1 text-axim-purple" />
        </div>
      </div>
    </Link>
  );
}
