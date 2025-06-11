'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import EditDialogs from './shared/EditDialogs';
import type { Cv, Experience, Education, Certification } from '@/types/Cv';

type TagKey = 'skills' | 'languages';

interface SettingsProps {
  template: number;
  onSetTemplate: (template: number) => void;
  onSaveTemplate: () => void;
  onClose: () => void;
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

const Settings = ({
  template,
  onSetTemplate,
  onSaveTemplate,
  onClose,
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
}: SettingsProps) => {
  const [pendingTemplate, setPendingTemplate] = useState(template);
  const [editSection, setEditSection] = useState<string | null>(null);

  const handleSelectTemplate = (num: number) => {
    setPendingTemplate(num);
    onSetTemplate(num);
    onUpdateCv('templateId', num); // Sync localCv.templateId
  };

  const handleSave = () => {
    onSaveTemplate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CV Builder</h1>
          <p className="mt-2 text-gray-500">
            Create your professional CV in minutes
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This CV builder helps you create a professional resume quickly and
          easily. You can customize all sections, add your skills, experience,
          and education, and choose from different templates.
        </p>

        <Card className="border-sky-200 bg-sky-50 dark:border-gray-900 dark:bg-gray-950/30">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-sky-900 dark:text-sky-400">
              Before using
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-sky-800 dark:text-sky-200">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The <strong>Reset</strong> button and the{' '}
                <strong>Fill Sample Data</strong> button will clear all the
                changes you have made and you cannot undo them.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Edit CV Sections</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('about')}
          >
            Edit About
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('contact')}
          >
            Edit Contact
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('skills')}
          >
            Edit Skills
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('experience')}
          >
            Edit Experience
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('education')}
          >
            Edit Education
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEditSection('certifications')}
          >
            Edit Certifications
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="mb-3 text-xl font-bold">Templates</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((num) => (
              <Card
                key={num}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  pendingTemplate === num
                    ? 'border-primary ring-primary/20 ring-2'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
                onClick={() => handleSelectTemplate(num)}
              >
                <CardContent className="flex h-24 items-center justify-center p-4">
                  <div className="text-center">
                    <div className="font-medium">Template {num}</div>
                    {pendingTemplate === num && (
                      <div className="text-primary mt-1 flex items-center justify-center gap-1 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Previewing
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {pendingTemplate !== template && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave} className="bg-primary text-white">
                Save Template
              </Button>
            </div>
          )}
        </div>
      </div>

      <EditDialogs
        editSection={editSection}
        setEditSection={setEditSection}
        cv={cv}
        cvId={cvId}
        onUpdateCv={onUpdateCv}
        onUploadImage={onUploadImage}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onAddExperience={onAddExperience}
        onAddEducation={onAddEducation}
        onAddCertification={onAddCertification}
        onUpdateCertification={onUpdateCertification}
        onDeleteCertification={onDeleteCertification}
        onUpdateEducation={onUpdateEducation}
        onDeleteEducation={onDeleteEducation}
        onUpdateExperience={onUpdateExperience}
        onDeleteExperience={onDeleteExperience}
      />
    </div>
  );
};

export default Settings;
