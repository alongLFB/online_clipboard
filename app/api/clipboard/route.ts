import { NextRequest, NextResponse } from 'next/server';
import { ClipboardService } from '@/lib/clipboard-service';
import { CreateClipboardRequest, CreateClipboardResponse } from '@/types/clipboard';
import QRCode from 'qrcode';

const clipboardService = new ClipboardService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateClipboardRequest;
    
    // 验证输入
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // 限制内容大小（1MB）
    if (body.content.length > 1024 * 1024) {
      return NextResponse.json(
        { error: 'Content too large (max 1MB)', code: 'CONTENT_TOO_LARGE' },
        { status: 400 }
      );
    }

    // 创建剪贴板内容
    const clipboard = await clipboardService.create(body.content, body.contentType);
    
    // 生成短链接
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    const shortUrl = `${baseUrl}/${clipboard.id}`;
    
    // 生成二维码
    const qrCodeData = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const response: CreateClipboardResponse = {
      id: clipboard.id,
      shortUrl,
      qrCodeData,
      expiresAt: clipboard.expiresAt
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating clipboard:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}