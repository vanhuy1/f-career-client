import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAiPoints } from '@/services/state/userSlice';

export const AiPointsDisplay: React.FC = () => {
  const points = useAiPoints();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5">
      <Sparkles className="h-4 w-4 text-purple-600" />
      <span className="text-sm font-medium text-purple-700">
        {points} AI Credits
      </span>
    </div>
  );
};
