'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  CompanyInfoFormValues,
  companyInfoSchema,
  SignUpRequest,
} from '@/schemas/Auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { authService } from '@/services/api/auth/auth-api';
import { uploadFile } from '@/lib/storage';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { ReportTaxCodeModal } from './ReportTaxCodeModal';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
  hrData: SignUpRequest | null;
}

export const CompanyInfoModal: React.FC<Props> = ({
  open,
  onClose,
  hrData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTaxCode, setReportTaxCode] = useState('');

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: '',
      company_website: '',
      taxCode: '',
      company_email: '',
    },
  });

  // Xử lý file được chọn
  const processFile = useCallback((file: File) => {
    // Kiểm tra loại file - thêm support cho .jpg
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    const fileType = file.type.toLowerCase();

    // Check file extension nếu MIME type không đúng (một số browser có thể không detect đúng)
    const fileName = file.name.toLowerCase();
    const isImageByExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdfByExtension = /\.pdf$/i.test(fileName);

    if (
      !allowedTypes.includes(fileType) &&
      !isImageByExtension &&
      !isPdfByExtension
    ) {
      toast.error('Please select an image file (JPEG, PNG, GIF, WebP) or PDF');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size cannot exceed 10MB');
      return;
    }

    setBusinessLicenseFile(file);

    // Tạo preview URL
    if (fileType.startsWith('image/') || isImageByExtension) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setPdfPreviewUrl(null);
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf' || isPdfByExtension) {
      // Tạo URL cho PDF preview
      const pdfUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(pdfUrl);
      setPreviewUrl(null);
    } else {
      setPreviewUrl(null);
      setPdfPreviewUrl(null);
    }
  }, []);

  // Xử lý chọn file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Xử lý drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  // Cleanup effect for PDF URL
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  // Xóa file đã chọn
  const handleRemoveFile = () => {
    setBusinessLicenseFile(null);
    setPreviewUrl(null);
    // Clean up PDF URL to prevent memory leak
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleRegisterClick = async () => {
    try {
      if (
        !hrData?.email ||
        !hrData?.password ||
        !hrData?.name ||
        !hrData?.username
      ) {
        throw new Error('Missing required registration data');
      }

      setIsSubmitting(true);
      setUploadProgress(true);

      let business_license_url = '';

      if (businessLicenseFile) {
        const { publicUrl, error } = await uploadFile({
          file: businessLicenseFile,
          bucket: SupabaseBucket.COMPANY_ASSETS,
          folder: SupabaseFolder.COMPANY_BUSINESS_LICENSES,
        });

        if (error || !publicUrl) {
          throw new Error('Error uploading business license');
        }

        business_license_url = publicUrl;
      }

      const companyData = getValues();
      const fullData = {
        email: hrData.email,
        password: hrData.password,
        name: hrData.name,
        username: hrData.username,
        taxCode: companyData.taxCode,
        companyName: companyData.company_name,
        companyWebsite: companyData.company_website,
        companyEmail: hrData.email,
        business_license_url,
        roles: ['ADMIN_RECRUITER'],
      };

      const response = await authService.registerCompany(fullData);
      setSubmittedEmail(companyData.company_email);
      setIsSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      const apiError = error as string;
      const companyData = getValues();

      const isTaxCodeError = apiError
        .toLowerCase()
        .includes('a company with this tax code already exists.');

      if (isTaxCodeError) {
        setReportTaxCode(companyData.taxCode);
        setShowReportModal(true);
      } else {
        toast.error(apiError);
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto lg:max-w-[66.666667%]">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mb-6 text-gray-600">
              We have received your company information. Please check your email
              at <strong className="text-gray-900">{submittedEmail}</strong> to
              verify your account.
            </p>
            <Button
              onClick={onClose}
              className="bg-emerald-600 px-6 text-white hover:bg-emerald-700"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-semibold">
                Company Information
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please provide your company details to complete registration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="company_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="e.g. ABC Company Ltd."
                  className="w-full transition-colors focus:border-emerald-500"
                />
                {errors.company_name && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.company_name.message}
                  </p>
                )}
              </div>

              {/* Tax Code */}
              <div className="space-y-2">
                <Label
                  htmlFor="taxCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Tax Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="taxCode"
                  {...register('taxCode')}
                  placeholder="e.g. 0123456789"
                  className="w-full transition-colors focus:border-emerald-500"
                />
                {errors.taxCode && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.taxCode.message}
                  </p>
                )}
              </div>

              {/* Business License Upload */}
              <div className="space-y-3">
                <Label
                  htmlFor="business_license"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Verification Documents
                </Label>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm leading-relaxed text-blue-800">
                    To speed up the verification process, please provide one of
                    the following documents:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Business registration certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Audited financial statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>
                        Company meeting minutes or appointment decision
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Recent output invoices</span>
                    </li>
                  </ul>
                </div>

                {!businessLicenseFile ? (
                  <div
                    className={`relative rounded-lg border-2 border-dashed transition-all ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      id="business_license"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="business_license"
                      className="flex cursor-pointer flex-col items-center justify-center p-8"
                    >
                      <Upload
                        className={`h-10 w-10 ${isDragging ? 'text-emerald-500' : 'text-gray-400'} mb-3`}
                      />
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        Drag and drop file here or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Accept image files (JPEG, PNG, GIF, WebP) or PDF • Max
                        10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Preview section */}
                    <div className="mb-3">
                      {previewUrl ? (
                        // Image preview
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <div className="relative h-48 w-full">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : pdfPreviewUrl ? (
                        // PDF preview
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <div className="border-b border-gray-200 bg-gray-100 px-4 py-2">
                            <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <FileText className="h-4 w-4 text-red-600" />
                              PDF Preview
                            </p>
                          </div>
                          <div className="relative bg-gray-50">
                            <iframe
                              src={pdfPreviewUrl}
                              className="h-96 w-full"
                              title="PDF Preview"
                            />
                            {/* Fallback message for browsers that don't support PDF preview */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-50 opacity-0 transition-opacity hover:opacity-100">
                              <p className="px-4 text-center text-sm text-gray-500">
                                If PDF preview is not showing, your browser may
                                not support it.
                                <br />
                                The file will still be uploaded successfully.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // File type preview for other files
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
                          <div className="flex flex-col items-center justify-center">
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                              <FileText className="h-10 w-10 text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              Document File
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Preview not available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File info section */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mr-3 flex-shrink-0">
                        {businessLicenseFile.type.startsWith('image/') ||
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(
                          businessLicenseFile.name,
                        ) ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <ImageIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        ) : businessLicenseFile.type === 'application/pdf' ||
                          businessLicenseFile.name
                            .toLowerCase()
                            .endsWith('.pdf') ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <FileText className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {businessLicenseFile.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatFileSize(businessLicenseFile.size)} •{' '}
                          {businessLicenseFile.name
                            .split('.')
                            .pop()
                            ?.toUpperCase() ||
                            businessLicenseFile.type
                              .split('/')[1]
                              ?.toUpperCase() ||
                            'FILE'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="group ml-3 rounded-lg p-1.5 transition-colors hover:bg-gray-200"
                        title="Remove file"
                      >
                        <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="min-w-[120px] bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                onClick={handleRegisterClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {uploadProgress ? 'Uploading...' : 'Processing...'}
                  </span>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>

      <ReportTaxCodeModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        taxCode={reportTaxCode}
        companyName={getValues().company_name}
        userEmail={hrData?.email || ''}
      />
    </Dialog>
  );
};
