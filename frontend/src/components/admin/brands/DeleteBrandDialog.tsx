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
import type { Brand } from '@/types/brand';

interface DeleteBrandDialogProps {
  brand: Brand | null;
  onClose: () => void;
  onConfirm: (brand: Brand) => void;
}

export function DeleteBrandDialog({
  brand,
  onClose,
  onConfirm,
}: DeleteBrandDialogProps): React.JSX.Element {
  if (!brand) {
    return <></>;
  }

  return (
    <AlertDialog open={!!brand} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the brand{' '}
            <span className="font-semibold">{brand.name}</span>. Products assigned to it may be
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
              onClick={() => onConfirm(brand)}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
