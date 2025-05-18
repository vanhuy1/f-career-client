'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus, Pencil, Trash2 } from 'lucide-react';
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
import ROUTES from '@/constants/navigation';
import { useRouter } from 'next/navigation';
import { Company } from '@/types/Company';
import { CoreTeamMember, CreateCoreTeamReq } from '@/types/CoreTeam';
import { coreTeamService } from '@/services/api/company/core-team-api';
import { toast } from 'react-toastify';

interface TeamSectionProps {
  company: Company;
}

export default function TeamSection({ company }: TeamSectionProps) {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<CoreTeamMember[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState<CoreTeamMember | null>(
    null,
  );
  const [newMember, setNewMember] = useState<CreateCoreTeamReq>({
    name: '',
    position: '',
    imageUrl: '',
  });

  // Cập nhật team members khi company thay đổi
  useEffect(() => {
    if (company?.coreTeam) {
      setTeamMembers(company.coreTeam);
    }
  }, [company]);

  const handleAddTeamMember = () => {
    setIsEditMode(false);
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
    setOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!company?.id) return;

    try {
      await coreTeamService.setCompanyId(company.id).delete(memberId);
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success('Xóa thành viên thành công');
    } catch (error) {
      console.error('Lỗi khi xóa thành viên:', error);
      toast.error('Không thể xóa thành viên');
    }
  };

  const handleSaveMember = async () => {
    if (!company?.id) return;

    if (!newMember.name.trim() || !newMember.position.trim()) {
      toast.error('Tên và Chức vụ không được để trống');
      return;
    }

    try {
      if (isEditMode && editingMember) {
        // Cập nhật thành viên
        const updatedMember = await coreTeamService
          .setCompanyId(company.id)
          .update(editingMember.id, {
            name: newMember.name.trim(),
            position: newMember.position.trim(),
            imageUrl: newMember.imageUrl.trim() || '/team-meeting.jpg',
          });

        setTeamMembers((prev) =>
          prev.map((member) =>
            member.id === editingMember.id ? updatedMember : member,
          ),
        );
        toast.success('Cập nhật thành viên thành công');
      } else {
        // Thêm thành viên mới
        const createdMember = await coreTeamService
          .setCompanyId(company.id)
          .create({
            name: newMember.name.trim(),
            position: newMember.position.trim(),
            imageUrl: newMember.imageUrl.trim() || '/team-meeting.jpg',
          });

        setTeamMembers((prev) => [...prev, createdMember]);
        toast.success('Thêm thành viên thành công');
      }

      // Reset form và đóng dialog
      setNewMember({ name: '', position: '', imageUrl: '' });
      setEditingMember(null);
      setIsEditMode(false);
      setOpen(false);
    } catch (error) {
      console.error('Lỗi khi lưu thành viên:', error);
      toast.error('Không thể lưu thông tin thành viên');
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={handleAddTeamMember}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="group relative flex flex-col items-center rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={member.imageUrl || '/team-meeting.jpg'}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {member.name}
              </div>
              <div className="text-xs text-gray-500">{member.position}</div>
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0 hover:bg-gray-200"
                onClick={() => handleEditMember(member)}
              >
                <Pencil className="h-3 w-3 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0 hover:bg-gray-200"
                onClick={() => handleDeleteMember(member.id)}
              >
                <Trash2 className="h-3 w-3 text-gray-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          className="flex items-center gap-1 p-0 text-indigo-600 hover:text-indigo-700"
          onClick={() => router.push(ROUTES.CO.HOME.SETTINGS.path)}
        >
          Xem tất cả thành viên
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Dialog for Adding/Editing Team Member */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Cập nhật thông tin thành viên.'
                : 'Điền thông tin để thêm thành viên mới vào team.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Nhập tên thành viên"
              />
            </div>
            <div>
              <Label htmlFor="position">Chức vụ</Label>
              <Input
                id="position"
                value={newMember.position}
                onChange={(e) =>
                  setNewMember({ ...newMember, position: e.target.value })
                }
                placeholder="Nhập chức vụ"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL Ảnh (không bắt buộc)</Label>
              <Input
                id="imageUrl"
                value={newMember.imageUrl}
                onChange={(e) =>
                  setNewMember({ ...newMember, imageUrl: e.target.value })
                }
                placeholder="Nhập URL ảnh hoặc để trống"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditingMember(null);
                setIsEditMode(false);
                setNewMember({ name: '', position: '', imageUrl: '' });
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveMember}>
              {isEditMode ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
