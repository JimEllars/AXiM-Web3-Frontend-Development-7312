import React, { useState, useEffect } from 'react';

export default function WPImage({ mediaId, alt, className }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!mediaId || mediaId === 0) {
      setIsLoading(false);
      return;
    }

    const fetchMedia = async () => {
      try {
        const res = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/media/${mediaId}`);
        if (!res.ok) throw new Error("Media network dropped");
        const data = await res.json();

        if (isMounted && data?.source_url) {
          setImgUrl(data.source_url.replace(/^http:\/\//i, 'https://'));
        }
      } catch (e) {
        // Graceful fail
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMedia();
    return () => { isMounted = false; };
  }, [mediaId]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-axim-deep to-black animate-pulse flex items-center justify-center border border-white/5">
        <div className="w-4 h-4 border-2 border-axim-purple border-t-transparent rounded-full animate-spin opacity-50" />
      </div>
    );
  }

  if (imgUrl) {
    return <img src={imgUrl} alt={alt || ''} className={className} referrerPolicy="no-referrer" loading="lazy" />;
  }

  // Branded Fallback
  return (
    <div className="w-full h-full bg-gradient-to-br from-axim-deep to-black flex items-center justify-center border border-white/5">
      <div className="text-axim-purple/30 group-hover:text-axim-purple/60 transition-colors flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" /></svg>
        <span className="font-mono text-[0.45rem] uppercase tracking-widest">AXiM_INTEL_ARCHIVE</span>
      </div>
    </div>
  );
}
