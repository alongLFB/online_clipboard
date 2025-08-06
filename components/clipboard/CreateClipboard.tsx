"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { CreateClipboardResponse } from "@/types/clipboard";
import { useRouter } from "next/navigation";

export function CreateClipboard() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error(t("create.error.empty"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/clipboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, contentType: "text" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("create.error.failed"));
      }

      const data: CreateClipboardResponse = await response.json();
      toast.success(t("create.success"));

      // 创建成功后跳转到详情页
      router.push(`/${locale}/${data.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("create.error.retry")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("create.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={t("create.placeholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("create.creating") : t("create.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
