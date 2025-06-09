'use client';

import { Button } from '@/components/ui/button';
import {
  Settings,
  ZoomIn,
  ZoomOut,
  Save,
  Printer,
  RefreshCw,
  FileText,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
interface PageButtonsProps {
  onPrint: () => void;
  onSave: () => void;
  onReset: () => void;
  onSampleData: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onShowSettings: () => void;
}

const PageButtons = ({
  onPrint,
  onSave,
  onReset,
  onSampleData,
  onScaleUp,
  onScaleDown,
  onShowSettings,
}: PageButtonsProps) => {
  const router = useRouter();
  return (
    <div className="fixed right-4 bottom-24 flex flex-col gap-2">
      <Button variant="outline" size="icon" onClick={onScaleUp}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onScaleDown}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onPrint}>
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onSave}>
        <Save className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onReset}>
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onSampleData}>
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onShowSettings}>
        <Settings className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push('/ca/cv-builder/')}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PageButtons;
