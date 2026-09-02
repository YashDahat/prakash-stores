import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/routes';

export default function CategoryShowcase(): React.JSX.Element {
  const categories = [
    {
      name: "Men's Apparel",
      imageUrl: "https://images.unsplash.com/photo-1514317751917-807530f2c459?w=1920&q=80",
      link: `${ROUTES.PRODUCTS}?category=Men`,
      dataTestId: "category-men",
    },
    {
      name: "Women's Apparel",
      imageUrl: "https://images.unsplash.com/photo-1523268753911-b02172776828?w=1920&q=80",
      link: `${ROUTES.PRODUCTS}?category=Women`,
      dataTestId: "category-women",
    },
    {
      name: "Kids' Apparel",
      imageUrl: "https://images.unsplash.com/photo-1592877395674-0466373e7381?w=1920&q=80",
      link: `${ROUTES.PRODUCTS}?category=Kids`,
      dataTestId: "category-kids",
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]" data-testid="category-showcase-section">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.name} className="overflow-hidden rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl" data-testid={category.dataTestId}>
              <div className="relative h-64">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <Link to={category.link}>
                  <Button
                    className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
                    data-testid={`${category.dataTestId}-shop-now-cta`}
                  >
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}