'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  User,
  Briefcase,
  ImageIcon,
  Loader2,
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
import { Company } from '@/types/Company';
import { CoreTeamMember, CreateCoreTeamReq } from '@/types/CoreTeam';
import { coreTeamService } from '@/services/api/company/core-team-api';
import { toast } from 'react-toastify';
import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { uploadFile } from '@/lib/storage';
// import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

interface TeamSectionProps {
  company: Company;
}

const MAX_TEAM_MEMBERS = 9;
const RECOMMENDED_TEAM_MEMBERS = 6;

// const TARGET_WIDTH = 400;
// const TARGET_HEIGHT = 400;
// const ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 1:1 for profile images

export default function TeamSection({ company }: TeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<CoreTeamMember[]>([]);
  const [open, setOpen] = useState(false);
  // const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState<CoreTeamMember | null>(
    null,
  );
  const [newMember, setNewMember] = useState<CreateCoreTeamReq>({
    name: '',
    position: '',
    imageUrl: '',
  });

  // Crop states
  // const [crop, setCrop] = useState<CropType>({
  //   unit: '%',
  //   width: 100,
  //   height: 100,
  //   x: 0,
  //   y: 0,
  // });
  // const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // const imgRef = useRef<HTMLImageElement>(null);

  // Cập nhật team members khi company thay đổi
  useEffect(() => {
    if (company?.coreTeam) {
      setTeamMembers(company.coreTeam);
    }
  }, [company]);

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
  //     const croppedFile = new File([croppedBlob], 'cropped-profile.jpg', { type: 'image/jpeg' });

  //     // Create preview URL for the cropped image
  //     const objectUrl = URL.createObjectURL(croppedBlob);
  //     setUploadedPreview(objectUrl);
  //     setUploadedFile(croppedFile);

  //     setCropDialogOpen(false);
  //     toast.success('Profile image cropped successfully');
  //   } catch (error) {
  //     console.error('Failed to crop image:', error);
  //     toast.error('Failed to crop image');
  //   }
  // };

  const handleAddTeamMember = () => {
    if (teamMembers.length >= MAX_TEAM_MEMBERS) {
      toast.warning(`You can only add up to ${MAX_TEAM_MEMBERS} team members`);
      return;
    }
    setIsEditMode(false);
    setNewMember({ name: '', position: '', imageUrl: '' });
    setEditingMember(null);
    setUploadedFile(null);
    setUploadedPreview(null);
    setOpen(true);
  };

  const handleEditMember = (member: CoreTeamMember) => {
    setIsEditMode(true);
    setEditingMember(member);
    setNewMember({
      name: member.name,
      position: member.position,
      imageUrl: member.imageUrl,
    });
    setUploadedFile(null);
    setUploadedPreview(null);
    setOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!company?.id) return;

    try {
      await coreTeamService.setCompanyId(company.id).delete(memberId);
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success('Team member deleted successfully');
    } catch (error) {
      console.error('Failed to delete team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleSaveMember = async () => {
    if (!company?.id) return;

    if (!newMember.name.trim() || !newMember.position.trim()) {
      toast.error('Name and Position are required');
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl = newMember.imageUrl;

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

      const memberData = {
        name: newMember.name.trim(),
        position: newMember.position.trim(),
        imageUrl: imageUrl.trim() || '/team-meeting.jpg',
      };

      if (isEditMode && editingMember) {
        // Update existing member
        const updatedMember = await coreTeamService
          .setCompanyId(company.id)
          .update(editingMember.id, memberData);

        setTeamMembers((prev) =>
          prev.map((member) =>
            member.id === editingMember.id ? updatedMember : member,
          ),
        );
        toast.success('Team member updated successfully');
      } else {
        // Add new member
        const createdMember = await coreTeamService
          .setCompanyId(company.id)
          .create(memberData);

        setTeamMembers((prev) => [...prev, createdMember]);
        toast.success('Team member added successfully');
      }

      // Clear the temporary file and preview
      if (uploadedFile) {
        setUploadedFile(null);
        if (uploadedPreview) {
          URL.revokeObjectURL(uploadedPreview);
          setUploadedPreview(null);
        }
      }

      // Reset form và đóng dialog
      setNewMember({ name: '', position: '', imageUrl: '' });
      setEditingMember(null);
      setIsEditMode(false);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save team member:', error);
      toast.error('Failed to save team member');
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-1 text-sm text-gray-600">
              The people behind our success ({teamMembers.length}/
              {MAX_TEAM_MEMBERS})
            </p>
            {teamMembers.length >= RECOMMENDED_TEAM_MEMBERS &&
              teamMembers.length < MAX_TEAM_MEMBERS && (
                <p className="mt-1 text-xs text-amber-600">
                  💡 Recommended: Keep your team size manageable (6 members
                  ideal)
                </p>
              )}
            {teamMembers.length >= MAX_TEAM_MEMBERS && (
              <p className="mt-1 text-xs text-red-600">
                ⚠️ Maximum {MAX_TEAM_MEMBERS} team members reached
              </p>
            )}
            {/* <p className="mt-1 text-xs text-gray-500">
              Profile images will be cropped to 400x400 (1:1 ratio)
            </p> */}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-sm font-medium text-purple-700 hover:bg-purple-50"
          onClick={handleAddTeamMember}
          disabled={teamMembers.length >= MAX_TEAM_MEMBERS}
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Team Cards */}
      {teamMembers.length > 0 ? (
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group/card relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Card background decoration */}
              <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-50 transition-transform duration-500 group-hover/card:scale-110"></div>

              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/card:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                      <User className="h-10 w-10 text-purple-600" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/card:text-purple-600">
                    {member.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {member.position}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-0 -right-1 flex flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-purple-50 p-0 hover:bg-purple-100"
                    onClick={() => handleEditMember(member)}
                  >
                    <Pencil className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-red-50 p-0 hover:bg-red-100"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>

                {/* Hover effect overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white/50 p-12 backdrop-blur-sm">
          <div className="text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">No team members added yet</p>
            {/* // eslint-disable-next-line react/no-unescaped-entities */}
            <p className="mt-1 text-sm text-gray-500">
              Click the &quot;Add Member&quot; button to start building your
              team
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Recommended: {RECOMMENDED_TEAM_MEMBERS} members • Maximum:{' '}
              {MAX_TEAM_MEMBERS} members
            </p>
          </div>
        </div>
      )}

      {/* Max team members reached state */}
      {teamMembers.length >= MAX_TEAM_MEMBERS && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              Maximum {MAX_TEAM_MEMBERS} team members reached. Remove a member
              to add a new one.
            </p>
          </div>
        </div>
      )}

      {/* Dialog for Adding/Editing Team Member */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Team Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              {isEditMode
                ? 'Update team member information'
                : 'Fill in the information to add a new team member'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="grid gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Enter member's full name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700"
                >
                  Position
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  value={newMember.position}
                  onChange={(e) =>
                    setNewMember({ ...newMember, position: e.target.value })
                  }
                  placeholder="e.g., CEO, CTO, Product Manager"
                  className="mt-1.5"
                />
              </div>

              {/* Profile Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Profile Image
                  <span className="ml-1 text-gray-400">(optional)</span>
                </Label>

                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Upload a profile image for this team member.
                    </p>
                    {/* <p className="mt-1 text-xs text-gray-500">
                      Image will be automatically cropped to 400x400 (1:1 ratio)
                    </p> */}
                  </div>

                  <div className="flex flex-1 items-start gap-6">
                    {/* Current image preview */}
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-purple-100">
                        {uploadedPreview || newMember.imageUrl ? (
                          <Image
                            src={uploadedPreview || newMember.imageUrl || ''}
                            alt="Preview"
                            width={80}
                            height={80}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 text-purple-600" />
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
                        h-20
                        w-40
                        flex-col
                        items-center
                        justify-center
                        rounded-lg
                        border-2
                        border-dashed
                        border-purple-300
                        p-4
                        text-center
                        hover:border-purple-400
                        transition
                        duration-150
                        ease-in-out
                      "
                      buttonClassName="flex flex-col items-center"
                    >
                      <ImageIcon className="h-4 w-4 text-purple-600" />
                      <p className="mt-1 text-xs font-medium text-purple-600">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or SVG</p>
                    </FileUploader>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditingMember(null);
                setIsEditMode(false);
                setNewMember({ name: '', position: '', imageUrl: '' });
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSaveMember}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crop Dialog - Commented out */}
      {/* <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Profile Image
            </DialogTitle>
            <DialogDescription>
              Select the area you want to keep. The image will be cropped to 400x400 (1:1 ratio).
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
              onClick={handleCropSave}
            >
              <Crop className="mr-2 h-4 w-4" />
              Crop & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
    </div>
  );
}
