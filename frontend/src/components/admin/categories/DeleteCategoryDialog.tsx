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
import type { ProductCategory } from '@/types/product';

interface DeleteCategoryDialogProps {
  category: ProductCategory | null;
  onClose: () => void;
  onConfirm: (category: ProductCategory) => void;
}

export function DeleteCategoryDialog({
  category,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps): React.JSX.Element {
  if (!category) {
    return <></>;
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category{' '}
            <span className="font-semibold">{category.name}</span>. Products assigned to it may be
            affected.
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
              onClick={() => onConfirm(category)}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
