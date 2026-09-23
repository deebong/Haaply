import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Path to client build directory
const distPath = path.resolve(__dirname, 'dist');

// Serve static files from dist directory
app.use(express.static(distPath));

// Fallback for nested route asset requests (e.g. /product/assets/*)
app.use('*/assets', express.static(path.join(distPath, 'assets')));

// Single Page Application route fallback
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build not found. Please run npm run build.');
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
