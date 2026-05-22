import React from 'react';
import { Helmet } from 'react-helmet-async';
import { theme } from '../config/theme';

export default function SEO({ title, description, image, type = "website", url, customSchema, noindex = false }) {
  const siteTitle = title ? (title.includes('AXiM') ? title : `${title} | ${theme.siteName}`) : theme.siteName;
  const metaDescription = description || "AXiM SYSTEMS - Builders of A New Era.";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AXiM SYSTEMS",
    "url": "https://axim.us.com",
    "logo": "https://axim.us.com/logo.png",
    "description": "Smart protocol integrations, web3 interfaces, and intelligent business ecosystems.",
    "sameAs": [
      "https://twitter.com/aximsystems",
      "https://linkedin.com/company/axim-systems"
    ],
        "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "AXiM Core",
          "applicationCategory": "BusinessApplication"
        }
      }
    ],
    "knowsAbout": [
      "Decentralized Systems",
      "Smart Business Automation",
      "AI Infrastructure"
    ]
  };

  const breadcrumbSchema = url ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://axim.us.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title || "Page",
        "item": url
      }
    ]
  } : null;

  const defaultWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": siteTitle,
    "description": metaDescription,
    "url": url || "https://axim.us.com"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://axim.us.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://axim.us.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const schemasToRender = customSchema || [defaultWebPageSchema, websiteSchema];

  if (type === "product" || (url && url.includes('/tools/'))) {
    schemasToRender.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": title || "AXiM Tool",
      "applicationCategory": "BusinessApplication"
    });
  }

  return (
    <Helmet>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}

      {url && <link rel="canonical" href={url} />}
      {!url && <link rel="canonical" href="https://axim.us.com" />}

      {schemasToRender.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </Helmet>
  );
}
