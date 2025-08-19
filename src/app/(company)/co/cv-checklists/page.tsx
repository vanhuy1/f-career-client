'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';
import { useRouter } from 'next/navigation';
import { checklistService } from '@/services/api/cv-checklists/checklist-api';
import { CompanyCvChecklist } from '@/types/CvChecklist';

// Components
import ChecklistHeader from './_components/checklist-header';
import ChecklistGrid from './_components/checklist-grid';
import LoadingState from './_components/loading-state';
import EmptyState from './_components/empty-state';
import DeleteConfirmationDialog from './_components/delete-confirmation-dialog';

export default function CvChecklistsDashboard() {
  const [checklists, setChecklists] = useState<CompanyCvChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checklistToDelete, setChecklistToDelete] =
    useState<CompanyCvChecklist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useUser();
  const companyId = user?.data?.companyId;
  const router = useRouter();

  useEffect(() => {
    const loadChecklists = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);

        const response = await checklistService.getByCompanyId(
          companyId.toString(),
          {
            sortBy: 'createdAt',
            sortOrder: 'desc',
          },
        );

        setChecklists(Array.isArray(response) ? response : []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load checklists:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load checklists';
        setError(errorMessage);
        setIsLoading(false);

        // No fallback data - show proper error state
        setChecklists([]);
      }
    };

    loadChecklists();
  }, [companyId]);

  // Event handlers
  const handleCreateNew = () => {
    router.push('/co/cv-checklists/create');
  };

  const handleViewDetails = (checklistId: number) => {
    router.push(`/co/cv-checklists/${checklistId}`);
  };

  const handleEdit = (checklistId: number) => {
    router.push(`/co/cv-checklists/${checklistId}/edit`);
  };

  const handleDuplicate = async (checklistId: number) => {
    // TODO: Duplicate functionality not implemented in backend yet

    const _ = checklistId;
    toast.info('Duplicate feature will be available soon');
  };

  const handleSetDefault = async (checklistId: number) => {
    if (!companyId) return;

    try {
      await checklistService.setDefault(companyId.toString(), checklistId);
      toast.success('Default checklist updated successfully');

      // Update local state
      setChecklists((prev) =>
        prev.map((checklist) => ({
          ...checklist,
          isDefault: checklist.id === checklistId,
        })),
      );
    } catch (error) {
      console.error('Failed to set default checklist:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to set default checklist';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = (checklistId: number) => {
    const checklist = checklists.find((c) => c.id === checklistId);
    if (!checklist) return;

    if (checklist.isDefault) {
      toast.error('Cannot delete the default checklist');
      return;
    }

    setChecklistToDelete(checklist);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!checklistToDelete || !companyId) return;

    try {
      setIsDeleting(true);
      await checklistService.delete(companyId.toString(), checklistToDelete.id);

      toast.success('Checklist deleted successfully');

      // Update local state
      setChecklists((prev) =>
        prev.filter((c) => c.id !== checklistToDelete.id),
      );
    } catch (error) {
      console.error('Failed to delete checklist:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Failed to delete checklist';
      if (
        errorMessage.toLowerCase().includes('default') &&
        errorMessage.toLowerCase().includes('cannot')
      ) {
        toast.error(
          'Cannot delete the default checklist. Please set another checklist as default first.',
        );
      } else if (errorMessage.toLowerCase().includes('not found')) {
        toast.error('Checklist not found. It may have been deleted already.');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setChecklistToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setChecklistToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-h-screen overflow-hidden">
      <div className="mx-auto max-w-7xl p-6">
        <ChecklistHeader onCreateNew={handleCreateNew} />

        {Array.isArray(checklists) && checklists.length === 0 && !isLoading ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : (
          <ChecklistGrid
            checklists={checklists}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        checklist={checklistToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
