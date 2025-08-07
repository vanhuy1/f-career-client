'use client';

import { useState } from 'react';
import { Edit2, Plus, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SkillSearchInput } from '@/components/skill-input-form';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import { updateProfileSkillsRequestDto, Skill } from '@/types/CandidateProfile';
import { toast } from 'react-toastify';

interface SkillsSectionProps {
  skills: Skill[];
  readOnly?: boolean;
}

export function SkillsSection({
  skills: initialSkills,
  readOnly = false,
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // Check if skill already exists
      const trimmedSkill = newSkill.trim();
      if (!skills.some((skill) => skill.name === trimmedSkill)) {
        setSkills([...skills, { name: trimmedSkill }]);
      }
      setNewSkill('');
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillToRemove));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewSkill('');
  };

  const handleSaveSkills = async () => {
    if (!isEditMode) return;

    setIsSaving(true);
    try {
      // Convert skills array to the DTO format
      const skillsDto: updateProfileSkillsRequestDto = {
        skills: skills,
      };

      await candidateProfileService.updateProfileSkills(skillsDto);

      toast.success('Skills updated successfully');

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating skills:', error);
      toast.error('Failed to save your skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSkills(initialSkills);
    setIsEditMode(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Skills</CardTitle>
          {!readOnly && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAddDialogOpen(true)}
                disabled={isSaving}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {!isEditMode ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleEditMode}
                  disabled={isSaving}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSaveSkills}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="secondary"
                  className={`px-4 py-2 text-sm font-normal ${isEditMode && !readOnly ? 'pr-2' : ''}`}
                >
                  {skill.name}
                  {isEditMode && !readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground -mr-1 ml-1 h-5 w-5"
                      onClick={() => handleRemoveSkill(skill.name)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No skills added yet. Click the + button to add skills.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill">Skill Name</Label>
              <SkillSearchInput
                value={newSkill}
                onChange={setNewSkill}
                placeholder="Search for skills (e.g., React, TypeScript, UI Design)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
