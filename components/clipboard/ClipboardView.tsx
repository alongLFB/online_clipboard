"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardContent } from "@/types/clipboard";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import toast from "react-hot-toast";
import QRCode from "qrcode";

interface ClipboardViewProps {
  id: string;
}

export function ClipboardView({ id }: ClipboardViewProps) {
  const [clipboard, setClipboard] = useState<ClipboardContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const fetchClipboard = async () => {
      try {
        const response = await fetch(`/api/clipboard/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("内容不存在或已过期");
          }
          throw new Error("获取内容失败");
        }

        const data = await response.json();
        setClipboard(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "获取内容失败");
      } finally {
        setLoading(false);
      }
    };

    fetchClipboard();
  }, [id]);

  const generateQRCode = async () => {
    if (!clipboard) return;

    setQrLoading(true);
    try {
      const currentUrl = window.location.href;
      const qrData = await QRCode.toDataURL(currentUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeData(qrData);
      toast.success("二维码生成成功");
    } catch {
      toast.error("二维码生成失败");
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!clipboard) return;

    try {
      await navigator.clipboard.writeText(clipboard.content);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-fg-secondary">加载中...</p>
      </div>
    );
  }

  if (error || !clipboard) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>内容不可用</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-fg-secondary">{error || "内容不存在或已过期"}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => (window.location.href = "/")}
          >
            返回首页
          </Button>
        </CardContent>
      </Card>
    );
  }

  const timeRemaining = formatDistanceToNow(new Date(clipboard.expiresAt), {
    locale: zhCN,
    addSuffix: true,
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => (window.location.href = "/")}
        className="mb-4"
      >
        ← 返回首页
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>剪贴板内容</span>
            <span className="text-sm font-mono text-fg-secondary bg-bg-secondary px-2 py-1 rounded">
              {id}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="p-4 bg-bg-secondary rounded-md overflow-auto max-h-96 whitespace-pre-wrap break-words text-fg-primary">
              {clipboard.content}
            </pre>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-fg-tertiary">{timeRemaining}过期</p>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard}>复制内容</Button>
              <Button
                variant="secondary"
                onClick={generateQRCode}
                disabled={qrLoading}
              >
                {qrLoading ? "生成中..." : "生成二维码"}
              </Button>
            </div>
          </div>

          {qrCodeData && (
            <div className="border-t border-border-default pt-4">
              <p className="text-sm text-fg-secondary mb-2">扫码访问：</p>
              <div className="flex justify-center">
                <Image
                  src={qrCodeData}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="border border-border-default rounded-lg p-4 bg-bg-secondary"
                  unoptimized
                />
              </div>
            </div>
          )}

          <div className="text-sm text-fg-tertiary space-y-1">
            <p>
              创建时间：
              {format(new Date(clipboard.createdAt), "yyyy-MM-dd HH:mm:ss")}
            </p>
            <p>访问次数：{clipboard.views || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
