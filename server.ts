import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/apiHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Raw body parser for POST /api/crawler/scrape
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle API requests
app.all('/api*', (req, res) => {
  handleApiRequest(req, res);
});

// Serve frontend static build
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MediaCrawler API server listening on http://0.0.0.0:${PORT}`);
});
