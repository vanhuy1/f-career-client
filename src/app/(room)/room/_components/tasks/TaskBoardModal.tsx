'use client';

import Modal from '../ui/Modal';
import TaskBoard from './TaskBoard';

interface TaskBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
}

export default function TaskBoardModal({
  isOpen,
  onClose,
  userId = 1,
}: TaskBoardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Manager" size="xl">
      <div className="h-[80vh] p-2">
        <div className="h-[calc(100%-3rem)] overflow-auto">
          <TaskBoard
            onTaskModalOpen={() => {}}
            onTaskModalClose={() => {}}
            keepParentOpen={true}
            userId={userId}
          />
        </div>
      </div>
    </Modal>
  );
}
