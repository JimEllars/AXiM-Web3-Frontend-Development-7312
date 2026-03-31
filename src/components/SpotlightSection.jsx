import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPostsByCategory } from '../lib/wp-fetch';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuArrowRight } = LuIcons;

export default function SpotlightSection({ title, categorySlug, limit = 4, subtitle = "Insights" }) {
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
      <div className="py-8 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-axim-teal/20 border-t-axim-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-12 relative z-10 border-t border-subtle">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="section-label">{subtitle}</span>
          <h2 className="text-[2rem] font-bold uppercase">{title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="h-40 overflow-hidden relative border-b border-subtle">
                  <div className="absolute inset-0 bg-axim-teal/10 mix-blend-overlay z-10"></div>
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="font-mono text-[0.6rem] opacity-50 text-axim-teal mb-3 block">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <h3 className="text-[1.1rem] font-bold uppercase mb-3 leading-tight group-hover:text-axim-teal transition-colors" dangerouslySetInnerHTML={{ __html: post.title }}></h3>
                <div
                  className="text-zinc-400 leading-[1.6] flex-grow mb-6 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                ></div>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.7rem] font-bold uppercase inline-flex items-center gap-2 text-white group-hover:text-axim-teal transition-colors mt-auto"
                >
                  Read More <SafeIcon icon={LuArrowRight} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
