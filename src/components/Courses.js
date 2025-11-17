import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Star, Clock, PlayCircle, TrendingUp } from "lucide-react";

const categories = ["All", "Science", "Maths", "Social", "English", "Kannada", "Hindi"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const sorters = [
  { key: "popular", label: "Most Popular" },
  { key: "rating", label: "Highest Rated" },
  { key: "new", label: "Newest" },
];

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");
  const [sort, setSort] = useState("popular");
  const [active, setActive] = useState(null);

async function handleEnroll(course) {
  try {
    const rawStudent = localStorage.getItem("student");
    const token = localStorage.getItem("token");
    const student = rawStudent ? JSON.parse(rawStudent) : null;
    const userId = student?.id;

    if (!userId) {
      alert("Please login to enroll.");
      return;
    }
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    await axios.post(`https://online-learning-backend-xi.vercel.app/api/progress/${userId}/course-enroll`, {
      courseId: course._id || course.id,         
      title: course.title,
      category: course.category,
      level: course.level,
      thumbnail: course.thumbnail
    });

    window.dispatchEvent(new CustomEvent("progress:updated"));
    alert("Enrolled successfully!");
  } catch (err) {
    console.error("Enroll failed:", err);
    alert(err?.response?.data?.error || "Failed to enroll.");
  }
}

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get("https://online-learning-backend-xi.vercel.app/api/courses", {
          params: { q, category: cat, level: lvl, sort },
        });
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    }
    fetchCourses();
  }, [q, cat, lvl, sort]);

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
                Explore Courses
              </motion.h1>
              <motion.p
                className="lead mb-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                Live classes, interactive videos, and adaptive practice — learn
                your way across K-12, JEE, NEET, English, Coding, and more.
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
                        placeholder="Search courses..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <select
                        className="form-select"
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6 col-md-3">
                      <select
                        className="form-select"
                        value={lvl}
                        onChange={(e) => setLvl(e.target.value)}
                      >
                        {levels.map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4 mt-2">
                      <select
                        className="form-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        {sorters.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="small text-secondary mt-2">
                    Showing <strong>{courses.length}</strong> courses
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <AnimatePresence mode="popLayout">
            <div className="row g-4">
              {courses.map((c, i) => (
                <motion.div
                  key={c._id}
                  className="col-12 col-sm-6 col-lg-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="position-relative">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="card-img-top"
                        style={{ height: 170, objectFit: "cover" }}
                      />
                      <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                        {c.tag}
                      </span>
                      <button
                        className="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 d-flex align-items-center gap-1"
                        onClick={() => setActive(c)}
                      >
                        <PlayCircle size={16} /> Preview
                      </button>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <span className="badge bg-primary-subtle text-primary">
                          {c.category}
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {c.level}
                        </span>
                      </div>
                      <h5 className="card-title mt-2 mb-2">{c.title}</h5>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Stars rating={c.rating} />
                        <span className="small text-secondary">{c.rating}</span>
                        <span className="small text-secondary">•</span>
                        <span className="small text-secondary">
                          {c.students?.toLocaleString() || 0} learners
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-3 text-secondary small mb-3">
                        <span className="d-inline-flex align-items-center gap-1">
                          <Clock size={16} /> {c.duration}
                        </span>
                        <span className="d-inline-flex align-items-center gap-1">
                          <TrendingUp size={16} /> {c.lessons} lessons
                        </span>
                      </div>

                      <div className="mt-auto d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => setActive(c)}
                        >
                          View Details
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
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="ratio ratio-16x9 mb-3">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Course preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="mb-2 text-secondary">
                    Learn with interactive videos, live doubt-solving, and
                    chapter-wise tests. Track your progress with analytics.
                  </p>
                  <ul className="small text-secondary mb-0">
                    <li>Video lessons & quizzes</li>
                    <li>Live mentor support</li>
                    <li>Practice sets with solutions</li>
                  </ul>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <div className="small text-secondary d-flex align-items-center gap-2">
                    <Stars rating={active.rating} /> {active.rating} •{" "}
                    {active.students?.toLocaleString() || 0} learners
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setActive(null)}
                    >
                      Close
                    </button>
                    <button className="btn btn-primary" onClick={() => handleEnroll(active)}>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="d-inline-flex align-items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`f${i}`}
          size={16}
          className="text-warning me-1"
          fill="currentColor"
        />
      ))}
      {half && (
        <Star
          size={16}
          className="text-warning me-1"
          fill="currentColor"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      )}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} size={16} className="text-secondary me-1" />
      ))}
    </div>
  );
}
