/**
 * 灵宝百事通 - 本地开发服务器（带API代理）
 * 解决浏览器CORS跨域限制 + 流式响应透传
 * 
 * 用法：node server.js
 * 然后访问 http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3005;
const TOKENHUB_API = 'https://tokenhub.tencentmaas.com/v1/chat/completions';

// ============ 请求频率限制 ============
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分钟窗口
const RATE_LIMIT_MAX = 20;       // 每分钟最大请求次数

function checkRateLimit(ip) {
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW) {
    record = { count: 0, startTime: now };
    rateLimitMap.set(ip, record);
  }
  record.count++;
  return record.count <= RATE_LIMIT_MAX;
}

// 清理过期记录（每5分钟）
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.startTime > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 300000);

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  // CORS头（所有请求都加）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Authorization');

  // 预检请求直接返回200
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API代理（仅允许 /api/chat 路径）
  if (req.method === 'POST' && req.url === '/api/chat') {
    // 频率限制检查
    const clientIp = req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '请求过于频繁，请稍后再试' }));
      console.log(`[限流] IP: ${clientIp} 请求被限流`);
      return;
    }
    return handleProxy(req, res);
  }

  // 禁止代理非白名单路径的POST请求
  if (req.method === 'POST' && req.url.startsWith('/api/')) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden: unsupported API path' }));
    return;
  }

  // 静态文件服务
  serveStatic(req, res);
});

function handleProxy(req, res) {
  // 收集请求体
  let body = '';
  req.on('data', chunk => { body += chunk; });
  
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const authHeader = data.authHeader || '';
      const tokenPreview = authHeader ? authHeader.substring(0, 6) + '...' : 'none';
      console.log(`[代理] 模型: ${data.model || 'unknown'}, 消息数: ${(data.messages || []).length}, Token: ${tokenPreview}`);

      // 删除authHeader，不传给混元API
      delete data.authHeader;

      // 构建转发请求
      const postData = JSON.stringify(data);
      const urlObj = new URL(TOKENHUB_API);
      
      const proxyReq = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'Content-Length': Buffer.byteLength(postData),
        }
      }, (proxyRes) => {
        // 直接流式透传给前端（关键！不缓冲）
        console.log(`[代理] 混元返回状态: ${proxyRes.statusCode}`);
        
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': proxyRes.headers['content-type'] || 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        
        // 流式pipe - 每收到一个chunk就立刻发给前端
        proxyRes.pipe(res);
        
        proxyRes.on('end', () => {
          console.log('[代理] 流式传输完成');
        });
      });

      proxyReq.on('error', (e) => {
        console.error('[代理] 请求错误:', e.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      });

      proxyReq.write(postData);
      proxyReq.end();
      
    } catch (e) {
      console.error('[代理] 解析错误:', e.message);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });

  req.on('error', (e) => {
    console.error('[代理] 接收错误:', e.message);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  });
}

function serveStatic(req, res) {
  let filePath = path.join(BASE_DIR, req.url === '/' ? 'index.html' : req.url);

  // 防止路径穿越攻击
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 尝试index.html作为fallback（SPA路由支持）
      if (!path.extname(filePath)) {
        fs.readFile(path.join(BASE_DIR, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       灵宝百事通 - 本地开发服务器         ║
╠════════════════════════════════════════╣
║  地址: http://localhost:${PORT}           ║
║  API代理: /api/chat → 腾讯混元          ║
║  按 Ctrl+C 停止服务器                   ║
╚════════════════════════════════════════╝
`);
});
