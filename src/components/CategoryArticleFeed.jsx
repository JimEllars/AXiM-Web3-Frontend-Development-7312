import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticlesByCategory } from '../lib/wp-fetch';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div className="flex flex-col justify-between p-5 bg-[#050505] border border-white/5 shadow-2xl rounded-2xl animate-pulse min-h-[320px]">
    <div className="w-full h-48 bg-white/5 rounded-xl mb-4" />
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <div className="w-16 h-3 bg-white/10 rounded-sm mb-4" />
        <div className="w-3/4 h-6 bg-white/10 rounded-sm mb-3" />
        <div className="w-full h-4 bg-white/10 rounded-sm mb-1" />
        <div className="w-5/6 h-4 bg-white/10 rounded-sm" />
      </div>
      <div className="w-24 h-4 bg-white/10 rounded-sm mt-6" />
    </div>
  </div>
);

export default function CategoryArticleFeed({ categorySlug, sectionTitle, sectionSubtitle, limit = 3 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      try {
        const data = await fetchArticlesByCategory(categorySlug, limit);
        if (isMounted) {
          setArticles(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, [categorySlug, limit]);

  if (!loading && articles.length === 0) return null;

  const categoryColor = {
    'business-development': 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    'personal-development': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    'tech-development': 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
  }[categorySlug] || 'text-axim-purple border-axim-purple/30 bg-axim-purple/10';

  const titleColor = {
    'business-development': 'text-amber-500',
    'personal-development': 'text-emerald-500',
    'tech-development': 'text-cyan-500',
  }[categorySlug] || 'text-axim-purple';

  return (
    <section className="py-16 relative z-10 w-full border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${titleColor}`}>{sectionTitle}</h2>
          {sectionSubtitle && <p className="text-zinc-400 text-sm max-w-2xl">{sectionSubtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            Array(limit).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="relative h-48 overflow-hidden bg-black/40">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-onyx-800 to-onyx-950">
                       <SafeIcon icon={LuIcons.LuImage} className="w-8 h-8 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm border ${categoryColor}`}>
                      {article.categoryName}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.readingTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-zinc-400 line-clamp-3 mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: article.excerpt }} />

                  <Link
                    to={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors mt-auto"
                  >
                    Read Article <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!loading && articles.length > 0 && (
          <div className="flex justify-center">
            <Link
              to={`/articles?category=${categorySlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/10 transition-colors"
            >
              Explore More {articleCategoryName(categorySlug)} Articles <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function articleCategoryName(slug) {
  if (slug === 'business-development') return 'Business';
  if (slug === 'personal-development') return 'Personal';
  if (slug === 'tech-development') return 'Tech';
  return '';
}
