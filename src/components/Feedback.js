import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Send, CheckCircle2, AlertTriangle, Image as ImageIcon, Loader2,
} from "lucide-react";
import axios from "axios";

const MAX_LEN = 600;
const CATEGORIES = ["Platform", "Courses", "Classes", "Payments", "App Performance", "Other"];
const QUICK_TAGS = ["Maths", "Science", "Social", "English", "Speed", "Feature request"];

export function Feedback() {
  const [category, setCategory] = useState("Platform");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [contactBack, setContactBack] = useState(true);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const left = MAX_LEN - message.length;
  const disabledContact = anonymous || !contactBack;

  useEffect(() => {
    if (anonymous) {
      setName("");
      setEmail("");
    }
  }, [anonymous]);

  function toggleTag(t) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  const errors = useMemo(() => {
  const e = {};
  if (!message.trim()) e.message = "Please write a short description.";
  if (message.length > MAX_LEN) e.messageLen = "Message is too long.";

  if (!anonymous && contactBack) {
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) e.email = "Enter a valid email.";
  }

  return e;
}, [message, anonymous, contactBack, name, email]);


  async function handleSubmit(e) {
    e.preventDefault();
    if (Object.keys(errors).length) {
      setToast({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("rating", rating);
      formData.append("tags", JSON.stringify(tags));
      formData.append("message", message.trim());
      formData.append("contactBack", contactBack);
      formData.append("anonymous", anonymous);
      formData.append("name", anonymous ? "" : name.trim());
      formData.append("email", anonymous ? "" : email.trim());
      if (file) formData.append("screenshot", file);

      const res = await axios.post("http://localhost:3001/api/feedbacks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setToast({ type: "success", text: "Thanks! Your feedback was submitted." });
        setCategory("Platform");
        setRating(5);
        setHoverRating(0);
        setTags([]);
        setMessage("");
        setName("");
        setEmail("");
        setAnonymous(false);
        setContactBack(true);
        setFile(null);
      } else {
        setToast({ type: "error", text: res.data.message || "Failed to submit feedback." });
      }
    } catch (err) {
      console.error("Error:", err);
      setToast({ type: "error", text: "Server error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-4">
      <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-3">
        <h1 className="h3 mb-1">We’d love your feedback</h1>
        <div className="text-secondary">Help us improve your learning experience.</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card border-0 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-lg-8">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label d-flex justify-content-between">
                      <span>Your rating</span>
                      <span className="text-secondary small">{rating}/5</span>
                    </label>
                    <StarBar
                      value={hoverRating || rating}
                      onHover={setHoverRating}
                      onSelect={v => { setRating(v); setHoverRating(0); }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Quick tags (optional)</label>
                  <div className="d-flex flex-wrap gap-2">
                    {QUICK_TAGS.map(t => (
                      <button
                        type="button"
                        key={t}
                        className={`btn btn-sm ${tags.includes(t) ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => toggleTag(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Your message</label>
                  <textarea
                    rows={6}
                    className={`form-control ${errors.message || errors.messageLen ? "is-invalid" : ""}`}
                    placeholder="Tell us what worked well or what should improve."
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, MAX_LEN))}
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <div className="invalid-feedback d-block">
                      {errors.message ? errors.message : errors.messageLen ? errors.messageLen : ""}
                    </div>
                    <div className={`small ${left < 50 ? "text-danger" : "text-secondary"}`}>{left} characters left</div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <ImageIcon size={18} /> Attach screenshot (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  {file && (
                    <div className="form-text">
                      Selected: <strong>{file.name}</strong> ({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="border rounded p-3">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={contactBack}
                      onChange={e => setContactBack(e.target.checked)}
                    />
                    <label className="form-check-label">I’m okay with a follow-up</label>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={anonymous}
                      onChange={e => setAnonymous(e.target.checked)}
                    />
                    <label className="form-check-label">Send anonymously</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your name</label>
                    <input
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Optional if anonymous"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={disabledContact}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="we’ll only use this for follow-up"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={disabledContact}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="me-1" size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send className="me-1" size={18} />}
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              className={`toast align-items-center text-bg-${toast.type === "success" ? "success" : "danger"} show`}
              role="alert"
            >
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2">
                  {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  {toast.text}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StarBar({ value = 0, onHover = () => {}, onSelect = () => {} }) {
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onMouseEnter={() => onHover(v)}
          onMouseLeave={() => onHover(0)}
          onClick={() => onSelect(v)}
          className="btn p-0"
          title={`${v} star`}
          style={{ lineHeight: 0 }}
        >
          <Star size={22} className={v <= value ? "text-warning" : "text-secondary"} fill={v <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}
