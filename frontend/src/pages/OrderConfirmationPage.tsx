import { Link, useSearchParams } from 'react-router-dom';
import { useOrderById } from '@/hooks/orderHooks';
import { OrderStatus, ShippingMethod } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const OrderConfirmationPage = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: order, isLoading, isError, error } = useOrderById(orderId ? parseInt(orderId) : -1);

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          </div>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Separator />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Separator />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-xl text-gray-700">Failed to load order details: {error?.message}</p>
          <Button asChild className="mt-8 bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            <Link to={ROUTES.HOME}>Back to Home</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-xl text-gray-700">The order you are looking for does not exist or the ID is invalid.</p>
          <Button asChild className="mt-8 bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            <Link to={ROUTES.HOME}>Back to Home</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1A3A6D] mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-700">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-[#F5F5F5] rounded-t-xl">
            <CardTitle className="text-2xl font-semibold text-[#1A3A6D]">Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString('en-IN')}</p>
                <p><strong>Status:</strong> {order.orderStatus === OrderStatus.PENDING_PAYMENT ? 'Pending Payment' : order.orderStatus}</p>
                <p><strong>Shipping Method:</strong> {order.shippingMethod === ShippingMethod.HOME_DELIVERY ? 'Home Delivery' : 'Click & Collect'}</p>
              </div>
              <div>
                <p><strong>Shipping Address:</strong></p>
                <p>{order.shippingAddress}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-[#1A3A6D] mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <p className="text-gray-800">{item.productName} (x{item.quantity})</p>
                    <p className="font-medium text-gray-900">{formatCurrency(item.priceAtPurchase * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold text-[#1A3A6D]">
              <span>Total Amount:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>

            <div className="text-center pt-6">
              <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;