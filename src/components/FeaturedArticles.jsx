import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { logTelemetry } from "../lib/telemetry";
import { useAximStore } from "../store/useAximStore";
import DOMPurify from "isomorphic-dompurify";
import WPImage from "./WPImage";
import { fetchPosts, fetchCategoryBySlug } from "../lib/wp-fetch";
import ArticleCard from "./ArticleCard";
import SafeIcon from "../common/SafeIcon";
import * as LuIcons from "react-icons/lu";

export default function FeaturedArticles({
  title = "Featured Articles",
  categorySlug = "featured",
  limit = 6,
  excludeIds = [],
  excludeCategories = [],
}) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const isWeb3Authenticated = useAximStore(
    (state) => state.isWeb3Authenticated,
  );

  const handleRetryFetch = () => setRetryCount((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const categoryId = categorySlug
          ? await fetchCategoryBySlug(categorySlug)
          : null;
        const params = { per_page: limit };
        if (categoryId) params.categories = categoryId;

        // Post ID Exclusion
        if (excludeIds && excludeIds.length > 0) {
          params.exclude = excludeIds.join(",");
        }

        // Strict Category Exclusion (Prevents Feed Bleed)
        if (excludeCategories && excludeCategories.length > 0) {
          params.categories_exclude = excludeCategories.join(",");
        }

        const data = await fetchPosts({ categorySlug, limit, ...params });
        if (isMounted) {
          setArticles(data || []);
        }
      } catch (error) {
        console.error(
          `[WP_FEATURED] Query failed for slug: ${categorySlug}`,
          error,
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadArticles();
    return () => {
      isMounted = false;
    };
  }, [
    categorySlug,
    limit,
    JSON.stringify(excludeIds),
    JSON.stringify(excludeCategories),
    retryCount,
  ]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-h-[300px] bg-[#050505] border border-white/5 rounded-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
          {title}
        </h2>
        <div className="w-full bg-[#050505] border border-white/5 p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
          [ INTELLIGENCE FEED SYNCHRONIZING WITH EDGE NODE ]
          <button
            onClick={handleRetryFetch}
            className="mt-4 px-4 py-1 text-xs border border-onyx-600 text-onyx-400 hover:text-white transition-colors block mx-auto"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const validArticles = articles.filter(
    (article) => article && article.title && article.title.rendered,
  );

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto py-16 px-6"
      onViewportEnter={() => {
        logTelemetry("spotlight_section_impression", {
          category: categorySlug,
          count: articles?.length || 0,
        });
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
        {title}
        {isWeb3Authenticated && (
          <span className="ml-auto font-mono text-[9px] text-zinc-500 tracking-widest uppercase border border-white/5 bg-black/40 px-2 py-0.5 rounded-sm select-none pointer-events-none hidden sm:inline-block">
            [NODE_INGEST_DECRYPT: 18.4 MB/S]
          </span>
        )}
      </h2>

      {/* Grid Container */}
      <div className="flex flex-col lg:flex-row gap-8 relative z-10 w-full">
        {/* Left Highlight Panel Column */}
        {validArticles[0] && (
          <div className="w-full lg:w-1/2 flex">
            <ArticleCard
              article={validArticles[0]}
              index={0}
              isHero={true}
              priority={true}
            />
          </div>
        )}

        {/* Right Briefing Stack Column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
          {validArticles.slice(1, 4).map((article, index) => (
            <ArticleCard
              article={article}
              index={index + 1}
              key={article.id || index}
              variant="row"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
