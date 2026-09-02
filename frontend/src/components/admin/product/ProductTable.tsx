import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductDto } from '@/types/product';

interface ProductTableProps {
  products: ProductDto[];
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
  onUpdateStock: (product: ProductDto, newQuantity: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onUpdateStock,
}: ProductTableProps): React.JSX.Element {
  const [stockQuantities, setStockQuantities] = useState<Record<number, number>>(
    products.reduce((acc, product) => {
      acc[product.id] = product.stockQuantity;
      return acc;
    }, {} as Record<number, number>)
  );

  const handleStockChange = (productId: number, newQuantity: number): void => {
    setStockQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleUpdateStockClick = (product: ProductDto): void => {
    const newQuantity = stockQuantities[product.id];
    if (newQuantity !== undefined && newQuantity !== product.stockQuantity) {
      onUpdateStock(product, newQuantity);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Quantity
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50">
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.id}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ₹{product.price.toFixed(2)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStockChange(product.id, Math.max(0, (stockQuantities[product.id] || 0) - 1))}
                    data-testid={`decrease-stock-${product.id}`}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={stockQuantities[product.id] || 0}
                    onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                    className="w-20 text-center"
                    data-testid={`stock-input-${product.id}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStockChange(product.id, (stockQuantities[product.id] || 0) + 1)}
                    data-testid={`increase-stock-${product.id}`}
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => handleUpdateStockClick(product)}
                    className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-md px-3 py-1 transition-all duration-200"
                    size="sm"
                    data-testid={`update-stock-button-${product.id}`}
                  >
                    Update
                  </Button>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.brand}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onEdit(product)}
                    className="text-[#E87A00] hover:text-[#D46A00] transition-all duration-200"
                    variant="ghost"
                    size="sm"
                    data-testid={`edit-product-${product.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:text-red-800 transition-all duration-200"
                    variant="ghost"
                    size="sm"
                    data-testid={`delete-product-${product.id}`}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}