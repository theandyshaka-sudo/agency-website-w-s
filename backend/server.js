const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Database setup (lowdb — pure JS, no compilation needed) ─────────────────
const adapter = new FileSync(path.join(__dirname, 'agency-db.json'));
const db = low(adapter);

// Seed default structure if the file is new / empty
db.defaults({ reviews: [], portfolio: [] }).write();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// ── Admin session store (in-memory) ─────────────────────────────────────────
const validTokens = new Set();
const ADMIN_PASSWORD = 'wisdomandy1234rocky';

// ── Multer (file uploads) ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
             && allowed.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg).'));
  },
});

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice(7);
  if (!validTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  next();
}

// ── Auth routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const token = uuidv4();
  validTokens.add(token);
  res.json({ token });
});

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) validTokens.delete(auth.slice(7));
  res.json({ success: true });
});

app.get('/api/auth/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.json({ valid: false });
  res.json({ valid: validTokens.has(auth.slice(7)) });
});

// ── Reviews routes ───────────────────────────────────────────────────────────
app.get('/api/reviews', (_req, res) => {
  const reviews = db.get('reviews').value();
  // Newest first
  const sorted = reviews.slice().sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  res.json(sorted);
});

app.post('/api/reviews', (req, res) => {
  const { name, business_name, rating, review_text } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }
  if (!review_text || !review_text.trim()) {
    return res.status(400).json({ error: 'Review text is required.' });
  }

  const review = {
    id:            uuidv4(),
    name:          name.trim(),
    business_name: business_name ? business_name.trim() : null,
    rating:        Number(rating),
    review_text:   review_text.trim(),
    created_at:    new Date().toISOString(),
  };

  db.get('reviews').push(review).write();
  res.status(201).json(review);
});

app.delete('/api/reviews/:id', requireAdmin, (req, res) => {
  const existing = db.get('reviews').find({ id: req.params.id }).value();
  if (!existing) {
    return res.status(404).json({ error: 'Review not found.' });
  }
  db.get('reviews').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

// ── Portfolio routes ─────────────────────────────────────────────────────────
app.get('/api/portfolio', (_req, res) => {
  const items = db.get('portfolio').value();
  // Newest first
  const sorted = items.slice().sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  res.json(sorted);
});

app.post('/api/portfolio', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'An image file is required.' });
  }

  const { title, description } = req.body;
  if (!title || !title.trim()) {
    // Remove the already-uploaded file since we're rejecting the request
    fs.unlink(path.join(uploadsDir, req.file.filename), () => {});
    return res.status(400).json({ error: 'Title is required.' });
  }

  const item = {
    id:          uuidv4(),
    title:       title.trim(),
    description: description ? description.trim() : null,
    image_url:   `/uploads/${req.file.filename}`,
    created_at:  new Date().toISOString(),
  };

  db.get('portfolio').push(item).write();
  res.status(201).json(item);
});

app.delete('/api/portfolio/:id', requireAdmin, (req, res) => {
  const item = db.get('portfolio').find({ id: req.params.id }).value();
  if (!item) {
    return res.status(404).json({ error: 'Portfolio item not found.' });
  }

  // Delete the image file from disk using path.basename to avoid
  // cross-platform issues with leading slashes in the stored URL
  const filePath = path.join(uploadsDir, path.basename(item.image_url));
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Could not delete image file:', err.message);
    });
  }

  db.get('portfolio').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

// ── Multer error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message.includes('image')) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  W&A Digital API running at http://localhost:${PORT}\n`);
});
