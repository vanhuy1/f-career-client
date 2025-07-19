'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import TodoList from './TodoList';
import DraggableCard from '../ui/DraggableCard';

export default function DraggableTodoList() {
  const isVisible = useSelector(
    (state: RootState) => state.room.todolist.ui.isVisible,
  );

  // Calculate initial position for the todo list
  const initialPosition = {
    x:
      typeof window !== 'undefined'
        ? Math.max(window.innerWidth / 2 + 100, 0)
        : 0,
    y: typeof window !== 'undefined' ? Math.max(window.innerHeight / 3, 0) : 0,
  };

  if (!isVisible) {
    return null;
  }

  return (
    <DraggableCard
      title="Todo List"
      initialPosition={initialPosition}
      className="w-[350px]"
    >
      <TodoList />
    </DraggableCard>
  );
}
