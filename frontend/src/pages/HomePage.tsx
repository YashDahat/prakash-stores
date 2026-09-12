import HeroSection from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import InstagramFeed from '@/components/home/InstagramFeed';
import FloatingWhatsAppButton from '@/components/common/FloatingWhatsAppButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <InstagramFeed />
      <FloatingWhatsAppButton />
    </div>
  );
}