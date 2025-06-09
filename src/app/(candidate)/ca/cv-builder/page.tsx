'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, List, Trash2 } from 'lucide-react';
import {
  setCvStart,
  setCvSuccess,
  setCvFailure,
  useCvs,
  useCvLoadingState,
  deleteCvById,
  createCv,
} from '@/services/state/cvSlice';
import { LoadingState } from '@/store/store.model';
import LoadingScreen from '@/pages/LoadingScreen';
import { cvService } from '@/services/api/cv/cv-api';
import { useUser } from '@/services/state/userSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import type { Cv } from '@/types/Cv';

export default function CvListPage() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteCvId, setDeleteCvId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const limit = 10;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const cvs = useCvs() || [];
  const loading = useCvLoadingState();
  const isLoading = loading === LoadingState.loading;
  const user = useUser();
  const userId = Number(user?.data?.id);

  useEffect(() => {
    async function fetchCvs() {
      if (!userId) return;

      try {
        dispatch(setCvStart());
        const res = await cvService.findAll(userId);
        dispatch(setCvSuccess(res.items));
        setCount(res.items.length);
      } catch (error) {
        dispatch(
          setCvFailure(
            error instanceof Error ? error.message : 'Failed to fetch CVs',
          ),
        );
      }
    }

    if (cvs.length === 0) {
      fetchCvs();
    }
    setPage(1);
  }, [page, limit, dispatch, cvs.length, userId]);

  const handleCreateNewCv = async () => {
    if (!userId) return;

    const defaultCv: Partial<Cv> = {
      name: 'Name Example',
      image: '',
      title: 'Example Title',
      linkedin: 'linkedin@example',
      github: 'github@example',
      phone: 123458690,
      summary:
        'A Fullstack Developer passionate about crafting efficient, user-centric software solutions that make a meaningful impact.',
      skills: ['Nest', 'Next', 'Sql'],
      languages: ['Vietnamese (Native)', 'English'],
      certifications: [
        {
          title: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          expiryDate: '2026',
          credentialId: 'AWS-123456',
          credentialUrl: 'https://aws.amazon.com/verification',
        },
      ],
      education: [
        {
          institution: 'University of Tech',
          degree: 'Bachelor',
          field: 'Computer Science',
          startYear: '2016',
          endYear: '2020',
          description: 'Major in Software Engineering',
        },
      ],
      experience: [
        {
          role: 'Senior Developer',
          company: 'Tech Corp',
          endDate: '2023-01-01',
          location: 'New York',
          startDate: '2020-01-01',
          description: 'Led team of 5 developers...',
          employmentType: 'FULL_TIME',
        },
      ],
      templateId: 1,
      email: user?.data?.email || '',
      userId,
      displayImage: false,
      displayMail: true,
      displayWebSite: false,
      displayGithub: false,
      displayTwitter: false,
      displayLinkedIn: false,
      displayInstagram: false,
      displayFacebook: false,
    };

    try {
      const result = await dispatch(createCv(defaultCv)).unwrap();
      if (result.id) {
        router.push(`/ca/cv-builder/${result.id}`);
      } else {
        throw new Error('CV creation failed: No ID returned');
      }
    } catch (error) {
      dispatch(
        setCvFailure(
          error instanceof Error ? error.message : 'CV creation failed',
        ),
      );
    }
  };

  const handleDeleteCv = async (cvId: string) => {
    try {
      await dispatch(deleteCvById(cvId)).unwrap();
      setCount((prev) => prev - 1);
      setIsDeleteDialogOpen(false);
      setDeleteCvId(null);
    } catch (error) {
      dispatch(
        setCvFailure(
          error instanceof Error ? error.message : 'Failed to delete CV',
        ),
      );
    }
  };

  const openDeleteDialog = (cvId: string) => {
    setDeleteCvId(cvId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteCvId(null);
  };

  if (!userId) {
    return <div className="p-4">Please log in to view your CVs</div>;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-8xl container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My CVs</h1>
            <p className="text-sm text-gray-500">Showing {count} results</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded border">
              <button
                onClick={() => setViewMode('grid')}
                className={`border-r p-2 ${viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={handleCreateNewCv}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Create New CV
            </Button>
          </div>
        </div>

        {/* CV cards */}
        {cvs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-gray-600">You havent created any CVs yet</p>
            <Button
              onClick={handleCreateNewCv}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Your First CV
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
              >
                <h2 className="mb-2 text-xl font-semibold">
                  {cv.title || 'Untitled CV'}
                </h2>
                <p className="mb-2 text-gray-600">
                  {cv.summary || 'No summary'}
                </p>
                <p className="mb-4 text-sm text-gray-500">
                  Last updated:{' '}
                  {new Date(
                    cv.updatedAt || cv.createdAt || '',
                  ).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/ca/cv-builder/${cv.id}`}
                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Preview & Edit
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(cv.id!)}
                    className="px-3 py-1 text-sm"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
              >
                <h2 className="mb-2 text-xl font-semibold">
                  {cv.title || 'Untitled CV'}
                </h2>
                <p className="mb-2 text-gray-600">
                  {cv.summary || 'No summary'}
                </p>
                <p className="mb-4 text-sm text-gray-500">
                  Last updated:{' '}
                  {new Date(
                    cv.updatedAt || cv.createdAt || '',
                  ).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/ca/cv-builder/${cv.id}`}
                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Preview & Edit
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(cv.id!)}
                    className="px-3 py-1 text-sm"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CV? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteCvId && handleDeleteCv(deleteCvId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
