import type { JSX } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import InstagramFeed from '@/components/home/InstagramFeed';
import { ROUTES } from '@/routes';

const HomePage = (): React.JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        title="Discover Your Style at Prakash Stores"
        subtitle="Quality Apparel for the Whole Family"
        ctaText="Shop Now"
        ctaLink={ROUTES.PRODUCTS}
        backgroundImage="/Prakash_store_aundh.png"
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Featured Products</h2>
          <FeaturedProducts />
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Shop by Category</h2>
          <CategoryGrid />
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">#PrakashStores on Instagram</h2>
          <InstagramFeed />
        </div>
      </section>
    </div>
  );
};

export default HomePage;