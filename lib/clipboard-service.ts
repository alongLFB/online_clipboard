import { ClipboardContent } from '@/types/clipboard';
import { generateShortId } from '@/utils/shortId';
import { getKVStore } from './kv-store';
import { getD1Store } from './d1-store';

const EXPIRY_MINUTES = parseInt(process.env.CONTENT_EXPIRY_MINUTES || '15');

export class ClipboardService {
  private kv = getKVStore();
  private d1 = getD1Store();

  constructor() {
    // 如果使用 D1，初始化数据库表
    if (this.d1) {
      this.d1.initTable().catch(console.error);
    }
  }

  async create(content: string, contentType?: string): Promise<ClipboardContent> {
    const id = generateShortId();
    const now = Date.now();
    const expiresAt = now + (EXPIRY_MINUTES * 60 * 1000);

    const clipboardContent: ClipboardContent = {
      id,
      content,
      createdAt: now,
      expiresAt,
      contentType,
      views: 0
    };

    // 优先使用 D1，fallback 到 KV
    if (this.d1) {
      await this.d1.set(id, clipboardContent);
    } else {
      await this.kv.put(
        id,
        JSON.stringify(clipboardContent),
        { expirationTtl: EXPIRY_MINUTES * 60 }
      );
    }

    return clipboardContent;
  }

  async get(id: string): Promise<ClipboardContent | null> {
    // 优先使用 D1
    if (this.d1) {
      return await this.d1.get(id);
    }

    // Fallback 到 KV
    const data = await this.kv.get(id);
    if (!data) return null;

    try {
      const content = JSON.parse(data) as ClipboardContent;
      
      // 检查是否已过期
      if (content.expiresAt < Date.now()) {
        await this.kv.delete(id);
        return null;
      }

      // 更新访问次数
      content.views = (content.views || 0) + 1;
      const remainingTtl = Math.floor((content.expiresAt - Date.now()) / 1000);
      if (remainingTtl > 0) {
        await this.kv.put(
          id,
          JSON.stringify(content),
          { expirationTtl: remainingTtl }
        );
      }

      return content;
    } catch (error) {
      console.error('Error parsing clipboard content:', error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    if (this.d1) {
      await this.d1.delete(id);
    } else {
      await this.kv.delete(id);
    }
  }

  async getStats(): Promise<{ total: number; active: number }> {
    if (this.d1) {
      return await this.d1.getStats();
    }
    
    // KV 存储没有统计功能
    return { total: 0, active: 0 };
  }
}