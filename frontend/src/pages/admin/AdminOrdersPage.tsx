import { useState } from 'react';
import { useAdminGetAllOrders, useUpdateOrderStatus } from '@/hooks/orderHooks';
import { OrderStatus, OrderResponse } from '@/types/order';
import { OrderTable } from '@/components/admin/order/OrderTable';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusValues } from '@/types/order';

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError, error } = useAdminGetAllOrders();
  const { mutate: updateOrderStatusMutation, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  const handleUpdateStatus = (order: OrderResponse, newStatus: OrderStatus): void => {
    updateOrderStatusMutation(order.id, {
      onSuccess: () => {
        toast.success(`Order ${order.id} status updated to ${newStatus}`);
      },
      onError: (err) => {
        toast.error(`Failed to update order status: ${err.message}`);
      },
    });
  };

  const filteredOrders = orders?.filter(order =>
    filterStatus === 'ALL' || order.status === filterStatus
  ) || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-6">Order Management</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-6">Order Management</h1>
        <p className="text-red-500">Error loading orders: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-6">Order Management</h1>

      <div className="mb-4 flex justify-end">
        <Select
          onValueChange={(value: OrderStatus | 'ALL') => setFilterStatus(value)}
          value={filterStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {OrderStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <OrderTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
}