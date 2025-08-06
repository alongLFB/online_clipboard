"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border-default mt-auto">
      <div className="text-center mx-auto px-4 py-4">
        <p>
          © 2025 {t("app.title")}. {t("footer.rights")}.
        </p>
        <p>
          {t("footer.author")}:{" "}
          <span className="text-fg-secondary">alongLFB</span> |
          <a
            href="https://github.com/alongLFB/online_clipboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            GitHub
          </a>
        </p>
        <p className="text-center text-sm text-fg-secondary">
          {t("footer.warning")}
        </p>
      </div>
    </footer>
  );
}
