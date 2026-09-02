import { useParams } from 'react-router-dom';
import { useProductById } from '@/hooks/productHooks';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductDetails from '@/components/product/ProductDetails';
import { ReviewList } from '@/components/review/ReviewList';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : undefined;

  const { data: product, isLoading, isError, error } = useProductById(productId as number);

  if (isError) {
    toast.error(`Failed to load product: ${error?.message || 'Unknown error'}`);
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error loading product details.</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </section>
    );
  }

  if (isLoading || !product) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>
    );
  }

  const imageUrls = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean) as string[];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImageGallery imageUrls={imageUrls} />
          <ProductDetails product={product} />
        </div>
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Customer Reviews</h2>
          <ReviewList productId={product.id} />
        </div>
      </div>
    </section>
  );
}