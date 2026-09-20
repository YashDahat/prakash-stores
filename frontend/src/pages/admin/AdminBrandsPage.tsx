import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrandTable } from '@/components/admin/brands/BrandTable';
import { BrandForm } from '@/components/admin/brands/BrandForm';
import { DeleteBrandDialog } from '@/components/admin/brands/DeleteBrandDialog';
import {
  useAdminGetAllBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/productHooks';
import type { Brand } from '@/types/brand';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ExcelUploadDialog } from '@/components/admin/ExcelUploadDialog';
import { useBulkUploadBrands } from '@/hooks/bulkUploadHooks';

const AdminBrandsPage = (): React.JSX.Element => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const { data: brands, isLoading, isError } = useAdminGetAllBrands();

  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();
  const bulkUploadBrandsMutation = useBulkUploadBrands();

  const handleCreateBrand = () => {
    setBrandToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setBrandToEdit(brand);
    setIsFormOpen(true);
  };

  const handleDeleteBrand = (brand: Brand) => {
    setBrandToDelete(brand);
  };

  const handleConfirmDelete = async (brand: Brand) => {
    try {
      await deleteBrandMutation.mutateAsync(brand.id);
      toast.success('Brand deleted successfully!');
      setBrandToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete brand: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitForm = async (data: { name: string }) => {
    try {
      if (brandToEdit) {
        await updateBrandMutation.mutateAsync({
          id: brandToEdit.id,
          request: { ...brandToEdit, name: data.name },
        });
        toast.success('Brand updated successfully!');
      } else {
        await createBrandMutation.mutateAsync({ name: data.name } as Brand);
        toast.success('Brand created successfully!');
      }
      setIsFormOpen(false);
      setBrandToEdit(null);
    } catch (error) {
      toast.error(`Failed to save brand: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto py-4 text-red-500">Error loading brands.</div>;
  }

  const brandsData = brands || [];

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Management</h1>
        <div className="flex items-center gap-2">
          <ExcelUploadDialog
            title="Bulk upload brands"
            columns={['name']}
            sampleRow={['Peter England']}
            templateName="brands-template.csv"
            onUpload={(file) => bulkUploadBrandsMutation.mutateAsync(file)}
          />
          <Button onClick={handleCreateBrand} data-testid="create-brand-cta">
            Add New Brand
          </Button>
        </div>
      </div>

      <BrandTable
        brands={brandsData}
        onEdit={handleEditBrand}
        onDelete={handleDeleteBrand}
      />

      {isFormOpen && (
        <BrandForm
          initialData={brandToEdit}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsFormOpen(false);
            setBrandToEdit(null);
          }}
        />
      )}

      {brandToDelete && (
        <DeleteBrandDialog
          brand={brandToDelete}
          onClose={() => setBrandToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminBrandsPage;
