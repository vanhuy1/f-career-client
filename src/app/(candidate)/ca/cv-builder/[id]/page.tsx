'use client';

import Head from 'next/head';
import CV from '../components/CV';
import CV2 from '../components/CV2';
import CV3 from '../components/CV3';
import PageButtons from '../components/PageButtons';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import {
  fetchCvById,
  updateCvById,
  useCvDetailById,
  useCvDetailLoadingState,
  useCvDetailErrors,
  setCvDetailSuccess,
  setCvDetailFailure,
} from '@/services/state/cvSlice';
import { useReactToPrint } from 'react-to-print';
import {
  FILE_NOT_SELECTED,
  FILE_READ_ERROR,
  UNSUPPORTED_FILE_TYPE,
} from '@/constants/message-result.constants';
import type { Cv, Experience, Education, Certification } from '@/types/Cv';
import Settings from '../components/Settings';
import LoadingScreen from '@/pages/LoadingScreen';
import { LoadingState } from '@/store/store.model';

type TagKey = 'skills' | 'languages';

export default function CvBuilderPage() {
  // Initialize hooks
  const [showSettings, setShowSettings] = useState(false);
  const [template, setTemplate] = useState(1);
  const [scale, setScale] = useState(1);
  const [localCv, setLocalCv] = useState<Cv | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const cvId = params?.id as string;
  const cvRef = useRef<HTMLDivElement>(null);

  // Redux state
  const cv = useCvDetailById(cvId);
  const loadingState = useCvDetailLoadingState();
  const error = useCvDetailErrors();
  const isLoading = loadingState === LoadingState.loading;

  // Sync localCv and template with fetched CV
  useEffect(() => {
    if (cv) {
      setLocalCv(cv);
      setTemplate(cv.templateId || 1); // Sync template with templateId
      dispatch(setCvDetailSuccess(cv));
    }
  }, [cv, dispatch]);

  // Sync template with localCv.templateId
  useEffect(() => {
    if (localCv) {
      setTemplate(localCv.templateId || 1);
    }
  }, [localCv]);

  // Fetch CV data
  useEffect(() => {
    const fetchCvData = async () => {
      if (!cvId) return;

      if (!cv) {
        try {
          await dispatch(fetchCvById(cvId)).unwrap();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load CV data';
          dispatch(setCvDetailFailure(errorMessage));
          console.error('Failed to fetch CV data:', err);
        }
      }
    };

    fetchCvData();
  }, [cvId, cv, dispatch]);

  // Debug state changes
  useEffect(() => {
    console.log('CV State:', { cv, localCv, template, cvId });
  }, [cv, localCv, template, cvId]);

  // Event handlers
  const handlePrint = useReactToPrint({
    pageStyle: `
      @page {
        size: 210mm 297mm;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100%;
          width: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
      }
      #cv {
        margin: 0;
        padding: 20px;
        width: 210mm;
        height: auto !important;
        min-height: initial !important;
        page-break-after: auto;
        background: white;
        box-shadow: none;
        transform: none !important;
        overflow: visible !important;
      }
      #cv.template-2 > div {
        display: flex !important;
        flex-direction: row !important;
      }
      #cv section {
        page-break-inside: auto;
      }
      #cv .experience-block,
      #cv .project-block,
      #cv .education-block,
      #cv .skill-block {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      #cv * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    `,
    contentRef: cvRef,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      alert(FILE_NOT_SELECTED);
      return;
    }

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert(UNSUPPORTED_FILE_TYPE);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && localCv) {
        setLocalCv({ ...localCv, image: event.target.result as string });
      }
    };
    reader.onerror = () => {
      alert(FILE_READ_ERROR);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e: React.KeyboardEvent, key: TagKey, value: string) => {
    if (e.key === 'Enter' && value.trim() && localCv) {
      setLocalCv({
        ...localCv,
        [key]: [...(localCv[key] as string[]), value.trim()],
      });
      (e.target as HTMLInputElement).value = '';
    }
  };

  const handleRemoveTag = (key: TagKey, value: string) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        [key]: (localCv[key] as string[]).filter((tag) => tag !== value),
      });
    }
  };

  const handleAddExperience = (experience: Experience) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        experience: [...localCv.experience, experience],
      });
    }
  };

  const handleAddEducation = (education: Education) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        education: [...localCv.education, education],
      });
    }
  };

  const handleAddCertification = (certification: Certification) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        certifications: [...localCv.certifications, certification],
      });
    }
  };

  const handleUpdateCertification = (
    index: number,
    certification: Certification,
  ) => {
    if (localCv) {
      const updatedCertifications = [...localCv.certifications];
      updatedCertifications[index] = certification;
      setLocalCv({
        ...localCv,
        certifications: updatedCertifications,
      });
    }
  };

  const handleDeleteCertification = (index: number) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        certifications: localCv.certifications.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateEducation = (index: number, education: Education) => {
    if (localCv) {
      const updatedEducation = [...localCv.education];
      updatedEducation[index] = education;
      setLocalCv({
        ...localCv,
        education: updatedEducation,
      });
    }
  };

  const handleDeleteEducation = (index: number) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        education: localCv.education.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateExperience = (index: number, experience: Experience) => {
    if (localCv) {
      const updatedExperience = [...localCv.experience];
      updatedExperience[index] = experience;
      setLocalCv({
        ...localCv,
        experience: updatedExperience,
      });
    }
  };

  const handleDeleteExperience = (index: number) => {
    if (localCv) {
      setLocalCv({
        ...localCv,
        experience: localCv.experience.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateCv = <K extends keyof Cv>(key: K, value: Cv[K]) => {
    if (localCv) {
      setLocalCv({ ...localCv, [key]: value });
    }
  };

  const handleSelectTemplate = (template: number) => {
    setTemplate(template);
    handleUpdateCv('templateId', template); // Update localCv.templateId
  };

  const handleResetCv = () => {
    if (cv) {
      setLocalCv(cv);
      setTemplate(cv.templateId || 1);
    }
  };

  const handleSetSampleData = () => {
    const sampleCv: Cv = {
      id: cvId,
      name: 'John Doe',
      image: '',
      email: 'john.doe@example.com',
      phone: 1234567890,
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      title: 'Software Engineer',
      summary: 'Experienced software engineer...',
      experience: [],
      education: [],
      skills: ['JavaScript', 'React'],
      certifications: [],
      languages: ['English'],
      templateId: template,
      userId: 1,
      displayImage: false,
      displayMail: true,
      displayWebSite: false,
      displayGithub: true,
      displayTwitter: false,
      displayLinkedIn: true,
      displayInstagram: false,
      displayFacebook: false,
    };
    setLocalCv(sampleCv);
  };

  const handleScaleUp = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleScaleDown = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleSave = async () => {
    if (!cvId || !localCv) {
      console.error('Cannot save CV: Missing ID or data');
      return;
    }

    const cvData = {
      ...localCv,
      templateId: template,
    };

    try {
      await dispatch(updateCvById({ cvId, cv: cvData })).unwrap();
    } catch (err) {
      console.error('Failed to save CV:', err);
    }
  };

  // Early returns
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!cv || !cvId || !localCv) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold">CV Not Found</h2>
        <p className="text-gray-600">The requested CV could not be found.</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="relative flex h-full w-full">
      <Head>
        <title>CV Builder</title>
        <meta
          name="Cv Builder"
          content="Beautifully designed CV builder where you can see the changes at the same time"
        />
        <link rel="icon" href="/fav.png" />
      </Head>
      <main className="m-auto flex">
        <div className="relative m-auto mt-5 md:absolute md:top-0 md:right-0 md:bottom-0 md:left-0 md:flex md:h-fit md:w-fit">
          <div>
            <section
              ref={cvRef}
              className={`min-h-[1188px] w-[840px] bg-white p-8 transition-all md:rounded-md md:border md:border-slate-300 md:shadow-lg print:border-none print:shadow-none template-${template}`}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                height: 'fit-content',
              }}
            >
              {template === 1 ? (
                <CV
                  cv={localCv}
                  cvId={cvId}
                  onUpdateCv={handleUpdateCv}
                  onUploadImage={handleImageUpload}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onAddExperience={handleAddExperience}
                  onAddEducation={handleAddEducation}
                  onAddCertification={handleAddCertification}
                  onUpdateCertification={handleUpdateCertification}
                  onDeleteCertification={handleDeleteCertification}
                  onUpdateEducation={handleUpdateEducation}
                  onDeleteEducation={handleDeleteEducation}
                  onUpdateExperience={handleUpdateExperience}
                  onDeleteExperience={handleDeleteExperience}
                />
              ) : template === 2 ? (
                <CV2
                  cv={localCv}
                  cvId={cvId}
                  onUpdateCv={handleUpdateCv}
                  onUploadImage={handleImageUpload}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onAddExperience={handleAddExperience}
                  onAddEducation={handleAddEducation}
                  onAddCertification={handleAddCertification}
                  onUpdateCertification={handleUpdateCertification}
                  onDeleteCertification={handleDeleteCertification}
                  onUpdateEducation={handleUpdateEducation}
                  onDeleteEducation={handleDeleteEducation}
                  onUpdateExperience={handleUpdateExperience}
                  onDeleteExperience={handleDeleteExperience}
                />
              ) : template === 3 ? (
                <CV3
                  cv={localCv}
                  cvId={cvId}
                  onUpdateCv={handleUpdateCv}
                  onUploadImage={handleImageUpload}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onAddExperience={handleAddExperience}
                  onAddEducation={handleAddEducation}
                  onAddCertification={handleAddCertification}
                  onUpdateCertification={handleUpdateCertification}
                  onDeleteCertification={handleDeleteCertification}
                  onUpdateEducation={handleUpdateEducation}
                  onDeleteEducation={handleDeleteEducation}
                  onUpdateExperience={handleUpdateExperience}
                  onDeleteExperience={handleDeleteExperience}
                />
              ) : (
                <div className="text-center text-red-600">
                  Invalid template selected
                </div>
              )}
            </section>
          </div>
        </div>
        <PageButtons
          onPrint={handlePrint}
          onSave={handleSave}
          onReset={handleResetCv}
          onSampleData={handleSetSampleData}
          onScaleUp={handleScaleUp}
          onScaleDown={handleScaleDown}
          onShowSettings={() => setShowSettings(true)}
        />
      </main>
      <div
        className={`no-print fixed top-0 right-0 h-full w-[400px] transform overflow-y-auto border-l bg-white p-6 shadow-lg transition-transform dark:bg-gray-900 ${
          showSettings ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Settings
          template={template}
          onSetTemplate={handleSelectTemplate}
          onSaveTemplate={handleSave}
          onClose={() => setShowSettings(false)}
          cv={localCv}
          cvId={cvId}
          onUpdateCv={handleUpdateCv}
          onUploadImage={handleImageUpload}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onAddExperience={handleAddExperience}
          onAddEducation={handleAddEducation}
          onAddCertification={handleAddCertification}
          onUpdateCertification={handleUpdateCertification}
          onDeleteCertification={handleDeleteCertification}
          onUpdateEducation={handleUpdateEducation}
          onDeleteEducation={handleDeleteEducation}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
        />
      </div>
    </div>
  );
}
