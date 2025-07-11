'use client';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { toggleTodoVisibility } from '@/services/state/roomSlice';
import IconButton from '../ui/IconButton';

export default function TodoFAB() {
  const dispatch = useAppDispatch();
  const todoVisible = useSelector((state: RootState) => state.room.todolist.ui?.isVisible);

  return (
    <IconButton
      icon="List"
      label="Todo List"
      labelPosition="hover-right"
      isActive={todoVisible}
      onClick={() => dispatch(toggleTodoVisibility())}
      tooltipClassName="font-medium"
    />
  );
} 