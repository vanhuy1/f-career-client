'use client';

import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  Edit,
  Eye,
  Star,
  StarOff,
  Copy,
  Trash2,
} from 'lucide-react';
import { CompanyCvChecklist } from '@/types/CvChecklist';

interface ChecklistCardProps {
  checklist: CompanyCvChecklist;
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDuplicate: (id: number) => void;
  onSetDefault: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChecklistCard({
  checklist,
  onViewDetails,
  onEdit,
  onDuplicate,
  onSetDefault,
  onDelete,
}: ChecklistCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          {checklist.isDefault && (
            <Star className="h-4 w-4 fill-current text-yellow-500" />
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(checklist.id)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(checklist.id)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(checklist.id)}
            title="Duplicate (Coming Soon)"
            disabled
            className="opacity-50"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {!checklist.isDefault && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(checklist.id)}
                title="Set as Default"
              >
                <StarOff className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(checklist.id)}
                title="Delete"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <h3 className="mb-2 font-semibold text-gray-900">
        {checklist.checklistName}
      </h3>

      {checklist.description && (
        <p className="mb-4 text-sm text-gray-600">{checklist.description}</p>
      )}

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-medium">{checklist.checklistItems.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Required items:</span>
          <span className="font-medium">
            {checklist.checklistItems.filter((item) => item.required).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-medium ${checklist.isActive ? 'text-green-600' : 'text-red-600'}`}
          >
            {checklist.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {checklist.isDefault && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-2">
          <p className="flex items-center gap-1 text-xs font-medium text-yellow-700">
            <Star className="h-3 w-3 fill-current" />
            Default Checklist
          </p>
        </div>
      )}
    </div>
  );
}
