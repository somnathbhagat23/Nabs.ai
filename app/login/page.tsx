"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSessionUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user) {
        await supabase.from("users").upsert({
          id: user.id,
          name: user.user_metadata.full_name ?? user.user_metadata.name ?? null,
          email: user.email,
          online: true
        });
        window.location.href = "/profile";
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await supabase.from("users").upsert({
            id: session.user.id,
            name:
              session.user.user_metadata.full_name ??
              session.user.user_metadata.name ??
              null,
            email: session.user.email,
            online: true
          });
          window.location.href = "/profile";
        }
      }
    );

    void syncSessionUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-nabs-bg px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-nabs-text">
          Welcome to Nabs.ai
        </h1>
        <p className="mt-3 text-base text-nabs-muted">
          Talk to someone who fits your moment
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          className="mt-10 w-full rounded-2xl border border-nabs-input-border bg-nabs-input px-4 py-3 text-sm font-medium text-nabs-text transition hover:border-nabs-accent disabled:opacity-60"
        >
          {loading ? "Connecting..." : "Continue with Google"}
        </button>
        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
