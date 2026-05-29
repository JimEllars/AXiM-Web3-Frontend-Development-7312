import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WPImage({ src, alt, className, ...props }) {
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-axim-axim-axim-1l1j90l.webp";

  const imageSrc = hasError || !src ? fallbackImage : src;

  return (
    <motion.img
      src={imageSrc}
      alt={alt || ''}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
      {...props}
    />
  );
}
