import React, { useState } from 'react';

export default function WPImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}
