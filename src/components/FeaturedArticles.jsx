import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPostsByCategory } from '../lib/wp-fetch';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { ensureSafeProtocol } from '../lib/sanitize';

const { LuArrowRight } = LuIcons;

export default function FeaturedArticles({ categorySlug = 'featured', limit = 2 }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const fetched = await fetchPostsByCategory(categorySlug, limit);
      setPosts(fetched);
      setLoading(false);
    }
    loadPosts();
  }, [categorySlug, limit]);

  if (loading) {
    return (
      <LoadingSpinner
        pyClass="py-12"
        sizeClass="w-8 h-8"
        colorClass="border-axim-gold/20 border-t-axim-gold"
      />
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="section-label">Featured Intelligence</span>
          <h2 className="section-title !mb-0 text-axim-gold">Top Stories</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-glass border border-subtle flex flex-col h-full hover:-translate-y-2 hover:bg-glass-hover hover:border-active transition duration-300 group overflow-hidden"
            >
              {post.featuredImage && (
                <div className="h-64 overflow-hidden relative border-b border-subtle">
                  <div className="absolute inset-0 bg-axim-gold/10 mix-blend-overlay z-10"></div>
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <span className="font-mono text-[0.7rem] opacity-50 text-axim-gold mb-4 block">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <a href={ensureSafeProtocol(post.link)} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="text-[1.5rem] font-bold uppercase mb-4 leading-tight group-hover:text-axim-gold transition-colors" dangerouslySetInnerHTML={{ __html: post.title }}></h3>
                </a>
                <div
                  className="text-zinc-400 leading-[1.7] flex-grow mb-8 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                ></div>
                <a
                  href={ensureSafeProtocol(post.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-white group-hover:text-axim-gold transition-colors mt-auto"
                >
                  Read Full Article <SafeIcon icon={LuArrowRight} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
