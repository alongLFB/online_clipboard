"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function FindClipboard() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      toast.error(t("find.error.empty"));
      return;
    }

    setLoading(true);

    try {
      // 先检查剪贴板是否存在
      const response = await fetch(`/api/clipboard/${id}`);

      if (response.ok) {
        // 存在则跳转到该页面
        router.push(`/${locale}/${id}`);
      } else if (response.status === 404) {
        toast.error(t("find.error.notFound"));
      } else {
        toast.error(t("find.error.failed"));
      }
    } catch {
      toast.error(t("find.error.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("find.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("find.placeholder")}
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-input-border rounded-md bg-bg-primary text-fg-primary"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("find.searching") : t("find.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
