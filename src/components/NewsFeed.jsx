import React, { useMemo } from "react";
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getWordPressPost } from '../lib/wp-fetch';
import { fetchPostsByCategory } from '../lib/wp-fetch';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import DOMPurify from 'isomorphic-dompurify';
import { ensureSafeProtocol } from '../lib/sanitize';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import { generators } from '../data/companyOfferings';

const { LuArrowRight } = LuIcons;

export default function NewsFeed({ categorySlug = 'article', limit = 12, title = 'Latest Insights & Offerings', fetchPosts = fetchPostsByCategory }) {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['wp-posts', categorySlug, limit],
    queryFn: async () => {
      let fetchedPosts = await fetchPosts(categorySlug, limit);

      return fetchedPosts;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const items = useMemo(() => {
    if (!posts) return [];

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

    return mergedItems;
  }, [posts]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-axim-teal/20 border-t-axim-teal rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono text-sm animate-pulse">Syncing with AXiM Intelligence...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <DatabaseUplinkError />;
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
                  className="bg-glass backdrop-blur-xl saturate-150 border border-subtle flex flex-col h-full hover:-translate-y-2 hover:bg-glass-hover hover:border-active transition duration-300 group overflow-hidden"
                >
                  {post.featuredImage && (
                    <Link to={`/article/${post.slug}`} className="block" onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['wp-post', post.slug], queryFn: () => getWordPressPost(post.slug), staleTime: 1000 * 60 * 5 })}><div className="h-48 overflow-hidden relative border-b border-subtle">
                      <div className="absolute inset-0 bg-axim-teal/10 mix-blend-overlay z-10"></div>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div></Link>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="font-mono text-[0.7rem] opacity-50 text-axim-teal mb-4 block">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <Link to={`/article/${post.slug}`} className="block hover:underline" onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['wp-post', post.slug], queryFn: () => getWordPressPost(post.slug), staleTime: 1000 * 60 * 5 })}><h3 className="text-[1.2rem] font-bold uppercase mb-4 leading-tight group-hover:text-axim-teal transition-colors" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}></h3></Link>
                    <div
                      className="text-zinc-400 leading-[1.6] flex-grow mb-6 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
                    ></div>
                    <Link to={`/article/${post.slug}`} className="font-mono text-[0.7rem] font-bold uppercase inline-flex items-center gap-2 text-white group-hover:text-axim-teal transition-colors mt-auto" onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['wp-post', post.slug], queryFn: () => getWordPressPost(post.slug), staleTime: 1000 * 60 * 5 })}>
                      Read Full Article <SafeIcon icon={LuArrowRight} />
                    </Link>
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
                    href={ensureSafeProtocol(offering.externalUrl ? `${offering.externalUrl}?source=axim_hub` : '#')}
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
