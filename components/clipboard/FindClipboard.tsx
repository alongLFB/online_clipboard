"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function FindClipboard() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      toast.error("请输入识别码");
      return;
    }

    setLoading(true);

    try {
      // 先检查剪贴板是否存在
      const response = await fetch(`/api/clipboard/${id}`);

      if (response.ok) {
        // 存在则跳转到该页面
        router.push(`/${id}`);
      } else if (response.status === 404) {
        toast.error("识别码不存在或已过期");
      } else {
        toast.error("查找失败，请重试");
      }
    } catch {
      toast.error("查找失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>查找剪贴板</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="输入识别码（如：abc123）"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-input-border rounded-md bg-bg-primary text-fg-primary"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "查找中..." : "查找"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
