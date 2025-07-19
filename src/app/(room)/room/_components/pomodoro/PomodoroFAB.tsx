'use client';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import {
  toggleTimerVisibility,
  toggleProgressVisibility,
} from '@/services/state/roomSlice';
import IconButton from '../ui/IconButton';

export default function PomodoroFAB() {
  const dispatch = useAppDispatch();
  const pomodoro = useSelector((state: RootState) => state.room.pomodoro);

  return (
    <>
      <IconButton
        icon="Clock"
        label="Timer"
        labelPosition="hover-right"
        isActive={pomodoro.ui.isTimerVisible}
        onClick={() => {
          dispatch(toggleTimerVisibility());
          // Show success toast when toggling
          if (!pomodoro.ui.isTimerVisible) {
            // We could add a toast notification here if needed
          }
        }}
        tooltipClassName="font-medium"
      />

      <IconButton
        icon="Calendar"
        label="Stats"
        labelPosition="hover-right"
        isActive={pomodoro.ui.isProgressVisible}
        onClick={() => dispatch(toggleProgressVisibility())}
        tooltipClassName="font-medium"
      />
    </>
  );
}
