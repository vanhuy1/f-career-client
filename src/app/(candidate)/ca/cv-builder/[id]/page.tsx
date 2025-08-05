'use client';

import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import CV from '../components/templates/CV';
import CV2 from '../components/templates/CV2';
import CV3 from '../components/templates/CV3';
import PageButtons from '../components/PageButtons';
import PreviewModal from '../components/PreviewModal';
import CvOptimizer from '../components/optimizer/CvOptimizer';
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
import {
  FILE_NOT_SELECTED,
  FILE_READ_ERROR,
  UNSUPPORTED_FILE_TYPE,
} from '@/constants/message-result.constants';
import type { Cv, Experience, Education, Certification } from '@/types/Cv';
import Settings from '../components/Settings';
import LoadingScreen from '@/pages/LoadingScreen';
import { LoadingState } from '@/store/store.model';
import { uploadFile } from '@/lib/storage';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabaseClient';
import { jsPDF } from 'jspdf';

// Helper function to upload avatar image
const uploadAvatarImage = async (
  file: File,
  cvId: string,
): Promise<string | null> => {
  try {
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${cvId}-${Date.now()}.${fileExt}`;

    // Upload image to Supabase Storage using the same uploadFile function
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

// Helper function to create a fallback PDF if html2canvas fails
const createFallbackPdf = async (cv: Cv): Promise<Blob> => {
  // PDF Configuration
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const primaryColor = '#0f172a';
  const secondaryColor = '#64748b';
  const accentColor = '#3b82f6';
  const lightGray = '#f1f5f9';

  // Fonts & Sizing
  pdf.setFont('helvetica', 'normal');
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper function to ensure text fits within page width
  const fitText = (text: string, maxWidth: number, fontSize: number) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Helper function to add section headers
  const addSectionHeader = (title: string) => {
    pdf.setFillColor(lightGray);
    pdf.rect(margin, yPos, contentWidth, 8, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 2, yPos + 5.5);
    yPos += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
  };

  // Add header with name and title
  pdf.setFillColor(primaryColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text(cv.name || 'CV', margin, 15);

  if (cv.title) {
    pdf.setFontSize(14);
    pdf.text(cv.title, margin, 25);
  }

  yPos = 45;

  // Contact info section with icons (simulated)
  pdf.setDrawColor(220, 220, 220);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'FD');

  yPos += 6;

  const contactX = margin + 5;
  const contactInfo = [];

  if (cv.email) contactInfo.push(`Email: ${cv.email}`);
  if (cv.phone) contactInfo.push(`Phone: ${cv.phone}`);
  if (cv.linkedin) contactInfo.push(`LinkedIn: ${cv.linkedin}`);
  if (cv.github) contactInfo.push(`GitHub: ${cv.github}`);

  // Display contact info in two columns if possible
  if (contactInfo.length > 2) {
    const midPoint = Math.ceil(contactInfo.length / 2);

    pdf.setFontSize(9);
    pdf.setTextColor(secondaryColor);

    // First column
    for (let i = 0; i < midPoint; i++) {
      pdf.text(contactInfo[i], contactX, yPos + i * 7);
    }

    // Second column
    const secondColX = margin + contentWidth / 2;
    for (let i = midPoint; i < contactInfo.length; i++) {
      pdf.text(contactInfo[i], secondColX, yPos + (i - midPoint) * 7);
    }

    yPos += Math.max(midPoint, contactInfo.length - midPoint) * 7;
  } else {
    // Single row layout for fewer items
    pdf.setFontSize(9);
    pdf.setTextColor(secondaryColor);

    const itemWidth = contentWidth / contactInfo.length;
    contactInfo.forEach((info, i) => {
      pdf.text(info, margin + i * itemWidth, yPos);
    });

    yPos += 7;
  }

  yPos += 10;

  // Add summary
  if (cv.summary) {
    addSectionHeader('Summary');

    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);

    const summaryLines = fitText(cv.summary, contentWidth, 10);
    pdf.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 5.5 + 10;
  }

  // Add skills
  if (cv.skills && cv.skills.length > 0) {
    addSectionHeader('Skills');

    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);

    // Create skill badges (simulated with rectangles)
    const skillsPerRow = 4;
    const skillMargin = 5;
    const skillWidth =
      (contentWidth - skillMargin * (skillsPerRow - 1)) / skillsPerRow;

    let currentRow = 0;
    let currentCol = 0;

    cv.skills.forEach((skill) => {
      if (currentCol >= skillsPerRow) {
        currentCol = 0;
        currentRow++;
      }

      const skillX = margin + currentCol * (skillWidth + skillMargin);
      const skillY = yPos + currentRow * 12;

      // Draw skill badge
      pdf.setFillColor(lightGray);
      pdf.roundedRect(skillX, skillY, skillWidth, 8, 2, 2, 'F');

      // Add skill text
      pdf.setTextColor(primaryColor);
      pdf.text(skill, skillX + 3, skillY + 5.5);

      currentCol++;
    });

    yPos += Math.ceil(cv.skills.length / skillsPerRow) * 12 + 10;
  }

  // Add experience
  if (cv.experience && cv.experience.length > 0) {
    addSectionHeader('Experience');

    cv.experience.forEach((exp, idx) => {
      // Company and role
      pdf.setFontSize(12);
      pdf.setTextColor(primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${exp.role}`, margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(accentColor);
      pdf.text(`${exp.company}`, margin, yPos);

      // Duration and location on the right
      const dateLocation = `${exp.startDate} - ${exp.endDate} | ${exp.location}`;
      const dateWidth = pdf.getTextWidth(dateLocation);
      pdf.setFontSize(9);
      pdf.setTextColor(secondaryColor);
      pdf.text(dateLocation, pageWidth - margin - dateWidth, yPos);

      yPos += 7;

      // Description
      pdf.setFontSize(10);
      pdf.setTextColor(secondaryColor);
      const descLines = fitText(exp.description, contentWidth, 10);
      pdf.text(descLines, margin, yPos);
      yPos += descLines.length * 5 + 12;

      // Add a divider between experiences except for the last one
      if (idx < cv.experience.length - 1) {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, yPos - 6, margin + contentWidth, yPos - 6);
      }
    });
  }

  // Check if we need a new page for education
  if (yPos > 250 && cv.education && cv.education.length > 0) {
    pdf.addPage();
    yPos = margin;
  }

  // Add education
  if (cv.education && cv.education.length > 0) {
    addSectionHeader('Education');

    cv.education.forEach((edu, idx) => {
      pdf.setFontSize(12);
      pdf.setTextColor(primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${edu.degree} in ${edu.field}`, margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(accentColor);
      pdf.text(`${edu.institution}`, margin, yPos);

      const years = `${edu.startYear} - ${edu.endYear || 'Present'}`;
      const yearsWidth = pdf.getTextWidth(years);
      pdf.setFontSize(9);
      pdf.setTextColor(secondaryColor);
      pdf.text(years, pageWidth - margin - yearsWidth, yPos);

      yPos += 7;

      if (edu.description) {
        pdf.setFontSize(10);
        pdf.setTextColor(secondaryColor);
        const descLines = fitText(edu.description, contentWidth, 10);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 5 + 10;
      } else {
        yPos += 5;
      }

      // Add a divider between educations except for the last one
      if (idx < cv.education.length - 1) {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, yPos - 5, margin + contentWidth, yPos - 5);
      }
    });

    yPos += 7;
  }

  // Add certifications if space allows
  if (cv.certifications && cv.certifications.length > 0) {
    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = margin;
    }

    addSectionHeader('Certifications / awards');

    cv.certifications.forEach((cert) => {
      pdf.setFontSize(11);
      pdf.setTextColor(primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(cert.title, margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(secondaryColor);
      pdf.text(
        `Issued by ${cert.issuer} | ${cert.issueDate} - ${cert.expiryDate}`,
        margin,
        yPos,
      );
      yPos += 7;

      if (cert.credentialId) {
        pdf.setFontSize(9);
        pdf.text(`Credential ID: ${cert.credentialId}`, margin, yPos);
        yPos += 5;
      }

      yPos += 5;
    });
  }

  // Add languages if available and space allows
  if (cv.languages && cv.languages.length > 0) {
    // Check if we need a new page
    if (yPos > 270) {
      pdf.addPage();
      yPos = margin;
    }

    addSectionHeader('Languages');

    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);
    pdf.text(cv.languages.join(', '), margin, yPos);
    yPos += 10;
  }

  // Footer with page number
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(secondaryColor);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 10,
      { align: 'center' },
    );
  }

  return pdf.output('blob');
};

// Helper function to compress a PDF file to fit within size limit
const compressPdf = async (pdfBlob: Blob, maxSize: number): Promise<Blob> => {
  // If the file is already small enough, return it as is
  if (pdfBlob.size <= maxSize) {
    return pdfBlob;
  }

  try {
    // Try using a simpler approach with canvas downscaling
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Convert to base64 string for adding to PDF
    const reader = new FileReader();
    const base64String = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(pdfBlob);
    });

    // Calculate a scale factor based on file size
    const scaleFactor = Math.min((maxSize / pdfBlob.size) * 0.8, 0.8); // Target 80% of max size, max scale 0.8

    // Add scaled image
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(
      base64String,
      'PNG',
      0,
      0,
      pdfWidth * scaleFactor,
      pdfHeight * scaleFactor,
    );

    // Get the compressed PDF
    const compressedBlob = pdf.output('blob');

    if (compressedBlob.size <= maxSize) {
      return compressedBlob;
    }

    // If still too large, create a much simpler version
    return createTextOnlyPdf();
  } catch (error) {
    console.error('Error compressing PDF:', error);
    // Fall back to creating a text-only version
    return createTextOnlyPdf();
  }
};

// Create a text-only version of the PDF as a last resort
const createTextOnlyPdf = async (): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // We can't easily extract text from a PDF blob, so we'll create a generic message
  pdf.setFontSize(16);
  pdf.text('Your CV was too large to save with full formatting.', 20, 30);
  pdf.setFontSize(12);
  pdf.text('Please try one of the following:', 20, 50);
  pdf.text('1. Remove some content or images from your CV', 20, 60);
  pdf.text('2. Download the CV to your device instead', 20, 70);
  pdf.text('3. Use a simpler template', 20, 80);

  return pdf.output('blob');
};

// Add a helper function to clean up old CV files
const cleanupOldCvFiles = async (cvId: string) => {
  try {
    if (!cvId) return;

    // List all files in the CV uploads folder
    const { data: files, error: listError } = await supabase.storage
      .from(SupabaseBucket.CV_UPLOADS)
      .list(SupabaseFolder.application);

    if (listError) {
      console.warn('Failed to list CV files for cleanup:', listError);
      return;
    }

    // Find files that belong to this CV
    const filesToDelete = files
      ?.filter((file) => file.name.includes(`CV-${cvId}`))
      .map((file) => `${SupabaseFolder.application}/${file.name}`);

    if (filesToDelete && filesToDelete.length > 0) {
      console.log(
        `Cleaning up ${filesToDelete.length} old CV files for CV ID: ${cvId}`,
      );
      // Delete the old files
      const { error: deleteError } = await supabase.storage
        .from(SupabaseBucket.CV_UPLOADS)
        .remove(filesToDelete);

      if (deleteError) {
        console.warn('Failed to delete old CV files:', deleteError);
      }
    }
  } catch (error) {
    console.warn('Error during CV file cleanup:', error);
  }
};

type TagKey = 'skills' | 'languages';

export default function CvBuilderPage() {
  // Initialize hooks
  const [showSettings, setShowSettings] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [template, setTemplate] = useState(1);
  const [scale, setScale] = useState(1);
  const [localCv, setLocalCv] = useState<Cv | null>(null);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
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

  // Handle save or download
  const handleSaveOrDownload = async (saveType: 'system' | 'download') => {
    if (!localCv || !cvId || !cvRef.current) {
      toast.error('CV data is not available. Please try again.');
      return;
    }

    const processingToast = toast.info(
      saveType === 'download' ? 'Creating PDF file...' : 'Processing CV...',
      {
        autoClose: false,
        closeButton: false,
        draggable: false,
      },
    );

    try {
      const updatedCv = { ...localCv };

      // Upload avatar image if available and saving to system
      if (tempImageFile && saveType === 'system') {
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
          }
        } catch (avatarError) {
          console.error('Failed to upload avatar:', avatarError);
          // Continue with CV save even if avatar upload fails
          toast.warn(
            'Failed to upload profile image, continuing with CV save...',
          );
        }
      }

      // Save original scale to restore later
      const originalScale = scale;

      // Set scale to 1 for capturing
      setScale(1);

      // Wait for the state update and DOM to reflect changes
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Temporarily inject a stylesheet that overrides problematic colors
      const styleElement = document.createElement('style');
      styleElement.id = 'cv-export-styles';
      styleElement.innerHTML = `
        [style*="oklch"] {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #cccccc !important;
        }
        .template-1, .template-2, .template-3 {
          background-color: white !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `;
      document.head.appendChild(styleElement);

      try {
        // Dynamic import html-to-image
        const { toCanvas } = await import('html-to-image');

        // Use html-to-image directly with lower quality for size reduction
        const canvas = await toCanvas(cvRef.current, {
          width: cvRef.current.offsetWidth,
          height: cvRef.current.offsetHeight,
          backgroundColor: 'white',
          skipAutoScale: true,
          pixelRatio: 5,
          quality: 1,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
          filter: (node: Node): boolean => {
            if (node instanceof Element) {
              // Skip hidden elements
              if (
                window.getComputedStyle(node).visibility === 'hidden' ||
                window.getComputedStyle(node).display === 'none'
              ) {
                return false;
              }

              // Fix problematic styling
              if (
                node.hasAttribute('style') &&
                node.getAttribute('style')?.includes('oklch')
              ) {
                const style = node.getAttribute('style');
                if (style) {
                  const safeStyle = style.replace(
                    /oklch\([^)]+\)/g,
                    'rgb(0,0,0)',
                  );
                  node.setAttribute('style', safeStyle);
                }
              }
            }
            return true;
          },
        });

        // Get the image data with higher compression
        const imgData = canvas.toDataURL('image/jpeg', 0.6); // More compression

        // Create PDF with maximum compression
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });

        // Calculate dimensions
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Handle multi-page if needed
        let remainingHeight = pdfHeight;
        let srcPos = 0;

        while (remainingHeight > 0) {
          // Add current portion to the PDF with maximum compression
          pdf.addImage(
            imgData,
            'JPEG',
            0, // x
            -srcPos, // y position in the source image
            pdfWidth,
            pdfHeight,
            undefined,
            'FAST',
          );

          remainingHeight -= pdfHeight;
          srcPos += pdfHeight;

          // Add a new page if we have more content
          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }

        // Get the PDF blob
        const initialPdfBlob = pdf.output('blob');

        // Define max size for Supabase (1.5MB to be safe)
        const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

        // For download, we can use the higher quality PDF
        if (saveType === 'download') {
          // Create a download link
          const downloadFileName = `${localCv.name ? localCv.name.replace(/\s+/g, '-') : 'CV'}-${Date.now()}.pdf`;
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(initialPdfBlob);
          downloadLink.download = downloadFileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Update toast
          toast.dismiss(processingToast);
          toast.success('CV downloaded successfully');
          return;
        }

        // For system save, check if we need to compress further
        let finalPdfBlob = initialPdfBlob;

        // If PDF is too large for Supabase, compress it
        if (finalPdfBlob.size > MAX_FILE_SIZE) {
          toast.update(processingToast, {
            render: 'CV file is large. Optimizing for storage...',
            type: 'info',
          });

          // Try to compress the PDF
          finalPdfBlob = await compressPdf(initialPdfBlob, MAX_FILE_SIZE);

          // If still too large after compression, create a simple text-only version
          if (finalPdfBlob.size > MAX_FILE_SIZE) {
            toast.update(processingToast, {
              render: 'Creating simplified version of CV...',
              type: 'info',
            });

            finalPdfBlob = await createFallbackPdf(updatedCv);
          }
        }

        // Clean up old CV files before uploading new one
        await cleanupOldCvFiles(cvId);

        // Convert blob to File with unique name
        const uniqueFileName = `CV-${cvId}-${Date.now()}.pdf`;
        const pdfFile = new File([finalPdfBlob], uniqueFileName, {
          type: 'application/pdf',
        });

        // Upload the PDF file to Supabase
        const { publicUrl, error } = await uploadFile({
          file: pdfFile,
          bucket: SupabaseBucket.CV_UPLOADS,
          folder: SupabaseFolder.application,
        });

        if (error || !publicUrl) {
          throw new Error(
            `Failed to save CV: ${error?.message || 'Unknown error'}`,
          );
        }

        // Save the URL to the CV in the database
        await dispatch(
          updateCvById({
            cvId,
            cv: { ...updatedCv, url: publicUrl, templateId: template },
          }),
        ).unwrap();

        // Clear temp image file after successful save
        setTempImageFile(null);

        // Success
        toast.dismiss(processingToast);
        toast.success('CV saved to system successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);

        // Try fallback method
        try {
          toast.update(processingToast, {
            render: 'Trying alternative method...',
            type: 'info',
          });

          // Create a simple text-based PDF as fallback
          const pdfBlob = await createFallbackPdf(updatedCv);

          // If downloading, create a link
          if (saveType === 'download') {
            const downloadFileName = `${localCv.name ? localCv.name.replace(/\s+/g, '-') : 'CV'}-${Date.now()}.pdf`;
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = downloadFileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            toast.dismiss(processingToast);
            toast.success('CV downloaded successfully (simplified version)');
            return;
          }

          // Clean up old CV files before uploading new one
          await cleanupOldCvFiles(cvId);

          // Convert blob to File with unique name
          const uniqueFileName = `CV-${cvId}-${Date.now()}.pdf`;
          const pdfFile = new File([pdfBlob], uniqueFileName, {
            type: 'application/pdf',
          });

          // Upload the PDF file to Supabase
          const { publicUrl, error } = await uploadFile({
            file: pdfFile,
            bucket: SupabaseBucket.CV_UPLOADS,
            folder: SupabaseFolder.application,
          });

          if (error || !publicUrl) {
            throw new Error(
              `Failed to save CV: ${error?.message || 'Unknown error'}`,
            );
          }

          // Save the URL to the CV in the database
          await dispatch(
            updateCvById({
              cvId,
              cv: { ...updatedCv, url: publicUrl, templateId: template },
            }),
          ).unwrap();

          toast.dismiss(processingToast);
          toast.success('CV saved to system successfully (simplified version)');
        } catch (error) {
          toast.dismiss(processingToast);
          console.error('Failed to save PDF:', error);
          toast.error('Failed to save PDF. Please try again.');
        }
      } finally {
        // Remove temporary styles
        if (styleElement && document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }

        // Restore original scale
        setScale(originalScale);
      }
    } catch (error) {
      toast.dismiss(processingToast);
      console.error('Error saving CV:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save CV. Please try again.',
      );
      throw error; // Re-throw so the dialog can handle it
    }
  };

  // Handle direct save to system from preview modal
  const handlePreviewSave = async () => {
    setShowPreviewModal(false);
    await handleSaveOrDownload('system');
  };

  // Handle direct download from preview modal
  const handlePreviewDownload = async () => {
    setShowPreviewModal(false);
    await handleSaveOrDownload('download');
  };

  // Handle direct save to system
  const handleDirectSave = async () => {
    await handleSaveOrDownload('system');
  };

  // Handle direct download
  const handleDirectDownload = async () => {
    await handleSaveOrDownload('download');
  };

  // Handle preview
  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  // Simple save for template updates - just updates the database
  const handleUpdateTemplate = async () => {
    if (!localCv || !cvId) return;

    try {
      await dispatch(
        updateCvById({
          cvId,
          cv: { ...localCv, templateId: template },
        }),
      ).unwrap();
      toast.success('Template updated successfully');
    } catch (error) {
      console.error('Failed to update template:', error);
      toast.error('Failed to update template. Please try again.');
    }
  };

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

    // Save file temporarily for upload later
    setTempImageFile(file);

    // Create preview for display
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && localCv) {
        // Update localCv with preview URL for display only
        // This is temporary and will not be saved to database
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
      const updatedCertifications = [...localCv.certifications];
      updatedCertifications.splice(index, 1);
      setLocalCv({
        ...localCv,
        certifications: updatedCertifications,
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
      const updatedEducation = [...localCv.education];
      updatedEducation.splice(index, 1);
      setLocalCv({
        ...localCv,
        education: updatedEducation,
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
      const updatedExperience = [...localCv.experience];
      updatedExperience.splice(index, 1);
      setLocalCv({
        ...localCv,
        experience: updatedExperience,
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
  };

  const handleResetCv = () => {
    if (cv) {
      setLocalCv(cv);
      setTemplate(cv.templateId || 1);
      setTempImageFile(null); // Clear temp image file
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
    setTempImageFile(null); // Clear temp image file
  };

  const handleScaleUp = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleScaleDown = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Render CV component based on template
  const renderCvComponent = () => {
    if (!localCv) return null;

    const cvProps = {
      cv: localCv,
      cvId,
      onUpdateCv: handleUpdateCv,
      onUploadImage: handleImageUpload,
      onAddTag: handleAddTag,
      onRemoveTag: handleRemoveTag,
      onAddExperience: handleAddExperience,
      onAddEducation: handleAddEducation,
      onAddCertification: handleAddCertification,
      onUpdateCertification: handleUpdateCertification,
      onDeleteCertification: handleDeleteCertification,
      onUpdateEducation: handleUpdateEducation,
      onDeleteEducation: handleDeleteEducation,
      onUpdateExperience: handleUpdateExperience,
      onDeleteExperience: handleDeleteExperience,
    };

    switch (template) {
      case 1:
        return <CV {...cvProps} />;
      case 2:
        return <CV2 {...cvProps} />;
      case 3:
        return <CV3 {...cvProps} />;
      default:
        return (
          <div className="text-center text-red-600">
            Invalid template selected
          </div>
        );
    }
  };

  if (isLoading || !localCv) {
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">CV Builder</h1>
        <div className="flex flex-wrap gap-2">
          <CvOptimizer
            cvId={cvId}
            onUpdateCv={(
              updatedCvOrUpdater: Partial<Cv> | ((cv: Cv) => Cv),
            ) => {
              if (localCv) {
                if (typeof updatedCvOrUpdater === 'function') {
                  // Handle function updater
                  setLocalCv(updatedCvOrUpdater(localCv));
                } else {
                  // Handle partial object update
                  setLocalCv({ ...localCv, ...updatedCvOrUpdater });
                }
              }
            }}
          />
        </div>
      </div>

      <div className="relative flex h-full w-full">
        <Head>
          <title>CV Builder</title>
          <meta
            name="Cv Builder"
            content="Beautifully designed CV builder where you can see the changes at the same time"
          />
          <link rel="icon" href="/fav.png" />
          <style>
            {`
              @media print {
                [style*="oklch"] {
                  color: #000000 !important;
                  background-color: #ffffff !important;
                  border-color: #cccccc !important;
                }
              }
            `}
          </style>
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
                {renderCvComponent()}
              </section>
            </div>
          </div>
          <PageButtons
            onSave={handleDirectSave}
            onDownload={handleDirectDownload}
            onReset={handleResetCv}
            onSampleData={handleSetSampleData}
            onScaleUp={handleScaleUp}
            onScaleDown={handleScaleDown}
            onShowSettings={() => setShowSettings(true)}
            onPreview={handlePreview}
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
            onSaveTemplate={() => handleUpdateTemplate()}
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

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSave={handlePreviewSave}
        onDownload={handlePreviewDownload}
        title="CV Preview"
      >
        {renderCvComponent()}
      </PreviewModal>
    </div>
  );
}
