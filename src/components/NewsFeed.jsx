import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { fetchPostsByCategory } from '../lib/wp-fetch';
import { sanitizeHTML } from '../lib/sanitize';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { generators } from '../data/companyOfferings';

const { LuArrowRight } = LuIcons;

export default function NewsFeed({ categorySlug = 'article', limit = 12, title = 'Latest Insights & Offerings' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Fetch news posts
      let posts = await fetchPostsByCategory(categorySlug, limit);
      // Fallback: If 'article' category returns nothing, fetch the latest posts from general feed
      if (!posts || posts.length === 0) {
        posts = await fetchPostsByCategory('', limit);
      }

      // Interleave Logic
      // Strategy: Inject a Company Offering card every 3rd news item.
      const mergedItems = [];
      let offeringIndex = 0;

      posts.forEach((post, index) => {
        mergedItems.push({ type: 'news', data: post });

        // After every 3rd post (index 2, 5, 8...), if we have an offering available, insert it
        if ((index + 1) % 3 === 0 && offeringIndex < generators.length) {
          mergedItems.push({ type: 'offering', data: generators[offeringIndex] });
          offeringIndex++;
        }
      });

      // If we run out of posts but still have offerings, we can optionally append them
      // but for a news feed, usually we just interleave what fits.

      setItems(mergedItems);
      setLoading(false);
    }
    loadData();
  }, [categorySlug, limit]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-axim-teal/20 border-t-axim-teal rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono text-sm animate-pulse">Syncing with AXiM Intelligence...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-16 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-zinc-500 font-mono">
            Establishing secure uplink to AXiM Database... If this persists, verify CORS headers on the origin server.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="section-label">Intelligence Hub</span>
          <h2 className="section-title !mb-0 text-axim-teal">{title || 'Latest Insights & Offerings'}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            if (item.type === 'news') {
              const post = item.data;
              return (
                <motion.div
                  key={`news-${post.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="bg-glass border border-subtle flex flex-col h-full hover:-translate-y-2 hover:bg-glass-hover hover:border-active transition duration-300 group overflow-hidden"
                >
                  {post.featuredImage && (
                    <div className="h-48 overflow-hidden relative border-b border-subtle">
                      <div className="absolute inset-0 bg-axim-teal/10 mix-blend-overlay z-10"></div>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="font-mono text-[0.7rem] opacity-50 text-axim-teal mb-4 block">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      <h3
                        className="text-[1.2rem] font-bold uppercase mb-4 leading-tight group-hover:text-axim-teal transition-colors"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.title) }}
                      ></h3>
                    </a>
                    <div
                      className="text-zinc-400 leading-[1.6] flex-grow mb-6 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.excerpt) }}
                    ></div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.7rem] font-bold uppercase inline-flex items-center gap-2 text-white group-hover:text-axim-teal transition-colors mt-auto"
                    >
                      Read Full Article <SafeIcon icon={LuArrowRight} />
                    </a>
                  </div>
                </motion.div>
              );
            } else {
              const offering = item.data;
              return (
                <motion.div
                  key={`offering-${offering.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="bg-black/80 border-2 border-axim-green/30 p-8 flex flex-col h-full hover:-translate-y-2 hover:bg-black hover:border-axim-green/70 transition duration-300 group shadow-[0_0_20px_rgba(58,170,116,0.1)] hover:shadow-[0_0_30px_rgba(58,170,116,0.2)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-axim-green/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-axim-green/10 flex items-center justify-center text-axim-green border border-axim-green/40 shadow-[0_0_15px_rgba(58,170,116,0.2)]">
                      <SafeIcon icon={LuIcons[offering.iconName]} className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-mono text-[0.65rem] font-bold text-axim-green uppercase tracking-wider block mb-1">AXiM Core Offering</span>
                      <h3 className="text-[1.3rem] font-bold uppercase leading-tight text-white group-hover:text-axim-green transition-colors">{offering.title}</h3>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-[1.6] flex-grow mb-8 relative z-10">{offering.desc}</p>
                  <a
                    href={offering.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.8rem] font-bold uppercase flex items-center justify-center gap-3 text-black bg-axim-green hover:bg-axim-green/90 transition-colors mt-auto rounded px-5 py-3 w-full relative z-10 shadow-[0_0_10px_rgba(58,170,116,0.3)] hover:shadow-[0_0_20px_rgba(58,170,116,0.5)]"
                  >
                    Access Now <SafeIcon icon={LuArrowRight} />
                  </a>
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}
