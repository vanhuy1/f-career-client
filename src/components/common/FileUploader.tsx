import { useState } from 'react';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';

interface FileUploaderProps {
  bucket?: SupabaseBucket;
  folder?: SupabaseFolder;
  onComplete?: (url: string) => void;
  onFileSelect: (file: File) => void;
  wrapperClassName?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
}

export default function FileUploader({
  onFileSelect,
  wrapperClassName = '',
  buttonClassName = '',
  children = 'Choose file…',
}: FileUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // Instead of uploading, just pass the file back for preview
    onFileSelect(file);

    setLoading(false);
  };

  return (
    <label className={`cursor-pointer ${wrapperClassName}`}>
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={loading}
      />
      {loading ? (
        <div className={buttonClassName}>
          <span>Processing…</span>
        </div>
      ) : (
        <div className={buttonClassName}>{children}</div>
      )}
    </label>
  );
}
