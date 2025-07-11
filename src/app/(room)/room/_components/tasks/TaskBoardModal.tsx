'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import TaskBoard from './TaskBoard';
import Icon from '../ui/Icon';

interface TaskBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskBoardModal({ isOpen, onClose }: TaskBoardModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Manager"
      size="xl"
    >
      <div className="p-2 h-[80vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Icon name="Board" className="w-5 h-5" />
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