import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Hand, PlayCircle, BookOpen, CalendarDays, Trophy, CheckCircle2,
  Clock, Users, ChevronRight, Flame, Video
} from "lucide-react";

// --- Helpers (ADD THESE) ---
function toDateTime(dateStr, timeStr) {
  // expects e.g. "2025-11-10", "14:30"
  return new Date(`${dateStr}T${timeStr}:00`);
}

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, (target?.getTime?.() || 0) - now);
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { h, m, s: sec, done: diff <= 0 };
}

export function Dashboard() {
  const [streak, setStreak] = useState(5);
  const [name, setName] = useState("");
  const [continueLearning, setContinueLearning] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("student");
      if (raw) {
        const s = JSON.parse(raw);
        setName(s?.name || s?.fullName || s?.firstName || "");
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("https://online-learning-backend-xi.vercel.app/api/dashboards");
        if (res.data.success) {
          const data = res.data.data;
          setUpcoming(data.filter(d => d.mode));
          setContinueLearning(data.slice(0, 3));
          setAnnouncements([
            { id: "a1", title: "Diwali Scholarship Window Extended", when: "2h ago" },
            { id: "a2", title: "New Doubt Rooms — Get Answers in 15 mins", when: "Yesterday" },
            { id: "a3", title: "App Update: Revamped Practice Analytics", when: "2 days ago" }
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const nextLive = upcoming[0];
  const cd = useCountdown(nextLive ? toDateTime(nextLive.date, nextLive.start) : null);

  if (loading) return <div className="container py-5">Loading dashboard...</div>;

  return (
    <div>
      <section className="py-20"
        style={{ background: "linear-gradient(135deg, #0A2342 0%, #1b3d6b 50%, #2c5aa0 100%)", color: "white" }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="">
              <motion.h1 className="h2 py-4 d-flex h1-lg fw-bold mb-2" layout>
                Welcome back&nbsp;{ name ? "," : "!" } {name}&nbsp;{name ? "!" : ""}{" "}
                <Hand size={28} className="align-text-bottom ms-3 mt-1" aria-label="hi" />
              </motion.h1>
              
            </div>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="mb-0">Continue Learning</h5>
            <Link className="btn btn-outline-warning d-flex small" to="/courses">View all <ChevronRight /></Link>
          </div>
          <div className="row g-3">
            {continueLearning.map((c, i) => (
              <motion.div key={c._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="position-relative">
                    <img src={c.banner || "https://via.placeholder.com/300x150"} alt={c.title} className="card-img-top" style={{ height: 150, objectFit: "cover" }} />
                    <span className="badge bg-dark position-absolute bottom-0 start-0 m-2">{c.duration || "N/A"} left</span>
                    <button className="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 d-flex align-items-center gap-1">
                      <PlayCircle size={16} /> Resume
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="small text-secondary mb-1">{c.lastLesson || "Last lesson"}</div>
                    <h6 className="mb-2">{c.title}</h6>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row g-3">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0 fs-4 fw-bold">Upcoming Classes</h5>
                    <Link className=" btn btn-outline-primary d-flex small" to="/classes">View all <ChevronRight /></Link>
                  </div>
                  <div className="row g-3">
                    {upcoming.map(u => (
                      <UpcomingRow key={u._id} data={u} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UpcomingRow({ data }) {
  const start = toDateTime(data.date, data.start);
  const { h, m, s, done } = useCountdown(start);
  const ratio = data.seats ? Math.round((data.booked / data.seats) * 100) : 0;

  return (
    <div className="border rounded p-2 p-md-3 mb-2">
      <div className="d-flex gap-3">
        <div className="ratio ratio-16x9" style={{ width: 180 }}>
          <img src={data.banner || "https://via.placeholder.com/180x100"} alt={data.title} style={{ objectFit: "cover", borderRadius: 6 }} />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0">{data.title}</h6>
            <span className="badge bg-success-subtle text-success">{data.mode}</span>
          </div>
          <div className="small text-secondary mb-2">By {data.teacher}</div>
          <div className="d-flex flex-wrap gap-3 small text-secondary mb-2">
            <span className="d-inline-flex align-items-center gap-1"><CalendarDays size={16} /> {data.date}</span>
            <span className="d-inline-flex align-items-center gap-1"><Clock size={16} /> {data.start}–{data.end} IST</span>
            <span className="d-inline-flex align-items-center gap-1"><Users size={16} /> {data.booked}/{data.seats}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="progress flex-grow-1" style={{ height: 6 }}>
              <div className="progress-bar" style={{ width: `${ratio}%` }} />
            </div>
            <span className="small text-secondary">{ratio}% full</span>
          </div>
          {!done && (
            <div className="mt-2 small alert alert-info py-1 px-2 d-inline-flex align-items-center gap-2">
              <Video size={16} /> Starts in {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
