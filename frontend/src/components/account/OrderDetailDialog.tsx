import React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderDto, OrderStatus } from '@/types/order';
import { useCancelOrder } from '@/hooks/orderHooks';

// An order can only be cancelled by the customer while it is still pending or being processed.
const CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.PROCESSING];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

interface OrderDetailDialogProps {
  order: OrderDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only view of a customer's order shown in a dialog (replaces the old detail route that 404'd),
 * plus a guarded "Cancel Order" action available only while the order is still cancellable.
 */
export default function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps): React.JSX.Element | null {
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  if (!order) {
    return null;
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.orderStatus);

  const handleCancel = (): void => {
    cancelOrder(order.id, {
      onSuccess: () => {
        toast.success(`Order #${order.id} cancelled.`);
        onOpenChange(false);
      },
      onError: () => {
        toast.error('This order could not be cancelled. Please try again.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order #{order.id}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge variant={order.orderStatus === OrderStatus.CANCELLED ? 'destructive' : 'secondary'}>
              {order.orderStatus.replace(/_/g, ' ')}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-6">
            <span className="text-sm text-gray-500 shrink-0">Shipping Address</span>
            <span className="text-sm text-right">{order.shippingAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Shipping Method</span>
            <span className="text-sm">{order.shippingMethod}</span>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-2">Items</h3>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.productName} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span>{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {canCancel ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                  {isPending ? 'Cancelling…' : 'Cancel Order'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Order #{order.id} will be cancelled and the items released. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>Yes, cancel it</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
