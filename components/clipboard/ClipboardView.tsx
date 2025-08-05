'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardContent } from '@/types/clipboard';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ClipboardViewProps {
  id: string;
}

export function ClipboardView({ id }: ClipboardViewProps) {
  const [clipboard, setClipboard] = useState<ClipboardContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClipboard();
  }, [id]);

  const fetchClipboard = async () => {
    try {
      const response = await fetch(`/api/clipboard/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('内容不存在或已过期');
        }
        throw new Error('获取内容失败');
      }

      const data = await response.json();
      setClipboard(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取内容失败');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!clipboard) return;
    
    try {
      await navigator.clipboard.writeText(clipboard.content);
      toast.success('已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>加载中...</p>
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
          <p className="text-gray-600">{error || '内容不存在或已过期'}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => window.location.href = '/'}
          >
            返回首页
          </Button>
        </CardContent>
      </Card>
    );
  }

  const timeRemaining = formatDistanceToNow(new Date(clipboard.expiresAt), {
    locale: zhCN,
    addSuffix: true
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>剪贴板内容</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 whitespace-pre-wrap break-words">
            {clipboard.content}
          </pre>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {timeRemaining}过期
          </p>
          <Button onClick={copyToClipboard}>
            复制内容
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>创建时间：{format(new Date(clipboard.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
          <p>访问次数：{clipboard.views || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}