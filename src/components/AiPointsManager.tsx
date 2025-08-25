import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useAiPointsManager } from '@/hooks/use-ai-points';
import { useAiPoints } from '@/services/state/userSlice';

export const AiPointsManager: React.FC = () => {
  const [pointsToAdd, setPointsToAdd] = useState<number>(1);
  const { getAiPoints, addAiPoints, isLoading } = useAiPointsManager();
  const currentPoints = useAiPoints();

  const handleRefreshPoints = async () => {
    try {
      await getAiPoints();
    } catch (error) {
      console.error('Error refreshing points:', error);
    }
  };

  const handleAddPoints = async () => {
    if (pointsToAdd <= 0) {
      return;
    }

    try {
      await addAiPoints(pointsToAdd);
      setPointsToAdd(1); // Reset input
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Quản lý AI Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hiển thị points hiện tại */}
        <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <span className="text-sm font-medium text-purple-700">
            AI Points hiện tại:
          </span>
          <span className="text-lg font-bold text-purple-800">
            {currentPoints}
          </span>
        </div>

        {/* Form thêm points */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(Number(e.target.value))}
              placeholder="Số points muốn thêm"
              className="flex-1"
            />
            <Button
              onClick={handleAddPoints}
              disabled={isLoading || pointsToAdd <= 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm
            </Button>
          </div>
        </div>

        {/* Nút refresh */}
        <Button
          onClick={handleRefreshPoints}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center text-sm text-gray-500">Đang xử lý...</div>
        )}
      </CardContent>
    </Card>
  );
};
