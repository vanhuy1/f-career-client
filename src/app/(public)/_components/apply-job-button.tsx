'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ApplyDialog from '@/app/(public)/_components/apply-dialog';

interface ApplyJobButtonProps {
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  jobId?: string; // Optional, if needed for ApplyJobButton
}

export default function ApplyJobButton({
  jobTitle,
  company,
  location,
  jobType,
  jobId,
}: ApplyJobButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Button
        onClick={openDialog}
        className="rounded-md bg-indigo-600 px-8 py-2 text-white hover:bg-indigo-700"
      >
        Apply
      </Button>

      <ApplyDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        jobTitle={jobTitle}
        company={company}
        location={location}
        jobType={jobType}
        jobId={jobId}
      />
    </>
  );
}
