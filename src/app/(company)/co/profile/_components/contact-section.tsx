'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EditButton from './edit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FormField } from '../../../_components/edit-form-dialog';
import { ContactInfo } from '@/types/Company';

export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    twitter: 'twitter.com/Nomad',
    facebook: 'facebook.com/NomadHQ',
    linkedin: 'linkedin.com/company/nomad',
    email: 'nomad@gmail.com',
  });

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleContactSubmit = (data: Record<string, string>) => {
    setContactInfo(data);
  };

  const handleAddContactSubmit = () => {
    if (newLabel.trim() && newValue.trim()) {
      setContactInfo((prev) => ({
        ...prev,
        [newLabel.trim().toLowerCase()]: newValue.trim(),
      }));
      setNewLabel('');
      setNewValue('');
      setIsAddPopupOpen(false);
    }
  };

  const handleAddContact = () => {
    setIsAddPopupOpen(true);
  };

  // Dynamic icons
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'twitter':
        return (
          <svg
            className="mr-3 h-5 w-5 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M23.954 4.569c-.885.389-1.83.654-2.825.775 
            1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.001.959-3.127 
            1.184-.897-.959-2.178-1.555-3.594-1.555-2.717 
            0-4.92 2.203-4.92 4.917 0 .39.045.765.127 
            1.124C7.691 8.094 4.066 6.13 1.64 
            3.161c-.427.722-.666 1.561-.666 2.475 
            0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.229-.616v.061c0 
            2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 
            0-.615-.03-.916-.086.631 1.953 2.445 3.376 
            4.604 3.415-1.68 1.319-3.809 2.105-6.102 
            2.105-.39 0-.779-.023-1.17-.067C2.42 
            19.29 5.29 20 8.29 20c9.142 0 14.307-7.721 
            13.995-14.646.962-.695 1.8-1.562 
            2.46-2.555z"
            />
          </svg>
        );
      case 'facebook':
        return (
          <svg
            className="mr-3 h-5 w-5 text-blue-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M22.675 0h-21.35C.597 
            0 0 .6 0 1.326v21.348C0 23.4.597 
            24 1.325 24h11.49v-9.294H9.691V11.01h3.123V8.413c0-3.1 
            1.894-4.788 4.659-4.788 1.325 
            0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 
            0-1.795.715-1.795 1.763v2.31h3.587l-.467 
            3.696h-3.12V24h6.116C23.403 24 24 
            23.4 24 22.674V1.326C24 .6 23.403 
            0 22.675 0z"
            />
          </svg>
        );
      case 'linkedin':
        return (
          <svg
            className="mr-3 h-5 w-5 text-blue-700"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 
            0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 
            1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 
            4.267 5.455v6.286zM5.337 7.433c-1.144 
            0-2.063-.926-2.063-2.065 0-1.138.92-2.063 
            2.063-2.063 1.14 0 2.064.925 2.064 
            2.063 0 1.139-.925 2.065-2.064 
            2.065zM6.776 20.452H3.894V9h2.882v11.452zM22.225 
            0H1.771C.792 0 0 .774 0 1.729v20.542C0 
            23.227.792 24 1.771 24h20.451C23.2 
            24 24 23.227 24 22.271V1.729C24 .774 
            23.2 0 22.222 0h.003z"
            />
          </svg>
        );
      case 'email':
        return (
          <svg
            className="mr-3 h-5 w-5 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 13.065l-11.534-7.61C.185 
            5.154 0 5.423 0 5.725v12.55c0 
            1.089.886 1.975 1.975 1.975h20.05c1.089 
            0 1.975-.886 1.975-1.975V5.725c0-.302-.185-.571-.466-.27L12 
            13.065zM24 4.586v-.587c0-1.089-.886-1.975-1.975-1.975H1.975C.886 
            2.024 0 2.91 0 4v.587l12 7.913 12-7.913z"
            />
          </svg>
        );
      default:
        return (
          <span className="mr-3 flex h-5 w-5 items-center justify-center font-bold text-gray-500">
            @
          </span>
        );
    }
  };

  const contactFields: FormField[] = Object.keys(contactInfo).map((key) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    type: key === 'email' ? 'email' : 'text',
    defaultValue: contactInfo[key],
    placeholder: `Enter ${key}`,
  }));

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={handleAddContact}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
          <EditButton
            className="h-8 w-8 border-2 p-0"
            title="Edit Contact Information"
            description="Update your company's contact details"
            fields={contactFields}
            onSubmit={handleContactSubmit}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(contactInfo).map(([label, value]) => (
          <Button
            key={label}
            variant="outline"
            className="h-10 justify-start px-4 text-sm font-normal"
          >
            {getIcon(label)}
            {value}
          </Button>
        ))}
      </div>

      <Dialog open={isAddPopupOpen} onOpenChange={setIsAddPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact Method</DialogTitle>
            <DialogDescription>
              Add a new way for people to reach you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Label
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., GitHub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., github.com/your-profile"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPopupOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleAddContactSubmit}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
