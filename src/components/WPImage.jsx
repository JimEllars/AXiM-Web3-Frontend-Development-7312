import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WPImage({ src, alt, className, post, ...props }) {
  const [hasError, setHasError] = useState(false);


  const handleError = () => {
    console.warn('[WP_MEDIA_ERROR] Failed to load asset:', src);
    setHasError(true);
  };


  const mediaUrl = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || post?.featured_media_src_url || null;
  //







  const imageSrc = src ? src : mediaUrl;

  if (hasError || !imageSrc) {
    return (
      <div className={`aspect-video bg-onyx-800 border-b border-white/5 flex items-center justify-center text-xs text-onyx-400 font-mono ${className || ''}`}>
        MEDIA OFFLINE
      </div>
    );
  }

  return (
    <motion.img layoutId={`post-image-${post?.id}`}
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
