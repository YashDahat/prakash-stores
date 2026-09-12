import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/productHooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/routes';

export function CategoryShowcase() {
  const { data: categories, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-xl shadow-md border border-gray-100 p-0">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4 text-center">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          <p>Error loading categories: {error?.message}</p>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>No categories found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`${ROUTES.PRODUCTS}?categoryId=${category.id}`}
              className="block group transition-all duration-200 hover:scale-105"
              data-testid={`category-card-${category.id}`}
            >
              <Card className="overflow-hidden rounded-xl shadow-md border border-gray-100 p-0">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={category.imageUrl || 'https://via.placeholder.com/400x300?text=Category+Image'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold text-center">{category.name}</h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}