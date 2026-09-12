import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/hooks/orderHooks';
import { OrderStatus, OrderResponse } from '@/types/order';
import { OrderTable } from '@/components/admin/order/OrderTable';
import { OrderDetailView } from '@/components/admin/order/OrderDetailView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminOrdersPage(): React.JSX.Element {
  const { data: orders, isLoading, isError, error } = useOrders();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const handleViewDetails = (order: OrderResponse): void => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (order: OrderResponse, newStatus: OrderStatus): void => {
    updateOrderStatus(
      { orderId: order.id, request: { newStatus } },
      {
        onSuccess: () => {
          toast.success(`Order ${order.id} status updated to ${newStatus}`);
        },
        onError: (err) => {
          toast.error(`Failed to update order status: ${err.message}`);
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && <div className="text-red-500">Error: {error?.message}</div>}
          <OrderTable
            orders={orders || []}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      <OrderDetailView
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}