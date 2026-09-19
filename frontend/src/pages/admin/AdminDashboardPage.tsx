import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/orderHooks';
import { useAdminGetAllProducts } from '@/hooks/productHooks';
import { usePendingReviews } from '@/hooks/reviewHooks';
import { Package, ShoppingCart, Star } from 'lucide-react';

export default function AdminDashboardPage(): React.JSX.Element {
  const { data: products, isLoading: isLoadingProducts } = useAdminGetAllProducts();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: pendingReviews, isLoading: isLoadingReviews } = usePendingReviews();

  const totalProducts = products?.length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const totalPendingReviews = pendingReviews?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#212121]">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card data-testid="dashboard-products-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingProducts ? <div className="h-7 w-20 bg-gray-200 animate-pulse rounded" /> : totalProducts}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="dashboard-orders-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOrders ? <div className="h-7 w-20 bg-gray-200 animate-pulse rounded" /> : totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="dashboard-reviews-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingReviews ? <div className="h-7 w-20 bg-gray-200 animate-pulse rounded" /> : totalPendingReviews}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}