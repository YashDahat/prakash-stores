import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/routes';
import type { OrderResponse } from '@/types/order';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order as OrderResponse | undefined;

  if (!order) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-4">Order Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We could not find details for your order. Please check your order history or contact support.
          </p>
          <Button asChild className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-[#212121]">Order Confirmed!</CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-xl font-semibold text-[#E87A00]">Order ID: {order.id}</p>
              <p className="text-md text-gray-700">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>

            <Separator className="my-6" />

            <h2 className="text-2xl font-semibold text-[#212121] mb-4">Order Summary</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.unitPrice)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatCurrency(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center text-xl font-bold text-[#212121]">
              <span>Total Amount:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Shipping Address:</span> {order.shippingAddress}
              </p>
              <p>
                <span className="font-semibold">Contact Phone:</span> {order.contactPhone}
              </p>
              <p>
                <span className="font-semibold">Order Type:</span> {order.orderType}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button asChild className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200" data-testid="continue-shopping-cta">
                <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#E87A00] text-[#E87A00] hover:bg-[#E87A00] hover:text-white font-semibold rounded-full px-8 py-3 transition-all duration-200" data-testid="view-orders-cta">
                <Link to={ROUTES.ACCOUNT}>View My Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}