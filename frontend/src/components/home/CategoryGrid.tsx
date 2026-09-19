import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoryGrid(): React.JSX.Element {
  const categories = [
    {
      name: 'Men',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e38ee3535914?w=800&q=80',
      link: '/products?category=Men',
    },
    {
      name: 'Women',
      imageUrl: 'https://images.unsplash.com/photo-1542728929-397157833292?w=800&q=80',
      link: '/products?category=Women',
    },
    {
      name: 'Kids',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-9f2733075c61?w=800&q=80',
      link: '/products?category=Kids',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link to={category.link} key={category.name} className="group transition-all duration-200 hover:scale-105">
              <Card className="overflow-hidden rounded-xl shadow-lg border border-gray-100">
                <div className="relative h-64 w-full">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <span className="text-lg font-medium text-[#1A3A6D] group-hover:text-[#E87A00] transition-colors duration-200">
                    Explore {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}