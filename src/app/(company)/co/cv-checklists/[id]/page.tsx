'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/services/state/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Star,
  ClipboardCheck,
  CheckCircle,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import { checklistService } from '@/services/api/cv-checklists/checklist-api';
import { CompanyCvChecklist } from '@/types/CvChecklist';
import LoadingState from '../_components/loading-state';
import ErrorState from '../_components/error-state';

export default function ChecklistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const companyId = user?.data?.companyId;
  const checklistId = parseInt((params?.id as string) || '0');

  const [checklist, setChecklist] = useState<CompanyCvChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChecklist = async () => {
      if (!companyId || !checklistId) return;

      try {
        setIsLoading(true);
        const data = await checklistService.findOne(
          companyId.toString(),
          checklistId,
        );
        setChecklist(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load checklist:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load checklist';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    loadChecklist();
  }, [companyId, checklistId]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <ErrorState />
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Checklist Not Found
            </h3>
            <p className="text-gray-600">
              The requested checklist could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalWeight = checklist.checklistItems.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const requiredItems = checklist.checklistItems.filter(
    (item) => item.required,
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
                {checklist.checklistName}
                {checklist.isDefault && (
                  <Star className="h-5 w-5 fill-current text-yellow-500" />
                )}
              </h1>
              <div className="mt-1 flex items-center gap-4">
                <Badge variant={checklist.isActive ? 'default' : 'secondary'}>
                  {checklist.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {checklist.isDefault && (
                  <Badge
                    variant="outline"
                    className="border-yellow-200 bg-yellow-50 text-yellow-700"
                  >
                    Default Checklist
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/co/cv-checklists/${checklistId}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Checklist
          </Button>
        </div>

        {/* Description */}
        {checklist.description && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-gray-700">{checklist.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {checklist.checklistItems.length}
              </div>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {requiredItems.length}
              </div>
              <p className="text-sm text-gray-600">Required Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {totalWeight}
              </div>
              <p className="text-sm text-gray-600">Total Weight</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  (totalWeight / checklist.checklistItems.length) * 10,
                ) / 10}
              </div>
              <p className="text-sm text-gray-600">Avg Weight</p>
            </CardContent>
          </Card>
        </div>

        {/* Checklist Items */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklist.checklistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center gap-2">
                      {item.required ? (
                        <CheckCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-mono text-sm text-gray-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {item.criterion}
                        </h4>
                        <div className="flex items-center gap-2">
                          {item.required && (
                            <Badge variant="destructive">Required</Badge>
                          )}
                          <Badge variant="outline">Weight: {item.weight}</Badge>
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="font-medium text-gray-700">Created:</span>{' '}
                <span className="text-gray-600">
                  {new Date(checklist.createdAt).toLocaleDateString()} at{' '}
                  {new Date(checklist.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>{' '}
                <span className="text-gray-600">
                  {new Date(checklist.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(checklist.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
