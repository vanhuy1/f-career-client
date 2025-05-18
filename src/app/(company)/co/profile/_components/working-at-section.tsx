'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface WorkingAtNomadSectionProps {
  workImageUrl?: string[];
}

export default function WorkingAtNomadSection({
  workImageUrl = [],
}: WorkingAtNomadSectionProps) {
  const [workCulture, setWorkCulture] = useState(
    'Our work culture is focused on collaboration and innovation.',
  );

  // Initialize with provided URLs or defaults
  const [images, setImages] = useState(
    workImageUrl.length > 0
      ? workImageUrl.map((url, index) => ({
          id: index,
          src: url,
          alt: `Team image ${index + 1}`,
        }))
      : [
          { id: 1, src: '/team-meeting.jpg', alt: 'Team meeting' },
          {
            id: 2,
            src: '/team-meeting.jpg',
            alt: 'Team collaboration',
          },
          {
            id: 3,
            src: '/team-meeting.jpg',
            alt: 'Office space',
          },
        ],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    id: number | null;
    src: string;
    alt: string;
  }>({ id: null, src: '', alt: '' });

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

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
    if (editingImage.id !== null) {
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Scroll to current slide when it changes
  useEffect(() => {
    if (sliderRef.current) {
      const scrollPosition = currentSlide * sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [currentSlide]);

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

      {/* Image Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-hidden rounded-lg"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="scroll-snap-align-start relative h-64 min-w-full flex-shrink-0 md:h-80"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Image
                src={image.src || '/placeholder.svg'}
                alt={image.alt}
                fill
                className="object-cover"
                onClick={() => handleEditImage(image)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Work Culture Text */}
      <p className="mt-4 text-sm text-gray-600">{workCulture}</p>

      {/* Dialog for Add/Edit Image */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingImage.id !== null ? 'Edit Image' : 'Add Image'}
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
                placeholder="https://example.com/image.jpg"
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
                placeholder="Description of the image"
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
