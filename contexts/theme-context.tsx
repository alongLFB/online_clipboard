"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { themes, type ThemeName } from "@/lib/theme";

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 和系统偏好中获取初始主题
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as ThemeName | null;

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // 保存主题到 localStorage 并更新 CSS 变量
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("theme", theme);
    const themeColors = themes[theme];
    const root = document.documentElement;

    // 设置 CSS 变量
    root.style.setProperty("--background", themeColors.background.primary);
    root.style.setProperty("--foreground", themeColors.foreground.primary);

    // 添加或移除 dark 类
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 在客户端挂载之前，提供默认值以避免hydration错误
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
