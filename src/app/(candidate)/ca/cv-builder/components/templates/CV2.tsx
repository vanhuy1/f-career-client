'use client';

import type React from 'react';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { websiteLinkCreator, resolvedWebsiteLink } from '@/utils/link.utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Calendar,
  Github,
  Linkedin,
  Edit,
  Phone,
  MapPin,
} from 'lucide-react';
import type { Experience, Education, Cv, Certification } from '@/types/Cv';
import EditDialogs from '../editor/EditDialogs';

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
      className="flex h-full min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 print:h-screen print:min-h-screen print:w-full print:bg-white"
      id="cv"
    >
      {/* Left Sidebar - Enhanced with gradient and better styling */}
      <div className="sidebar flex w-1/3 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl print:w-1/3 print:bg-slate-900 print:p-8 print:shadow-none">
        <div className="sticky top-0 space-y-6 print:static">
          {/* Profile Image with enhanced styling */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Image
                src={cv.image || '/Gradient.jpg'}
                className="rounded-2xl border-4 border-white/20 object-cover shadow-xl ring-4 ring-white/10"
                width={140}
                height={140}
                alt="Profile Picture"
                quality={100}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Name and Title with better typography */}
          <div className="space-y-2 text-center">
            <h1 className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-3xl font-bold text-transparent">
              {cv.name}
            </h1>
            <h4 className="text-lg font-medium tracking-wide text-blue-200">
              {cv.title}
            </h4>
          </div>

          {/* Contact Info with improved spacing and icons */}
          <div className="group relative mt-8 space-y-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-semibold text-white">
                <div className="mr-3 h-6 w-1 rounded-full bg-blue-400"></div>
                Contact
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                onClick={() => setEditSection('contact')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {cv.email && (
                <a
                  href={`mailto:${cv.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group/item flex items-center text-slate-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 transition-colors group-hover/item:bg-blue-500/30">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {cv.email}
                  </span>
                </a>
              )}

              {cv.github && (
                <a
                  href={websiteLinkCreator(cv.github)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/item flex items-center text-slate-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 transition-colors group-hover/item:bg-purple-500/30">
                    <Github className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {resolvedWebsiteLink(cv.github)}
                  </span>
                </a>
              )}

              {cv.linkedin && (
                <a
                  href={websiteLinkCreator(cv.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/item flex items-center text-slate-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 transition-colors group-hover/item:bg-blue-600/30">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {resolvedWebsiteLink(cv.linkedin)}
                  </span>
                </a>
              )}

              {cv.phone && (
                <div className="group/item flex items-center text-slate-200">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium">
                    {cv.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section with enhanced design */}
          <div className="mt-10">
            <div className="group relative mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-semibold text-white">
                <div className="mr-3 h-6 w-1 rounded-full bg-green-400"></div>
                Skills
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                onClick={() => setEditSection('skills')}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="skill-block">
                <h3 className="mb-3 text-sm font-semibold tracking-wider text-blue-200 uppercase">
                  Industry Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="skill-block">
                <h3 className="mb-3 text-sm font-semibold tracking-wider text-blue-200 uppercase">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(cv.languages || []).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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

      {/* Main Content with enhanced styling */}
      <div className="main-content flex w-2/3 flex-col bg-white p-8 print:w-2/3 print:p-8">
        {/* About Section */}
        <section className="mb-10 print:mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-slate-800">
              <div className="mr-4 h-8 w-1 rounded-full bg-blue-500"></div>
              About
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setEditSection('about')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 leading-relaxed text-slate-600">
            <ReactMarkdown>{cv.summary}</ReactMarkdown>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-10 print:mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-slate-800">
              <div className="mr-4 h-8 w-1 rounded-full bg-purple-500"></div>
              Experience
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setEditSection('experience')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {cv.experience.map((experience, index) => (
              <div
                key={index}
                className="experience-block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-semibold text-slate-800">
                    {experience.role}
                  </h3>
                  <p className="mb-2 text-lg font-medium text-blue-600">
                    {experience.company}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {experience.startDate} - {experience.endDate}
                      </span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="leading-relaxed text-slate-600">
                  <ReactMarkdown>{experience.description}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-10 print:mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-slate-800">
              <div className="mr-4 h-8 w-1 rounded-full bg-green-500"></div>
              Education
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setEditSection('education')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {cv.education.map((education, index) => (
              <div
                key={index}
                className="education-block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-800">
                      {education.field}
                    </h3>
                    <p className="mb-2 font-medium text-blue-600">
                      {education.institution}
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="mr-2 h-4 w-4" />
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
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-slate-800">
              <div className="mr-4 h-8 w-1 rounded-full bg-orange-500"></div>
              Certifications
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setEditSection('certifications')}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {cv.certifications.map((certification, index) => (
              <div
                key={index}
                className="certification-block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-800">
                      {certification.title}
                    </h3>
                    <p className="mb-2 font-medium text-blue-600">
                      Issued by {certification.issuer}
                    </p>
                    <div className="mb-2 flex items-center text-sm text-slate-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {certification.issueDate} -{' '}
                        {certification.expiryDate || 'Present'}
                      </span>
                    </div>
                    {certification.credentialId && (
                      <p className="mb-2 text-sm text-slate-600">
                        Credential ID: {certification.credentialId}
                      </p>
                    )}
                    {certification.credentialUrl && (
                      <a
                        href={websiteLinkCreator(certification.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-500 transition-colors hover:text-blue-600"
                      >
                        View Credential
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
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
