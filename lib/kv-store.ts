import { ClipboardContent } from '@/types/clipboard';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

// 用于本地开发的内存存储
class InMemoryKV implements KVNamespace {
  private store: Map<string, { value: string; expiresAt?: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    const expiresAt = options?.expirationTtl 
      ? Date.now() + (options.expirationTtl * 1000)
      : undefined;
    
    this.store.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// 根据环境选择 KV 存储实现
export function getKVStore(): KVNamespace {
  if (process.env.NODE_ENV === 'production' && typeof globalThis.CLIPBOARD_KV !== 'undefined') {
    // 在 Cloudflare Workers 环境中
    return globalThis.CLIPBOARD_KV as KVNamespace;
  } else {
    // 本地开发环境
    if (!global.kvStore) {
      global.kvStore = new InMemoryKV();
    }
    return global.kvStore;
  }
}

// 用于本地开发的全局类型声明
declare global {
  var kvStore: InMemoryKV | undefined;
  var CLIPBOARD_KV: KVNamespace | undefined;
}