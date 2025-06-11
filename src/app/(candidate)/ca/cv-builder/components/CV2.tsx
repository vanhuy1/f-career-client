'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { websiteLinkCreator, resolvedWebsiteLink } from '@/utils/link.utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, Github, Linkedin, Edit, Phone } from 'lucide-react';
import type { Experience, Education, Cv, Certification } from '@/types/Cv';
import EditDialogs from './shared/EditDialogs';

type TagKey = 'skills' | 'languages';

interface CV2Props {
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

const CV2 = ({
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
}: CV2Props) => {
  const [editSection, setEditSection] = useState<string | null>(null);

  return (
    <div
      className="flex h-full min-h-screen w-full print:h-screen print:min-h-screen print:w-full"
      id="cv"
    >
      {/* Left Sidebar */}
      <div className="sidebar flex w-1/3 flex-col bg-gray-900 p-6 text-white print:w-1/3 print:p-8">
        <div className="sticky top-0 space-y-4 print:static">
          {cv.image ? (
            <div className="mb-6 flex justify-center">
              <Image
                src={cv.image || '/Gradient.jpg'}
                className="rounded-full border-4 border-gray-700 object-cover shadow-lg"
                width={120}
                height={120}
                alt="Profile Picture"
                quality={100}
              />
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <Image
                src={'/Gradient.jpg'}
                className="rounded-full border-4 border-gray-700 object-cover shadow-lg"
                width={120}
                height={120}
                alt="Profile Picture"
                quality={100}
              />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold">{cv.name}</h1>
            <h4 className="text-sm font-medium text-gray-400">{cv.title}</h4>
            {/* <h4 className="text-sm font-medium text-gray-400">{cv.location}</h4> */}
          </div>

          {/* Contact Info */}
          <div className="group relative mt-6 space-y-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Contact</h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-gray-700 bg-gray-800 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-700"
                onClick={() => setEditSection('contact')}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
            {cv.email && (
              <a
                href={`mailto:${cv.email}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                <span className="truncate text-sm">{cv.email}</span>
              </a>
            )}
            {cv.github && (
              <a
                href={websiteLinkCreator(cv.github)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Github className="mr-2 h-4 w-4" />
                <span className="truncate text-sm">
                  {resolvedWebsiteLink(cv.github)}
                </span>
              </a>
            )}
            {cv.linkedin && (
              <a
                href={websiteLinkCreator(cv.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                <span className="truncate text-sm">
                  {resolvedWebsiteLink(cv.linkedin)}
                </span>
              </a>
            )}
            {cv.phone && (
              <div className="flex items-center text-gray-300 hover:text-white">
                <Phone className="mr-2 h-4 w-4" />
                <span className="text-xs">{cv.phone}</span>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold">Skills</h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-gray-700 bg-gray-800 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-700"
                onClick={() => setEditSection('skills')}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="skill-block">
                <h3 className="mb-2 text-sm font-medium text-gray-400">
                  Industry Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800 text-[0.6rem] text-gray-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-400">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.languages.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800 text-[0.6rem] text-gray-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex w-2/3 flex-col bg-white p-6 print:w-2/3 print:p-8">
        {/* About Section */}
        <section className="mb-8 print:mb-6">
          <div className="group relative flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold text-gray-800">About</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('about')}
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            <ReactMarkdown>{cv.summary}</ReactMarkdown>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-8 print:mb-6">
          <div className="group relative flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Experience</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('experience')}
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-4">
            {cv.experience.map((experience, index) => (
              <div
                key={index}
                className="experience-block rounded-lg border border-gray-200 p-4 print:border print:border-gray-200"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {experience.role}
                  </h3>
                  <p className="text-sm text-gray-600">{experience.company}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>
                      {experience.startDate} - {experience.endDate}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <ReactMarkdown>{experience.description}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <div className="group relative flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Education</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('education')}
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-4">
            {cv.education.map((education, index) => (
              <div
                key={index}
                className="education-block rounded-lg border border-gray-200 p-4 print:break-inside-avoid"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {education.field}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {education.institution}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>
                      {education.startYear} - {education.endYear}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section className="mt-8 print:mt-6">
          <div className="group relative flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Certifications
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('certifications')}
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>
          <div className="space-y-4">
            {cv.certifications.map((certification, index) => (
              <div
                key={index}
                className="certification-block rounded-lg border border-gray-200 p-4 print:border print:border-gray-200"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {certification.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Issued by {certification.issuer}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>
                      {certification.issueDate} -{' '}
                      {certification.expiryDate || 'Present'}
                    </span>
                  </div>
                </div>
                {certification.credentialId && (
                  <p className="text-sm text-gray-600">
                    Credential ID: {certification.credentialId}
                  </p>
                )}
                {certification.credentialUrl && (
                  <a
                    href={websiteLinkCreator(certification.credentialUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-blue-500 hover:text-blue-600"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Edit Dialogs */}
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

export default CV2;
