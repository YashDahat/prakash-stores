import { useParams } from 'react-router-dom';
import { useProductById } from '@/hooks/productHooks';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductReviews from '@/components/product/ProductReviews';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : undefined;

  const { data: product, isLoading, isError, error } = useProductById(productId as number);

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="mt-16">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          <h2 className="text-2xl font-semibold">Error loading product details</h2>
          <p>{error?.message || 'Something went wrong.'}</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p>The product you are looking for does not exist.</p>
        </div>
      </section>
    );
  }

  const imageUrls = product.imageUrl ? [product.imageUrl] : [];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery imageUrls={imageUrls} />
          <ProductInfo product={product} />
        </div>
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </section>
  );
}