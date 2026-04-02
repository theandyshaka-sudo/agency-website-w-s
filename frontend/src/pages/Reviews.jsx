import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import './Reviews.css';

// ── Star rating input component ───────────────────────────────────────────────
function StarInput({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  return (
    <div className="star-input-group">
      <div className="star-input" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn${star <= (hover || rating) ? ' lit' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      {(hover || rating) > 0 && (
        <span className="star-label">{labels[hover || rating]}</span>
      )}
    </div>
  );
}

// ── Star display component ────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  return (
    <div className="star-display" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'star-on' : 'star-off'}>★</span>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function avatarLetter(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Reviews() {
  const { isAdmin, token } = useAuth();

  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const [form, setForm] = useState({
    name: '', business_name: '', rating: 0, review_text: '',
  });

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews() {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`);
      setReviews(await res.json());
    } catch {
      // silently fail — grid will just be empty
    } finally {
      setLoading(false);
    }
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim())      return setError('Please enter your name.');
    if (!form.rating)           return setError('Please select a star rating.');
    if (!form.review_text.trim()) return setError('Please write your review.');

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setReviews((prev) => [data, ...prev]);
      setForm({ name: '', business_name: '', rating: 0, review_text: '' });
      setSuccess('Thank you! Your review has been posted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Failed to delete review. Please try again.');
    }
  }

  // Average rating
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="reviews-page">

      {/* Hero */}
      <div className="reviews-hero">
        <div className="container">
          <h1>Client <span>Reviews</span></h1>
          <p>Real feedback from real clients. Share your experience with W&A Digital.</p>
          {avg && (
            <div className="reviews-hero-rating">
              <StarDisplay rating={Math.round(parseFloat(avg))} />
              <span className="avg-num">{avg}</span>
              <span className="avg-sub">average · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="container reviews-body">

        {/* Submit form */}
        <aside className="review-form-aside">
          <div className="review-form-card">
            <h2>Share Your Experience</h2>
            <p>Worked with us? We'd love your feedback!</p>

            {success && <div className="alert alert-success">{success}</div>}
            {error   && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rv-name">Your Name *</label>
                  <input
                    id="rv-name"
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rv-biz">Business Name</label>
                  <input
                    id="rv-biz"
                    type="text"
                    placeholder="Smith's Bakery (optional)"
                    value={form.business_name}
                    onChange={(e) => setField('business_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Rating *</label>
                <StarInput rating={form.rating} onChange={(r) => setField('rating', r)} />
              </div>

              <div className="form-group">
                <label htmlFor="rv-text">Your Review *</label>
                <textarea
                  id="rv-text"
                  rows={5}
                  placeholder="Tell us about your experience working with W&A Digital..."
                  value={form.review_text}
                  onChange={(e) => setField('review_text', e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary submit-review-btn" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post Review'}
              </button>
            </form>
          </div>
        </aside>

        {/* Reviews grid */}
        <div className="reviews-display">
          <div className="reviews-display-header">
            <h2>What Our Clients Say</h2>
            {reviews.length > 0 && (
              <span className="reviews-badge">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="reviews-loading"><div className="spinner" /></div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty">
              <div className="reviews-empty-icon">⭐</div>
              <h3>No reviews yet</h3>
              <p>Be the first to share your experience! Use the form to leave a review.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((rev) => (
                <article className="review-card" key={rev.id}>
                  <div className="review-card-top">
                    <div className="review-author">
                      <div className="review-avatar" aria-hidden="true">
                        {avatarLetter(rev.name)}
                      </div>
                      <div className="review-author-meta">
                        <strong>{rev.name}</strong>
                        {rev.business_name && (
                          <span className="review-biz">{rev.business_name}</span>
                        )}
                      </div>
                    </div>
                    <StarDisplay rating={rev.rating} />
                  </div>
                  <blockquote className="review-body">
                    "{rev.review_text}"
                  </blockquote>
                  <div className="review-card-foot">
                    <time className="review-date">{formatDate(rev.created_at)}</time>
                    {isAdmin && (
                      <button
                        className="review-delete-btn"
                        onClick={() => handleDelete(rev.id)}
                        title="Delete this review"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
