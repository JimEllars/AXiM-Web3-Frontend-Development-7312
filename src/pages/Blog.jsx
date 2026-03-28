import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockPosts } from '../data/mockPosts';
import { Feedback } from '@questlabs/react-sdk';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuClock, LuSearch, LuExternalLink } = LuIcons;

const FEEDBACK_THEME = {
  Form: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    padding: '24px'
  },
  Heading: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  Description: {
    color: '#a1a1aa',
    fontSize: '13px'
  },
  PrimaryButton: {
    backgroundColor: '#FFEA00',
    color: '#000000',
    fontWeight: 'bold',
    borderRadius: '2px',
    textTransform: 'uppercase'
  },
  listHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    iconBackground: '#FFEA00',
    iconColor: '#000000',
    Heading: '#ffffff',
    Description: '#a1a1aa',
    Icon: { color: '#FFEA00' },
    defaultIconBackground: 'rgba(255, 255, 255, 0.03)'
  }
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <span className="section-label">Digital Intelligence</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter">The Briefings</h1>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-sm focus:border-axim-gold outline-none font-mono text-xs uppercase"
          />
          <SafeIcon icon={LuSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-20">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse" />)
          ) : (
            posts.map((post, idx) => (
              <motion.article 
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group border-b border-white/5 pb-16"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple font-mono text-[0.6rem] uppercase rounded">
                    {post.category}
                  </span>
                  <span className="font-mono text-[0.6rem] text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                    <SafeIcon icon={LuClock} className="w-3 h-3" /> {post.readTime} Read
                  </span>
                </div>
                <h2 className="text-4xl font-black uppercase mb-6 group-hover:text-axim-gold transition-colors leading-none tracking-tight">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl">
                  {post.excerpt}
                </p>
                <button className="flex items-center gap-3 font-mono text-[0.7rem] font-bold uppercase text-white group-hover:gap-5 transition-all">
                  Access Full Intelligence <SafeIcon icon={LuExternalLink} />
                </button>
              </motion.article>
            ))
          )}

          {/* User Feedback Section */}
          <div className="pt-12">
            <Feedback 
              questId="axim-intelligence-feedback"
              userId="user_123"
              token="your_token"
              styleConfig={FEEDBACK_THEME}
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            <div className="bg-glass border border-subtle p-8">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6">Trending Briefs</h3>
              <div className="space-y-6">
                {posts.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="text-2xl font-black text-zinc-800 group-hover:text-axim-gold transition-colors">0{i+1}</div>
                    <div>
                      <h4 className="text-sm font-bold uppercase leading-tight mb-1">{p.title}</h4>
                      <div className="text-[0.6rem] text-zinc-600 font-mono uppercase">{p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}