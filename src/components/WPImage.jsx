import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon.jsx';
import { logTelemetry } from '../lib/telemetry';

const extractFromContent = (html) => {
  if (!html) return null;
  const match = html.match(/(?:src|data-src|data-lazy-src)=["']([^"]+)["']/i);
  return match ? match[1] : null;
};

const FALLBACK_IMAGE = 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp';

export default function WPImage({ src, alt, className, post, priority, ...props }) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  let mediaUrl =
    post?.featuredImage ||
    post?.featured_image_src ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(post?.content?.rendered) ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.jetpack_featured_media_url ||
    null;

  let imageSrc = src ? src : mediaUrl;

  if (imageSrc && imageSrc.startsWith('/') && !imageSrc.startsWith('//')) {
    imageSrc = `https://wp.axim.us.com${imageSrc}`;
  }

  if (imageSrc && imageSrc.startsWith('http://')) {
    imageSrc = imageSrc.replace('http://', 'https://');
  }

  if (imageSrc && retryCount > 0) {
    const separator = imageSrc.includes('?') ? '&' : '?';
    imageSrc = `${imageSrc}${separator}retry=${retryCount}`;
  }

  const handleError = (e) => {
    console.warn('[WP_MEDIA_ERROR] Failed to load asset:', imageSrc || src);
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
    logTelemetry('article_image_fallback_triggered', { slug: post?.slug, originalSrc: imageSrc || src });
    setHasError(true);
  };

  const handleRetry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHasError(false);
    setRetryCount((prev) => prev + 1);
  };

  if (hasError || !imageSrc) {
    return (
      <div className={`w-full h-full aspect-video bg-gradient-to-br from-onyx-800 to-onyx-950 border-b border-white/5 flex items-center justify-center relative overflow-hidden ${className || ''}`}>
        <SafeIcon icon={LuIcons.LuHexagon} className="text-white/5 text-6xl absolute -bottom-4 -right-4" />
        {imageSrc && (
          <button
            onClick={handleRetry}
            className="absolute top-2 right-2 p-1.5 bg-onyx-900/80 hover:bg-onyx-700 rounded-md border border-white/10 transition-colors z-10 cursor-pointer"
            title="Retry Image"
            aria-label="Retry Image"
          >
            <SafeIcon icon={LuIcons.LuRefreshCw} className="w-4 h-4 text-onyx-300" />
          </button>
        )}
      </div>
    );
  }

  // Ensure aspect ratio to prevent CLS
  return (
    <div className={`relative overflow-hidden aspect-video bg-white/5 ${className || ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        <motion.img layoutId={`post-image-${post?.id}`} width="1200" height="675"
        src={imageSrc}
        alt={alt || ''}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleError}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        {...props}
        />
    </div>
  );
}
