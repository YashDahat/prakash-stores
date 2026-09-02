import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/productHooks';
import { useAdminGetAllOrders } from '@/hooks/orderHooks';
import { useEvents } from '@/hooks/eventHooks';
import { ROUTES } from '@/routes';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: orders, isLoading: isLoadingOrders } = useAdminGetAllOrders();
  const { data: events, isLoading: isLoadingEvents } = useEvents();

  const totalProducts = products?.length ?? 0;
  const pendingOrders = orders?.filter(order => order.status === 'PENDING').length ?? 0;
  const upcomingEvents = events?.filter(event => new Date(event.eventDate) > new Date()).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#212121] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card">
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
              <Loader2 className="h-6 w-6 animate-spin text-[#E87A00]" />
            ) : (
              <div className="text-2xl font-bold">{totalProducts}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <Link to={ROUTES.ADMIN_PRODUCTS} className="text-[#E87A00] hover:underline">
                View all products
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="card">
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
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 00-3-3.87m-3-1.13a4 4 0 01-1 3.87"></path>
              <path d="M16 3.13a4 4 0 010 7.75"></path>
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#E87A00]" />
            ) : (
              <div className="text-2xl font-bold">{pendingOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <Link to={ROUTES.ADMIN_ORDERS} className="text-[#E87A00] hover:underline">
                View all orders
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
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
              <Loader2 className="h-6 w-6 animate-spin text-[#E87A00]" />
            ) : (
              <div className="text-2xl font-bold">{upcomingEvents}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <Link to={ROUTES.ADMIN_EVENTS} className="text-[#E87A00] hover:underline">
                View all events
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-[#212121] mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to={ROUTES.ADMIN_PRODUCTS} className="button primary-cta">
            Manage Products
          </Link>
          <Link to={ROUTES.ADMIN_ORDERS} className="button primary-cta">
            Manage Orders
          </Link>
          <Link to={ROUTES.ADMIN_EVENTS} className="button primary-cta">
            Manage Events
          </Link>
        </div>
      </div>
    </div>
  );
}