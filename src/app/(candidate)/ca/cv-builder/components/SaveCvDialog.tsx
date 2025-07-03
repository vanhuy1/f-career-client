'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Cv } from '@/types/Cv';
import { toast } from 'react-toastify';

interface SaveCvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (saveType: 'system' | 'download') => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  cv: Cv | null;
}

export default function SaveCvDialog({
  open,
  onOpenChange,
  onSave,
  onCancel,
  isSaving,
}: SaveCvDialogProps) {
  const [submitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSaveToSystem = async () => {
    try {
      await onSave('system');
    } catch (error) {
      console.error('Error using SaveCvDialog:', error);

      // Check if the error is related to file size
      if (
        error instanceof Error &&
        (error.message.includes('exceeded the maximum allowed size') ||
          error.message.includes('too large'))
      ) {
        toast.error(
          'File size too large. Try simplifying your CV or downloading it instead.',
        );
      } else {
        toast.error('Failed to save CV to system. Try downloading instead.');
      }
      onOpenChange(false);
    }
  };

  const handleDownload = async () => {
    try {
      await onSave('download');
      onOpenChange(false);
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-[500px]">
        <div className="relative">
          <DialogTitle className="sr-only">Save CV</DialogTitle>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="p-6">
            <h2 className="text-lg font-semibold">Save CV</h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose how you want to save your CV
            </p>

            {submitMessage && (
              <div className="mt-4">
                <div
                  className={`rounded-md p-3 ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDownload}
                  disabled={isSaving}
                >
                  Download CV
                </Button>
                <Button onClick={handleSaveToSystem} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save to My CVs'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
