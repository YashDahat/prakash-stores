import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function InstagramFeed(): React.JSX.Element {
  const instagramImages = [
    'https://images.unsplash.com/photo-1515886657613-9f627960383d?w=800&q=80',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80',
    'https://images.unsplash.com/photo-1520006403855-5fce6a83fe51?w=800&q=80',
    'https://images.unsplash.com/photo-1529139574466-a3fd9103edba?w=800&q=80',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
    'https://images.unsplash.com/photo-1525507119060-efc3abfed34c?w=800&q=80',
  ];

  return (
    <section className="bg-[#F5F5F5] py-16 px-4" data-testid="instagram-feed-section">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-4">
          #PrakashStoresStyle on Instagram
        </h2>
        <p className="text-[#212121] leading-relaxed mb-8">
          Follow us on Instagram for daily style inspiration, new arrivals, and behind-the-scenes content!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {instagramImages.map((src, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
              <img
                src={src}
                alt={`Instagram style ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <Link to="https://www.instagram.com/prakashstores/" target="_blank" rel="noopener noreferrer">
          <Button
            className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            data-testid="instagram-cta"
          >
            Follow Us on Instagram
          </Button>
        </Link>
      </div>
    </section>
  );
}