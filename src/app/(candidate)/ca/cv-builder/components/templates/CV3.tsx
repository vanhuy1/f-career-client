'use client';

import type React from 'react';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { websiteLinkCreator, resolvedWebsiteLink } from '@/utils/link.utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Github,
  Linkedin,
  Edit,
  Calendar,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
} from 'lucide-react';
import type { Experience, Education, Cv, Certification } from '@/types/Cv';
import EditDialogs from '../editor/EditDialogs';

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
      className="flex min-h-[1188px] w-full flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 print:h-auto print:min-h-0 print:overflow-visible print:bg-white"
      id="cv"
    >
      {/* Enhanced Header */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm print:border-slate-200 print:bg-white print:shadow-none">
        <div className="p-4">
          {/* Main Profile Section */}
          <div className="group mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-3">
                <Image
                  src={cv.image || '/Gradient.jpg'}
                  className="h-full w-full object-cover shadow-lg ring-4 ring-blue-100"
                  width={96}
                  height={96}
                  alt="Profile Picture"
                  quality={100}
                  style={{ objectFit: 'cover', width: '96px', height: '96px' }}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    {cv.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                    onClick={() => setEditSection('about')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-medium text-transparent">
                    {cv.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Social Links Section */}
          <div className="group border-t border-slate-200 pt-6">
            <div className="flex justify-between">
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-700 uppercase">
                Contact
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('contact')}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex space-x-6">
              {cv.email && (
                <a
                  href={`mailto:${cv.email}`}
                  className="group/link flex items-center text-slate-600 transition-all duration-300 hover:translate-y-[-1px] hover:text-slate-900"
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover/link:bg-slate-200">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{cv.email}</span>
                </a>
              )}

              {cv.phone && (
                <a
                  href={`tel:${cv.phone}`}
                  className="group/link flex items-center text-slate-600 transition-all duration-300 hover:translate-y-[-1px] hover:text-slate-900"
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover/link:bg-slate-200">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{cv.phone}</span>
                </a>
              )}

              {cv.github && (
                <a
                  href={websiteLinkCreator(cv.github)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-center text-slate-600 transition-all duration-300 hover:translate-y-[-1px] hover:text-slate-900"
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover/link:bg-slate-200">
                    <Github className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {resolvedWebsiteLink(cv.github)}
                  </span>
                </a>
              )}
              {cv.linkedin && (
                <a
                  href={websiteLinkCreator(cv.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-center text-slate-600 transition-all duration-300 hover:translate-y-[-1px] hover:text-slate-900"
                >
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover/link:bg-blue-200">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {resolvedWebsiteLink(cv.linkedin)}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="grid flex-grow grid-cols-3 gap-10 p-4 print:grid print:grid-cols-3 print:gap-4">
        {/* Left Column */}
        <div className="col-span-1 space-y-4 print:col-span-1 print:space-y-6">
          {/* About Section */}
          <section className="group print:mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <div className="mr-3 h-6 w-1 rounded-full bg-blue-500"></div>
                About
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('about')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm leading-relaxed text-slate-600">
                <ReactMarkdown>{cv.summary}</ReactMarkdown>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="group print:mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <div className="mr-3 h-6 w-1 rounded-full bg-green-500"></div>
                Skills
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('skills')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="skill-block">
                <h3 className="mb-3 text-sm font-semibold tracking-wider text-slate-700 uppercase">
                  Industry Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="skill-block">
                <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-700 uppercase">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(cv.languages || []).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100"
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
        <div className="col-span-2 space-y-4 print:col-span-2 print:space-y-4">
          {/* Experience Section */}
          <section className="group">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <div className="mr-3 h-6 w-1 rounded-full bg-purple-500"></div>
                Experience
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('experience')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 print:space-y-4">
              {cv.experience.map((experience, index) => (
                <div
                  key={index}
                  className="experience-block relative border-l-2 border-slate-200 pl-6 transition-colors hover:border-purple-300"
                >
                  <div className="absolute top-2 -left-[7px] h-3 w-3 rounded-full bg-purple-500"></div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {experience.role}
                        </h3>
                        <p className="mb-2 font-medium text-purple-600">
                          {experience.company}
                        </p>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>
                            {experience.startDate} - {experience.endDate}
                          </span>
                        </div>
                        {experience.location && (
                          <div className="mt-2 flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-600">
                      <ReactMarkdown>{experience.description}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="group">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <div className="mr-3 h-6 w-1 rounded-full bg-blue-500"></div>
                Education
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('education')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {cv.education.map((education, index) => (
                <div
                  key={index}
                  className="education-block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {education.field}
                      </h3>
                      <p className="font-medium text-blue-600">
                        {education.institution}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>
                          {education.startYear} - {education.endYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section className="group">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <div className="mr-3 h-6 w-1 rounded-full bg-orange-500"></div>
                Certifications
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setEditSection('certifications')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {cv.certifications.map((certification, index) => (
                <div
                  key={index}
                  className="certification-block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-slate-900">
                        {certification.title}
                      </h3>
                      <p className="mb-1 font-medium text-orange-600">
                        Issued by {certification.issuer} on{' '}
                        {certification.issueDate}
                      </p>
                      {certification.expiryDate && (
                        <p className="mb-1 text-sm text-slate-500">
                          Expires on {certification.expiryDate}
                        </p>
                      )}
                      {certification.credentialId && (
                        <p className="mb-2 text-sm text-slate-600">
                          Credential ID: {certification.credentialId}
                        </p>
                      )}
                    </div>
                    {certification.credentialUrl && (
                      <a
                        href={websiteLinkCreator(certification.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-4 flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        View Credential
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
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
