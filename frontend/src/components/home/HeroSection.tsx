import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

export default function HeroSection() {
  return (
    <section
      className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1523381294911-8d3cead1858b?w=1920&q=80')`,
      }}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Discover the Latest Trends at Prakash Stores
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Your trusted local family store for quality apparel since 1970.
        </p>
        <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200" data-testid="shop-now-cta">
          <Link to={ROUTES.PRODUCTS}>Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}