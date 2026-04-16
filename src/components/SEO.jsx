import React from 'react';
import { Helmet } from 'react-helmet-async';
import { theme } from '../config/theme';

export default function SEO({ title, description, image, type = "website", url }) {
  const siteTitle = title ? `${title} | ${theme.siteName}` : theme.siteName;
  const metaDescription = description || "AXiM Systems - Builders of A New Era.";

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
