'use client';

import { Button } from '@/components/ui/button';
import {
  Settings,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  RefreshCw,
  FileText,
  LogOut,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageButtonsProps {
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
  onSampleData: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onShowSettings: () => void;
  onPreview: () => void;
}

const PageButtons = ({
  onSave,
  onDownload,
  onReset,
  onSampleData,
  onScaleUp,
  onScaleDown,
  onShowSettings,
  onPreview,
}: PageButtonsProps) => {
  const router = useRouter();
  return (
    <div className="fixed right-4 bottom-24 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onScaleUp}
        title="Phóng to"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onScaleDown}
        title="Thu nhỏ"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPreview}
        title="Xem trước"
        className="border-purple-300 bg-purple-50 hover:bg-purple-100"
      >
        <Eye className="h-4 w-4 text-purple-600" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSave}
        title="Lưu CV vào hệ thống"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onDownload}
        title="Tải xuống PDF"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onReset} title="Khôi phục">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSampleData}
        title="Dữ liệu mẫu"
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onShowSettings}
        title="Cài đặt"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push('/ca/cv-builder/')}
        title="Thoát"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PageButtons;
