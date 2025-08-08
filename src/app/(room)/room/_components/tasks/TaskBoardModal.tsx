'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import TaskBoard from './TaskBoard';

interface TaskBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskBoardModal({
  isOpen,
  onClose,
}: TaskBoardModalProps) {
  // State để theo dõi khi có task modal đang mở
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Handler khi task modal mở
  const handleTaskModalOpen = () => {
    setIsTaskModalOpen(true);
  };

  // Handler khi task modal đóng
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
  };

  // Override onClose để không đóng khi task modal đang mở
  const handleModalClose = () => {
    if (!isTaskModalOpen) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Task Manager"
      size="xl"
    >
      <div className="h-[80vh] p-2">
        <div className="h-[calc(100%-3rem)] overflow-auto">
          <TaskBoard
            onTaskModalOpen={handleTaskModalOpen}
            onTaskModalClose={handleTaskModalClose}
            keepParentOpen={true}
          />
        </div>
      </div>
    </Modal>
  );
}
