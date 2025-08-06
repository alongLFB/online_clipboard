"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="border-b border-border-default">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold text-foreground-primary"
          >
            {t("app.title")}
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-sm text-foreground-secondary">
              {t("app.description")}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={locale === "zh" ? "default" : "ghost"}
                size="sm"
                onClick={() => switchLocale("zh")}
              >
                中文
              </Button>
              <Button
                variant={locale === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => switchLocale("en")}
              >
                EN
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
