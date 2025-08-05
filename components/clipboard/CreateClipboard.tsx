"use client";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("请输入要分享的内容");
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
        throw new Error(error.error || "创建失败");
      }

      const data: CreateClipboardResponse = await response.json();
      toast.success("创建成功！正在跳转...");

      // 创建成功后跳转到详情页
      router.push(`/${data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>贴一块</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="粘贴文本、网址、坐标等内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "创建中..." : "创建并分享"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
