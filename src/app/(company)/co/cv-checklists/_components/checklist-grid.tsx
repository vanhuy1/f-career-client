'use client';

import { CompanyCvChecklist } from '@/types/CvChecklist';
import ChecklistCard from './checklist-card';

interface ChecklistGridProps {
  checklists: CompanyCvChecklist[];
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDuplicate: (id: number) => void;
  onSetDefault: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChecklistGrid({
  checklists,
  onViewDetails,
  onEdit,
  onDuplicate,
  onSetDefault,
  onDelete,
}: ChecklistGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {checklists.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          checklist={checklist}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onSetDefault={onSetDefault}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
