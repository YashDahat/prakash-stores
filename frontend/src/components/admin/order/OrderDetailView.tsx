import type { JSX } from 'react';
import { OrderResponse, OrderStatus } from '@/types/order';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface OrderDetailViewProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export function OrderDetailView({ order, onClose }: OrderDetailViewProps): React.JSX.Element {
  if (!order) {
    return (
      <Dialog open={false} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>No order selected.</DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle data-testid="order-detail-title">Order #{order.id}</DialogTitle>
          <DialogDescription>Details for order placed on {new Date(order.orderDate).toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>User ID:</strong> {order.userId}</p>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> <Badge variant={order.status === OrderStatus.CANCELLED ? 'destructive' : 'default'}>{order.status}</Badge></p>
            <p><strong>Payment Gateway Order ID:</strong> {order.paymentGatewayOrderId}</p>
          </div>
          {order.shippingAddress && (
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>Phone: {order.shippingAddress.phoneNumber}</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price at Purchase</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.priceAtPurchase.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{(item.quantity * item.priceAtPurchase).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} data-testid="order-detail-close-button">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simple Badge component for status display
function Badge({ variant, children }: { variant?: 'default' | 'destructive'; children: React.ReactNode }): React.JSX.Element {
  const baseClasses = "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  };
  const classes = `${baseClasses} ${variantClasses[variant || 'default']}`;
  return <span className={classes}>{children}</span>;
}