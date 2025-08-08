'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import About from './sections/About';
import Contact from './sections/Contact';
import Skills from './sections/Skills';
import Experiences from './sections/Experiences';
import Educations from './sections/Education';
import Certifications from './sections/Certifications';
import type { Experience, Education, Certification, Cv } from '@/types/Cv';
import { useAppDispatch } from '@/store/hooks';
import { updateCvById } from '@/services/state/cvSlice';
import { uploadFile } from '@/lib/storage';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabaseClient';

type TagKey = 'skills' | 'languages';

interface EditDialogsProps {
  editSection: string | null;
  setEditSection: (section: string | null) => void;
  cv: Cv;
  cvId?: string;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: (e: React.KeyboardEvent, key: TagKey, value: string) => void;
  onRemoveTag: (key: TagKey, value: string) => void;
  onAddExperience: (experience: Experience) => void;
  onAddEducation: (education: Education) => void;
  onAddCertification: (certification: Certification) => void;
  onUpdateCertification: (index: number, certification: Certification) => void;
  onDeleteCertification: (index: number) => void;
  onUpdateEducation: (index: number, education: Education) => void;
  onDeleteEducation: (index: number) => void;
  onUpdateExperience: (index: number, experience: Experience) => void;
  onDeleteExperience: (index: number) => void;
}

