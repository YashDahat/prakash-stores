import type { JSX } from 'react';
import AccountLayout from '@/components/layout/AccountLayout';
import { useOrdersByUserId } from '@/hooks/orderHooks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

export default function OrderHistoryPage(): React.JSX.Element {
  const { data: orders, isLoading, isError } = useOrdersByUserId();

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </AccountLayout>
    );
  }

  if (isError) {
    return (
      <AccountLayout>
        <div className="text-center text-red-500">
          Error loading order history. Please try again later.
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Order History</h1>

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>
                    <Link
                      to={`${ROUTES.ORDER_HISTORY}/${order.id}`}
                      className="text-[#E87A00] hover:underline transition-all duration-200"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          You haven't placed any orders yet.
        </div>
      )}
    </AccountLayout>
  );
}