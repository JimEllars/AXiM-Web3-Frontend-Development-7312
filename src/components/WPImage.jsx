import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WPImage({ src, alt, className, ...props }) {
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-axim-axim-axim-1l1j90l.webp";

  const handleError = () => {
    console.warn('[WP_MEDIA_ERROR] Failed to load asset:', src);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`w-full h-full bg-onyx-800 flex items-center justify-center text-xs text-onyx-400 font-mono ${className || ''}`}>
        MEDIA OFFLINE
      </div>
    );
  }

  const imageSrc = !src ? fallbackImage : src;

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
