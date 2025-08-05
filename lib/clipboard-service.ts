import { ClipboardContent } from '@/types/clipboard';
import { generateShortId } from '@/utils/shortId';
import { getKVStore } from './kv-store';

const EXPIRY_MINUTES = parseInt(process.env.CONTENT_EXPIRY_MINUTES || '15');

export class ClipboardService {
  private kv = getKVStore();

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

    // 存储到 KV，设置 TTL
    await this.kv.put(
      id,
      JSON.stringify(clipboardContent),
      { expirationTtl: EXPIRY_MINUTES * 60 }
    );

    return clipboardContent;
  }

  async get(id: string): Promise<ClipboardContent | null> {
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
      await this.kv.put(
        id,
        JSON.stringify(content),
        { expirationTtl: Math.floor((content.expiresAt - Date.now()) / 1000) }
      );

      return content;
    } catch (error) {
      console.error('Error parsing clipboard content:', error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await this.kv.delete(id);
  }
}