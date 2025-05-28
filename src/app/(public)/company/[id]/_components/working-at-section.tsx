'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkingAtSectionProps {
  workImageUrl?: string[];
}

export default function WorkingAtSection({
  workImageUrl = [],
}: WorkingAtSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const images =
    workImageUrl.length > 0
      ? workImageUrl.map((url, index) => ({
          id: index,
          src: url,
          alt: `Work environment image ${index + 1}`,
        }))
      : [
          { id: 1, src: '/team-meeting.jpg', alt: 'Team meeting' },
          { id: 2, src: '/team-meeting.jpg', alt: 'Team collaboration' },
          { id: 3, src: '/team-meeting.jpg', alt: 'Office space' },
        ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (sliderRef.current) {
      const scrollPosition = currentSlide * sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [currentSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold">Working Environment</h2>

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
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
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
              className={`h-2 w-2 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
