'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cvService } from '@/services/api/cv/cv-api';
import { roadmapService } from '@/services/api/roadmap/roadmap-api';
import { useUser } from '@/services/state/userSlice';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cv } from '@/types/Cv';
import { Roadmap } from '@/types/RoadMap';

interface GenerateRoadmapButtonProps {
  jobId: string;
  jobTitle: string;
}

export default function GenerateRoadmapButton({
  jobId,
  jobTitle,
}: GenerateRoadmapButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCvs, setIsLoadingCvs] = useState(false);
  const [userCvs, setUserCvs] = useState<Cv[]>([]);
  const [useTestMode, setUseTestMode] = useState(roadmapService.isInTestMode());
  const router = useRouter();
  const user = useUser();

  // Fetch user CVs when dialog opens
  useEffect(() => {
    const fetchUserCvs = async () => {
      if (!open || !user?.data?.id) return;

      // Check if we have cached CVs for this user
      const userId = Number(user.data.id);

      setIsLoadingCvs(true);
      try {
        const response = await cvService.findAll(userId);
        console.log('Fetched user CVs:', response);

        const cvs = response.items || [];
        setUserCvs(cvs);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        toast.error('Failed to load your CVs. Please try again.');
      } finally {
        setIsLoadingCvs(false);
      }
    };

    fetchUserCvs();
  }, [open, user?.data?.id]);

  // Handle test mode toggle
  const handleTestModeToggle = (checked: boolean) => {
    setUseTestMode(checked);
    roadmapService.setTestMode(checked);
  };

  const handleGenerate = async () => {
    if (!selectedCv) {
      toast.error('Please select a CV to continue');
      return;
    }

    setIsGenerating(true);

    try {
      // Call the roadmap API to generate a roadmap
      const newRoadmap = await roadmapService.generate({
        cvId: selectedCv,
        jobId: jobId,
        jobTitle: jobTitle,
        useTestMode: useTestMode,
      });

      // Save to local storage (merge with existing)
      if (typeof window !== 'undefined') {
        const key = 'career-roadmaps';
        const existingRaw = localStorage.getItem(key);
        let existing: Roadmap[] = [];
        if (existingRaw) {
          try {
            existing = JSON.parse(existingRaw);
          } catch {}
        }
        if (!existing.some((r) => r.id === newRoadmap.id)) {
          existing.push(newRoadmap);
          localStorage.setItem(key, JSON.stringify(existing));
        }
      }

      toast.success('Roadmap generated successfully!');

      // Redirect to the room page with query parameters
      router.push(
        `/room?tab=roadmap&jobId=${jobId}&cvId=${selectedCv}&jobTitle=${encodeURIComponent(jobTitle)}`,
      );
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-green-600 text-white hover:bg-green-700"
          size="lg"
        >
          <MapIcon className="mr-2 h-4 w-4" />
          Generate Learning Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Learning Roadmap</DialogTitle>
          <DialogDescription>
            Create a personalized skill development roadmap based on this job
            and your selected CV.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Job Position</p>
            <p className="text-sm text-gray-500">{jobTitle}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="cv" className="text-sm font-medium">
              Select your CV
            </label>
            <Select
              value={selectedCv}
              onValueChange={setSelectedCv}
              disabled={isLoadingCvs}
            >
              <SelectTrigger id="cv">
                <SelectValue
                  placeholder={isLoadingCvs ? 'Loading CVs...' : 'Select a CV'}
                />
              </SelectTrigger>
              <SelectContent>
                {userCvs.length > 0 ? (
                  userCvs.map((cv) => (
                    <SelectItem key={cv.id} value={String(cv.id)}>
                      {cv.title || 'Unnamed CV'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-cv" disabled>
                    {isLoadingCvs ? 'Loading...' : 'No CVs available'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {userCvs.length === 0 && !isLoadingCvs && (
              <p className="mt-1 text-xs text-amber-500">
                You need to create a CV first. Go to your profile to create one.
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="test-mode"
              checked={useTestMode}
              onCheckedChange={handleTestModeToggle}
            />
            <Label htmlFor="test-mode" className="text-sm">
              Use Test Mode (faster, no AI credits)
            </Label>
          </div>
          {useTestMode && (
            <p className="text-xs text-gray-500">
              Test mode uses pre-generated data instead of AI. This is useful
              for development and testing.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!selectedCv || isGenerating || isLoadingCvs}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
