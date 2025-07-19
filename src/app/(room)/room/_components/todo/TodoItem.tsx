'use client';

import { cn } from '@/lib/utils';
import Icon from '../ui/Icon';

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
}: TodoItemProps) {
  return (
    <li className={cn('my-1 flex items-center')} key={todo.id}>
      <button
        className={cn('mr-2 flex items-center text-lg focus:outline-none')}
        onClick={() => onToggleComplete(todo.id)}
      >
        {todo.completed ? (
          <Icon
            className={cn('text-green-500 !filter-none')}
            name="Check-off"
          />
        ) : (
          <Icon className={cn('text-white !filter-none')} name="Check-on" />
        )}
        <span className={cn(todo.completed && 'line-through', 'ml-2')}>
          {todo.text}
        </span>
      </button>
      <button className={cn('ml-auto')} onClick={() => onDelete(todo.id)}>
        <Icon className={cn('text-red-500 !filter-none')} name="Trash" />
      </button>
    </li>
  );
}
