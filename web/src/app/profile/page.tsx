"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/NavBar";
import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const { user, authenticated } = usePrivy();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && user) {
      setEmail(
        Array.isArray(user.linkedAccounts)
          ? user.linkedAccounts.map((acc: any) => acc.email).join("")
          : ""
      );
      setAvatarUrl(user.id || null);
      setLoading(false);
    }
  }, [authenticated, user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: You can't update Privy user data directly here unless using Privy APIs
    setStatus("✅ This is a demo — changes are not saved.");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar userEmail={email} />
      <main className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Account Details</h2>
              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setStatus(null);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-300 text-sm text-neutral-700 rounded-md hover:bg-neutral-100"
                >
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-4">
                <Image
                  src={avatarUrl || "/default-avatar.png"}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full border border-neutral-300"
                  unoptimized
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border rounded-md text-sm bg-neutral-100 text-neutral-500"
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setStatus(null);
                    }}
                    className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md text-sm hover:bg-neutral-300"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {status && (
                <div
                  className={`mt-4 rounded-md px-4 py-3 text-sm border ${
                    status.startsWith("✅")
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
