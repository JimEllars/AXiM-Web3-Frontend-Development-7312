import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon.jsx';

const extractFirstImage = (html) => {
  const match = html?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
};

export default function WPImage({ src, alt, className, post, ...props }) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  let mediaUrl =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.featured_media_src_url ||
    post?.jetpack_featured_media_url ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    extractFirstImage(post?.content?.rendered) ||
    null;

  let imageSrc = src ? src : mediaUrl;

  if (imageSrc && imageSrc.startsWith('/') && !imageSrc.startsWith('//')) {
    imageSrc = `https://wp.axim.us.com${imageSrc}`;
  }

  if (imageSrc && retryCount > 0) {
    const separator = imageSrc.includes('?') ? '&' : '?';
    imageSrc = `${imageSrc}${separator}retry=${retryCount}`;
  }

  const handleError = () => {
    console.warn('[WP_MEDIA_ERROR] Failed to load asset:', imageSrc || src);
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
      <div className={`relative aspect-video w-full h-full object-cover bg-onyx-800 border-b border-white/5 flex items-center justify-center text-xs text-onyx-400 font-mono ${className || ''}`}>
        MEDIA OFFLINE
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
