import { ClipboardContent } from "@/types/clipboard";

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

class CloudflareD1Store {
  private config: D1Config;
  private baseUrl: string;

  constructor(config: D1Config) {
    this.config = config;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}`;
  }

  private async query(sql: string, params: any[] = []): Promise<any> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`D1 query failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result[0];
  }

  async initTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS clipboard (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        views INTEGER DEFAULT 0
      )
    `;
    await this.query(sql);

    // 创建过期时间索引
    const indexSql = `
      CREATE INDEX IF NOT EXISTS idx_expires_at ON clipboard(expires_at)
    `;
    await this.query(indexSql);
  }

  async set(id: string, content: ClipboardContent): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO clipboard (id, content, created_at, expires_at, views)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      content.content,
      content.createdAt,
      content.expiresAt,
      content.views || 0,
    ];
    await this.query(sql, params);
  }

  async get(id: string): Promise<ClipboardContent | null> {
    // 首先清理过期数据
    await this.cleanupExpired();

    const sql = `
      SELECT * FROM clipboard WHERE id = ? AND expires_at > ?
    `;
    const params = [id, Date.now()];
    const result = await this.query(sql, params);

    if (!result.results || result.results.length === 0) {
      return null;
    }

    const row = result.results[0];
    
    // 更新访问次数
    await this.incrementViews(id);

    return {
      id: row.id,
      content: row.content,
      createdAt: Number(row.created_at),
      expiresAt: Number(row.expires_at),
      views: (row.views || 0) + 1,
    };
  }

  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM clipboard WHERE id = ?`;
    await this.query(sql, [id]);
  }

  private async incrementViews(id: string): Promise<void> {
    const sql = `
      UPDATE clipboard SET views = views + 1 WHERE id = ?
    `;
    await this.query(sql, [id]);
  }

  private async cleanupExpired(): Promise<void> {
    const sql = `DELETE FROM clipboard WHERE expires_at <= ?`;
    await this.query(sql, [Date.now()]);
  }

  async getStats(): Promise<{ total: number; active: number }> {
    const totalSql = `SELECT COUNT(*) as count FROM clipboard`;
    const activeSql = `SELECT COUNT(*) as count FROM clipboard WHERE expires_at > ?`;
    
    const [totalResult, activeResult] = await Promise.all([
      this.query(totalSql),
      this.query(activeSql, [Date.now()]),
    ]);

    return {
      total: totalResult.results[0].count,
      active: activeResult.results[0].count,
    };
  }
}

// 导出 D1 存储实例
export function getD1Store(): CloudflareD1Store | null {
  const config = {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  };

  if (!config.accountId || !config.databaseId || !config.apiToken) {
    console.warn("Cloudflare D1 configuration missing, falling back to KV store");
    return null;
  }

  return new CloudflareD1Store(config as D1Config);
}
