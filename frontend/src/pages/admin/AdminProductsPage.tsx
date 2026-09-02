import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateProductStock } from '@/hooks/productHooks';
import { ProductDto } from '@/types/product';
import { ProductTable } from '@/components/admin/product/ProductTable';
import ProductForm from '@/components/admin/product/ProductForm';
import { DeleteConfirmationDialog } from '@/components/admin/shared/DeleteConfirmationDialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProductStock } = useUpdateProductStock();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);

  const handleAddProduct = (): void => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: ProductDto): void => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: ProductDto): void => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          toast.success('Product deleted successfully.');
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete product: ${err.message}`);
        },
      });
    }
  };

  const handleUpdateStock = (product: ProductDto, newQuantity: number): void => {
    updateProductStock({ productId: product.id, request: { stockQuantity: newQuantity } }, {
      onSuccess: () => {
        toast.success('Product stock updated successfully.');
      },
      onError: (err) => {
        toast.error(`Failed to update stock: ${err.message}`);
      },
    });
  };

  const handleFormSubmit = (data: ProductDto): void => {
    if (editingProduct) {
      updateProduct({ productId: editingProduct.id, request: data }, {
        onSuccess: () => {
          toast.success('Product updated successfully.');
          setIsFormOpen(false);
          setEditingProduct(null);
        },
        onError: (err) => {
          toast.error(`Failed to update product: ${err.message}`);
        },
      });
    } else {
      createProduct(data, {
        onSuccess: () => {
          toast.success('Product created successfully.');
          setIsFormOpen(false);
        },
        onError: (err) => {
          toast.error(`Failed to create product: ${err.message}`);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Management</h1>
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Management</h1>
        <p className="text-red-500">Error loading products: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Management</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddProduct} data-testid="add-product-cta">Add New Product</Button>
      </div>
      <ProductTable
        products={products || []}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onUpdateStock={handleUpdateStock}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemToDeleteName={productToDelete?.name || 'product'}
      />
    </div>
  );
}