'use client';

import { useState } from 'react';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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

interface AboutSectionProps {
  about: string | null;
  onUpdate?: (newAbout: string) => void;
}

export function AboutSection({ about, onUpdate }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about || '');

  const dispatch = useDispatch();
  const loadingState = useCaProfileLoading();
  const errors = useCaProfileErrors();

  const paragraphs = about ? about.split('\n\n') : [''];

  const handleSave = async () => {
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

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>About Me</CardTitle>
        {!isEditing ? (
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
        )}
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4 text-gray-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              className="min-h-[200px] resize-y"
              placeholder="Write about yourself..."
              disabled={loadingState === LoadingState.loading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
