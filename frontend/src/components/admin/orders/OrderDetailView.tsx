import type { JSX } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderDto, OrderStatus, OrderStatusValues } from '@/types/order';
import React, { useEffect, useState } from 'react';

interface OrderDetailViewProps {
  order: OrderDto | null;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
  onClose: () => void;
  isSaving?: boolean;
}

export function OrderDetailView({ order, onUpdateStatus, onClose, isSaving = false }: OrderDetailViewProps): React.JSX.Element {
  // Hold the dropdown selection locally so the admin can pick a status and then explicitly Save,
  // rather than firing an update on every change. Re-sync whenever the order (or its saved
  // status) changes so the Save button correctly disables once persisted.
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(order?.orderStatus);

  useEffect(() => {
    setSelectedStatus(order?.orderStatus);
  }, [order?.id, order?.orderStatus]);

  if (!order) {
    return <Dialog open={false} onOpenChange={onClose} />;
  }

  const handleSave = (): void => {
    if (selectedStatus && selectedStatus !== order.orderStatus) {
      onUpdateStatus(order.id, selectedStatus);
    }
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details (ID: {order.id})</DialogTitle>
          <DialogDescription>View and update the status of this order.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Order Date:</span>
            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Total Amount:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Shipping Address:</span>
            <span>{order.shippingAddress}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Shipping Method:</span>
            <span>{order.shippingMethod}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Payment ID:</span>
            <span>{order.paymentId}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
              <SelectTrigger className="w-[180px]" data-testid="order-status-select">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {OrderStatusValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold">Order Items</h3>
          {order.orderItems.length > 0 ? (
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <span>
                    {item.productName} (x{item.quantity})
                  </span>
                  <span>{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in this order.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !selectedStatus || selectedStatus === order.orderStatus}
            data-testid="order-status-save"
          >
            {isSaving ? 'Saving...' : 'Save Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}