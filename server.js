// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Fungsi untuk sanitize string
const sanitizeString = (str) => {
  return str
    ?.replace(/[^a-zA-Z0-9-_\s]/g, '')
    .trim()
    .substring(0, 200) || '';
};

// Route untuk handle semua request
app.get('*', (req, res) => {
  // Ambil data dari query params
  const { title, description, image } = req.query;

  const sanitizedTitle = sanitizeString(title);
  const sanitizedDesc = sanitizeString(description);
  const sanitizedImage = image || '';

  // HTML template dengan meta tags
  const html = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <!-- Basic Meta Tags -->
        <title>${sanitizedTitle}</title>
        <meta name="description" content="${sanitizedDesc}" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${sanitizedTitle}" />
        <meta property="og:description" content="${sanitizedDesc}" />
        <meta property="og:image" content="${sanitizedImage}" />
        <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
        <meta property="og:site_name" content="Digital Pesantren" />
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${sanitizedTitle}" />
        <meta name="twitter:description" content="${sanitizedDesc}" />
        <meta name="twitter:image" content="${sanitizedImage}" />
        
        <!-- React app root -->
        <div id="root"></div>
      </head>
      <body>
        <script src="/static/js/main.js"></script>
      </body>
    </html>
  `;

  res.send(html);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});