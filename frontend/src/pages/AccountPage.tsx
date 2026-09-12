import { useAuth } from '@/context/AuthContext';
import { useMyOrders } from '@/hooks/orderHooks';
import { useMyLoyaltyPoints } from '@/hooks/loyaltyHooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProfileDetails from '@/components/account/ProfileDetails';
import OrderHistory from '@/components/account/OrderHistory';
import LoyaltyPointsSummary from '@/components/account/LoyaltyPointsSummary';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: orders, isLoading: isOrdersLoading, isError: isOrdersError } = useMyOrders();
  const { data: loyaltyPoints, isLoading: isLoyaltyLoading, isError: isLoyaltyError } = useMyLoyaltyPoints();

  if (isAuthLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-8">My Account</h1>
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600">Please log in to view your account details.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-fit">
            <TabsTrigger value="profile" data-testid="account-tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="orders" data-testid="account-tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="loyalty" data-testid="account-tab-loyalty">Loyalty Points</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
              {user ? <ProfileDetails user={user} /> : <p>No profile data available.</p>}
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Order History</h2>
              {isOrdersLoading && <Skeleton className="h-48 w-full" />}
              {isOrdersError && <p className="text-red-500">Error loading orders.</p>}
              {orders && orders.length > 0 ? (
                <OrderHistory orders={orders} />
              ) : (
                !isOrdersLoading && <p>You have no past orders.</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Loyalty Points</h2>
              {isLoyaltyLoading && <Skeleton className="h-32 w-full" />}
              {isLoyaltyError && <p className="text-red-500">Error loading loyalty points.</p>}
              {loyaltyPoints ? (
                <LoyaltyPointsSummary loyaltyPoints={loyaltyPoints} />
              ) : (
                !isLoyaltyLoading && <p>No loyalty points data available.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}