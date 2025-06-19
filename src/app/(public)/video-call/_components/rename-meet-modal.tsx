'use client';
import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui-button';
import { Input } from './ui-input';
import useMeetContext from '../contexts/MeetContext';
import { toast } from 'react-toastify';
import { videoCallText } from '../utils/text';

export interface RenameMeetModalProps {
  visible: boolean;
  defaultName?: string;
  onClose: () => void;
  onSubmit: (newName: string) => void;
}

export function RenameMeetModal({
  visible,
  defaultName = '',
  onClose,
  onSubmit,
}: RenameMeetModalProps) {
  const { userData } = useMeetContext();
  const [meetName, setMeetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeName = () => {
    if (!meetName.trim() || !userData.isHost) {
      if (!userData.isHost) {
        toast('Only the host can rename the meeting', { type: 'error' });
      }
      return;
    }

    setIsLoading(true);
    try {
      onSubmit(meetName);
    } catch (error) {
      console.error('Error renaming meet:', error);
      toast('Failed to rename meeting', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setMeetName(defaultName);
    }
  }, [visible, defaultName]);

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="renameMeetModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{videoCallText.renameMeetModal.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            testId="meetNameInput"
            name="meetName"
            placeholder={videoCallText.inputPlaceholder.meetName}
            value={meetName}
            onChangeValue={setMeetName}
            icon={Edit}
          />
          <Button
            testId="changeMeetNameButton"
            disabled={!meetName.trim() || isLoading || !userData.isHost}
            isLoading={isLoading}
            onClick={handleChangeName}
            className="w-full"
          >
            {videoCallText.renameMeetModal.rename}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}