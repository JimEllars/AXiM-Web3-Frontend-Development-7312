with open('src/pages/Article.jsx', 'r') as f:
    content = f.read()

# We need to find the point where the main return starts:
# `return (`
# `  <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">`

parts = content.split('  return (\n    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">')
if len(parts) != 2:
    print("Could not find the main return statement!")
    exit(1)

bottom_part = '  return (\n    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">' + parts[1]

# Now, write the top part exactly following their logic but keeping recentArticles to prevent ReferenceError. Wait, the user specifically provided the code. Let's look at their provided code again.

top_part = """import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPosts } from '../lib/wp-fetch';
import DOMPurify from 'isomorphic-dompurify';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import WPImage from '../components/WPImage';
import NewsFeed from '../components/NewsFeed';
import SystemBreadcrumb from '../components/SystemBreadcrumb'; // Adding this as user included it in their import list, though it may not be used or used in existing UI. Wait, let me check if it's used in the bottom part.

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadArticle() {
      setIsLoading(true);
      try {
        const [mainRes, recentRes] = await Promise.all([
          fetchPosts({ slug, _embed: 1 }),
          fetchPosts({ per_page: 4, _embed: 1 })
        ]);

        if (isMounted) {
          if (mainRes && mainRes.length > 0) {
            setArticle(mainRes[0]);
          } else {
            setError("Article not found.");
          }
          if (recentRes) {
            setRecentArticles(recentRes.filter(p => p.slug !== slug).slice(0, 3));
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadArticle();
    return () => { isMounted = false; };
  }, [slug]);

  // 1. STRICT SHIELD: Handle Error State FIRST
  if (error) {
    return (
      <div className="min-h-screen bg-bg-void pt-32 px-6 flex justify-center items-start">
        <div className="bg-[#050505] border border-red-500/20 p-8 rounded-sm max-w-lg w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <SafeIcon icon={LuIcons.LuAlertTriangle} className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">System Malfunction</h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">{error}</p>
          <Link to="/articles" className="inline-block mt-6 px-6 py-2 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  // 2. STRICT SHIELD: Handle Loading/Null State SECOND
  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-bg-void pt-32 px-6 flex justify-center items-start">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#004040]/30 border-t-[#004040] rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Decrypting Protocol...</p>
        </div>
      </div>
    );
  }

  // 3. SAFE EXECUTION: The component will ONLY reach this point if `article` is a fully loaded object.
  // It is now safe to declare variables that rely on the article object.
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
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

with open('src/pages/Article.jsx', 'w') as f:
    f.write(top_part + bottom_part)

print("Updated Article.jsx successfully.")
