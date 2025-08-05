'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { websiteLinkCreator, resolvedWebsiteLink } from '@/utils/link.utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Phone,
  MapPin,
  User,
  Edit,
} from 'lucide-react';
import type { Experience, Education, Certification, Cv } from '@/types/Cv';
import EditDialogs from '../editor/EditDialogs';

type TagKey = 'skills' | 'languages';

interface CVProps {
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

const CV = ({
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
}: CVProps) => {
  const items = 'flex items-center mr-3 mt-2';
  const itemsSVG = 'h-4 w-4 text-gray-700 mr-1';
  const titles = 'text-sm font-medium uppercase text-primary';
  const paragraphSize = 'text-[0.705rem] mt-1 text-gray-700';
  const jobSize = 'text-[0.775rem] text-gray-500';

  const [editSection, setEditSection] = useState<string | null>(null);

  return (
    <div className="h-full w-full" id="cv">
      <div>
        {/* HEADER SECTION */}
        <section id="header" className="group relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {cv.image ? (
                <div className="mr-4 flex">
                  <Image
                    src={cv.image}
                    className="rounded-full border object-cover shadow-sm"
                    width={72}
                    height={72}
                    alt="Profile Picture"
                    quality={100}
                  />
                </div>
              ) : (
                <Image
                  src={'/Gradient.jpg'}
                  className="rounded-full border object-cover shadow-sm"
                  width={72}
                  height={72}
                  alt="Profile Picture"
                  quality={100}
                />
              )}
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold">{cv.name}</h1>
                <h4 className="text-sm font-medium text-gray-400">
                  {cv.title}
                </h4>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setEditSection('about')}
            >
              <User className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>

          {/* SOCIAL LINKS */}
          <div className="group relative mt-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center">
                <a
                  href={`mailto:${cv.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className={items}
                >
                  <Mail className={itemsSVG} />
                  <span className="text-xs">{cv.email}</span>
                </a>
                {cv.github && (
                  <a
                    href={websiteLinkCreator(cv.github)}
                    target="_blank"
                    rel="noreferrer"
                    className={items}
                  >
                    <Github className={itemsSVG} />
                    <span className="text-xs">
                      {resolvedWebsiteLink(cv.github)}
                    </span>
                  </a>
                )}
                {cv.linkedin && (
                  <a
                    href={websiteLinkCreator(cv.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className={items}
                  >
                    <Linkedin className={itemsSVG} />
                    <span className="text-xs">
                      {resolvedWebsiteLink(cv.linkedin)}
                    </span>
                  </a>
                )}
                {cv.phone && (
                  <div className={items}>
                    <Phone className={itemsSVG} />
                    <span className="text-xs">{cv.phone}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setEditSection('contact')}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="group relative mt-6">
          <div className="flex items-center justify-between">
            <h2 className={titles}>About</h2>
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
          <div className={paragraphSize}>
            <ReactMarkdown>{cv.summary}</ReactMarkdown>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="group skill-block relative mt-6">
          <div className="flex items-center justify-between">
            <h2 className={titles}>Skills</h2>
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
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-medium">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {cv.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-[0.6rem]"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium">Languages</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {(cv.languages || []).map((language, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-[0.6rem]"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="group relative mt-6">
          <div className="flex items-center justify-between">
            <h2 className={titles}>Experience</h2>
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
          <div className="mt-2 space-y-4">
            {cv.experience.map((experience, index) => (
              <Card key={index} className="experience-block">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {experience.company}
                          </h3>
                        </div>
                        <p className={`${jobSize}`}>{experience.role}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="border-blue-200 text-black"
                      >
                        {experience.employmentType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <div className="mt-1 flex items-center text-[0.7rem] text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>
                          {experience.startDate} -{' '}
                          {experience.endDate || 'Present'}
                        </span>
                      </div>
                      {experience.location && (
                        <div className="flex items-center gap-1 text-[0.7rem] text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{experience.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <div
                        className={`${paragraphSize} prose prose-sm max-w-none`}
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-800">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="ml-2 list-inside list-disc space-y-1">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-sm">{children}</li>
                            ),
                          }}
                        >
                          {experience.description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="group relative mt-6">
          <div className="flex items-center justify-between">
            <h2 className={titles}>Education</h2>
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
          <div className="mt-2 space-y-4">
            {cv.education.map((education, index) => (
              <Card key={index} className="education-block">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">
                          {education.institution}
                        </h3>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className={jobSize}>{education.degree}</span>
                      </div>
                      <div className="mt-1 flex items-center text-[0.7rem] text-gray-500">
                        <span className="mr-2">{education.field}</span>
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>
                          {education.startYear} -{' '}
                          {education.endYear || 'Present'}
                        </span>
                      </div>
                      <div className={paragraphSize}>
                        <ReactMarkdown>{education.description}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="group relative mt-6">
          <div className="flex items-center justify-between">
            <h2 className={titles}>Certifications / awards</h2>
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
          <div className="mt-2 space-y-4">
            {cv.certifications.map((certification, index) => (
              <Card key={index} className="certification-block">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">
                          {certification.title}
                        </h3>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className={jobSize}>{certification.issuer}</span>
                      </div>
                      <div className="mt-1 flex items-center text-[0.7rem] text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{certification.issueDate}</span>
                      </div>
                      {certification.credentialId && (
                        <div className="mt-1 text-[0.7rem] text-gray-500">
                          <span>
                            Credential ID: {certification.credentialId}
                          </span>
                        </div>
                      )}
                      {certification.credentialUrl && (
                        <div className="mt-1">
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-[0.7rem] text-blue-500 hover:underline"
                          >
                            <span>View Credential</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* EDIT DIALOGS */}
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
    </div>
  );
};

export default CV;
