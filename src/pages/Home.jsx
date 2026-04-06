import Hero from '../components/Hero';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import Ecosystem from '../components/Ecosystem';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedArticles categorySlug="featured" limit={2} />
      <NewsFeed categorySlug="article" limit={12} />
      <Ecosystem />
    </>
  );
}