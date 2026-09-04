"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore, useCallback, useEffect } from "react";

type Theme = "light" | "dark" | "system";

function getThemeSnapshot(): Theme {
  return (localStorage.getItem("theme") as Theme) || "system";
}

function getServerSnapshot(): Theme {
  return "system";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("theme-change", callback);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("theme-change", callback);
    mql.removeEventListener("change", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme =
      resolved === "dark" ? "dark" : "light";
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {(
          [
            { value: "light" as const, icon: Sun, label: "Light" },
            { value: "dark" as const, icon: Moon, label: "Dark" },
            { value: "system" as const, icon: Monitor, label: "System" },
          ] as const
        ).map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center justify-center h-7 w-7 rounded-md border transition-colors duration-200 cursor-pointer ${
              theme === value
                ? "border-foreground text-foreground"
                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-foreground"
            }`}
            aria-label={label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
