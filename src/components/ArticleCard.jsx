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
}) {
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
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={() => {
        logTelemetry('article_view_impression', {
          id: article.id,
          slug: article.slug,
          location: window.location.pathname
        });
      }}
      className={
        variant === 'row'
          ? "w-full"
          : isHero
            ? "md:col-span-3 lg:col-span-full"
            : index % 7 === 0
              ? "md:col-span-2"
              : "h-full block"
      }
    >
      <Link
        ref={cardRef}
        onMouseMove={handleMouseMove}
        to={`/article/${article.slug}`}
        onClick={() =>
          logTelemetry("briefing_disclosure_intent", {
            slug: article.slug,
            category: categoryBadge,
          })
        }
        className={
          variant === 'row'
            ? "flex flex-col sm:flex-row gap-6 bg-[#050505] border border-white/5 p-4 rounded-sm items-center hover:border-axim-purple/30 transition-all duration-300 group relative overflow-hidden h-full"
            : `bg-gradient-to-b from-[#090909] to-[#030303] border border-white/5 backdrop-blur-md shadow-xl hover:border-axim-purple/40 hover:shadow-[0_0_25px_rgba(147,51,234,0.15)] transition-all duration-500 ease-out group rounded-sm overflow-hidden flex flex-col relative block ${isHero ? "flex flex-col md:flex-row gap-6" : index % 7 === 0 ? "flex flex-col md:flex-row gap-6 min-h-[320px]" : "h-full"}`
        }
      >
        {/* Interactive Neon Hover Ray Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.05), transparent 40%)`,
          }}
        />

        {/* Reduced Height Image Container */}
        <div
          className={
            variant === 'row'
              ? "relative w-full sm:w-1/3 h-40 flex-none overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 flex flex-col justify-end p-6 border-b sm:border-b-0 sm:border-r border-white/10 rounded-sm overflow-hidden mask"
              : `relative w-full h-48 overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 flex flex-col justify-end p-6 border-b border-white/10 overflow-hidden mask ${isHero ? "md:w-1/2 md:border-b-0 md:border-r h-64 md:h-auto" : ""}`
          }
        >

        <button
          onClick={handleSaveToggle}
          className="absolute top-4 right-4 z-30 p-2 bg-black/40 hover:bg-black/80 backdrop-blur-sm border border-white/10 hover:border-axim-purple/50 rounded-sm transition-all duration-300"
          title="Save Briefing"
        >
          <SafeIcon icon={FiIcons.FiBookmark} className={`w-4 h-4 transition-colors ${isSaved ? 'text-axim-purple fill-axim-purple/20' : 'text-white/40 group-hover:text-white/80'}`} />
        </button>

        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <motion.img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-all duration-700 ease-out opacity-50 group-hover:opacity-80 border-b border-white/5 relative z-10"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
        />

        {/* Saturated Color Overlay */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 opacity-100 group-hover:opacity-60 mix-blend-multiply"
          style={{ backgroundImage: activeGradient }}
        />



        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[0.55rem] font-mono uppercase tracking-widest text-white rounded-sm shadow-lg">
            {date}
          </span>
          <span className="text-zinc-500 font-mono text-xs drop-shadow-md bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm">
            • {estimateDuration(excerptText)} MIN READ
          </span>
          <button
            onClick={handleShareClick}
            className="p-1.5 text-white/30 hover:text-axim-purple bg-white/5 border border-white/5 hover:border-axim-purple/30 rounded-sm transition-all duration-300 relative z-30"
            title="Copy Link"
          >
            <SafeIcon icon={FiIcons.FiShare2} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lower Sub-Text Section */}
      <div
        className={
          variant === 'row'
            ? "flex flex-col flex-grow relative z-10 w-full"
            : `flex flex-col flex-1 justify-between min-h-[160px] p-5 relative z-10 bg-[#050505] ${isHero ? "md:w-1/2 md:justify-center md:p-10" : ""}`
        }
      >
        <span className="inline-block font-mono text-[10px] tracking-widest text-axim-purple bg-axim-purple/10 border border-axim-purple/20 px-2 py-0.5 rounded-sm uppercase mb-2 self-start">
          {categoryBadge}
        </span>
        <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-white mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-axim-purple transition-colors duration-300">
          {cleanTitle}
        </h2>

        <p
          className="text-sm text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-3 mt-3 mb-6"
        >
          {cleanExcerpt}
        </p>

        <div className="mt-auto inline-flex items-center text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors pt-4 border-t border-white/5 w-full">
          Access Briefing{" "}
          <SafeIcon
            icon={LuIcons.LuArrowRight}
            className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1 text-axim-purple"
          />
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
