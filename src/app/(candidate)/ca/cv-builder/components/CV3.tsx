'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { websiteLinkCreator, resolvedWebsiteLink } from '@/utils/link.utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Edit } from 'lucide-react';
import type { Experience, Education, Cv, Certification } from '@/types/Cv';
import EditDialogs from './shared/EditDialogs';

type TagKey = 'skills' | 'languages';

interface CV3Props {
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

const CV3 = ({
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
}: CV3Props) => {
  const [editSection, setEditSection] = useState<string | null>(null);

  return (
    <div
      className="flex min-h-[1188px] w-full flex-col bg-white print:h-auto print:min-h-0 print:overflow-visible"
      id="cv"
    >
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-gray-50 p-8 print:border-gray-200 print:bg-white">
        <div className="group relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {cv.image ? (
              <Image
                src={cv.image}
                className="h-20 w-20 rounded-lg object-cover shadow-md"
                width={80}
                height={80}
                alt="Profile Picture"
                quality={100}
              />
            ) : (
              <Image
                src={'/Gradient.jpg'}
                className="h-20 w-20 rounded-lg object-cover shadow-md"
                width={80}
                height={80}
                alt="Profile Picture"
                quality={100}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cv.name}</h1>
              <div className="mt-1 flex items-center space-x-2 text-gray-600">
                <span className="text-sm">{cv.title}</span>
                {/* {cv.location && (
                  <>
                    <span>•</span>
                    <span className="text-sm">{cv.location}</span>
                  </>
                )} */}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('contact')}
            >
              <Edit className="h-3 w-3" />
              <span>Edit Contact</span>
            </Button>
            <div className="flex flex-col items-end space-y-2">
              {cv.displayMail && cv.email && (
                <a
                  href={`mailto:${cv.email}`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {cv.email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-4 flex space-x-4">
          {cv.github && (
            <a
              href={websiteLinkCreator(cv.github)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Github className="mr-1 h-4 w-4" />
              <span className="text-sm">{resolvedWebsiteLink(cv.github)}</span>
            </a>
          )}
          {cv.linkedin && (
            <a
              href={websiteLinkCreator(cv.linkedin)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Linkedin className="mr-1 h-4 w-4" />
              <span className="text-sm">
                {resolvedWebsiteLink(cv.linkedin)}
              </span>
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="grid flex-grow grid-cols-3 gap-8 p-8 print:grid print:grid-cols-3 print:gap-6">
        {/* Left Column */}
        <div className="col-span-1 space-y-8 print:col-span-1 print:space-y-6">
          {/* About Section */}
          <section className="print:mb-6">
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                About
              </h2>
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
            <div className="text-sm leading-relaxed text-gray-600">
              <ReactMarkdown>{cv.summary}</ReactMarkdown>
            </div>
          </section>

          {/* Skills Section */}
          <section className="print:mb-6">
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Skills
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setEditSection('skills')}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="skill-block">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Industry Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 text-[0.7rem] text-gray-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.languages.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 text-[0.7rem] text-gray-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-8 print:col-span-2 print:space-y-6">
          {/* Experience Section */}
          <section>
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Experience
              </h2>
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
            <div className="space-y-6 print:space-y-4">
              {cv.experience.map((experience, index) => (
                <div
                  key={index}
                  className="experience-block border-b border-gray-100 pb-6 last:border-0 last:pb-0 print:border-gray-100 print:pb-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      {experience.role}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {experience.startDate} - {experience.endDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {experience.company}
                  </p>
                  <div className="mt-2 text-sm leading-relaxed text-gray-600">
                    <ReactMarkdown>{experience.description}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          {/* <section>
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Projects
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setEditSection('projects')}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 print:gap-4">
              {cv.projects.map((project, index) => (
                <div
                  key={index}
                  className="project-block rounded-lg border border-gray-100 bg-gray-50 p-4 print:border-gray-100 print:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      {project.title}
                    </h3>
                    {project.link && (
                      <a
                        href={websiteLinkCreator(project.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-gray-600">
                    <ReactMarkdown>{project.summary}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* Education Section */}
          <section>
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Education
              </h2>
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
                  className="education-block flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 print:break-inside-avoid"
                >
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {education.field}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {education.institution}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {education.startYear} - {education.endYear}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section>
            <div className="group relative flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
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
                  className="certification-block flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 print:break-inside-avoid"
                >
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {certification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Issued by {certification.issuer} on{' '}
                      {certification.issueDate}
                    </p>
                    {certification.expiryDate && (
                      <p className="text-sm text-gray-500">
                        Expires on {certification.expiryDate}
                      </p>
                    )}
                  </div>
                  {certification.credentialUrl && (
                    <a
                      href={websiteLinkCreator(certification.credentialUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

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

export default CV3;
