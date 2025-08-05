'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import type { Cv } from '@/types/Cv';
import { toast } from 'react-toastify';

interface AboutProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const About = ({ cv, onUpdateCv, onUploadImage }: AboutProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Set preview URL from cv.image when component mounts or cv changes
  useEffect(() => {
    if (cv.image && !isImageChanged) {
      setPreviewUrl(cv.image);
    }
  }, [cv.image, isImageChanged]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      // Image types
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain', // .txt
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(
        'Please select a valid file (Images: JPG, PNG, GIF, WebP | Documents: PDF, DOC, DOCX, TXT)',
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must not exceed 5MB');
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        setPreviewUrl(base64String);
        setIsImageChanged(true);
      }
    };
    reader.readAsDataURL(file);

    // Call the original onUploadImage to handle file for later upload
    onUploadImage(e);
  };

  const handleRemoveImage = () => {
    onUpdateCv('image', '');
    setPreviewUrl('');
    setIsImageChanged(false);

    // Reset file input
    const fileInput = document.getElementById(
      'image-upload',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    // Notify parent to clear temp file by creating a mock event
    const mockEvent = {
      target: {
        files: null,
      },
      currentTarget: {
        files: null,
      },
      preventDefault: () => {},
      stopPropagation: () => {},
      nativeEvent: new Event('change'),
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {},
      bubbles: false,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      timeStamp: Date.now(),
      type: 'change',
    } as React.ChangeEvent<HTMLInputElement>;

    onUploadImage(mockEvent);

    toast.info('Image has been removed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="displayImage">Display profile image</Label>
        <Switch
          id="displayImage"
          checked={cv.displayImage}
          onCheckedChange={(checked) => onUpdateCv('displayImage', checked)}
        />
      </div>

      {cv.displayImage && (
        <div className="space-y-4">
          <Label>Profile image</Label>

          {/* Preview Image */}
          {previewUrl && (
            <div className="relative mx-auto h-32 w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Profile preview"
                className="h-full w-full rounded-full border-2 border-gray-200 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-center">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>{previewUrl ? 'Change image' : 'Upload image'}</span>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </Label>
          </div>

          <p className="text-center text-xs text-gray-500">
            Formats: JPG, JPEG, PNG, GIF, WebP. Max 5MB
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={cv.name || ''}
          onChange={(e) => onUpdateCv('name', e.target.value)}
          className="mt-1"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          value={cv.title || ''}
          onChange={(e) => onUpdateCv('title', e.target.value)}
          className="mt-1"
          placeholder="e.g. Senior Software Engineer"
        />
      </div>

      <div>
        <Label htmlFor="summary">About me</Label>
        <Textarea
          id="summary"
          value={cv.summary || ''}
          onChange={(e) => onUpdateCv('summary', e.target.value)}
          className="mt-1 h-32"
          placeholder="Brief description about yourself, experience and career goals..."
        />
      </div>
    </div>
  );
};

export default About;
