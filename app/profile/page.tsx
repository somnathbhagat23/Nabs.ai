"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const languages = ["English", "हिंदी", "Español", "Français", "Deutsch"];
const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"];

export default function ProfilePage() {
  const [step, setStep] = useState<"language" | "gender" | "saving">(
    "language"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    null
  );
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/login";
      }
    };

    checkSession();
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setFade(false);
    setTimeout(() => {
      setStep("gender");
      setFade(true);
    }, 180);
  };

  const handleGenderSelect = async (gender: string) => {
    setSelectedGender(gender);
    setStep("saving");
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase
        .from("users")
        .update({ language: selectedLanguage, gender })
        .eq("id", data.user.id);
    }
    window.location.href = "/";
  };

  const handleSkipGender = async () => {
    setStep("saving");
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase
        .from("users")
        .update({ language: selectedLanguage, gender: null })
        .eq("id", data.user.id);
    }
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-nabs-bg px-6">
      <div className="w-full max-w-md rounded-3xl border border-nabs-input-border bg-nabs-surface p-8">
        {step === "language" ? (
          <div className={fade ? "fade-enter-active" : "fade-exit-active"}>
            <h2 className="text-2xl font-semibold text-nabs-text">
              Preferred language
            </h2>
            <p className="mt-2 text-sm text-nabs-muted">
              Choose what feels most natural for you.
            </p>
            <div className="mt-6 grid gap-3">
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageSelect(language)}
                  className="rounded-2xl border border-nabs-input-border bg-nabs-input px-4 py-3 text-left text-sm text-nabs-text transition hover:border-nabs-accent"
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === "gender" ? (
          <div className={fade ? "fade-enter-active" : "fade-exit-active"}>
            <h2 className="text-2xl font-semibold text-nabs-text">Gender</h2>
            <p className="mt-2 text-sm text-nabs-muted">
              Optional — share only if you want to.
            </p>
            <div className="mt-6 grid gap-3">
              {genders.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleGenderSelect(gender)}
                  className="rounded-2xl border border-nabs-input-border bg-nabs-input px-4 py-3 text-left text-sm text-nabs-text transition hover:border-nabs-accent"
                >
                  {gender}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSkipGender}
                className="rounded-2xl border border-transparent bg-transparent px-4 py-3 text-left text-sm text-nabs-muted transition hover:text-nabs-text"
              >
                Skip for now
              </button>
            </div>
          </div>
        ) : null}

        {step === "saving" ? (
          <div className="text-sm text-nabs-muted">Saving...</div>
        ) : null}
      </div>
    </div>
  );
}
