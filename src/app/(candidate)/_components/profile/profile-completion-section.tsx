'use client';
import { CandidateProfile } from '@/types/CandidateProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileCompletionSectionProps {
  profile: CandidateProfile;
}

interface CompletionSection {
  name: string;
  isComplete: boolean;
  weight: number; // Weight for calculating percentage
}

export function ProfileCompletionSection({
  profile,
}: ProfileCompletionSectionProps) {
  const checkSections = (): CompletionSection[] => {
    return [
      {
        name: 'Basic Information',
        isComplete: !!(profile.name && profile.title && profile.location),
        weight: 20,
      },
      {
        name: 'About Section',
        isComplete: !!(profile.about && profile.about.trim().length > 0),
        weight: 15,
      },
      {
        name: 'Work Experience',
        isComplete: profile.experiences?.length > 0,
        weight: 20,
      },
      {
        name: 'Education',
        isComplete: profile.education?.length > 0,
        weight: 15,
      },
      {
        name: 'Skills',
        isComplete: profile.skills?.length > 0,
        weight: 5,
      },
    ];
  };

  const sections = checkSections();
  const completedSections = sections.filter((section) => section.isComplete);
  const incompleteSections = sections.filter((section) => !section.isComplete);

  // Calculate weighted completion percentage
  const totalWeight = sections.reduce(
    (sum, section) => sum + section.weight,
    0,
  );
  const completedWeight = completedSections.reduce(
    (sum, section) => sum + section.weight,
    0,
  );
  const completionPercentage = Math.round(
    (completedWeight / totalWeight) * 100,
  );

  const getCompletionMessage = (percentage: number) => {
    if (percentage === 100) return 'Your profile is complete! 🎉';
    if (percentage >= 80) return 'Almost there! Just a few more details.';
    if (percentage >= 60) return "You're making good progress!";
    return "Let's complete your profile to attract employers.";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage === 100) return '[&>div]:bg-green-500'; // Gold for complete
    if (percentage >= 80) return '[&>div]:bg-blue-500'; // Green for almost complete
    if (percentage >= 60) return '[&>div]:bg-yellow-500'; // Blue for good progress
    if (percentage >= 40) return '[&>div]:bg-orange-500'; // Orange for moderate progress
    return '[&>div]:bg-red-500'; // Red for low completion
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {completionPercentage}% Complete
            </span>
            <span className="text-xs text-gray-500">
              {completedSections.length}/{sections.length} sections
            </span>
          </div>
          <Progress
            value={completionPercentage}
            className={`h-2 ${getProgressBarColor(completionPercentage)}`}
          />
          <p className="text-xs text-gray-600">
            {getCompletionMessage(completionPercentage)}
          </p>
        </div>

        {/* Completed Sections */}
        {completedSections.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Completed ({completedSections.length})
            </h4>
            <div className="space-y-1">
              {completedSections.map((section) => (
                <div
                  key={section.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-gray-600">{section.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incomplete Sections */}
        {incompleteSections.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Needs Attention ({incompleteSections.length})
            </h4>
            <div className="space-y-1">
              {incompleteSections.map((section) => (
                <div
                  key={section.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <AlertCircle className="h-3 w-3 text-orange-500" />
                  <span className="text-gray-600">{section.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {completionPercentage === 100 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-medium text-green-700">
              🎉 Congratulations! Your profile is now complete and ready to
              attract top employers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
