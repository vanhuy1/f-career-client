'use client';

import { useState, useEffect } from 'react';

// Define a type for the task object
interface TaskItem {
  status: string;
  [key: string]: unknown;
}

export function useLocalStorageState<T>(
  initialState: T,
  key: string,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }

    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      return initialState;
    }

    try {
      // Parse the stored value
      const parsedValue = JSON.parse(storedValue);

      // Special handling for task data - fix status format if needed
      if (key === 'study-room-tasks' && Array.isArray(parsedValue)) {
        return parsedValue.map((task: TaskItem) => {
          // If status contains underscore (in_progress), convert to hyphen (in-progress)
          if (
            task.status &&
            typeof task.status === 'string' &&
            task.status.includes('_')
          ) {
            return {
              ...task,
              status: task.status.replace('_', '-'),
            };
          }
          return task;
        }) as T;
      }

      return parsedValue;
    } catch (error) {
      console.error(
        `Error parsing localStorage value for key "${key}":`,
        error,
      );
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  return [value, setValue];
}
