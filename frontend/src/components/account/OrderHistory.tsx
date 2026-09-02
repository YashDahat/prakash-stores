import { useOrders } from '@/hooks/orderHooks';
import { OrderResponse, OrderItemResponse } from '@/types/order';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderHistory(): React.JSX.Element {
  const { data: orders, isLoading, isError } = useOrders();

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load order history.</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">No orders found.</h3>
        <p className="text-gray-600 mt-2">Looks like you haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Your Order History</h2>
      {orders.map((order: OrderResponse) => (
        <Card key={order.id} className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{order.id}</span>
              <span className="text-sm font-normal text-gray-500">
                {new Date(order.orderDate).toLocaleDateString()}
              </span>
            </CardTitle>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Status: <span className="font-medium">{order.status}</span></span>
              <span>Total: <span className="font-medium">{formatCurrency(order.totalAmount)}</span></span>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <h4 className="text-lg font-medium mb-2">Items:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItemResponse) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Order details for Order #{order.id}</TableCaption>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}