import { NextRequest, NextResponse } from 'next/server';
import { ClipboardService } from '@/lib/clipboard-service';

export async function GET(request: NextRequest) {
  try {
    const clipboardService = new ClipboardService();
    const stats = await clipboardService.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { total: 0, active: 0 }
      },
      { status: 500 }
    );
  }
}
