import { Button } from '@/components/ui/button';
// FIXME[invalid-icon]: 'Instagram' is not exported by lucide-react. Replace it (import + all usages) with one of these real icons: Star, Sparkles, Circle.
import { Star } from 'lucide-react';

export default function InstagramFeed(): React.JSX.Element {
  const instagramImages = [
    'https://images.unsplash.com/photo-1516762689617-5bddae3679d7?w=800&q=80',
    'https://images.unsplash.com/photo-1520006403200-5f000b34148b?w=800&q=80',
    'https://images.unsplash.com/photo-1503341504253-b568e8bb3008?w=800&q=80',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80',
    'https://images.unsplash.com/photo-1503342334001-9d7a87090176?w=800&q=80',
    'https://images.unsplash.com/photo-1503342334001-9d7a87090176?w=800&q=80', // Duplicate to fill grid
  ];

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-8">#PrakashStoresStyle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {instagramImages.map((src, index) => (
            <div key={index} className="relative w-full h-48 overflow-hidden group">
              <img
                src={src}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          ))}
        </div>
        <Button
          asChild
          className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          data-testid="instagram-follow-cta"
        >
          <a href="https://www.instagram.com/prakashstores/" target="_blank" rel="noopener noreferrer">
            Follow us on Instagram
          </a>
        </Button>
      </div>
    </section>
  );
}