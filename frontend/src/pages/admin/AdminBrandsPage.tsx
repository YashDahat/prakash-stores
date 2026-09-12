import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandTable } from '@/components/admin/brand/BrandTable';
import { BrandForm } from '@/components/admin/brand/BrandForm';
import { DeleteBrandDialog } from '@/components/admin/brand/DeleteBrandDialog';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/brandHooks';
import { BrandDto } from '@/types/brand';
import { toast } from 'sonner';

const AdminBrandsPage = () => {
  const { data: brands, isLoading, isError, error } = useBrands();
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const [editingBrand, setEditingBrand] = useState<BrandDto | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<BrandDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleCreateNew = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: BrandDto) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  const handleDelete = (brand: BrandDto) => {
    setDeletingBrand(brand);
  };

  const handleFormSubmit = (data: Partial<BrandDto>) => {
    if (editingBrand) {
      updateBrand(
        { brandId: editingBrand.id, request: data as BrandDto },
        {
          onSuccess: () => {
            toast.success('Brand updated successfully!');
            setIsFormOpen(false);
            setEditingBrand(null);
          },
          onError: (err) => {
            toast.error(`Failed to update brand: ${err.message}`);
          },
        }
      );
    } else {
      createBrand(data as BrandDto, {
        onSuccess: () => {
          toast.success('Brand created successfully!');
          setIsFormOpen(false);
        },
        onError: (err) => {
          toast.error(`Failed to create brand: ${err.message}`);
        },
      });
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBrand(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingBrand) {
      deleteBrand(deletingBrand.id, {
        onSuccess: () => {
          toast.success('Brand deleted successfully!');
          setDeletingBrand(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete brand: ${err.message}`);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeletingBrand(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Manage Brands</CardTitle>
          <Button onClick={handleCreateNew} className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200">
            Add New Brand
          </Button>
        </CardHeader>
        <CardContent>
          <BrandTable
            brands={brands || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            error={isError ? error : null}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{editingBrand ? 'Edit Brand' : 'Create New Brand'}</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandForm
                initialData={editingBrand}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isCreating || isUpdating}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <DeleteBrandDialog
        brand={deletingBrand}
        isOpen={!!deletingBrand}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminBrandsPage;