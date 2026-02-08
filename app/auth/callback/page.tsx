"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for errors passed in the URL hash from the provider
    const params = new URLSearchParams(window.location.hash.substring(1));
    const errorParam = params.get("error_description") ?? params.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription?.unsubscribe(); // Prevent this from running again
        try {
          const user = session.user;
          const { error: upsertError } = await supabase.from("users").upsert({
            id: user.id,
            name:
              user.user_metadata.full_name ??
              user.user_metadata.name ??
              null,
            email: user.email,
            online: true,
          });

          if (upsertError) {
            throw upsertError;
          }

          // Redirect to the profile page on successful sign-in and upsert
          router.replace("/profile");
        } catch (e: any) {
          setError(e.message);
        }
      }
    });

    // Set a timeout in case the auth event doesn't fire
    const timeout = setTimeout(() => {
        if (!error) {
            setError("Authentication timed out. Please try signing in again.");
        }
    }, 10000);

    return () => {
      subscription?.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-nabs-bg px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-nabs-text">
          Finishing sign in...
        </h1>
        <p className="mt-3 text-base text-nabs-muted">
          We&apos;re completing your Google sign-in.
        </p>
        {error ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-red-400">{error}</p>
            <Link
              href="/login"
              className="inline-flex rounded-2xl border border-nabs-input-border bg-nabs-input px-4 py-2 text-sm font-medium text-nabs-text transition hover:border-nabs-accent"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-nabs-muted">Please wait...</p>
        )}
      </div>
    </div>
  );
}
