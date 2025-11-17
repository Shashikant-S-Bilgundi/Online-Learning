import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  Users,
  Video,
  MapPin,
  Info,
  PlayCircle,
} from "lucide-react";

const subjects = ["All", "Physics", "Chemistry", "Maths", "Biology", "English", "Coding"];
const tracks = ["All", "K-12", "JEE", "NEET", "Skills", "Kids"];
const modes = ["All", "Live", "Recorded"];

function toDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`);
}

export function Classes() {
  const [classes, setClasses] = useState([]);
  const [q, setQ] = useState("");
  const [subj, setSubj] = useState("All");
  const [trk, setTrk] = useState("All");
  const [mode, setMode] = useState("All");
  const [date, setDate] = useState("");
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get("https://online-learning-backend-xi.vercel.app/api/classes", {
          params: {
            q: q || undefined,
            subject: subj !== "All" ? subj : undefined,
            track: trk !== "All" ? trk : undefined,
            mode: mode !== "All" ? mode : undefined,
            date: date || undefined,
          },
        });

        const payload = Array.isArray(res.data)
          ? res.data
          : (res.data?.data || []);

        setClasses(payload);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q, subj, trk, mode, date]);

async function handleJoinClass(cls) {
    try {
      const rawStudent = localStorage.getItem("student");
      const token = localStorage.getItem("token");
      const student = rawStudent ? JSON.parse(rawStudent) : null;
      const userId = student?.id;
      if (!userId) {
        alert("Please login to join the class.");
        return;
      }
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      await axios.post(`https://online-learning-backend-xi.vercel.app/api/progress/${userId}/class-join`, {
        classId: cls._id || cls.id,
        title: cls.title,
        subject: cls.subject,
        track: cls.track,
        date: cls.date,
        start: cls.start,
        end: cls.end,
        mode: cls.mode,
        room: cls.room,
        thumbnail: cls.thumbnail
      });

      if (cls._id && cls.mode === "Live" && Number.isFinite(cls.seats)) {
        try {
          await axios.post(`https://online-learning-backend-xi.vercel.app/api/classes/${cls._id}/book`, { action: "book" });
        } catch (_) { /* ignore seat booking errors here */ }
      }

      window.dispatchEvent(new CustomEvent("progress:updated"));

      alert("Joined class successfully!");
    } catch (err) {
      console.error("Join class failed:", err);
      alert(err?.response?.data?.error || "Failed to join class.");
    }
  }

  return (
    <div>
      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0A2342 0%, #1b3d6b 60%, #2c5aa0 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <motion.h1
                className="display-5 fw-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Explore Classes
              </motion.h1>
              <motion.p
                className="lead mb-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                Join live sessions, watch recordings, and learn with top mentors across Maths, Science, Social Science, and more.
              </motion.p>
            </div>

            <div className="col-lg-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-0 shadow-lg"
              >
                <div className="card-body p-3 p-sm-4">
                  <div className="row g-2">
                    <div className="col-12 col-md-5">
                      <input
                        className="form-control"
                        placeholder="Search classes..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <select
                        className="form-select"
                        value={subj}
                        onChange={(e) => setSubj(e.target.value)}
                      >
                        {subjects.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <select
                        className="form-select"
                        value={trk}
                        onChange={(e) => setTrk(e.target.value)}
                      >
                        {tracks.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <select
                        className="form-select"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                      >
                        {modes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 col-md-4">
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="small text-secondary mt-2">
                    Showing <strong>{classes.length}</strong> classes
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading && <div className="text-secondary mb-3">Loading classes…</div>}
          {!loading && classes.length === 0 && (
            <div className="alert alert-info">No classes found.</div>
          )}

          <AnimatePresence mode="popLayout">
            <div className="row g-4">
              {classes.map((c, i) => (
                <motion.div
                  key={c._id || c.id || `${c.title}-${i}`}
                  className="col-12 col-sm-6 col-lg-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="position-relative">
                      <img
                        src={c.thumbnail || "https://via.placeholder.com/600x340?text=Class"}
                        alt={c.title}
                        className="card-img-top"
                        style={{ height: 170, objectFit: "cover" }}
                      />
                      {c.track && (
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                          {c.track}
                        </span>
                      )}
                      {c.mode && (
                        <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                          {c.mode}
                        </span>
                      )}
                      <button
                        className="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 d-flex align-items-center gap-1"
                        onClick={() => setActive(c)}
                      >
                        <PlayCircle size={16} /> View
                      </button>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        {c.subject && (
                          <span className="badge bg-warning text-dark">
                            {c.subject}
                          </span>
                        )}
                        <span className="small text-secondary d-flex align-items-center gap-1">
                          <Clock size={16} /> {c.start}–{c.end}
                        </span>
                      </div>

                      <h5 className="card-title mt-2 mb-2">{c.title}</h5>

                      <div className="d-flex align-items-center gap-3 text-secondary small mb-3">
                        <span className="d-inline-flex align-items-center gap-1">
                          <CalendarDays size={16} /> {c.date}
                        </span>
                        {(c.booked != null || c.seats != null) && (
                          <span className="d-inline-flex align-items-center gap-1">
                            <Users size={16} /> {c.booked ?? 0}/{c.seats ?? "∞"}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto d-grid gap-2">
                        <button className="btn btn-primary" onClick={() => setActive(c)}>
                          {c.mode === "Recorded" ? "Watch" : "Join / Details"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="modal-dialog modal-lg modal-dialog-centered"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{active.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setActive(null)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="ratio ratio-16x9">
                        <img
                          src={active.thumbnail || "https://via.placeholder.com/600x340?text=Class"}
                          alt={active.title}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <p className="text-secondary small mb-2">
                        {active.mode === "Recorded"
                          ? "Recorded session — watch at your own pace."
                          : "Live class with interactive problems, polls, and doubt-solving."}
                      </p>
                      <ul className="list-unstyled small mb-3">
                        <li className="mb-1 d-flex align-items-center gap-2">
                          <CalendarDays size={16} /> {active.date}
                        </li>
                        <li className="mb-1 d-flex align-items-center gap-2">
                          <Clock size={16} /> {active.start}–{active.end} IST
                        </li>
                        {active.room && (
                          <li className="mb-1 d-flex align-items-center gap-2">
                            <MapPin size={16} /> {active.room}
                          </li>
                        )}
                        {(active.booked != null || active.seats != null) && (
                          <li className="mb-1 d-flex align-items-center gap-2">
                            <Users size={16} /> {active.booked ?? 0}/{active.seats ?? "∞"} seats
                          </li>
                        )}
                        <li className="mb-1 d-flex align-items-center gap-2">
                          <Info size={16} /> Track: {active.track || "—"} • Subject: {active.subject || "—"}
                        </li>
                      </ul>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary" onClick={() => setActive(null)}>
                          Close
                        </button>
                        <button className="btn btn-primary" onClick={() => handleJoinClass(active)}>
                          <Video size={18} className="me-1" />
                          {active.mode === "Recorded" ? "Watch Recording" : "Join Live"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer small text-secondary">
                  Be ready 5 minutes before start time. Keep notebook & pen handy.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
