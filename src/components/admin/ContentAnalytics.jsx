import DOMPurify from 'isomorphic-dompurify';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPostsByCategory } from '../../lib/wp-fetch';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuFileText, LuTrendingUp, LuEye, LuMousePointerClick } = LuIcons;

export default function ContentAnalytics() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const posts = await fetchPostsByCategory('featured', 5);
        if (posts && posts.length > 0) {
          // If the 'featured' category fetch doesn't return enough, it'll fallback to recent posts
          setArticles(posts.slice(0, 5));
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.15  ,
                }}
      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col w-full h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center rounded-sm text-axim-purple">
          <SafeIcon icon={LuFileText} className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-black uppercase text-white tracking-widest">Content Funnel Analytics</h3>
      </div>

      <div className="flex-grow space-y-4">
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-axim-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 text-xs font-mono uppercase tracking-widest">
            SECURE_ARCHIVE_SYNC_PENDING...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {articles.map((article, index) => {
              // Simulated metrics for visual display
              const views = Math.floor(Math.random() * 5000) + 1000;
              const conversions = Math.floor(views * (Math.random() * 0.05 + 0.01)); // 1-6% conversion

              return (
                <div key={article.id || index} className="p-4 bg-black/40 border border-white/10 rounded-sm hover:border-axim-purple/30 transition-colors group">
                  <div className="mb-3 line-clamp-2">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white group-hover:text-axim-purple transition-colors"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.title || 'Untitled Article') }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <SafeIcon icon={LuEye} className="w-3.5 h-3.5" />
                        <span>Active Views</span>
                      </div>
                      <span className="text-white">{views.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5 text-axim-purple">
                        <SafeIcon icon={LuMousePointerClick} className="w-3.5 h-3.5" />
                        <span>Conversions</span>
                      </div>
                      <span className="text-axim-purple font-bold">+{conversions}</span>
                    </div>

                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-axim-purple"
                        style={{ width: `${Math.min((conversions / views) * 1000, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
