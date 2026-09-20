import type { JSX } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { DeleteProductDialog } from '@/components/admin/products/DeleteProductDialog';
import {
  useAdminGetAllProducts,
  useAdminGetProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAdminGetAllBrands,
  useAdminGetAllCategories,
} from '@/hooks/productHooks';
import { ProductDto } from '@/types/product';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ExcelUploadDialog } from '@/components/admin/ExcelUploadDialog';
import { useBulkUploadProducts } from '@/hooks/bulkUploadHooks';

const AdminProductsPage = (): React.JSX.Element => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>('id,asc');

  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useAdminGetAllProducts();
  const { data: brands, isLoading: isLoadingBrands } = useAdminGetAllBrands();
  const { data: categories, isLoading: isLoadingCategories } = useAdminGetAllCategories();
  const { data: productToEdit, isLoading: isLoadingProductToEdit } = useAdminGetProductById(selectedProductId!);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const bulkUploadProductsMutation = useBulkUploadProducts();

  const handleCreateProduct = () => {
    setSelectedProductId(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: ProductDto) => {
    setSelectedProductId(product.id);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: ProductDto) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (product: ProductDto) => {
    try {
      await deleteProductMutation.mutateAsync(product.id);
      toast.success('Product deleted successfully!');
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitForm = async (data: Omit<ProductDto, 'id' | 'brandName' | 'categoryName'>) => {
    try {
      if (selectedProductId) {
        await updateProductMutation.mutateAsync({ id: selectedProductId, request: data as ProductDto });
        toast.success('Product updated successfully!');
      } else {
        await createProductMutation.mutateAsync(data as ProductDto);
        toast.success('Product created successfully!');
      }
      setIsFormOpen(false);
      setSelectedProductId(null);
    } catch (error) {
      toast.error(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoadingProducts || isLoadingBrands || isLoadingCategories) {
    return (
      <div className="container mx-auto py-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isErrorProducts) {
    return <div className="container mx-auto py-4 text-red-500">Error loading products.</div>;
  }

  const productsData = products || [];
  const brandsData = brands || [];
  const categoriesData = categories || [];

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex items-center gap-2">
          <ExcelUploadDialog
            title="Bulk upload products"
            columns={['name', 'price', 'description', 'stock', 'imageUrl', 'brand', 'category']}
            sampleRow={['Cotton Shirt', '799', 'Slim-fit cotton shirt', '25', '', 'Peter England', 'Shirts']}
            templateName="products-template.csv"
            onUpload={(file) => bulkUploadProductsMutation.mutateAsync(file)}
          />
          <Button onClick={handleCreateProduct} data-testid="create-product-cta">
            Add New Product
          </Button>
        </div>
      </div>

      <ProductTable
        products={productsData}
        page={page}
        totalPages={1} // Assuming no pagination for now, as useAdminGetAllProducts doesn't return page info
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onPageChange={setPage}
        onSortChange={setSort}
      />

      {isFormOpen && (
        <ProductForm
          initialData={selectedProductId ? productToEdit || null : null}
          brands={brandsData}
          categories={categoriesData}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedProductId(null);
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteProductDialog
          product={productToDelete}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;