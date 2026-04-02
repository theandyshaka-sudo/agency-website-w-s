import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import './Examples.css';

export default function Examples() {
  const { isAdmin, token } = useAuth();

  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [uploading,      setUploading]      = useState(false);
  const [uploadError,    setUploadError]    = useState('');
  const [uploadSuccess,  setUploadSuccess]  = useState('');
  const [form,           setForm]           = useState({ title: '', description: '' });
  const [imageFile,      setImageFile]      = useState(null);
  const [previewSrc,     setPreviewSrc]     = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`);
      setItems(await res.json());
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewSrc(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!form.title.trim()) return setUploadError('Please enter a project title.');
    if (!imageFile)         return setUploadError('Please select an image file.');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('description', form.description);
      fd.append('image',       imageFile);

      const res = await fetch(`${API_BASE}/api/portfolio`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      setItems((prev) => [data, ...prev]);
      setForm({ title: '', description: '' });
      setImageFile(null);
      setPreviewSrc(null);
      if (fileRef.current) fileRef.current.value = '';
      setUploadSuccess('Portfolio item added successfully!');
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this portfolio item? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert('Failed to delete item. Please try again.');
    }
  }

  return (
    <div className="examples-page">

      {/* Hero */}
      <div className="examples-hero">
        <div className="container">
          <h1>Our <span>Portfolio</span></h1>
          <p>A showcase of websites we've built for small businesses just like yours.</p>
        </div>
      </div>

      <div className="container examples-body">

        {/* Admin upload panel */}
        {isAdmin && (
          <section className="admin-panel">
            <div className="admin-panel-header">
              <div className="admin-crown">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v2H2zM12 2L2 7l3.5 10h13L22 7z"/></svg>
              </div>
              <div>
                <h3>Admin — Add Portfolio Example</h3>
                <p>Upload a screenshot or project image</p>
              </div>
            </div>

            {uploadSuccess && <div className="alert alert-success">{uploadSuccess}</div>}
            {uploadError   && <div className="alert alert-error">{uploadError}</div>}

            <form onSubmit={handleUpload} className="upload-form" encType="multipart/form-data">
              <div className="upload-form-grid">
                <div className="upload-fields">
                  <div className="form-group">
                    <label htmlFor="pf-title">Project Title *</label>
                    <input
                      id="pf-title"
                      type="text"
                      placeholder="e.g., Smith's Bakery Website"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf-desc">Short Description</label>
                    <input
                      id="pf-desc"
                      type="text"
                      placeholder="Brief description of the project (optional)"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf-img">Screenshot / Image *</label>
                    <input
                      id="pf-img"
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin-icon"><path d="M21 12a9 9 0 11-6-8.485"/></svg>
                        Uploading…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Add to Portfolio
                      </>
                    )}
                  </button>
                </div>

                {previewSrc && (
                  <div className="upload-preview-box">
                    <img src={previewSrc} alt="Preview" />
                    <span className="preview-label">Preview</span>
                  </div>
                )}
              </div>
            </form>
          </section>
        )}

        {/* Portfolio grid */}
        {loading ? (
          <div className="port-loading"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="port-empty">
            <div className="port-empty-icon">🎨</div>
            <h3>{isAdmin ? 'No items yet' : 'Portfolio Coming Soon!'}</h3>
            <p>
              {isAdmin
                ? 'Use the admin panel above to add your first portfolio example.'
                : "We're currently putting together our portfolio showcase. Check back soon to see examples of our work, or contact us to discuss your project!"}
            </p>
            {!isAdmin && (
              <div className="port-empty-actions">
                <a href="tel:3473459162" className="btn btn-primary">Call Us Now</a>
                <a href="https://mail.google.com/mail/?view=cm&to=theandyshaka@gmail.com" target="_blank" rel="noreferrer" className="btn btn-outline-dark">Email Us</a>
              </div>
            )}
          </div>
        ) : (
          <div className="portfolio-grid">
            {items.map((item) => (
              <article className="portfolio-card" key={item.id}>
                <div className="portfolio-img-wrap">
                  <img src={`${API_BASE}${item.image_url}`} alt={item.title} loading="lazy" />
                  <div className="portfolio-overlay">
                    <span className="portfolio-overlay-label">
                      {item.title}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      className="port-delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete this item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  )}
                </div>
                <div className="portfolio-info">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