// Helper function to upload avatar image
const uploadAvatarImage = async (
  file: File,
  cvId: string,
): Promise<string | null> => {
  try {
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${cvId}-${Date.now()}.${fileExt}`;

    // Upload image to Supabase Storage
    const { publicUrl, error } = await uploadFile({
      file: new File([file], fileName, { type: file.type }),
      bucket: SupabaseBucket.CV_UPLOADS,
      folder: SupabaseFolder.CV_PROFILE,
    });

    if (error || !publicUrl) {
      throw new Error(
        `Failed to upload image: ${error?.message || 'Unknown error'}`,
      );
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Helper function to cleanup old avatar files
const cleanupOldAvatarFiles = async (cvId: string) => {
  try {
    if (!cvId) return;

    const { data: files, error: listError } = await supabase.storage
      .from(SupabaseBucket.CV_UPLOADS)
      .list(SupabaseFolder.CV_PROFILE);

    if (listError) {
      console.warn('Failed to list avatar files for cleanup:', listError);
      return;
    }

    const filesToDelete = files
      ?.filter((file) => file.name.includes(`avatar-${cvId}`))
      .map((file) => `${SupabaseFolder.CV_PROFILE}/${file.name}`);

    if (filesToDelete && filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(SupabaseBucket.CV_UPLOADS)
        .remove(filesToDelete);

      if (deleteError) {
        console.warn('Failed to delete old avatar files:', deleteError);
      }
    }
  } catch (error) {
    console.warn('Error during avatar file cleanup:', error);
  }
};

const EditDialogs = ({
  editSection,
  setEditSection,
  cv,
  cvId,
  onUpdateCv,
  onUploadImage,
  onAddTag,
  onRemoveTag,
  onAddExperience,
  onAddEducation,
  onAddCertification,
  onUpdateCertification,
  onDeleteCertification,
  onUpdateEducation,
  onDeleteEducation,
  onUpdateExperience,
  onDeleteExperience,
}: EditDialogsProps) => {
  const dispatch = useAppDispatch();
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isContactValid, setIsContactValid] = useState(true);
  const contactValidationRef = useRef<boolean>(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImageFile(file);
    } else {
      setTempImageFile(null);
    }
    onUploadImage(e);
  };

  const handleContactValidationChange = (isValid: boolean) => {
    setIsContactValid(isValid);
    contactValidationRef.current = isValid;
  };

  const validateBeforeSave = (): boolean => {
    // Basic validation
    if (!cv.name || cv.name.trim() === '') {
      toast.error('Name is required');
      return false;
    }

    if (!cv.title || cv.title.trim() === '') {
      toast.error('Job title is required');
      return false;
    }

    if (!cv.email || cv.email.trim() === '') {
      toast.error('Email is required');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cv.email)) {
      toast.error('Invalid email format');
      return false;
    }

    // Phone validation
    const phoneValue =
      typeof cv.phone === 'number' ? String(cv.phone) : cv.phone || '';
    if (!phoneValue) {
      toast.error('Phone number is required');
      return false;
    }

    // Vietnamese phone format validation
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8,9}$/;
    if (!phoneRegex.test(phoneValue)) {
      toast.error(
        'Invalid phone number format. Must be 10-11 digits starting with 0',
      );
      return false;
    }

    // Check contact section validation if it's being edited
    if (editSection === 'contact' && !contactValidationRef.current) {
      toast.error('Please fix validation errors in contact information');
      return false;
    }

    return true;
  };

  const handleSaveToDatabase = async () => {
    if (!cvId) {
      console.error('Cannot save to database: CV ID is missing');
      toast.error('Cannot save: CV ID is missing');
      return;
    }

    // Validate before saving
    if (!validateBeforeSave()) {
      return;
    }

    setIsSaving(true);
    const processingToast = toast.info('Saving changes...', {
      autoClose: false,
      closeButton: false,
    });

    try {
      const updatedCv = { ...cv };

      // Upload avatar image if available
      if (tempImageFile && editSection === 'about') {
        toast.update(processingToast, {
          render: 'Uploading profile image...',
          type: 'info',
        });

        try {
          // Cleanup old avatar
          await cleanupOldAvatarFiles(cvId);

          // Upload new avatar
          const avatarUrl = await uploadAvatarImage(tempImageFile, cvId);
          if (avatarUrl) {
            updatedCv.image = avatarUrl;
            onUpdateCv('image', avatarUrl);
          }
        } catch (avatarError) {
          console.error('Failed to upload avatar:', avatarError);
          toast.warn('Failed to upload profile image');
          throw avatarError;
        }
      }

      // Save CV data (without generating PDF - that's only for the main save button)
      toast.update(processingToast, {
        render: 'Saving CV data...',
        type: 'info',
      });

      await dispatch(updateCvById({ cvId, cv: updatedCv })).unwrap();

      toast.dismiss(processingToast);
      toast.success('Changes saved successfully');
      setEditSection(null);
      setTempImageFile(null);
    } catch (err) {
      toast.dismiss(processingToast);
      console.error('Failed to save CV:', err);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderDialogContent = () => {
    switch (editSection) {
      case 'about':
        return (
          <About
            cv={cv}
            onUpdateCv={onUpdateCv}
            onUploadImage={handleImageChange}
          />
        );
      case 'contact':
        return (
          <Contact
            cv={cv}
            onUpdateCv={onUpdateCv}
            onValidationChange={handleContactValidationChange}
          />
        );
      case 'skills':
        return (
          <Skills
            cv={cv}
            onUpdateCv={onUpdateCv}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
        );
      case 'experience':
        return (
          <Experiences
            cv={cv}
            onAddExperience={onAddExperience}
            onUpdateExperience={onUpdateExperience}
            onDeleteExperience={onDeleteExperience}
          />
        );
      case 'education':
        return (
          <Educations
            cv={cv}
            onAddEducation={onAddEducation}
            onUpdateEducation={onUpdateEducation}
            onDeleteEducation={onDeleteEducation}
          />
        );
      case 'certifications':
        return (
          <Certifications
            cv={cv}
            onAddCertification={onAddCertification}
            onUpdateCertification={onUpdateCertification}
            onDeleteCertification={onDeleteCertification}
          />
        );
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    return `Edit ${editSection?.charAt(0).toUpperCase()}${editSection?.slice(1)}`;
  };

  const handleCancel = () => {
    setEditSection(null);
    setTempImageFile(null);
    setIsContactValid(true);
  };

  const canSave = () => {
    // For contact section, check real-time validation
    if (editSection === 'contact') {
      return !isSaving && isContactValid;
    }
    // For other sections, basic check
    return !isSaving;
  };

  return (
    <Dialog open={!!editSection} onOpenChange={() => handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveToDatabase} disabled={!canSave()}>
            {isSaving ? 'Saving...' : 'Temporary Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogs;
