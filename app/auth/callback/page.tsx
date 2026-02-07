"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  useEffect(() => {
    const exchangeSession = async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href);
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          name: data.user.user_metadata.full_name,
          email: data.user.email,
          online: true
        });
      }
      window.location.href = "/profile";
    };

    exchangeSession();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-nabs-bg text-nabs-muted">
      Signing you in...
    </div>
  );
}
