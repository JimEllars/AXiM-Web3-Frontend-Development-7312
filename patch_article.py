import re

with open('src/pages/Article.jsx', 'r') as f:
    content = f.read()

# Define the schema logic to inject
schema_logic = """
  // Fallback image string if article lacks a featured image
  const defaultImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";

  // Extract clean text from excerpt for schema descriptions
  const cleanExcerpt = article.excerpt?.rendered?.replace(/<[^>]+>/g, '') || "AXiM Systems Intelligence Briefing";

  // Construct rigorous AIO/SEO NewsArticle Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": article.title?.rendered || "AXiM Systems Article",
    "description": cleanExcerpt,
    "image": [
      imageUrl || defaultImage
    ],
    "datePublished": article.date,
    "dateModified": article.modified || article.date,
    "author": {
      "@type": "Organization",
      "name": "AXiM Systems Editorial",
      "url": "https://axim.us.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    }
  };
"""

# Define the replacement for the SEO component call
seo_call_replacement = """      <SEO
        title={`${article.title?.rendered || 'Article'} | AXiM Systems`}
        description={cleanExcerpt}
        image={imageUrl || defaultImage}
        type="article"
        url={window.location.href}
        customSchema={[articleSchema]}
      />"""

# It looks like the previous replacement didn't match the SEO call properly. Let's do a more robust replacement.
content = re.sub(r'<SEO[^>]+/>', seo_call_replacement, content)

# Check if schema logic is already there, if not, add it
if 'const articleSchema =' not in content:
    content = re.sub(r'(\s+)(return\s*\(\s*<div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">)', r'\n' + schema_logic + r'\1\2', content, count=1)

with open('src/pages/Article.jsx', 'w') as f:
    f.write(content)
