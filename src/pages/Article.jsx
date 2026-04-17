import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWordPressPost } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import DOMPurify from 'isomorphic-dompurify';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function Article() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['wp-post', slug],
    queryFn: () => getWordPressPost(slug),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center relative z-10 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-axim-teal/20 border-t-axim-teal rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono text-sm animate-pulse">Syncing with AXiM Intelligence...</p>
      </div>
    );
  }

  if (error || !data || !data.data || !data.data.post) {
    return (
      <div className="py-24 flex flex-col justify-center items-center relative z-10 min-h-[60vh]">
        <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold uppercase mb-2">Protocol Error</h2>
        <p className="text-zinc-500 mb-6">Could not retrieve the requested intelligence file.</p>
        <Link to="/articles" className="btn btn-outline">
          Return to Hub
        </Link>
      </div>
    );
  }

  const post = data.data.post;
  const seoTitle = DOMPurify.sanitize(post.title, { ALLOWED_TAGS: [] });

  // Since we fetch via GraphQL getWordPressPost which returns title/content, we'll use a snippet of content for the description if excerpt isn't available
  const snippet = DOMPurify.sanitize(post.content, { ALLOWED_TAGS: [] }).substring(0, 160);
  const featuredImage = post.featuredImage?.node?.sourceUrl;

  return (
    <div className="w-full relative z-10">
      <SEO
        title={seoTitle}
        description={snippet}
        type="article"
        image={featuredImage}
      />
      <div className="max-w-[800px] mx-auto px-6 pt-20 pb-10">
        <Link to="/articles" className="inline-flex items-center gap-2 text-axim-teal font-mono text-xs uppercase tracking-widest hover:underline mb-8">
          <SafeIcon icon={LuIcons.LuArrowLeft} /> Back to Network
        </Link>
        <h1
          className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}
        ></h1>
        <div
          className="prose prose-invert prose-axim max-w-none text-zinc-300"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        ></div>
      </div>
    </div>
  );
}
