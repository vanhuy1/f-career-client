'use client';

import Modal from '../ui/Modal';
import TaskBoard from './TaskBoard';
import Icon from '../ui/Icon';

interface TaskBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskBoardModal({
  isOpen,
  onClose,
}: TaskBoardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Manager" size="xl">
      <div className="h-[80vh] p-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Icon name="Board" className="h-5 w-5" />
            Manage Your Tasks
          </h2>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-auto">
          <TaskBoard />
        </div>
      </div>
    </Modal>
  );
}
