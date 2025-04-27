'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormField } from '../../../_components/edit-form-dialog';

export default function WorkingAtNomadSection() {
  const [workCulture, setWorkCulture] = useState(
    'Our work culture is focused on collaboration and innovation.',
  );

  const [images, setImages] = useState([
    { id: 1, src: '/team-meeting.jpg', alt: 'Office space' },
    { id: 2, src: '/team-meeting.jpg', alt: 'Team collaboration' },
    { id: 3, src: '/team-meeting.jpg', alt: 'Team event' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    id: number | null;
    src: string;
    alt: string;
  }>({ id: null, src: '', alt: '' });

  const workCultureFields: FormField[] = [
    {
      id: 'workCulture',
      label: 'Work Culture',
      type: 'textarea',
      defaultValue: workCulture,
      placeholder: 'Describe your work culture',
    },
  ];

  const handleWorkCultureSubmit = (data: Record<string, string>) => {
    setWorkCulture(data.workCulture);
  };

  const handleAddImage = () => {
    setEditingImage({ id: null, src: '', alt: '' });
    setDialogOpen(true);
  };

  const handleEditImage = (image: { id: number; src: string; alt: string }) => {
    setEditingImage(image);
    setDialogOpen(true);
  };

  const handleSaveImage = () => {
    if (editingImage.id) {
      // Edit existing
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? { ...editingImage, id: editingImage.id }
            : img,
        ),
      );
    } else {
      // Add new
      setImages((prev) => [...prev, { ...editingImage, id: Date.now() }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Working at</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={handleAddImage}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
          <EditButton
            title="Edit Working at"
            description="Update your company's work culture information"
            fields={workCultureFields}
            className="h-8 w-8 border-2 p-0"
            onSubmit={handleWorkCultureSubmit}
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative overflow-hidden rounded-md ${
              index === 0
                ? 'aspect-1 row-span-2'
                : index === 1
                  ? 'aspect-[3/2]'
                  : 'aspect-square'
            }`}
            onClick={() => handleEditImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="cursor-pointer object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dialog for Add/Edit Image */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingImage.id ? 'Edit Image' : 'Add Image'}
            </DialogTitle>
            <DialogDescription>
              Provide image URL and description.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="src" className="text-right">
                Image URL
              </Label>
              <Input
                id="src"
                value={editingImage.src}
                onChange={(e) =>
                  setEditingImage({ ...editingImage, src: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alt" className="text-right">
                Alt Text
              </Label>
              <Input
                id="alt"
                value={editingImage.alt}
                onChange={(e) =>
                  setEditingImage({ ...editingImage, alt: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveImage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
