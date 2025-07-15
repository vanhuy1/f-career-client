'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApplicantDetail } from '@/services/state/applicantDetailSlice';
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumePage() {
  const applicant = useApplicantDetail();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setIsLoading(false);
      setError(null);
    },
    [],
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try again.');
    setIsLoading(false);
  }, []);

  const handlePreview = () => {
    if (applicant?.cv_id) {
      window.open(applicant.cv_id, '_blank');
    }
  };

  const handleDownload = async () => {
    if (applicant?.cv_id) {
      try {
        const response = await fetch(applicant.cv_id);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${applicant.candidate?.name?.replace(/\s+/g, '_') || 'applicant'}_resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to direct link
        const link = document.createElement('a');
        link.href = applicant.cv_id;
        link.download = `${applicant.candidate?.name?.replace(/\s+/g, '_') || 'applicant'}_resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed bg-gray-50">
        <div className="space-y-3 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-900">Loading resume...</p>
          <p className="text-xs text-gray-500">
            Please wait while we load the PDF
          </p>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex h-96 items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-red-900">
              Unable to load resume
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // No resume component
  const NoResume = () => (
    <Card className="border-gray-200">
      <CardContent className="flex h-96 items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-gray-100 p-3">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">No resume available</h3>
            <p className="text-sm text-gray-500">
              This applicant hasn&apos;t uploaded a resume yet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!applicant?.cv_id) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              View and download the applicant&apos;s resume
            </p>
          </div>
        </div>
        <NoResume />
        {applicant?.cover_letter && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cover Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                  {applicant.cover_letter}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Resume</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and download the applicant&apos;s resume
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex-1 sm:flex-none"
          >
            <Eye className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1 sm:flex-none"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* PDF Viewer Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1 || isLoading}
                className="h-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="min-w-0 text-sm font-medium text-gray-700">
                  Page {numPages > 0 ? pageNumber : '-'} of {numPages || '-'}
                </span>
                {numPages > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    {numPages} pages
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages || isLoading}
                className="h-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden h-6 sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5 || isLoading}
                className="h-9"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                disabled={isLoading}
                className="h-9 min-w-[60px] font-medium"
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3.0 || isLoading}
                className="h-9"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex min-h-[600px] items-start justify-center bg-gray-50">
            {isLoading && <LoadingSkeleton />}
            {error && <ErrorDisplay />}

            {!error && (
              <div className="flex w-full justify-center p-6">
                <Document
                  file={applicant.cv_id}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="flex justify-center"
                  loading={<LoadingSkeleton />}
                >
                  {!isLoading && (
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      className="overflow-hidden rounded-lg bg-white shadow-lg"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={
                        <div className="flex h-96 items-center justify-center rounded-lg bg-white shadow-lg">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      }
                    />
                  )}
                </Document>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cover Letter Section */}
      {applicant?.cover_letter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                {applicant.cover_letter}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {applicant?.candidate?.name && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Resume for:{' '}
                <span className="font-medium text-gray-900">
                  {applicant.candidate.name}
                </span>
              </span>
              {numPages > 0 && (
                <span className="text-xs">
                  Document contains {numPages} page{numPages !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
