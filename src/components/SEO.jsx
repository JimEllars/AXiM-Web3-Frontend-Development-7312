import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = "AXiM Systems | Enterprise Software Provider",
  description = "Builders of A New Era. Integrating energy, connectivity, and intelligence.",
  image = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp",
  url = "https://axim.us.com",
  type = "website",
  customSchema
}) {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Dynamic JSON-LD Schema Injection */}
      {customSchema && customSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
