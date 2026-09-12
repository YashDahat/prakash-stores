import { useLocation, Link } from 'react-router-dom';
import { OrderResponse, OrderItemResponse, OrderStatus } from '@/types/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';

export default function OrderConfirmationPage(): React.JSX.Element {
  const location = useLocation();
  const order = location.state?.order as OrderResponse | undefined;

  if (!order) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-lg text-gray-700 mb-8">
            We could not find details for your order. Please check your order history or contact support.
          </p>
          <Button asChild className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 shadow-lg">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</CardTitle>
            <p className="text-lg text-gray-700">Thank you for your purchase.</p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Order Date:</span>
                <span>{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Order Status:</span>
                <span>{order.status}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-[#E87A00]">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <h3 className="text-2xl font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-1 text-gray-700 mb-6">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p>Phone: {order.shippingAddress.phoneNumber}</p>
            </div>

            <Separator className="my-6" />

            <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item: OrderItemResponse, index: number) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800">Product ID: {item.productId}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#E87A00] text-[#E87A00] hover:bg-[#E87A00] hover:text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                <Link to={ROUTES.ACCOUNT}>View My Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}