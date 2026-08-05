import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import WPImage from "./WPImage";
import { Link } from "react-router-dom";
import { logTelemetry } from "../lib/telemetry";
import { useAximStore } from "../store/useAximStore";
import SafeIcon from "../common/SafeIcon";
import * as LuIcons from "react-icons/lu";
import * as FiIcons from "react-icons/fi";
import { decodeHtmlEntitiesAndStripTags } from "../lib/sanitize";
import { localStore } from "../lib/persistence";

export default function ArticleCard({
  article,
  index = 0,
  variant = 'grid',
  priority = false,
  isHero = false,
  onCardClick,
}) {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSaved, setIsSaved] = useState(() => localStore.getSavedBriefs().includes(article.id));

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const extractFromContent = (html) => {
    if (!html) return null;
    const match = html.match(/(?:src|data-src|data-lazy-src)=["']([^"]+)["']/i);
    return match ? match[1] : null;
  };

  let mediaUrl =
    article?.featuredImage ||
    article?.featured_image_src ||
    article?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(article?.content?.rendered) ||
    article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    article?.jetpack_featured_media_url ||
    null;

  if (mediaUrl && mediaUrl.startsWith("http://")) {
    mediaUrl = mediaUrl.replace("http://", "https://");
  }
  const defaultImage =
    "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const finalImage = mediaUrl || defaultImage;

  const date = article?.date
    ? new Date(article.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "PENDING";

  const excerptText = article?.excerpt?.rendered || article?.excerpt || "";

  const cleanExcerpt = decodeHtmlEntitiesAndStripTags(excerptText);
  const titleText = article?.title?.rendered || article?.title || "Untitled";

  const cleanTitle = decodeHtmlEntitiesAndStripTags(titleText);

  const calculateReadTime = (text) =>
    Math.max(1, Math.ceil((text?.split(" ").length || 0) / 200));
  const rawContent =
    article?.content?.rendered || article?.content || excerptText;
  const readTime = calculateReadTime(
    decodeHtmlEntitiesAndStripTags(rawContent),
  );

  const estimateDuration = (textString) => {
    const wordsPerMinute = 200;
    const totalWords = textString ? textString.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
  };

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
    "linear-gradient(to bottom, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.95))", // Rich Royal Blue
    "linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(15, 23, 42, 0.95))", // Deep AXiM Purple
    "linear-gradient(to bottom, rgba(0, 64, 64, 0.5), rgba(15, 23, 42, 0.95))", // Deep Phthalo Green
  ];

  const activeGradient = overlayGradients[index % 3] || overlayGradients[1];



  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newBriefs = localStore.toggleSavedBrief(article.id);
      setIsSaved(newBriefs.includes(article.id));
      useAximStore.getState().addToast(isSaved ? "BRIEFING REMOVED" : "BRIEFING SAVED", "success");
    } catch (err) {
      console.error("Save toggle failed", err);
      useAximStore.getState().addToast("STORAGE FAULT", "error");
    }
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.slug}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          useAximStore.getState().addToast("COPIED", "success");
          logTelemetry("article_share_copied", { slug: article.slug });
        })
        .catch((err) => {
          console.error("Failed to copy link", err);
        });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={() => {
        logTelemetry('article_view_impression', {
          id: article.id,
          slug: article.slug,
          location: window.location.pathname
        });
      }}
      className={
        isHero
          ? "md:col-span-3 lg:col-span-full h-full block"
          : index % 7 === 0
            ? "md:col-span-2 h-full block"
            : "h-full block"
      }
    >
      <Link
        ref={cardRef}
        onMouseMove={handleMouseMove}
        to={`/article/${article.slug}`}
        onClick={() => {
          if (onCardClick) onCardClick(article);
          logTelemetry("briefing_disclosure_intent", {
            slug: article.slug,
            category: categoryBadge,
          });
          logTelemetry('article_card_clicked', {
            slug: article.slug,
            title: cleanTitle,
            layout: '2_col_overlay_standard',
            variant: 'standard'
          });
        }}
        className="bg-gradient-to-b from-[#080808] to-[#020202] border border-white/10 hover:border-axim-purple/50 backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(147,51,234,0.15)] transition-all duration-500 ease-out group rounded-sm overflow-hidden flex flex-col relative block h-full"
      >
        {/* Interactive Neon Hover Ray Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.05), transparent 40%)`,
          }}
        />

        {/* Top Container */}
        <div className="relative w-full aspect-[16/9] sm:h-56 overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 border-b border-white/10 rounded-t-sm mask">
          <motion.img
            width="1200" height="675"
            src={finalImage}
            alt={cleanTitle}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:opacity-85 transition-all duration-700"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
              logTelemetry('article_image_fallback_triggered', { slug: article?.slug, originalSrc: mediaUrl });
            }}
            loading={priority ? "eager" : "lazy"}

          />
          {/* Top Corner Badges */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="font-mono font-bold text-[10px] tracking-widest text-purple-300 bg-axim-purple/20 border-axim-purple/40 backdrop-blur-sm border px-2.5 py-1 rounded-sm uppercase">
              {categoryBadge}
            </span>
            <span className="text-[0.6rem] font-mono text-zinc-300 bg-black/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-sm uppercase">
              {date}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
            <button
              onClick={handleShareClick}
              className="p-2 text-white/40 hover:text-white/80 bg-black/40 hover:bg-black/80 backdrop-blur-sm border border-white/10 hover:border-axim-purple/50 rounded-sm transition-all duration-300 relative z-30"
              title="Copy Link"
            >
              <SafeIcon icon={FiIcons.FiShare2} className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveToggle}
              className="p-2 bg-black/40 hover:bg-black/80 backdrop-blur-sm border border-white/10 hover:border-axim-purple/50 rounded-sm transition-all duration-300 relative z-30"
              title="Save Briefing"
            >
              <SafeIcon icon={FiIcons.FiBookmark} className={`w-4 h-4 transition-colors ${isSaved ? 'text-axim-purple fill-axim-purple/20' : 'text-white/40 group-hover:text-white/80'}`} />
            </button>
          </div>

          {/* Title Overlay on Thumbnail Bottom Edge */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-20 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pt-8">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white line-clamp-2 leading-snug group-hover:text-axim-purple transition-colors duration-300 drop-shadow-md">
              {cleanTitle}
            </h3>
          </div>
        </div>

        {/* Bottom Half (Wide-Framed Text Body) */}
        <div className="flex flex-col flex-1 justify-between p-5 bg-[#050505] relative z-10 w-full">
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-6">
            {cleanExcerpt}
          </p>

          {/* Anchored CTA Bar */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between w-full text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
            <div className="flex items-center gap-2">
              <span>Access Briefing</span>
              <SafeIcon className="w-3.5 h-3.5 text-axim-purple transition-transform group-hover:translate-x-1" icon={LuIcons.LuArrowRight}/>
            </div>

            <div className="flex items-center gap-3">
              {isWeb3Authenticated && (
                <span className="font-mono text-[8px] text-emerald-400/80 uppercase tracking-widest select-none pointer-events-none hidden sm:inline-block">
                  [INTEL_NODE: VERIFIED_ON_CHAIN // ARBITRUM_ONE]
                </span>
              )}
              <span className="font-mono text-[10px] text-zinc-500">
                • {estimateDuration(excerptText)} MIN READ
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
