'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react';
import { checklistService } from '@/services/api/cv-checklists/checklist-api';
import {
  DEFAULT_CHECKLIST_TEMPLATE,
  ChecklistItem,
  CreateChecklistReq,
} from '@/types/CvChecklist';

export default function CreateChecklistPage() {
  const router = useRouter();
  const user = useUser();
  const companyId = user?.data?.companyId;

  const [formData, setFormData] = useState<CreateChecklistReq>({
    checklistName: '',
    description: '',
    checklistItems: DEFAULT_CHECKLIST_TEMPLATE.map((item) => ({ ...item })),
    isActive: true,
    isDefault: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }

    // Validate form
    const validationErrors = checklistService.validateChecklist(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors([]);

      await checklistService.create(companyId.toString(), formData);
      toast.success('Checklist created successfully');
      router.push('/co/cv-checklists');
    } catch (error) {
      console.error('Failed to create checklist:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Failed to create checklist';

      // Handle default-conflict explicitly
      if (
        errorMessage.toLowerCase().includes('default checklist') &&
        errorMessage.toLowerCase().includes('already exists')
      ) {
        setFormData((prev) => ({ ...prev, isDefault: false }));
        toast.error(
          'A default checklist already exists. Unselect "Set as Default" to continue.',
        );
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: `custom_${Date.now()}`,
      criterion: '',
      weight: 5,
      required: false,
      description: '',
    };

    setFormData((prev) => ({
      ...prev,
      checklistItems: [...prev.checklistItems, newItem],
    }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== index),
    }));
  };

  const updateChecklistItem = (
    index: number,
    field: keyof ChecklistItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // Keep current page in range when items or page size change
  const totalItems = formData.checklistItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (currentPage > totalPages) {
    // Clamp current page without triggering extra renders
    setCurrentPage(totalPages);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
              Create CV Checklist
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create a new CV screening checklist for your company.
            </p>
          </div>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="mb-2 font-medium text-red-800">
                    Please fix the following errors:
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="checklistName">
                  Checklist Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checklistName"
                  value={formData.checklistName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      checklistName: e.target.value,
                    }))
                  }
                  placeholder="e.g., Senior Developer Screening Checklist"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">
                  Description{' '}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description of when and how this checklist should be used"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: !!checked }))
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isDefault: !!checked }))
                    }
                  />
                  <Label htmlFor="isDefault">Set as Default</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Checklist Items</CardTitle>
                <Button
                  type="button"
                  onClick={addChecklistItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                {formData.checklistItems.map((item, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900">
                        Item {index + 1}
                      </h4>
                      {formData.checklistItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChecklistItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label>
                          Criterion <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={item.criterion}
                          onChange={(e) =>
                            updateChecklistItem(
                              index,
                              'criterion',
                              e.target.value,
                            )
                          }
                          placeholder="What to evaluate"
                          required
                        />
                      </div>

                      <div>
                        <Label>
                          Weight (1-10) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={item.weight}
                          onChange={(e) =>
                            updateChecklistItem(
                              index,
                              'weight',
                              parseInt(e.target.value) || 1,
                            )
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>
                        Description{' '}
                        <span className="text-xs text-gray-500">
                          (Optional)
                        </span>
                      </Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateChecklistItem(
                            index,
                            'description',
                            e.target.value,
                          )
                        }
                        placeholder="Additional context or instructions"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.required}
                        onCheckedChange={(checked) =>
                          updateChecklistItem(index, 'required', !!checked)
                        }
                      />
                      <Label>Required Item</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Checklist
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
