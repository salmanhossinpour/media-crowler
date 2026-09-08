import express from 'express';
import path from 'path';
import { handleApiRequest } from './server/apiHandler.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Raw body parser for POST /api/crawler/scrape
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle API requests
app.all('/api*', (req, res) => {
  handleApiRequest(req, res);
});

// Serve frontend static build
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MediaCrawler API server listening on http://0.0.0.0:${PORT}`);
});
