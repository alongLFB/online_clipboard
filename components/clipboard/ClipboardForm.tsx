'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { CreateClipboardResponse } from '@/types/clipboard';

export function ClipboardForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateClipboardResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('请输入要分享的内容');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/clipboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, contentType: 'text' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建失败');
      }

      const data: CreateClipboardResponse = await response.json();
      setResult(data);
      setContent('');
      toast.success('创建成功！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>创建剪贴板</CardTitle>
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
              {loading ? '创建中...' : '生成短链接'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>分享链接</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">短链接：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.shortUrl}
                  className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                />
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(result.shortUrl)}
                >
                  复制
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">二维码（扫码访问）：</p>
              <div className="flex justify-center">
                <img
                  src={result.qrCodeData}
                  alt="QR Code"
                  className="border rounded-lg p-4"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              内容将在 15 分钟后自动删除
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}