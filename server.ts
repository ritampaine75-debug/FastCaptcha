import express from 'express';
import { createServer as createViteServer } from 'vite';
import { captchaRouter } from './server/routes/captchaRoutes.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API router
  app.use('/api', captchaRouter);

  // Health check
  app.get('/healthz', (req, res) => {
    res.json({ status: 'healthy', time: new Date().toISOString() });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[FastCaptcha Server] Vite middleware attached in dev mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[FastCaptcha Server] Serving production build.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FastCaptcha Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start FastCaptcha server:', err);
  process.exit(1);
});
