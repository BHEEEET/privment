// components/PrivateMessage.tsx
import { createClient } from '@/utils/supabase/client';

export default async function PrivateMessage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log('Not logged in');
  }

  return (
    <p className="text-sm text-gray-800">
      Hello {data?.user?.email ?? 'Guest'}
    </p>
  );
}
