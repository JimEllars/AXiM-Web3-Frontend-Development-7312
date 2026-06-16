import re
import os

# index.html
with open('index.html', 'r') as f:
    index_html = f.read()

index_html = re.sub(
    r'<title>AXiM Systems \| Enterprise Software Provider</title>.*?<meta name="revisit-after" content="7 days" />',
    '''<title>AXiM Systems | Work Smarter</title>
    <meta name="description" content="Decentralized business infrastructure, AI tools, and enterprise automation strategies." />''',
    index_html, flags=re.DOTALL
)

index_html = re.sub(
    r'<!-- Open Graph / Facebook -->\s*<meta property="og:type" content="website" />\s*<meta property="og:url" content="https://axim\.us\.com/" />\s*<meta property="og:title" content="AXiM Systems \| Enterprise Software Provider" />\s*<meta property="og:description" content="Builders of A New Era\. Integrating energy, connectivity, and intelligence\." />',
    '''<meta property="og:type" content="website" />
    <meta property="og:url" content="https://axim.us.com/" />
    <meta property="og:title" content="AXiM Systems | Enterprise Infrastructure" />
    <meta property="og:description" content="Decentralized business infrastructure, AI tools, and enterprise automation strategies." />''',
    index_html, flags=re.DOTALL
)

index_html = re.sub(
    r'<!-- Twitter -->\s*<meta name="twitter:card" content="summary_large_image" />\s*<meta name="twitter:url" content="https://axim\.us\.com/" />\s*<meta name="twitter:title" content="AXiM Systems \| Enterprise Software Provider" />\s*<meta name="twitter:description" content="Builders of A New Era\. Integrating energy, connectivity, and intelligence\." />\s*<meta name="twitter:image" content="https://wp\.axim\.us\.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci\.webp" />',
    '''<meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://axim.us.com/" />
    <meta property="twitter:title" content="AXiM Systems | Enterprise Infrastructure" />
    <meta property="twitter:description" content="Decentralized business infrastructure, AI tools, and enterprise automation strategies." />
    <meta property="twitter:image" content="https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp" />''',
    index_html, flags=re.DOTALL
)

with open('index.html', 'w') as f:
    f.write(index_html)

# Article.jsx
with open('src/pages/Article.jsx', 'r') as f:
    article_jsx = f.read()

old_vars = '''  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const defaultImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const cleanExcerpt = article.excerpt?.rendered?.replace(/<[^>]+>/g, '') || "AXiM Systems Intelligence Briefing";

  // Additional variables needed by the bottom part of the component
  const authorName = article._embedded?.author?.[0]?.name || 'AXiM Protocol';
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const fallbackImage = defaultImage;

  // Construct rigorous AIO/SEO NewsArticle Schema
  // Construct rigorous Google News Compliant JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": article.title?.rendered || "AXiM Systems Article",
    "description": cleanExcerpt,
    "image": [imageUrl || defaultImage],
    "datePublished": new Date(article.date).toISOString(),
    "dateModified": article.modified ? new Date(article.modified).toISOString() : new Date(article.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "AXiM Systems Editorial",
      "url": "https://axim.us.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    },
    "isAccessibleForFree": "True",
    "articleSection": "Technology News"
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title={`${article.title?.rendered || 'Article'} | AXiM Systems`}
        description={cleanExcerpt}
        image={imageUrl || defaultImage}'''

new_vars = '''  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
  const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Clean titles and excerpts for schema and meta tags
  const cleanTitle = article.title?.rendered?.replace(/<[^>]+>/g, '') || 'Intelligence Briefing';
  const cleanExcerpt = article.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 'AXiM Systems Intelligence Briefing';

  // Construct AIO/SEO Rich Snippet Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": cleanTitle,
    "image": [imageUrl],
    "datePublished": article.date,
    "dateModified": article.modified || article.date,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://axim.us.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    },
    "description": cleanExcerpt
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title={`${cleanTitle} | AXiM Systems`}
        description={cleanExcerpt}
        image={imageUrl}'''

article_jsx = article_jsx.replace(old_vars, new_vars)
with open('src/pages/Article.jsx', 'w') as f:
    f.write(article_jsx)


# Articles.jsx
with open('src/pages/Articles.jsx', 'r') as f:
    articles_jsx = f.read()

articles_jsx = articles_jsx.replace('''  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Articles | AXiM Systems" description="Strategic insights, software spotlights, and decentralized infrastructure updates." />''',
      '''  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AXiM Intelligence Hub",
    "description": "Latest intelligence briefings, system architecture updates, and decentralized enterprise automation strategies.",
    "url": "https://axim.us.com/articles",
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Intelligence Hub | AXiM Systems"
        description="Latest intelligence briefings, system architecture updates, and decentralized enterprise automation strategies."
        customSchema={[blogSchema]}
      />''')

with open('src/pages/Articles.jsx', 'w') as f:
    f.write(articles_jsx)
