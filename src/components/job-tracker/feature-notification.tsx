'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface FeatureNotificationProps {
  title: string;
  description: string;
  additionalInfo?: string;
  onClose?: () => void;
}

export function FeatureNotification({
  title,
  description,
  additionalInfo,
  onClose,
}: FeatureNotificationProps) {
  return (
    <Card className="relative mb-8 bg-blue-50 p-4">
      <div className="flex items-start">
        <div className="mr-4 flex-shrink-0">
          <div className="rounded-full bg-blue-600 p-2">
            <Image
              src="/checked-document.png"
              alt="New Feature"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
          <p className="text-gray-600">{description}</p>
          {additionalInfo && <p className="text-gray-600">{additionalInfo}</p>}
        </div>
      </div>
      {onClose && (
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </Card>
  );
}
