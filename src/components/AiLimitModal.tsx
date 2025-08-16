import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';

interface AiLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const AiLimitModal: React.FC<AiLimitModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>AI Credits Exhausted</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            You&apos;ve used all your AI credits for this month. Upgrade to Pro
            to get unlimited access to AI features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-900">
              Pro Plan Benefits:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
                <span>Unlimited AI-powered CV optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
                <span>Unlimited roadmap generation</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
                <span>Unlimited quiz creation</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-purple-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            onClick={onUpgrade}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
