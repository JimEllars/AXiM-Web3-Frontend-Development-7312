import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPostsByCategory } from '../lib/wp-fetch';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import DOMPurify from 'isomorphic-dompurify';
import { ensureSafeProtocol } from '../lib/sanitize';

const { LuArrowRight } = LuIcons;

export default function FeaturedArticles({ categorySlug = 'featured', limit = 2, title = 'Top Stories', fetchPosts = fetchPostsByCategory }) {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['wp-posts-featured', categorySlug, limit],
    queryFn: async () => {
      let fetchedPosts = await fetchPosts(categorySlug, limit);

      return fetchedPosts || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-axim-gold/20 border-t-axim-gold rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono text-sm animate-pulse">Syncing with AXiM Intelligence...</p>
      </div>
    );
  }

  if (posts.length === 0) {
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
          <span className="section-label">Featured Intelligence</span>
          <h2 className="section-title !mb-0 text-axim-gold">{title || 'Top Stories'}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "circOut",
                  delay: idx * 0.1 ,
                }}
              className="bg-glass backdrop-blur-xl saturate-150 border border-subtle flex flex-col h-full hover:-translate-y-2 hover:bg-glass-hover hover:border-active transition duration-300 group overflow-hidden"
            >
              {post.featuredImage && (
                <a href={`https://wp.axim.us.com/article/${post.slug}`} className="block"><div className="aspect-video overflow-hidden relative border-b border-subtle">
                  <div className="absolute inset-0 bg-axim-gold/10 mix-blend-overlay z-10"></div>
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div></a>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <span className="font-mono text-[0.7rem] opacity-50 text-axim-gold mb-4 block">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <a href={`https://wp.axim.us.com/article/${post.slug}`} className="block hover:underline"><h3 className="text-[1.5rem] font-bold uppercase mb-4 leading-tight group-hover:text-axim-gold transition-colors" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}></h3></a>
                <div
                  className="text-zinc-400 leading-[1.7] flex-grow mb-8 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
                ></div>
                <a href={`https://wp.axim.us.com/article/${post.slug}`} className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-white group-hover:text-axim-gold transition-colors mt-auto">
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
