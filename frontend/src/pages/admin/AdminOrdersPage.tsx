import type { JSX } from 'react';
import { useState } from 'react';
import { OrderDto, OrderStatus } from '@/types/order';
import { useOrders, useUpdateOrderStatus } from '@/hooks/orderHooks';
import { OrderTable } from '@/components/admin/orders/OrderTable';
import { OrderDetailView } from '@/components/admin/orders/OrderDetailView';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AdminOrdersPage(): React.JSX.Element {
  const { data: orders, isLoading, isError, error } = useOrders();
  const { mutateAsync: updateOrderStatus, isPending: isSavingStatus } = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  const handleViewDetails = (order: OrderDto): void => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = (): void => {
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus): Promise<void> => {
    try {
      await updateOrderStatus({ orderId, request: newStatus });
      toast.success('Order status updated successfully!');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
    } catch (err) {
      toast.error(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      {orders && orders.length > 0 ? (
        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      ) : (
        <div className="text-center py-10">No orders found.</div>
      )}

      {selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onClose={handleCloseDetails}
          isSaving={isSavingStatus}
        />
      )}
    </div>
  );
}