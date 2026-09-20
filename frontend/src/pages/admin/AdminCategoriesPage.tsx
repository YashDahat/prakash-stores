import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';
import { DeleteCategoryDialog } from '@/components/admin/categories/DeleteCategoryDialog';
import {
  useAdminGetAllCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/productHooks';
import type { ProductCategory } from '@/types/product';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ExcelUploadDialog } from '@/components/admin/ExcelUploadDialog';
import { useBulkUploadCategories } from '@/hooks/bulkUploadHooks';

const AdminCategoriesPage = (): React.JSX.Element => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  const { data: categories, isLoading, isError } = useAdminGetAllCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const bulkUploadCategoriesMutation = useBulkUploadCategories();

  const handleCreateCategory = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (category: ProductCategory) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async (category: ProductCategory) => {
    try {
      await deleteCategoryMutation.mutateAsync(category.id);
      toast.success('Category deleted successfully!');
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitForm = async (data: { name: string }) => {
    try {
      if (categoryToEdit) {
        await updateCategoryMutation.mutateAsync({
          id: categoryToEdit.id,
          request: { ...categoryToEdit, name: data.name },
        });
        toast.success('Category updated successfully!');
      } else {
        await createCategoryMutation.mutateAsync({ name: data.name } as ProductCategory);
        toast.success('Category created successfully!');
      }
      setIsFormOpen(false);
      setCategoryToEdit(null);
    } catch (error) {
      toast.error(`Failed to save category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    return <div className="container mx-auto py-4 text-red-500">Error loading categories.</div>;
  }

  const categoriesData = categories || [];

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <div className="flex items-center gap-2">
          <ExcelUploadDialog
            title="Bulk upload categories"
            columns={['name']}
            sampleRow={['Shirts']}
            templateName="categories-template.csv"
            onUpload={(file) => bulkUploadCategoriesMutation.mutateAsync(file)}
          />
          <Button onClick={handleCreateCategory} data-testid="create-category-cta">
            Add New Category
          </Button>
        </div>
      </div>

      <CategoryTable
        categories={categoriesData}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {isFormOpen && (
        <CategoryForm
          initialData={categoryToEdit}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsFormOpen(false);
            setCategoryToEdit(null);
          }}
        />
      )}

      {categoryToDelete && (
        <DeleteCategoryDialog
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
