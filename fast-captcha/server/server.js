import express from 'express';
import { captchaRoutes } from './routes/captchaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', captchaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

app.listen(PORT, () => {
  console.log(`FastCaptcha Standalone Server running on port ${PORT}`);
});
