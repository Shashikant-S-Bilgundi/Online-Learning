import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, Languages, BookOpen, Video, Clock, Award, Users, CalendarDays, CheckCircle2
} from "lucide-react";

/* ---------- Filters ---------- */
const SUBJECTS = ["All", "Physics", "Chemistry", "Biology", "Maths", "English"];
const SORTERS = [
  { key: "popular", label: "Most Sessions" },
  { key: "rating", label: "Highest Rated" },
  { key: "priceLow", label: "Price: Low to High" },
  { key: "priceHigh", label: "Price: High to Low" },
];

/* ---------- Component ---------- */
export function Mentor() {
  const [q, setQ] = useState("");
  const [subj, setSubj] = useState("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("popular");
  const [active, setActive] = useState(null); // booking modal
  const [mentors, setMentors] = useState([]);

  // Fetch mentors from backend using axios
  useEffect(() => {
    async function fetchMentors() {
      try {
        const { data } = await axios.get("http://localhost:3001/api/mentors");
        if (data.success) setMentors(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMentors();
  }, []);

  const filtered = useMemo(() => {
    let out = mentors.filter(m => {
      const matchQ = !q.trim() ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.subjects.join(" ").toLowerCase().includes(q.toLowerCase());
      const matchSub = subj === "All" || m.subjects.join(" ").toLowerCase().includes(subj.toLowerCase());
      const matchCity = city === "All" || m.city === city;
      return matchQ && matchSub && matchCity;
    });

    switch (sort) {
      case "rating": out = out.sort((a, b) => b.rating - a.rating); break;
      case "priceLow": out = out.sort((a, b) => a.price - b.price); break;
      case "priceHigh": out = out.sort((a, b) => b.price - a.price); break;
      default: out = out.sort((a, b) => b.sessions - a.sessions);
    }
    return out;
  }, [mentors, q, subj, city, sort]);

  return (
    <div>
      {/* Hero / Filters */}
      <section className="py-5" style={{ background: "linear-gradient(135deg,#0A2342,#1b3d6b,#2c5aa0)", color: "white" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <motion.h1 className="display-6 fw-bold mb-1" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                Find your perfect mentor
              </motion.h1>
              <motion.p className="mb-0" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .05 }}>
                1:1 guidance, exam strategies, and doubt-solving—learn faster with experts.
              </motion.p>
            </div>
            <div className="col-lg-5">
              <motion.div className="card border-0 shadow-lg" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="card-body p-3 p-sm-4">
                  <div className="row g-2">
                    <div className="col-12 col-md-5">
                      <input className="form-control" placeholder="Search mentor / topic…" value={q} onChange={e => setQ(e.target.value)} />
                    </div>
                    <div className="col-6 col-md-3">
                      <select className="form-select" value={subj} onChange={e => setSubj(e.target.value)}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                   
                    <div className="col-12 col-md-2">
                      <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                        {SORTERS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="small mt-2 opacity-75">
                    Showing <strong>{filtered.length}</strong> of {mentors.length} mentors
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Grid */}
      <section className="py-5">
        <div className="container">
          <AnimatePresence mode="popLayout">
            <div className="row g-4">
              {filtered.map((m, i) => (
                <motion.div
                  key={m._id || m.id}
                  className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="position-relative">
                      <img src={m.photo} alt={m.name} className="card-img-top" style={{ height: 210, objectFit: "cover" }} />
                      {m.tag && <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">{m.tag}</span>}
                      {m.availability && (
                        <span className="badge bg-success-subtle text-success position-absolute top-0 end-0 m-2">
                          <CheckCircle2 size={14} className="me-1" /> {m.availability}
                        </span>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <h5 className="card-title mb-1">{m.name}</h5>
                          <div className="small text-secondary d-flex align-items-center gap-2">
                            <Stars rating={m.rating} />
                            <span>{m.rating} ({m.reviews})</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">₹{m.price}</div>
                          <div className="small text-secondary">per 45 min</div>
                        </div>
                      </div>

                      <div className="mt-2 small text-secondary">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <BookOpen size={16} /> {m.subjects.join(" • ")}
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Languages size={16} /> {m.languages.join(", ")}
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <MapPin size={16} /> {m.city}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Users size={16} /> {m.sessions?.toLocaleString()} sessions
                        </div>
                      </div>

                      <div className="mt-3 d-flex flex-wrap gap-2">
                        <span className="badge bg-primary-subtle text-primary"><Video size={14} className="me-1" /> Live 1:1</span>
                        <span className="badge bg-secondary-subtle text-secondary"><CalendarDays size={14} className="me-1" /> Slots</span>
                        <span className="badge bg-info-subtle text-info"><Award size={14} className="me-1" /> Verified</span>
                      </div>

                      <div className="mt-auto d-grid gap-2 pt-3">
                        <button className="btn btn-primary" onClick={() => setActive(m)}>
                          Book a Session
                        </button>
                        <button className="btn btn-outline-secondary">View Profile</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {active && <BookingModal mentor={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="d-inline-flex align-items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={16} className="text-warning me-1" fill="currentColor" />
      ))}
      {half && <Star size={16} className="text-warning me-1" fill="currentColor" style={{ clipPath: "inset(0 50% 0 0)" }} />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} size={16} className="text-secondary me-1" />
      ))}
    </span>
  );
}

function BookingModal({ mentor, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [dur, setDur] = useState(45);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  async function submitBooking(e) {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3001/api/mentors/book", {
        mentorId: mentor._id || mentor.id,
        date,
        time,
        duration: dur,
        userEmail: "user@example.com", // replace with real logged-in user email
      });

      if (data.success) {

      const rawStudent = localStorage.getItem("student");
      const token = localStorage.getItem("token");
      const student = rawStudent ? JSON.parse(rawStudent) : null;
      const userId = student?.id;
      if (userId) {
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        await axios.post(`http://localhost:3001/api/progress/${userId}/mentor-book`, {
          mentorId: mentor._id || mentor.id,
          mentorName: mentor.name,
          subjects: mentor.subjects,
          languages: mentor.languages,
          city: mentor.city,
          price: mentor.price,
          date,
          time,
          duration: dur,
          mode: "Live 1:1",
          photo: mentor.photo
        });
        // notify MyProgress to refresh immediately
        window.dispatchEvent(new CustomEvent("progress:updated"));
      }

        setOk(true);
        setTimeout(() => onClose(), 1000);
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,.45)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-dialog modal-dialog-centered"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book a Session — {mentor.name}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={submitBooking}>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src={mentor.photo} alt={mentor.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
                <div className="small">
                  <div className="fw-semibold">{mentor.name}</div>
                  <div className="text-secondary">{mentor.subjects.join(" • ")}</div>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Duration</label>
                  <select className="form-select" value={dur} onChange={e => setDur(Number(e.target.value))}>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>
              <div className="alert alert-secondary mt-3 small d-flex align-items-center gap-2 mb-0">
                <Clock size={16} /> ₹{mentor.price} per {dur} min • Mode: Live 1:1
              </div>
            </div>
            <div className="modal-footer">
              {!ok ? (
                <>
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Booking…" : "Confirm Booking"}
                  </button>
                </>
              ) : (
                <div className="text-success d-flex align-items-center gap-2">
                  <CheckCircle2 /> Booked! Check your email for the invite.
                </div>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
