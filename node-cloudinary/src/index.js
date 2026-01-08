const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const { configureCloudinaryFromEnv, uploadBuffer } = require('./upload');
const cors = require('cors');
const path = require('path');

dotenv.config();
configureCloudinaryFromEnv();

const app = express();
const PORT = process.env.PORT || 3004;

// Allow CORS for demo/testing so a static dev server (e.g. Live Server on
// port 5500) can POST to the API. In production narrow this origin.
app.use(cors());

// Serve the static frontend so the demo runs same-origin (optional).
// If you prefer to open the frontend via a different server, set the
// frontend to post to the API root (defaults to http://localhost:3004).
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Use memory storage so we don't write files to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

// POST /upload - multipart/form-data: field `file` (single)
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.warn('Upload attempt with no file');
    return res.status(400).json({ error: 'file is required' });
  }

  console.log('Upload request:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  try {
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'node-cloudinary-uploads';
    const opts = { folder };
    const result = await uploadBuffer(req.file.buffer, opts);
    console.log('Cloudinary upload result:', {
      public_id: result && result.public_id,
      url: result && result.secure_url,
    });
    // ensure we always return JSON
    return res.json({ ok: true, result });
  } catch (err) {
    console.error('upload error', err && err.message ? err.message : err);
    const msg = err && err.message ? err.message : 'Upload failed';
    return res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => console.log(`Cloudinary upload example listening on ${PORT}`));
