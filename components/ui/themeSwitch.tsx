"use client";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitch = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Set default theme to light on first mount
    if (!theme || theme === "system") {
      setTheme("light");
    }
  }, [theme, setTheme]);

  if (!mounted) {
    return null;
  }

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    if (!document.startViewTransition) return setTheme(newTheme);
    document.startViewTransition(() => setTheme(newTheme));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className={cn(
        "relative flex h-8 w-20 items-center rounded-2xl border border-primary/10 bg-foreground/5 p-1",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        className="absolute h-6 w-10 rounded-xl bg-primary"
        animate={{
          x: isDark ? 36 : 0,
        }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
      />
      <Sun
        className={cn(
          "relative z-10 h-4 w-4 ml-2.5 transition-colors duration-200",
          !isDark ? "text-primary-foreground" : "text-muted-foreground"
        )}
      />
      <Moon
        className={cn(
          "relative z-10 h-4 w-4 ml-auto mr-2.5 transition-colors duration-200",
          isDark ? "text-primary-foreground" : "text-muted-foreground"
        )}
      />
    </button>
  );
};