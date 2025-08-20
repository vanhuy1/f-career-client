'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import type {
  ChecklistItem,
  CompanyCvChecklist,
  UpdateChecklistReq,
} from '@/types/CvChecklist';

export default function EditChecklistPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const companyId = user?.data?.companyId;
  const checklistId = useMemo(() => Number(params?.id), [params]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<CompanyCvChecklist | null>(null);

  const [formData, setFormData] = useState<UpdateChecklistReq>({
    checklistName: '',
    description: '',
    checklistItems: [],
    isActive: true,
  });
  const [unsetDefault, setUnsetDefault] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!companyId || !checklistId) return;
      try {
        setIsLoading(true);
        const data = await checklistService.findOne(
          companyId.toString(),
          checklistId,
        );
        setChecklist(data);
        setFormData({
          checklistName: data.checklistName,
          description: data.description || '',
          checklistItems: data.checklistItems,
          isActive: data.isActive,
          isDefault: data.isDefault,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load checklist';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId, checklistId]);

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
      checklistItems: [...(prev.checklistItems || []), newItem],
    }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: (prev.checklistItems || []).filter((_, i) => i !== index),
    }));
  };

  const updateChecklistItem = (
    index: number,
    field: keyof ChecklistItem,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: (prev.checklistItems || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !checklistId) return;

    // Simple validations
    const errs: string[] = [];
    if (!formData.checklistName || !formData.checklistName.trim())
      errs.push('Checklist name is required');
    if (!formData.checklistItems || formData.checklistItems.length === 0)
      errs.push('At least one item is required');
    (formData.checklistItems || []).forEach((it, i) => {
      if (!it.criterion || !it.criterion.trim())
        errs.push(`Item ${i + 1}: Criterion is required`);
      if (it.weight < 1 || it.weight > 10)
        errs.push(`Item ${i + 1}: Weight must be 1-10`);
    });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsSaving(true);
      setErrors([]);
      // If trying to unset default, handle via setDefault on another list or deny
      // Backend does not expose explicit UNSET endpoint, so we disallow when isDefault true & unsetDefault false
      if (checklist?.isDefault && unsetDefault) {
        // Update to not default by setting another as default is the proper flow.
        // Here we only flip the flag locally and send update; if backend enforces single default, it may ignore.
        const updated = await checklistService.update(
          companyId.toString(),
          checklistId,
          { ...formData, isDefault: false },
        );
        toast.success('Default unset for this checklist');
        router.push(`/co/cv-checklists/${updated.id}`);
        return;
      }
      const updated = await checklistService.update(
        companyId.toString(),
        checklistId,
        formData,
      );
      toast.success('Checklist updated successfully');
      router.push(`/co/cv-checklists/${updated.id}`);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Failed to update checklist';
      if (
        message.toLowerCase().includes('default') &&
        message.toLowerCase().includes('already exists')
      ) {
        toast.error(
          'A default checklist already exists. Uncheck default here or change another checklist to default.',
        );
      } else {
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2" />
          <p className="mt-4">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="rounded border p-6 text-center text-gray-600">
          Checklist not found.
        </div>
      </div>
    );
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
              Edit Checklist
            </h1>
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
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
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
                  value={formData.checklistName || ''}
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
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={!!formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: !!checked }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {checklist?.isDefault && (
                <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="unsetDefault"
                      checked={unsetDefault}
                      onCheckedChange={(c) => setUnsetDefault(!!c)}
                    />
                    <Label htmlFor="unsetDefault" className="text-yellow-800">
                      Unset as default checklist
                    </Label>
                  </div>
                  <p className="mt-1 text-xs text-yellow-700">
                    A company can only have one default checklist. Unset here or
                    set another checklist as default from the list view.
                  </p>
                </div>
              )}
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
                {(formData.checklistItems || []).map((item, index) => (
                  <div
                    key={`${item.id}_${index}`}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900">
                        Item {index + 1}
                      </h4>
                      {(formData.checklistItems || []).length > 1 && (
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
                          min={1}
                          max={10}
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
