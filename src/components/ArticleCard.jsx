import React from 'react';
import WPImage from './WPImage';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { decodeHtmlEntitiesAndStripTags } from '../lib/sanitize';

export default function ArticleCard({ article, index = 0, priority = false, isHero = false }) {
  const extractFromContent = (html) => {
    if (!html) return null;
    const match = html.match(/(?:src|data-src|data-lazy-src)=["']([^"]+)["']/i);
    return match ? match[1] : null;
  };

  let mediaUrl =
    article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    article?.featured_media_src_url ||
    article?.jetpack_featured_media_url ||
    article?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(article?.content?.rendered) ||
    null;

  if (mediaUrl && mediaUrl.startsWith('http://')) {
    mediaUrl = mediaUrl.replace('http://', 'https://');
  }
  const defaultImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const finalImage = mediaUrl || defaultImage;

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

  // Determine dynamic category badge based on tags/categories
  const getCategoryBadge = () => {
    const tags = article?.tags || [];
    const categories = article?.categories || [];

    // Example mapping
    if (tags.includes(15) || categories.includes(15)) return "CYBERSEC";
    if (tags.includes(20) || categories.includes(20)) return "INTEL";
    if (tags.includes(25) || categories.includes(25)) return "AI ENGINE";

    // Default fallback if a category exists
    if (categories.length > 0) return "BRIEFING";
    return "UPDATE";
  };
  const categoryBadge = getCategoryBadge();

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
      onClick={() => logTelemetry('briefing_disclosure_intent', { slug: article.slug, category: categoryBadge })}
      className={`group bg-gradient-to-b from-[#090909] to-[#030303] border border-white/5 backdrop-blur-md shadow-2xl hover:border-axim-purple/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-500 rounded-sm overflow-hidden flex flex-col relative block ${isHero ? "md:col-span-3 lg:col-span-full flex flex-col md:flex-row gap-6" : index % 7 === 0 ? "md:col-span-2 flex flex-col md:flex-row gap-6 min-h-[320px]" : "h-full"}`}
    >

      {/* Reduced Height Image Container */}
      <div className={`relative w-full h-48 overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 flex flex-col justify-end p-6 border-b border-white/10 ${isHero ? "md:w-1/2 md:border-b-0 md:border-r h-64 md:h-auto" : ""}`}>

        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-100 group-hover:scale-102 group-hover:opacity-80 transition-all duration-700 ease-out"
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
        <span className="inline-block text-[10px] font-mono tracking-widest text-axim-purple bg-axim-purple/10 border border-axim-purple/20 px-2 py-0.5 rounded-sm uppercase mb-3 self-start relative z-20">
          {categoryBadge}
        </span>
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
