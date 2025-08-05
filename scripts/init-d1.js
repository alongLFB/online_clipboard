#!/usr/bin/env node

/**
 * Cloudflare D1 数据库初始化脚本
 * 
 * 使用方法:
 * 1. 确保在 .env.local 中配置了 D1 相关环境变量
 * 2. 运行: node scripts/init-d1.js
 */

require('dotenv').config({ path: '.env.local' });

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
  console.error('❌ 缺少必要的环境变量:');
  console.error('   CLOUDFLARE_ACCOUNT_ID');
  console.error('   CLOUDFLARE_D1_DATABASE_ID');
  console.error('   CLOUDFLARE_API_TOKEN');
  console.error('\n请在 .env.local 文件中配置这些变量');
  process.exit(1);
}

async function initDatabase() {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}`;
  
  const headers = {
    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  console.log('🚀 正在初始化 Cloudflare D1 数据库...');

  try {
    // 创建表
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS clipboard (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        views INTEGER DEFAULT 0
      )
    `;

    const response1 = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: createTableSql,
        params: [],
      }),
    });

    if (!response1.ok) {
      throw new Error(`创建表失败: ${response1.statusText}`);
    }

    console.log('✅ 数据表创建成功');

    // 创建索引
    const createIndexSql = `
      CREATE INDEX IF NOT EXISTS idx_expires_at ON clipboard(expires_at)
    `;

    const response2 = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: createIndexSql,
        params: [],
      }),
    });

    if (!response2.ok) {
      throw new Error(`创建索引失败: ${response2.statusText}`);
    }

    console.log('✅ 索引创建成功');

    // 验证表结构
    const showTablesSql = `
      SELECT name FROM sqlite_master WHERE type='table' AND name='clipboard'
    `;

    const response3 = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: showTablesSql,
        params: [],
      }),
    });

    if (!response3.ok) {
      throw new Error(`验证表结构失败: ${response3.statusText}`);
    }

    const result = await response3.json();
    
    if (result.result[0].results.length > 0) {
      console.log('✅ 数据库验证成功');
      console.log('🎉 Cloudflare D1 数据库初始化完成!');
      console.log('\n现在你可以启动应用了:');
      console.log('   npm run build');
      console.log('   npm run pm2:start');
    } else {
      console.log('❌ 数据库验证失败');
    }

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
}

initDatabase();
