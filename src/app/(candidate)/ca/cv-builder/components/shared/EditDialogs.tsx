'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import About from '../settings-components/About';
import Contact from '../settings-components/Contact';
import Skills from '../settings-components/Skills';
import Experiences from '../settings-components/Experiences';
import Educations from '../settings-components/Education';
import Certifications from '../settings-components/Certifications';
import type { Experience, Education, Certification, Cv } from '@/types/Cv';
import { useAppDispatch } from '@/store/hooks';
import { updateCvById } from '@/services/state/cvSlice';

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

  const handleSaveToDatabase = async () => {
    if (!cvId) {
      console.error('Cannot save to database: CV ID is missing');
      return;
    }
    try {
      const { ...cvData } = cv;
      await dispatch(updateCvById({ cvId, cv: cvData })).unwrap();
      setEditSection(null);
    } catch (err) {
      console.error('Failed to save CV:', err);
    }
  };

  const renderDialogContent = () => {
    switch (editSection) {
      case 'about':
        return (
          <About
            cv={cv}
            onUpdateCv={onUpdateCv}
            onUploadImage={onUploadImage}
          />
        );
      case 'contact':
        return <Contact cv={cv} onUpdateCv={onUpdateCv} />;
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

  return (
    <Dialog open={!!editSection} onOpenChange={() => setEditSection(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditSection(null)}>
            Cancel
          </Button>
          <Button onClick={handleSaveToDatabase}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogs;
