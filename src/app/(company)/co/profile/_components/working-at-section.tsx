'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Camera,
  ImageIcon,
  Loader2,
  Trash2,
  Edit,
} from 'lucide-react';
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
import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { uploadFile } from '@/lib/storage';
import { toast } from 'react-toastify';
import { Company } from '@/types/Company';
import { CreateCompanyReq } from '@/types/Company';
// import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

interface WorkingAtSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
}

const MAX_IMAGES = 5;
// const TARGET_WIDTH = 1920;
// const TARGET_HEIGHT = 1080;
// const ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 16:9

export default function WorkingAtSection({
  company,
  onUpdateCompany,
}: WorkingAtSectionProps) {
  // Initialize with images from database
  const [images, setImages] = useState(
    company.workImageUrl && company.workImageUrl.length > 0
      ? company.workImageUrl.map((url, index) => ({
          id: index,
          src: url,
          alt: `Work environment image ${index + 1}`,
        }))
      : [],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  // const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    id: number | null;
    src: string;
    alt: string;
  }>({ id: null, src: '', alt: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  // const [crop, setCrop] = useState<CropType>({
  //   unit: '%',
  //   width: 100,
  //   height: 100,
  //   x: 0,
  //   y: 0,
  // });
  // const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // const [cropImageSrc, setCropImageSrc] = useState<string>('');
  // const imgRef = useRef<HTMLImageElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update images when company data changes
  useEffect(() => {
    if (company.workImageUrl) {
      const newImages = company.workImageUrl.map((url, index) => ({
        id: index,
        src: url,
        alt: `Work environment image ${index + 1}`,
      }));
      setImages(newImages);
    } else {
      setImages([]);
    }
  }, [company.workImageUrl]);

  const handleFileSelect = (file: File) => {
    // Create a local preview URL and open crop dialog
    const objectUrl = URL.createObjectURL(file);
    // setCropImageSrc(objectUrl);
    // setCrop({
    //   unit: '%',
    //   width: 100,
    //   height: 100,
    //   x: 0,
    //   y: 0,
    // });
    // setCropDialogOpen(true);

    // Temporary: direct upload without crop
    setUploadedPreview(objectUrl);
    setUploadedFile(file);
  };

  // const handleCropComplete = (crop: PixelCrop) => {
  //   setCompletedCrop(crop);
  // };

  // const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     throw new Error('No 2d context');
  //   }

  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   canvas.width = TARGET_WIDTH;
  //   canvas.height = TARGET_HEIGHT;

  //   ctx.drawImage(
  //     image,
  //     crop.x * scaleX,
  //     crop.y * scaleY,
  //     crop.width * scaleX,
  //     crop.height * scaleY,
  //     0,
  //     0,
  //     TARGET_WIDTH,
  //     TARGET_HEIGHT
  //   );

  //   return new Promise((resolve) => {
  //     canvas.toBlob((blob) => {
  //       if (blob) {
  //         resolve(blob);
  //       }
  //     }, 'image/jpeg', 0.9);
  //   });
  // };

  // const handleCropSave = async () => {
  //   if (!imgRef.current || !completedCrop) {
  //     toast.error('Please select a crop area');
  //     return;
  //   }

  //   try {
  //     const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
  //     const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });

  //     // Create preview URL for the cropped image
  //     const objectUrl = URL.createObjectURL(croppedBlob);
  //     setUploadedPreview(objectUrl);
  //     setUploadedFile(croppedFile);

  //     setCropDialogOpen(false);
  //     toast.success('Image cropped successfully');
  //   } catch (error) {
  //     console.error('Failed to crop image:', error);
  //     toast.error('Failed to crop image');
  //   }
  // };

  const handleAddImage = () => {
    if (images.length >= MAX_IMAGES) {
      toast.warning(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }
    setEditingImage({ id: null, src: '', alt: '' });
    setUploadedFile(null);
    setUploadedPreview(null);
    setDialogOpen(true);
  };

  const handleEditImage = (image: { id: number; src: string; alt: string }) => {
    setEditingImage(image);
    setUploadedFile(null);
    setUploadedPreview(null);
    setDialogOpen(true);
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      const newImages = images.filter((img) => img.id !== imageId);
      setImages(newImages);

      // Save to database
      const workImageUrls = newImages.map((img) => img.src);
      await onUpdateCompany({
        workImageUrl: workImageUrls,
      });

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSaveImage = async () => {
    try {
      setIsUploading(true);

      let imageUrl = editingImage.src;

      // Upload the file to Supabase if we have a new one
      if (uploadedFile) {
        const { publicUrl, error } = await uploadFile({
          file: uploadedFile,
          bucket: SupabaseBucket.USER_SETTINGS,
          folder: SupabaseFolder.COMPANY_LOGOS,
        });

        if (error) {
          toast.error(`Failed to upload image: ${error.message}`);
          setIsUploading(false);
          return;
        }

        if (publicUrl) {
          imageUrl = publicUrl;
        }
      }

      // Prepare new images array
      let newImages: { id: number; src: string; alt: string }[];
      if (editingImage.id !== null) {
        // Edit existing
        newImages = images.map((img) =>
          img.id === editingImage.id
            ? { ...editingImage, id: editingImage.id, src: imageUrl }
            : img,
        );
      } else {
        // Add new
        newImages = [
          ...images,
          { ...editingImage, id: Date.now(), src: imageUrl },
        ];
      }

      // Update local state
      setImages(newImages);

      // Save to database
      const workImageUrls = newImages.map((img) => img.src);
      await onUpdateCompany({
        workImageUrl: workImageUrls,
      });

      // Clear the temporary file and preview
      if (uploadedFile) {
        setUploadedFile(null);
        if (uploadedPreview) {
          URL.revokeObjectURL(uploadedPreview);
          setUploadedPreview(null);
        }
      }

      setDialogOpen(false);
      toast.success(
        editingImage.id !== null
          ? 'Image updated successfully'
          : 'Image added successfully',
      );
    } catch (error) {
      console.error('Failed to save image:', error);
      toast.error('Failed to save image');
    } finally {
      setIsUploading(false);
    }
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

  // Auto-play functionality
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedPreview) {
        URL.revokeObjectURL(uploadedPreview);
      }
      // if (cropImageSrc) {
      //   URL.revokeObjectURL(cropImageSrc);
      // }
    };
  }, [uploadedPreview]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-20 translate-y-20 rounded-full bg-gradient-to-tr from-orange-100 to-yellow-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Working Environment
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Showcase your workplace culture ({images.length}/{MAX_IMAGES})
            </p>
            {/* <p className="mt-1 text-xs text-gray-500">
              Images will be cropped to 1920x1080 (16:9 ratio)
            </p> */}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
          onClick={handleAddImage}
          disabled={images.length >= MAX_IMAGES}
        >
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
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
                className="scroll-snap-align-start relative h-80 min-w-full flex-shrink-0 cursor-pointer md:h-96"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Image
                  src={image.src || '/placeholder.svg'}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Image Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditImage(image);
                    }}
                  >
                    <Edit className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-red-500/90 shadow-lg backdrop-blur-sm hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
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
          {images.length > 0 && (
            <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentSlide + 1} / {images.length}
            </div>
          )}
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

      {/* No images state */}
      {images.length === 0 && (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-12">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">No workplace images available</p>
            {/* // eslint-disable-next-line react/no-unescaped-entities */}
            <p className="mt-1 text-sm text-gray-500">
              Click the &quot;Add Image&quot; button to showcase your work
              environment
            </p>
          </div>
        </div>
      )}

      {/* Max images reached state */}
      {images.length >= MAX_IMAGES && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              Maximum {MAX_IMAGES} images reached. Delete an existing image to
              add a new one.
            </p>
          </div>
        </div>
      )}

      {/* Dialog for Add/Edit Image */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingImage.id !== null ? 'Edit Image' : 'Add Image'}
            </DialogTitle>
            <DialogDescription>
              Upload an image and provide a description for your work
              environment.
              {editingImage.id !== null &&
                ' You can replace the existing image or update the description.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Work Environment Image
              </Label>

              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload an image that showcases your workplace culture and
                    environment.
                    {editingImage.id !== null &&
                      ' Leave empty to keep the current image.'}
                  </p>
                  {/* <p className="mt-1 text-xs text-gray-500">
                    Image will be automatically cropped to 1920x1080 (16:9 ratio)
                  </p> */}
                </div>

                <div className="flex flex-1 items-start gap-6">
                  {/* Current image preview */}
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-orange-100">
                      {uploadedPreview || editingImage.src ? (
                        <Image
                          src={uploadedPreview || editingImage.src || ''}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Camera className="h-12 w-12 text-orange-600" />
                      )}
                    </div>
                  </div>

                  {/* FileUploader */}
                  <FileUploader
                    bucket={SupabaseBucket.USER_SETTINGS}
                    folder={SupabaseFolder.COMPANY_LOGOS}
                    onFileSelect={handleFileSelect}
                    wrapperClassName="
                      flex
                      h-24
                      w-48
                      flex-col
                      items-center
                      justify-center
                      rounded-lg
                      border-2
                      border-dashed
                      border-orange-300
                      p-4
                      text-center
                      hover:border-orange-400
                      transition
                      duration-150
                      ease-in-out
                    "
                    buttonClassName="flex flex-col items-center"
                  >
                    <ImageIcon className="h-5 w-5 text-orange-600" />
                    <p className="mt-1 text-xs font-medium text-orange-600">
                      {editingImage.id !== null
                        ? 'Click to replace'
                        : 'Click to upload'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or SVG</p>
                  </FileUploader>
                </div>
              </div>
            </div>

            {/* Alt Text Input */}
            <div>
              <Label
                htmlFor="alt"
                className="text-sm font-medium text-gray-700"
              >
                Image Description
              </Label>
              <Input
                id="alt"
                value={editingImage.alt}
                onChange={(e) =>
                  setEditingImage({ ...editingImage, alt: e.target.value })
                }
                className="mt-1.5"
                placeholder="Describe the work environment shown in this image"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                This description helps with accessibility and SEO
              </p>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setUploadedFile(null);
                if (uploadedPreview) {
                  URL.revokeObjectURL(uploadedPreview);
                  setUploadedPreview(null);
                }
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 text-white transition-all duration-300 hover:from-orange-700 hover:to-amber-700"
              onClick={handleSaveImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : editingImage.id !== null ? (
                'Update Image'
              ) : (
                'Save Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crop Dialog - Commented out */}
      {/* <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Image
            </DialogTitle>
            <DialogDescription>
              Select the area you want to keep. The image will be cropped to 1920x1080 (16:9 ratio).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <div className="relative max-h-[400px] max-w-full overflow-hidden rounded-lg border">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={ASPECT_RATIO}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={imgRef}
                    src={cropImageSrc}
                    alt="Crop preview"
                    className="max-h-[400px] w-auto"
                  />
                </ReactCrop>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Crop className="h-4 w-4" />
                <span>Drag to select crop area</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>Hold Shift for square crop</span>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCropDialogOpen(false);
                if (cropImageSrc) {
                  URL.revokeObjectURL(cropImageSrc);
                  setCropImageSrc('');
                }
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 text-white transition-all duration-300 hover:from-orange-700 hover:to-amber-700"
              onClick={handleCropSave}
            >
              <Crop className="mr-2 h-4 w-4" />
              Crop & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
    </div>
  );
}
