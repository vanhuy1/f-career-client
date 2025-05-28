import { useState } from 'react';
import { uploadFile } from '@/lib/storage';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';

interface FileUploaderProps {
  bucket?: SupabaseBucket;
  folder?: SupabaseFolder;
  onComplete: (url: string) => void;
  children?: React.ReactNode;
}

export default function FileUploader({
  bucket,
  folder,
  onComplete,
  children = 'Choose file…',
}: FileUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const { publicUrl, error } = await uploadFile({ file, bucket, folder });
    setLoading(false);

    if (error || !publicUrl) {
      console.error(error);
      alert(`Upload failed: ${error?.message}`);
      return;
    }

    onComplete(publicUrl);
  };

  return (
    <label className="inline-block cursor-pointer">
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={loading}
      />
      <span className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        {loading ? 'Uploading…' : children}
      </span>
    </label>
  );
}
