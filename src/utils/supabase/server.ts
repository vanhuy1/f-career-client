import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async set(name: string, value: string, options: any) {
          (await cookieStore).set({ name, value, ...options });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  );
};
