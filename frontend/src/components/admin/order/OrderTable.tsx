import type { JSX } from 'react';
import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderResponse, OrderStatus, OrderStatusValues } from '@/types/order';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OrderTableProps {
  orders: OrderResponse[];
  onViewDetails: (order: OrderResponse) => void;
  onUpdateStatus: (order: OrderResponse, newStatus: OrderStatus) => void;
  isLoading: boolean;
  error: Error | null;
}

export function OrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  isLoading,
  error,
}: OrderTableProps): React.JSX.Element {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = orders.filter(order =>
    filterStatus === 'ALL' ? true : order.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <Select
          value={filterStatus}
          onValueChange={(value: OrderStatus | 'ALL') => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {OrderStatusValues.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={newStatus => onUpdateStatus(order, newStatus as OrderStatus)}
                    >
                      <SelectTrigger
                        className={cn(
                          'w-[120px] capitalize',
                          order.status === 'PENDING' && 'text-yellow-600',
                          order.status === 'PROCESSING' && 'text-blue-600',
                          order.status === 'SHIPPED' && 'text-indigo-600',
                          order.status === 'DELIVERED' && 'text-green-600',
                          order.status === 'CANCELLED' && 'text-red-600'
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OrderStatusValues.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order)}
                      data-testid={`view-details-${order.id}`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}