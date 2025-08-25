import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { useAiPoints } from '@/services/state/userSlice';

export const AiPointsDisplay: React.FC = () => {
  const points = useAiPoints();

  const getPointsStatus = () => {
    if (points >= 50) {
      return {
        icon: <Crown className="h-5 w-5 text-yellow-500" />,
        badge: <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    } else if (points >= 20) {
      return {
        icon: <Zap className="h-5 w-5 text-orange-500" />,
        badge: <Badge className="bg-orange-100 text-orange-800">Active</Badge>,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    } else {
      return {
        icon: <Sparkles className="h-5 w-5 text-purple-500" />,
        badge: <Badge className="bg-purple-100 text-purple-800">Basic</Badge>,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      };
    }
  };

  const status = getPointsStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Points Status
          </span>
          {status.badge}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`rounded-lg border ${status.borderColor} ${status.bgColor} p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status.icon}
              <div>
                <p className={`text-sm font-medium ${status.color}`}>
                  Current AI Points
                </p>
                <p className="text-2xl font-bold text-gray-900">{points}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Available for AI features</p>
              <p className="text-xs text-gray-500">
                (CV optimization, Roadmap generation, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Points usage info */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>CV Optimization: 1 point per use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Roadmap Generation: 1 points per use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>AI Chat Assistant: 1 point per conversation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
