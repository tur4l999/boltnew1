#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPORT_DIR = join(__dirname, '../dist/figma-export');
const PORT = 5173;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Remove query parameters for file lookup
  const [pathname] = filePath.split('?');
  const fullPath = join(EXPORT_DIR, pathname);

  // Security check
  if (!fullPath.startsWith(EXPORT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!existsSync(fullPath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  try {
    const content = readFileSync(fullPath);
    const mimeType = getMimeType(fullPath);
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  } catch (error) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`🎨 Figma Export Preview Server running at:`);
  console.log(`   http://localhost:${PORT}/figma-export/`);
  console.log('');
  console.log('📋 Import Methods:');
  console.log('   🌐 Web: Copy the URL above into html.to.design plugin');
  console.log('   📁 File: Drag index.html into html.to.design plugin');
  console.log('   🔌 Extension: Use html.to.design Chrome extension on this page');
  console.log('');
  console.log('Press Ctrl+C to stop');
});