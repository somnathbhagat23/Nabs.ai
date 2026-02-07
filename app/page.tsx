"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "@/app/components/Menu";
import { supabase } from "@/lib/supabaseClient";

type Stage = "idle" | "ack" | "camera" | "connected";

type Message = {
  id: string;
  text: string;
};

const intentKeywords: Record<string, string[]> = {
  vent: ["vent", "frustrated", "angry", "overwhelmed"],
  talk: ["talk", "chat", "conversation", "company"],
  fun: ["fun", "laugh", "joke", "light"],
  listen: ["listen", "hear", "advice", "support"]
};

const extractIntent = (input: string) => {
  const lowered = input.toLowerCase();
  const match = Object.entries(intentKeywords).find(([_, words]) =>
    words.some((word) => lowered.includes(word))
  );
  return match?.[0] ?? "talk";
};

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [input, setInput] = useState("");
  const [statusText, setStatusText] = useState("");
  const [showOverlayInput, setShowOverlayInput] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const overlayTimer = useRef<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/login";
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (localVideoRef.current && currentStream) {
      localVideoRef.current.srcObject = currentStream;
    }
    if (previewVideoRef.current && currentStream) {
      previewVideoRef.current.srcObject = currentStream;
    }
    if (remoteVideoRef.current && currentStream) {
      remoteVideoRef.current.srcObject = currentStream;
    }
  }, [currentStream]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    setCurrentStream(stream);
  };

  const queueIntent = async (intent: string) => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      return;
    }
    const { data: profile } = await supabase
      .from("users")
      .select("language")
      .eq("id", user.id)
      .single();
    await supabase.from("waiting_queue").insert({
      user_id: user.id,
      intent,
      language: profile?.language ?? "English"
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    const intent = extractIntent(input);
    setStatusText("Finding someone for you...");
    setStage("ack");
    await queueIntent(intent);

    setTimeout(async () => {
      setStage("camera");
      setStatusText("Connecting you...");
      await startCamera();
    }, 180);

    setTimeout(() => {
      setStage("connected");
      setStatusText("");
    }, 1500);
  };

  const handleScreenTap = () => {
    if (stage !== "connected") {
      return;
    }
    setShowOverlayInput(true);
    if (overlayTimer.current) {
      clearTimeout(overlayTimer.current);
    }
    overlayTimer.current = setTimeout(() => {
      setShowOverlayInput(false);
    }, 5000);
  };

  const handleMessageSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: input }
    ]);
    setInput("");
    setShowOverlayInput(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const inputTransform =
    stage === "ack"
      ? "-translate-y-3 scale-[0.98]"
      : "translate-y-0 scale-100";

  return (
    <div
      className="relative min-h-screen bg-nabs-bg text-nabs-text"
      onClick={handleScreenTap}
    >
      <div className="absolute right-6 top-6">
        <Menu onLogout={handleLogout} />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-end px-6 pb-10">
        <div className="w-full max-w-3xl space-y-4">
          {statusText ? (
            <div className="text-center text-sm text-nabs-muted transition-opacity duration-200">
              {statusText}
            </div>
          ) : null}

          {stage !== "idle" ? (
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
                className={`h-72 w-full rounded-3xl object-cover transition-opacity duration-200 ${
                  stage === "connected" ? "opacity-100" : "opacity-0"
                } blur-video deep`}
              />
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className={`absolute right-4 top-4 h-24 w-36 rounded-2xl object-cover blur-video ${
                  stage === "connected" ? "opacity-100" : "opacity-0"
                } transition-opacity duration-200`}
              />
              {stage === "camera" ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-72 w-full rounded-3xl object-cover blur-video deep"
                />
              ) : null}
              {messages.length > 0 ? (
                <div className="absolute left-6 top-6 space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="rounded-2xl bg-black/50 px-4 py-2 text-sm text-nabs-text backdrop-blur"
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <form
            onSubmit={stage === "connected" ? handleMessageSend : handleSubmit}
            className={`nabs-input w-full transition-transform duration-200 ease-in-out ${
              stage === "connected" && !showOverlayInput
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            } ${inputTransform}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  stage === "connected"
                    ? "Type a message"
                    : "Jo mann mein hai, likho…"
                }
                className="w-full bg-transparent text-base text-nabs-text outline-none placeholder:text-nabs-placeholder"
              />
              <button
                type="submit"
                className="rounded-full border border-nabs-input-border px-4 py-2 text-sm text-nabs-muted transition hover:border-nabs-accent hover:text-nabs-text"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
