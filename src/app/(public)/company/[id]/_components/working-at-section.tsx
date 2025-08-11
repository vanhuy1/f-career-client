'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

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

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

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

  // Auto-play functionality
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length, nextSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-20 translate-y-20 rounded-full bg-gradient-to-tr from-orange-100 to-yellow-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Working Environment
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Get a glimpse of our workplace culture
          </p>
        </div>
      </div>

      {/* Image Slider */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="scroll-snap-align-start relative h-80 min-w-full flex-shrink-0 md:h-96"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </Button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
            {currentSlide + 1} / {images.length}
          </div>
        </div>

        {/* Indicators */}
        {images.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'scale-125 bg-orange-500 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
    </div>
  );
}
