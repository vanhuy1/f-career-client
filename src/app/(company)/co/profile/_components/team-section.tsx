'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus } from 'lucide-react';
import EditButton from './edit-button';
import type { FormField } from '../../../_components/edit-form-dialog';
import { teamMembersSchema } from '@/schemas/Company';
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

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export default function TeamSection() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      name: 'Celestin Gardiner',
      role: 'CEO & Co-Founder',
      image: '/team-meeting.jpg',
    },
    { name: 'Reynaud Colbert', role: 'Co-Founder', image: '/team-meeting.jpg' },
    {
      name: 'Arianne Lyon',
      role: 'Managing Director',
      image: '/team-meeting.jpg',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', image: '' });

  const teamMembersFields: FormField[] = [
    {
      id: 'teamMembers',
      label: 'Team Members',
      type: 'textarea',
      defaultValue: teamMembers
        .map((member) => `${member.name} (${member.role})`)
        .join(', '),
      placeholder: 'Enter team members (name and role)',
    },
  ];

  const handleTeamMembersSubmit = (data: Record<string, string>) => {
    try {
      const parsedMembers = data.teamMembers.split(',').map((item) => {
        const trimmed = item.trim();
        const match = trimmed.match(/^(.+)\s\((.+)\)$/);

        if (match) {
          const [, name, role] = match;
          const existingMember = teamMembers.find(
            (member) => member.name === name.trim(),
          );

          return {
            name: name.trim(),
            role: role.trim(),
            image: existingMember?.image || '/team-meeting.jpg',
          };
        }

        return {
          name: trimmed,
          role: 'Team Member',
          image: '/team-meeting.jpg',
        };
      });

      const validatedMembers = teamMembersSchema.parse(parsedMembers);

      setTeamMembers(validatedMembers);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Validation Error:', error);
      }
    }
  };

  const handleAddTeamMember = () => {
    setOpen(true);
  };

  const handleSaveNewMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      alert('Name and Role are required');
      return;
    }

    const updatedMembers = [
      ...teamMembers,
      {
        name: newMember.name.trim(),
        role: newMember.role.trim(),
        image: newMember.image.trim() || '/team-meeting.jpg',
      },
    ];

    setTeamMembers(updatedMembers);
    setNewMember({ name: '', role: '', image: '' });
    setOpen(false);
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
          <EditButton
            title="Edit Team Members"
            description="Update your company's team information"
            className="h-8 w-8 border-2 p-0"
            fields={teamMembersFields}
            onSubmit={handleTeamMembersSubmit}
          />
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-3 gap-4">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg border bg-white p-4"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={member.image || '/team-meeting.jpg'}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{member.name}</div>
              <div className="text-xs text-gray-500">{member.role}</div>
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0"
              >
                <svg
                  className="h-3 w-3 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0"
              >
                <svg
                  className="h-3 w-3 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          className="flex items-center gap-1 p-0 text-indigo-600"
          onClick={() => router.push(ROUTES.CO.HOME.SETTINGS.path)}
        >
          View all core teams
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Dialog for Adding Team Member */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new team member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                placeholder="Enter role"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={newMember.image}
                onChange={(e) =>
                  setNewMember({ ...newMember, image: e.target.value })
                }
                placeholder="Enter image URL or leave empty"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
