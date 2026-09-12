import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProductCategoryDto } from '@/types/product';
import { Loader2, Pencil, Trash } from 'lucide-react';

interface CategoryTableProps {
  categories: ProductCategoryDto[];
  onEdit: (category: ProductCategoryDto) => void;
  onDelete: (category: ProductCategoryDto) => void;
  isLoading: boolean;
  error: Error | null;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  isLoading,
  error,
}: CategoryTableProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No categories found.</div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table data-testid="category-table">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} data-testid={`category-row-${category.id}`}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                  data-testid={`edit-category-${category.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category)}
                  data-testid={`delete-category-${category.id}`}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}