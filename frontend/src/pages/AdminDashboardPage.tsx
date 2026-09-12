import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';
import { useProducts } from '@/hooks/productHooks';
import { useOrders } from '@/hooks/orderHooks';
import { useReviews } from '@/hooks/reviewHooks';
import { useEvents } from '@/hooks/storeEventHooks';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders } = useOrders();
  const { data: reviews, isLoading: isLoadingReviews, isError: isErrorReviews } = useReviews();
  const { data: events, isLoading: isLoadingEvents, isError: isErrorEvents } = useEvents();

  const pendingOrders = orders?.filter(order => order.status === 'PENDING').length || 0;
  const pendingReviews = reviews?.filter(review => review.status === 'PENDING').length || 0;
  const totalProducts = products?.length || 0;
  const totalEvents = events?.length || 0;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card data-testid="dashboard-card-products">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : isErrorProducts ? (
              <p className="text-red-500">Error loading products</p>
            ) : (
              <div className="text-2xl font-bold">{totalProducts}</div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="dashboard-card-orders">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : isErrorOrders ? (
              <p className="text-red-500">Error loading orders</p>
            ) : (
              <div className="text-2xl font-bold">{pendingOrders}</div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="dashboard-card-reviews">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : isErrorReviews ? (
              <p className="text-red-500">Error loading reviews</p>
            ) : (
              <div className="text-2xl font-bold">{pendingReviews}</div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="dashboard-card-events">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : isErrorEvents ? (
              <p className="text-red-500">Error loading events</p>
            ) : (
              <div className="text-2xl font-bold">{totalEvents}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card data-testid="dashboard-quick-links">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-products">
              <Link to={ROUTES.ADMIN_PRODUCTS}>Manage Products</Link>
            </Button>
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-orders">
              <Link to={ROUTES.ADMIN_ORDERS}>Manage Orders</Link>
            </Button>
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-reviews">
              <Link to={ROUTES.ADMIN_REVIEWS}>Moderate Reviews</Link>
            </Button>
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-events">
              <Link to={ROUTES.ADMIN_EVENTS}>Manage Events</Link>
            </Button>
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-categories">
              <Link to={ROUTES.ADMIN_CATEGORIES}>Manage Categories</Link>
            </Button>
            <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold transition-all duration-200" data-testid="quick-link-brands">
              <Link to={ROUTES.ADMIN_BRANDS}>Manage Brands</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}