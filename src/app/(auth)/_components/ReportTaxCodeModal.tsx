'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '@/services/api/auth/auth-api';

interface ReportTaxCodeModalProps {
  open: boolean;
  onClose: () => void;
  taxCode: string;
  companyName: string;
  userEmail: string;
}

export const ReportTaxCodeModal: React.FC<ReportTaxCodeModalProps> = ({
  open,
  onClose,
  taxCode,
  companyName,
  userEmail,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState({
    contactPhone: '',
    additionalInfo: '',
  });
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, '');

    const vietnamesePhonePattern =
      /^(0|84|\+84)?(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;

    if (vietnamesePhonePattern.test(phoneDigits)) {
      return true;
    }

    if (phoneDigits.length >= 10 && phoneDigits.length <= 15) {
      return true;
    }

    return false;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReportData({
      ...reportData,
      contactPhone: value,
    });

    if (phoneError) {
      setPhoneError('');
    }
  };

  const handlePhoneBlur = () => {
    if (reportData.contactPhone && !validatePhone(reportData.contactPhone)) {
      setPhoneError('Please enter a valid phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async () => {
    if (!reportData.contactPhone) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!validatePhone(reportData.contactPhone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    try {
      setIsSubmitting(true);

      const reportPayload = {
        taxCode,
        companyName,
        userEmail,
        contactPhone: reportData.contactPhone,
        additionalInfo: reportData.additionalInfo,
        reportType: 'DUPLICATE_TAX_CODE',
        timestamp: new Date().toISOString(),
      };

      try {
        await authService.sendTaxCodeReport(reportPayload);
      } catch (_) {}

      toast.success(
        'Report has been sent successfully. Our admin team will review and contact you soon.',
      );
      onClose();
    } catch (_) {
      toast.error('Failed to send report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[66.666667%] flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Tax Code Already Registered
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            The tax code <strong>{taxCode}</strong> is already registered in our
            system.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 py-4">
            {/* Alert Box */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="mb-2 text-sm text-blue-800">
                <strong>If this is your company:</strong>
              </p>
              <ul className="ml-2 list-inside list-disc space-y-1 text-sm text-blue-700">
                <li>You may have already registered</li>
                <li>Please try logging in with your existing account</li>
                <li>Contact support if you forgot your credentials</li>
              </ul>

              <p className="mt-3 mb-2 text-sm text-blue-800">
                <strong>If this is NOT your company:</strong>
              </p>
              <p className="ml-2 text-sm text-blue-700">
                Please fill out the form below to report this issue to our admin
                team.
              </p>
            </div>

            {/* Report Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <Input value={companyName} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tax Code
                </Label>
                <Input value={taxCode} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Your Email
                </Label>
                <Input value={userEmail} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Contact Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={reportData.contactPhone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  className={
                    phoneError ? 'border-red-500 focus:border-red-500' : ''
                  }
                  required
                />
                {phoneError && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertTriangle className="h-3 w-3" />
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Additional Information
                </Label>
                <Textarea
                  placeholder="Please provide any additional details that might help us resolve this issue..."
                  rows={4}
                  value={reportData.additionalInfo}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      additionalInfo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex flex-shrink-0 justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reportData.contactPhone || !!phoneError}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Report
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
