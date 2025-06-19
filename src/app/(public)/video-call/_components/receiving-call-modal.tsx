'use client';
import { PhoneCall, PhoneOff, X, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui-button';
import { IconButton } from './icon-button';
import { videoCallText } from '../utils/text';

export interface ReceivingCallModalProps {
  visible: boolean;
  userName: string;
  onAccept: () => void;
  onReject: () => void;
}

export function ReceivingCallModal({
  visible,
  userName,
  onAccept,
  onReject,
}: ReceivingCallModalProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/25 transition-all duration-300',
        visible ? 'visible opacity-100' : 'invisible opacity-0',
      )}
      data-testid="receivingCallModal"
    >
      <div className="bg-background flex w-[90%] max-w-md flex-col gap-4 rounded-2xl p-6 shadow-2xl transition-all duration-300 sm:w-[450px]">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Meeting Join Request
          </h2>
          <IconButton
            icon={<X className="h-4 w-4" />}
            onClick={onReject}
            className="text-muted-foreground hover:text-foreground"
          />
        </header>

        <div className="text-center mb-4">
          <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <p className="text-lg">
            <strong>{userName}</strong> is requesting to join the meeting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            testId="rejectMeetRequestButton"
            onClick={onReject}
            variant="destructive"
            className="flex-1"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            Decline
          </Button>

          <Button
            testId="acceptMeetRequestButton"
            onClick={onAccept}
            className="flex-1"
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}