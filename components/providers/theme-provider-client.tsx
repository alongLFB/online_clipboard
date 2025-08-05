"use client";

import { ThemeProvider } from "@/contexts/theme-context";

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
