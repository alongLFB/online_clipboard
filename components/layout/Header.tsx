'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="border-b border-border-default">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-foreground-primary">
            在线剪贴板
          </a>
          <div className="flex items-center gap-4">
            <p className="text-sm text-foreground-secondary">
              快速分享，15分钟自动删除
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}