// app/auth/callback/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthCallback() {
  console.log("AuthCallback: Component rendering...");

  // IMPORTANT: Ensure this is the correct way to pass cookies to the client.
  // The official docs often show `cookies` as a function, which you are doing.
  const supabase = createServerComponentClient({ cookies });

  console.log("AuthCallback: Calling supabase.auth.getUser()");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("AuthCallback: Supabase getUser error:", error);
    // You might want to pass error details to the login page for better UX
    // redirect(`/login?error=${encodeURIComponent(error.message)}`);
    redirect("/login"); // Simpler for debugging
  }

  if (!user) {
    console.warn("AuthCallback: No user found after getUser, redirecting to login.");
    redirect("/login");
  }

  console.log("AuthCallback: User successfully authenticated:", user.id);
  // ✅ Success — go to home page
  redirect("/");
}