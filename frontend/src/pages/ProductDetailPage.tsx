import { useParams } from 'react-router-dom';
import { useProductById } from '@/hooks/productHooks';
import { useReviewsByProductId } from '@/hooks/reviewHooks';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductReviews from '@/components/reviews/ProductReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : undefined;

  const { data: product, isLoading: isLoadingProduct, isError: isErrorProduct } = useProductById(productId as number);
  const { data: reviews, isLoading: isLoadingReviews, isError: isErrorReviews } = useReviewsByProductId(productId as number);

  if (isLoadingProduct || isLoadingReviews) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <Separator className="my-8" />
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isErrorProduct || !product) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        <p>Error loading product details or product not found.</p>
      </div>
    );
  }

  if (isErrorReviews) {
    // Optionally display an error for reviews but still show product details
    console.error("Error loading reviews:", isErrorReviews);
  }

  const imageUrls = product.imageUrl ? [product.imageUrl] : []; // Assuming product.imageUrl is the primary image

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery imageUrls={imageUrls} />
          <ProductInfo product={product} />
        </div>
        <Separator className="my-8" />
        <ProductReviews productId={product.id} />
      </div>
    </section>
  );
}