import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandDto } from '@/types/brand';
import { Pencil, Trash2 } from 'lucide-react';

interface BrandTableProps {
  brands: BrandDto[];
  onEdit: (brand: BrandDto) => void;
  onDelete: (brand: BrandDto) => void;
  isLoading: boolean;
  error: Error | null;
}

export function BrandTable({ brands, onEdit, onDelete, isLoading, error }: BrandTableProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!brands || brands.length === 0) {
    return <div className="text-center py-8 text-gray-500">No brands found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table data-testid="brand-table">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id} data-testid={`brand-row-${brand.id}`}>
              <TableCell className="font-medium">{brand.id}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.description}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(brand)}
                  className="mr-2"
                  data-testid={`edit-brand-${brand.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(brand)}
                  data-testid={`delete-brand-${brand.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}