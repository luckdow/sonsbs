import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Bot detection middleware
const botDetection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|yandex|baidu|facebookexternalhit|twitterbot|linkedinbot|pinterest|whatsapp/i.test(userAgent);
  
  console.log(`Request: ${req.url} | User-Agent: ${userAgent} | IsBot: ${isBot}`);
  
  if (isBot && req.url === '/') {
    // Serve SEO-optimized static content to bots
    const seoContent = fs.readFileSync(path.join(process.cwd(), 'dist/index.html'), 'utf8');
    res.send(seoContent);
    return;
  }
  
  next();
};

// Apply bot detection middleware
app.use(botDetection);

// Serve static files
app.use(express.static('public'));

// For non-bot traffic, proxy to Vite dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
}));

app.listen(PORT, () => {
  console.log(`🚀 SEO Proxy Server running on port ${PORT}`);
  console.log(`📊 Bot traffic → Static SEO content`);
  console.log(`👥 User traffic → React SPA (localhost:3000)`);
});
