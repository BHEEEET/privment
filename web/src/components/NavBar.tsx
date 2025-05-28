'use client';

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // redirect to login or homepage after logout
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/10 dark:border-white/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          <Image
            className="dark:invert mx-6"
            src="/privment_transparent_black.png"
            alt="Privment logo"
            width={20}
            height={30}
            priority
          />
        </Link>

        {/* Center nav links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <Link href="/" className="text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300 transition">
            Contact
          </Link>
          <Link href="/private" className="text-white hover:text-gray-300 transition">
            Private
          </Link>
        </div>

        {/* Logout button (right side) */}
        <div>
          <button
            onClick={handleLogout}
            className="text-sm text-white hover:text-red-400 transition px-2"
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}
