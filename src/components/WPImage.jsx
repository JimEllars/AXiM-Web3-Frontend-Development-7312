import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WPImage({ src, alt, className, post, ...props }) {
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-axim-axim-axim-1l1j90l.webp";

  const handleError = () => {
    console.warn('[WP_MEDIA_ERROR] Failed to load asset:', src);
    setHasError(true);
  };

  if (hasError || !post?._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return (
      <div className={`aspect-video bg-onyx-800 border-b border-white/5 flex items-center justify-center text-xs text-onyx-400 font-mono ${className || ''}`}>
        MEDIA OFFLINE
      </div>
    );
  }

  const defaultFallback = fallbackImage;
  const mediaUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || post?.featured_media_src_url || defaultFallback;
  const imageSrc = src ? src : mediaUrl;

  return (
    <motion.img
      src={imageSrc}
      alt={alt || ''}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="lazy"
      {...props}
    />
  );
}
