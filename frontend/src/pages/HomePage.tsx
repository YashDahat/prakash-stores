import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import InstagramFeed from '@/components/home/InstagramFeed';

export default function HomePage(): React.JSX.Element {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <InstagramFeed />
    </main>
  );
}