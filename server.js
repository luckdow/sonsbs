// Express.js SPA fallback middleware example
// Bu dosya deployment platform'unda kullanılabilir

const express = require('express');
const path = require('path');
const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes (eğer varsa)
app.use('/api', (req, res, next) => {
  // API routes burada tanımlanır
  res.status(404).json({ error: 'API endpoint not found' });
});

// SPA fallback - Tüm route'ları index.html'e yönlendir
app.get('*', (req, res) => {
  // Static asset'ler için 404 döndür
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return res.status(404).send('File not found');
  }
  
  // SPA route'ları için index.html serve et
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
