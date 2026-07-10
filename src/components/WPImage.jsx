import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon.jsx';

const extractFromContent = (html) => {
  if (!html) return null;
  const match = html.match(/(?:src|data-src|data-lazy-src)=["']([^"]+)["']/i);
  return match ? match[1] : null;
};

export default function WPImage({ src, alt, className, post, ...props }) {
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
