'use client';

import { useState } from 'react';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  updateCaProfileFailure,
  updateCaProfileStart,
  updateCaProfileSuccess,
  useCaProfileErrors,
  useCaProfileLoading,
} from '@/services/state/caProfileSlice';
import { LoadingState } from '@/store/store.model';
import { RichTextEditor } from '@/components/common/RichTextEditor';

interface AboutSectionProps {
  about: string | null;
  onUpdate?: (newAbout: string) => void;
  readOnly?: boolean;
}

export function AboutSection({
  about,
  onUpdate,
  readOnly = false,
}: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about || '');

  const dispatch = useDispatch();
  const loadingState = useCaProfileLoading();
  const errors = useCaProfileErrors();

  const handleSave = async () => {
    // Validate that the content is not empty
    const trimmedContent = editedAbout.trim();
    // Remove HTML tags and check if there's actual content
    const textContent = trimmedContent.replace(/<[^>]*>/g, '').trim();

    if (!textContent) {
      toast.dark('You should have something about yourself', {});
      return;
    }

    dispatch(updateCaProfileStart());
    try {
      await candidateProfileService.updateAboutSectionCandidateProfile({
        about: editedAbout,
      });
      dispatch(updateCaProfileSuccess());
      // Call the onUpdate prop if provided for compatibility
      if (onUpdate) {
        onUpdate(editedAbout);
      }

      toast.success('About section updated successfully!', {});

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update about section:', error);
      dispatch(updateCaProfileFailure(error as string));
      toast.error(errors);
    }
  };

  const handleCancel = () => {
    setEditedAbout(about || ''); // Reset to original
    setIsEditing(false);
  };

  // Convert plain text to HTML for backward compatibility
  const getDisplayContent = () => {
    if (!about) return '';

    // If the content contains HTML tags, render as HTML
    if (about.includes('<') && about.includes('>')) {
      return about;
    }

    // Otherwise, convert plain text paragraphs to HTML
    return about
      .split('\n\n')
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join('');
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>About Me</CardTitle>
        {!readOnly &&
          (!isEditing ? (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit about section</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleCancel}
                disabled={loadingState === LoadingState.loading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel editing</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleSave}
                disabled={loadingState === LoadingState.loading}
              >
                {loadingState === LoadingState.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="sr-only">Save changes</span>
              </Button>
            </div>
          ))}
      </CardHeader>
      <CardContent>
        {!isEditing || readOnly ? (
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
          />
        ) : (
          <div className="space-y-4">
            <RichTextEditor
              content={editedAbout}
              onChange={setEditedAbout}
              disabled={loadingState === LoadingState.loading}
              placeholder="Write about yourself..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
