#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  try {
    const root = path.resolve(process.cwd(), 'test-results');
    if (!fs.existsSync(root)) {
      console.error('No test-results folder at', root);
      process.exit(1);
    }

    const images = [];
    function walk(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const p = path.join(dir, item);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) walk(p);
        else if (/\-full\.(png|jpe?g)$/i.test(p)) images.push(p);
      }
    }
    walk(root);

    if (images.length === 0) {
      console.error('No screenshots found matching "-full.png" under test-results.');
      process.exit(1);
    }

    const order = ['desktop','tablet','mobile'];
    images.sort((a,b) => {
      const ia = order.findIndex(o => a.toLowerCase().includes(o));
      const ib = order.findIndex(o => b.toLowerCase().includes(o));
      return ia - ib;
    });

    const parts = images.map(p => {
      const data = fs.readFileSync(p);
      const ext = path.extname(p).slice(1) || 'png';
      const b64 = data.toString('base64');
      return `<div class="page"><img src="data:image/${ext};base64,${b64}" alt="${path.basename(p)}"></div>`;
    });

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Screenshots PDF</title><style>@page{size:A4;margin:10mm}body{margin:0;font-family:Arial,Helvetica,sans-serif}.page{page-break-after:always;display:flex;align-items:center;justify-content:center;height:297mm}img{max-width:100%;max-height:100%;object-fit:contain}</style></head><body>${parts.join('')}</body></html>`;

    const outDir = path.resolve(process.cwd(), 'artifacts');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPdf = path.join(outDir, 'screenshots.pdf');

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: outPdf, format: 'A4', printBackground: true });
    await browser.close();

    console.log('PDF generated:', outPdf);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
