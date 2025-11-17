import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Briefcase, GraduationCap, Rocket, MapPin, Clock, Building2, Bookmark, BookmarkCheck, ExternalLink, Filter, Star } from "lucide-react";

/** ---------- Filter options ---------- */
const KINDS = ["All", "Employment", "Internship", "Development"];
const MODES = ["Any", "On-site", "Remote", "Hybrid"];
const SORTS = [
  { key: "recent", label: "Most Recent" },
  { key: "rating", label: "Highest Rated" },
  { key: "alpha", label: "A → Z" }
];

/** ---------- Main Component ---------- */
export function Opportunities() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("Any");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent");
  const [saved, setSaved] = useState(new Set());
  const [active, setActive] = useState(null);
  const [data, setData] = useState([]);

  /** Fetch opportunities from backend API */
  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await axios.get("http://localhost:3001/api/opportunities");
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      }
    }
    fetchOpportunities();
  }, []);

  /** Filtered and sorted data */
  const filtered = useMemo(() => {
    let out = data.filter(item => {
      if (tab !== "All" && item.kind !== tab) return false;
      if (mode !== "Any" && item.mode !== mode) return false;
      if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (q && !(`${item.title} ${item.company} ${item.tags?.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });

    if (sort === "rating") out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "alpha") out.sort((a, b) => a.title.localeCompare(b.title));
    else out.sort((a, b) => (b.posted || "").localeCompare(a.posted || ""));

    return out;
  }, [data, tab, q, mode, location, sort]);

  /** Toggle saved opportunities */
  const toggleSave = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #0A2342 0%, #1b3d6b 55%, #2c5aa0 100%)", color: "white" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <motion.h1 className="display-6 fw-bold mb-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                Find Your Next Opportunity
              </motion.h1>
              <motion.p className="lead mb-0" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
                Explore <strong>Jobs</strong>, <strong>Internships</strong>, and <strong>Skill Development</strong> programs—curated for growing learners.
              </motion.p>
            </div>
            <div className="col-lg-5">
              <motion.div className="card border-0 shadow-lg" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-12 col-md-5">
                      <input className="form-control" placeholder="Search roles, skills…" value={q} onChange={(e) => setQ(e.target.value)} />
                    </div>
                    <div className="col-6 col-md-3">
                      <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                        {MODES.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-6 col-md-2">
                      <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="col-12 col-md-2">
                      <input className="form-control" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                  </div>
                  <div className="small text-secondary mt-2 d-flex align-items-center gap-2">
                    <Filter size={16} /> Quick filter: choose Mode, sort by rating, or narrow by city.
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="container mt-4">
        <ul className="nav nav-pills mb-3">
          {KINDS.map(k => (
            <li className="nav-item" key={k}>
              <button className={`nav-link ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
                {k}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* GRID */}
      <section className="pb-5">
        <div className="container">
          <AnimatePresence mode="popLayout">
            <div className="row g-4">
              {filtered.map((item, i) => (
                <motion.div key={item.id} className="col-12 col-md-6 col-lg-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25, delay: i * 0.03 }}>
                  <Card item={item} saved={saved.has(item.id)} onSave={() => toggleSave(item.id)} onOpen={() => setActive(item)} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-light border d-flex align-items-center gap-2">
                    <Filter size={18} /> No results. Try clearing filters or changing location/mode.
                  </div>
                </div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.4)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="modal-dialog modal-lg modal-dialog-centered" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{active.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setActive(null)} />
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <img src={active.logo} alt={active.company} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12 }} />
                    <div>
                      <div className="fw-semibold">{active.company}</div>
                      <div className="small text-secondary d-flex align-items-center gap-2">
                        <MapPin size={16} /> {active.location} • {active.mode}
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary">{active.desc}</p>
                  <ul className="list-unstyled small">
                    <li className="mb-1 d-flex align-items-center gap-2"><Clock size={16} /> Posted: {active.posted}</li>
                    {active.salary && <li className="mb-1 d-flex align-items-center gap-2"><Briefcase size={16} /> Salary: {active.salary}</li>}
                    {active.stipend && <li className="mb-1 d-flex align-items-center gap-2"><GraduationCap size={16} /> Stipend: {active.stipend}</li>}
                    {active.fee && <li className="mb-1 d-flex align-items-center gap-2"><Rocket size={16} /> Program Fee: {active.fee}</li>}
                  </ul>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {active.tags?.map(t => <span key={t} className="badge bg-light text-dark border">{t}</span>)}
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <div className="small text-secondary d-flex align-items-center gap-2"><Star size={16} className="text-warning" /> {active.rating} rated</div>
                  <div className="d-flex gap-2">
                    <a href={active.link} className="btn btn-outline-secondary" target="_blank" rel="noreferrer">Company <ExternalLink size={16} className="ms-1" /></a>
                    <button className="btn btn-primary">Apply Now</button>
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

/** ---------- Card Component ---------- */
function Card({ item, saved, onSave, onOpen }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-start gap-2">
            <img src={item.logo} alt={item.company} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 10 }} />
            <div>
              <span className="badge bg-primary-subtle text-primary me-2">{item.kind}</span>
              <span className="badge bg-secondary-subtle text-secondary">{item.mode}</span>
              <h6 className="mt-2 mb-1">{item.title}</h6>
              <div className="small text-secondary d-flex align-items-center flex-wrap gap-2">
                <Building2 size={16} /> {item.company} <span className="text-secondary">•</span> <MapPin size={16} /> {item.location}
              </div>
            </div>
          </div>
          <button className={`btn btn-sm ${saved ? "btn-success" : "btn-outline-secondary"}`} onClick={onSave} aria-label="Save opportunity" title={saved ? "Saved" : "Save"}>
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
        <p className="text-secondary small mt-3 mb-2" style={{ minHeight: 48 }}>{item.desc}</p>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {item.tags?.slice(0, 4).map(t => <span key={t} className="badge bg-light text-dark border">{t}</span>)}
        </div>
        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="small text-secondary d-flex align-items-center gap-2"><Clock size={16} /> {item.posted}</div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={onOpen}>Details</button>
            <a className="btn btn-primary" href={item.link} target="_blank" rel="noreferrer">Apply</a>
          </div>
        </div>
      </div>
    </div>
  );
}
