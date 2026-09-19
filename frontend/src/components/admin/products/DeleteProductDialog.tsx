import type { JSX } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { ProductDto } from '@/types/product';

interface DeleteProductDialogProps {
  product: ProductDto | null;
  onClose: () => void;
  onConfirm: (product: ProductDto) => void;
}

export function DeleteProductDialog({
  product,
  onClose,
  onConfirm,
}: DeleteProductDialogProps): React.JSX.Element {
  if (!product) {
    return <></>;
  }

  return (
    <AlertDialog open={!!product} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product{' '}
            <span className="font-semibold">{product.name}</span> from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-[#E87A00] hover:bg-[#D46C00] text-white"
              onClick={() => onConfirm(product)}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}