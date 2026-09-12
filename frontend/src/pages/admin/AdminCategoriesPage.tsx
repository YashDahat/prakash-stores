import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTable } from '@/components/admin/category/CategoryTable';
import CategoryForm from '@/components/admin/category/CategoryForm';
import { DeleteCategoryDialog } from '@/components/admin/category/DeleteCategoryDialog';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/productHooks';
import { ProductCategoryDto } from '@/types/product';
import { toast } from 'sonner';

const AdminCategoriesPage = () => {
  const { data: categories, isLoading, isError, error } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<ProductCategoryDto | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategoryDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleEdit = (category: ProductCategoryDto): void => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: ProductCategoryDto): void => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: Partial<ProductCategoryDto>): void => {
    if (editingCategory) {
      updateCategory(
        { categoryId: editingCategory.id, request: data as ProductCategoryDto },
        {
          onSuccess: () => {
            toast.success('Category updated successfully!');
            setIsFormOpen(false);
            setEditingCategory(null);
          },
          onError: (err) => {
            toast.error(`Failed to update category: ${err.message}`);
          },
        }
      );
    } else {
      createCategory(data as ProductCategoryDto, {
        onSuccess: () => {
          toast.success('Category created successfully!');
          setIsFormOpen(false);
        },
        onError: (err) => {
          toast.error(`Failed to create category: ${err.message}`);
        },
      });
    }
  };

  const handleFormCancel = (): void => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleConfirmDelete = (): void => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id, {
        onSuccess: () => {
          toast.success('Category deleted successfully!');
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete category: ${err.message}`);
        },
      });
    }
  };

  const handleCloseDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
    setDeletingCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#212121] mb-6">Manage Categories</h1>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Categories</CardTitle>
          <Button onClick={() => { setEditingCategory(null); setIsFormOpen(true); }} className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200" data-testid="add-category-cta">
            Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryTable
            categories={categories || []}
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
              <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryForm
                initialData={editingCategory}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isCreating || isUpdating}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <DeleteCategoryDialog
        category={deletingCategory}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminCategoriesPage;