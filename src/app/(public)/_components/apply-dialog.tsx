'use client';

import { useState } from 'react';
import { X, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
}

export default function ApplyDialog({
  isOpen,
  onClose,
  jobTitle,
  company,
  location,
  jobType,
}: ApplyDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentJob: '',
    linkedinUrl: '',
    portfolioUrl: '',
    additionalInfo: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'additionalInfo') {
      setCharCount(value.length);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ ...formData, resumeFile });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-9/10 gap-0 overflow-y-auto p-0 sm:max-w-[600px]">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="border-b p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-emerald-100 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500 text-white">
                  {company.charAt(0)}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {jobTitle}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span>{company}</span>
                  <span>•</span>
                  <span>{location}</span>
                  <span>•</span>
                  <span>{jobType}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="mb-4 text-xl font-semibold">
              Submit your application
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              The following is required and will only be shared with {company}
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your fullname"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="currentJob"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Current of previous job title
                </label>
                <Input
                  id="currentJob"
                  name="currentJob"
                  placeholder="What's your current or previous job title?"
                  value={formData.currentJob}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700 uppercase">
                  Links
                </h4>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="linkedinUrl"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      LinkedIn URL
                    </label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      placeholder="Link to your LinkedIn URL"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="portfolioUrl"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Portfolio URL
                    </label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      placeholder="Link to your portfolio URL"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Additional information
                </label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Add a cover letter or anything else you want to share"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                  maxLength={maxChars}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="font-bold text-gray-500 hover:text-gray-700"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 italic hover:text-gray-700"
                    >
                      I
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {charCount} / {maxChars}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Attach your resume
                  </label>
                  <div className="rounded-md border border-dashed border-indigo-300 px-4 py-2">
                    <label
                      htmlFor="resume"
                      className="flex cursor-pointer items-center gap-2 text-sm text-indigo-600"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span>Attach Resume/CV</span>
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {resumeFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {resumeFile.name}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full bg-indigo-600 py-3 text-white hover:bg-indigo-700"
              >
                Submit Application
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                By sending the request you confirm that you accept our{' '}
                <a href="#" className="text-indigo-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
