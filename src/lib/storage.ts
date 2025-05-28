// lib/storage.ts
import { SupabaseBucket } from '@/enums/supabase';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';

export interface UploadOptions {
  file: File;
  bucket?: SupabaseBucket;
  folder?: string;
  fileName?: string;
}

export async function uploadFile({
  file,
  bucket = SupabaseBucket.UPLOADS,
  folder,
  fileName,
}: UploadOptions): Promise<{ publicUrl: string | null; error: Error | null }> {
  const timestamp = Date.now();
  const name = fileName ?? `${timestamp}_${file.name}`;

  const path = folder ? `${folder}/${name}` : name;

  const { data, error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (uploadErr || !data) {
    const errorMessage = uploadErr?.message || 'File upload failed.';
    toast.error(errorMessage);
    return { publicUrl: null, error: uploadErr || new Error(errorMessage) };
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    const errorMessage = 'Failed to get public URL.';
    toast.error(errorMessage);
    return { publicUrl: null, error: new Error(errorMessage) };
  }

  return { publicUrl: publicUrlData.publicUrl, error: null };
}
