import { useState } from 'react';
import { userService } from '@/services/api/auth/user-api';
import { useUserActions } from '@/services/state/userSlice';
import { AddAiPointsRequest } from '@/types/User';
import toast from 'react-hot-toast';

export const useAiPointsManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addAiPointsSuccess } = useUserActions();

  const getAiPoints = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAiPoints();
      return response;
    } catch (error) {
      console.error('Error fetching AI points:', error);
      toast.error('Không thể lấy thông tin AI points');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addAiPoints = async (points: number, showToast: boolean = true) => {
    try {
      setIsLoading(true);
      const requestData: AddAiPointsRequest = { points };
      const response = await userService.addAiPoints(requestData);

      if (response.success) {
        // Cập nhật state với số points mới (tổng)
        addAiPointsSuccess(response.newPoints);
        if (showToast) {
          toast.success(`Đã thêm ${points} AI points thành công!`);
        }
        return response;
      } else {
        if (showToast) {
          toast.error('Không thể thêm AI points');
        }
        throw new Error('Failed to add AI points');
      }
    } catch (error) {
      console.error('Error adding AI points:', error);
      if (showToast) {
        toast.error('Không thể thêm AI points');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAiPoints,
    addAiPoints,
    isLoading,
  };
};
