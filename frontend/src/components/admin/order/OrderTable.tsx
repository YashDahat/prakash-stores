import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderResponse, OrderStatus, OrderStatusValues } from '@/types/order';

interface OrderTableProps {
  orders: OrderResponse[];
  onUpdateStatus: (order: OrderResponse, newStatus: OrderStatus) => void;
}

export function OrderTable({ orders, onUpdateStatus }: OrderTableProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table data-testid="order-table">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
              <TableCell className="py-3 px-6 text-sm font-medium text-gray-900">{order.id}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">
                <Select
                  value={order.status}
                  onValueChange={(newStatus: OrderStatus) => onUpdateStatus(order, newStatus)}
                  data-testid={`order-status-select-${order.id}`}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {OrderStatusValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">{order.orderType}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">{order.shippingAddress}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">{order.contactPhone}</TableCell>
              <TableCell className="py-3 px-6 text-sm text-gray-500">
                {/* No additional actions specified beyond status update */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}