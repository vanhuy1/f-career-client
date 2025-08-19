'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { CompanyCvChecklist } from '@/types/CvChecklist';

interface EditChecklistModalProps {
  isOpen: boolean;
  checklist: CompanyCvChecklist | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    checklistName?: string;
    description?: string;
    isActive?: boolean;
  }) => Promise<void> | void;
}

export default function EditChecklistModal({
  isOpen,
  checklist,
  isSaving,
  onClose,
  onSubmit,
}: EditChecklistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!checklist) return;
    setName(checklist.checklistName || '');
    setDescription(checklist.description || '');
    setIsActive(!!checklist.isActive);
  }, [checklist]);

  const handleSubmit = async () => {
    await onSubmit({ checklistName: name, description, isActive });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Checklist</DialogTitle>
          <DialogDescription>
            Update basic information for this checklist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">
              Checklist Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Checklist name"
            />
          </div>

          <div>
            <Label htmlFor="edit-desc">
              Description{' '}
              <span className="text-xs text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(!!checked)}
            />
            <Label htmlFor="edit-active">Active</Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
