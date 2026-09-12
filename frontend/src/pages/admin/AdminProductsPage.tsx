import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductTable } from '@/components/admin/product/ProductTable';
import ProductForm from '@/components/admin/product/ProductForm';
import DeleteProductDialog from '@/components/admin/product/DeleteProductDialog';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/productHooks';
import { ProductDto } from '@/types/product';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductDto | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateNew = (): void => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: ProductDto): void => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: ProductDto): void => {
    setDeletingProduct(product);
  };

  const handleFormSubmit = (data: Partial<ProductDto>): void => {
    if (editingProduct) {
      updateProduct(
        { productId: editingProduct.id, request: data as ProductDto },
        {
          onSuccess: () => {
            toast.success('Product updated successfully!');
            setShowForm(false);
            setEditingProduct(null);
          },
          onError: (err) => {
            toast.error(`Failed to update product: ${err.message}`);
          },
        }
      );
    } else {
      createProduct(data as ProductDto, {
        onSuccess: () => {
          toast.success('Product created successfully!');
          setShowForm(false);
        },
        onError: (err) => {
          toast.error(`Failed to create product: ${err.message}`);
        },
      });
    }
  };

  const handleFormCancel = (): void => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = (): void => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id, {
        onSuccess: () => {
          toast.success('Product deleted successfully!');
          setDeletingProduct(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete product: ${err.message}`);
        },
      });
    }
  };

  const handleDeleteClose = (): void => {
    setDeletingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold text-[#212121]">Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm && (
            <div className="mb-4">
              <Button
                onClick={handleCreateNew}
                className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                data-testid="create-product-cta"
              >
                Add New Product
              </Button>
            </div>
          )}

          {showForm ? (
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isCreating || isUpdating}
            />
          ) : (
            <ProductTable
              products={products || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              error={isError ? error : null}
            />
          )}
        </CardContent>
      </Card>

      <DeleteProductDialog
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}