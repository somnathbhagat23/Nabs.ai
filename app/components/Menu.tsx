"use client";

import { useState } from "react";

const menuItems = [
  { label: "About Nabs.ai", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" }
];

type MenuProps = {
  onLogout?: () => void;
};

export function Menu({ onLogout }: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-nabs-input-border bg-nabs-input text-nabs-text transition hover:border-nabs-accent"
        aria-label="Menu"
      >
        <span className="block h-4 w-4">
          <span className="block h-0.5 w-4 rounded bg-nabs-text" />
          <span className="mt-1 block h-0.5 w-4 rounded bg-nabs-text" />
          <span className="mt-1 block h-0.5 w-4 rounded bg-nabs-text" />
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-nabs-input-border bg-nabs-surface p-2 text-sm text-nabs-text shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-nabs-muted transition hover:bg-nabs-input hover:text-nabs-text"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="block w-full rounded-xl px-3 py-2 text-left text-nabs-muted transition hover:bg-nabs-input hover:text-nabs-text"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
