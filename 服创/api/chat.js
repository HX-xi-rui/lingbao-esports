/**
 * Vercel云函数 - API代理
 * 作用：保护API密钥，解决CORS跨域问题
 *
 * 使用方式：
 * 1. 在Vercel部署此项目
 * 2. 在Vercel环境变量中设置 HUNYUAN_API_KEY
 * 3. 前端将自动通过此云函数调用腾讯混元API
 */

// 腾讯混元API地址
const API_ENDPOINT = 'https://tokenhub.tencentmaas.com/v1/chat/completions';

// 允许的来源（生产环境时改为你的域名）
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

export default async function handler(req, res) {
  // 设置CORS头
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // 生产环境可以限制为你的域名
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量获取API密钥
    const apiKey = process.env.HUNYUAN_API_KEY;

    if (!apiKey) {
      console.error('HUNYUAN_API_KEY 环境变量未设置');
      return res.status(500).json({
        error: 'API密钥未配置',
        message: '请联系管理员配置HUNYUAN_API_KEY环境变量'
      });
    }

    // 构建请求头
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // 转发请求到腾讯混元API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    // 获取响应数据
    const data = await response.json();

    // 返回数据
    if (response.ok) {
      return res.status(200).json(data);
    } else {
      console.error('腾讯混元API错误:', data);
      return res.status(response.status).json(data);
    }

  } catch (error) {
    console.error('云函数错误:', error);
    return res.status(500).json({
      error: '服务器内部错误',
      message: error.message
    });
  }
}
