"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CreateClipboard } from "@/components/clipboard/CreateClipboard";
import { FindClipboard } from "@/components/clipboard/FindClipboard";

type ActiveView = "home" | "create" | "find";

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const t = useTranslations();

  if (activeView === "create") {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("app.title")}</h1>
          <p className="text-gray-600">{t("app.description")}</p>
        </div>
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => setActiveView("home")}
            className="mb-4"
          >
            ← {t("navigation.home")}
          </Button>
          <CreateClipboard />
        </div>
      </main>
    );
  }

  if (activeView === "find") {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("app.title")}</h1>
          <p className="text-gray-600">{t("app.description")}</p>
        </div>
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => setActiveView("home")}
            className="mb-4"
          >
            ← {t("navigation.home")}
          </Button>
          <FindClipboard />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-fg-primary">
          {t("app.title")}
        </h1>
        <p className="text-xl text-fg-secondary mb-2">{t("app.subtitle")}</p>
        <p className="text-fg-tertiary">{t("app.description")}</p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 创建新的剪贴板空间 */}
          <div className="bg-card-bg border border-border-default rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-fg-primary">
                {t("home.create.title")}
              </h2>
              <p className="text-fg-secondary mb-6">
                {t("home.create.description")}
              </p>
            </div>
            <Button
              onClick={() => setActiveView("create")}
              className="w-full py-3 text-lg"
              size="lg"
            >
              {t("home.create.button")}
            </Button>
          </div>

          {/* 查找已有的剪贴板空间 */}
          <div className="bg-card-bg border border-border-default rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-fg-primary">
                {t("home.find.title")}
              </h2>
              <p className="text-fg-secondary mb-6">
                {t("home.find.description")}
              </p>
            </div>
            <Button
              onClick={() => setActiveView("find")}
              variant="secondary"
              className="w-full py-3 text-lg"
              size="lg"
            >
              {t("home.find.button")}
            </Button>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4 text-fg-primary">
            {t("home.instructions.title")}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-fg-secondary">
            <div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  1
                </span>
              </div>
              <p>{t("home.instructions.step1")}</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  2
                </span>
              </div>
              <p>{t("home.instructions.step2")}</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  3
                </span>
              </div>
              <p>{t("home.instructions.step3")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
