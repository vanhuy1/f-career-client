'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditFormDialog, {
  type FormField,
} from '../../../_components/edit-form-dialog';

type EditButtonProps = {
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  className?: string;
};

export default function EditButton({
  title,
  description,
  fields,
  onSubmit,
  className,
}: EditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={className || 'h-8 w-8 p-0'}
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>

      <EditFormDialog
        title={title}
        description={description}
        fields={fields}
        onSubmit={onSubmit}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
