import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  School, Landmark, HandCoins, Gift, MapPin, Clock, Users, Bookmark, BookmarkCheck,
  ExternalLink, Filter, CalendarDays, Info, Sparkles, ShieldCheck, CheckCircle2
} from "lucide-react";
import axios from "axios";

/** ---------- Demo data (replace with your API later) ---------- */
const DATA = [];

const TABS = ["All", "Scholarship", "Loan", "Incentive"];
const SOURCES = ["Any", "Government", "NGO"];
const STATES = ["Any", "All India", "Karnataka", "Multi-state"];
const SORTS = [
  { key: "deadline", label: "Closest Deadline" },
  { key: "amount", label: "Highest Amount" },
  { key: "alpha", label: "A → Z" }
];

/** ---------- Utilities ---------- */
function daysLeft(deadline) {
  if (!deadline || deadline.toLowerCase() === "rolling") return null;
  const end = new Date(deadline + "T23:59:59");
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}
function amountValue(amountStr) {
  // crude numeric value for sort; looks for the first number
  const n = (amountStr || "").replace(/[^\d.]/g, "");
  return Number(n || 0);
}

/** ---------- Component ---------- */
export function Grants() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [source, setSource] = useState("Any");
  const [state, setState] = useState("Any");
  const [sort, setSort] = useState("deadline");
  const [saved, setSaved] = useState(new Set());
  const [active, setActive] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
  axios
    .get("http://localhost:3001/api/grants", {
      params: { kind: tab, source, state, q, sort },
    })
    .then((res) => setData(res.data.data || []))
    .catch((err) => console.error("Error fetching grants:", err));
}, [tab, source, state, q, sort]);

// recompute filtered list (use backend data instead of static DATA)
const filtered = useMemo(() => {
  let out = data.filter((item) => {
    if (tab !== "All" && item.kind !== tab) return false;
    if (source !== "Any" && item.source !== source) return false;
    if (state !== "Any" && item.state !== state) return false;
    if (q) {
      const hay = `${item.title} ${item.desc} ${item.state} ${item.tags?.join(" ")} ${item.authority}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  if (sort === "deadline") {
    out.sort((a, b) => {
      const da = daysLeft(a.deadline) ?? 99999;
      const db = daysLeft(b.deadline) ?? 99999;
      return da - db;
    });
  } else if (sort === "amount") {
    out.sort((a, b) => amountValue(b.amount) - amountValue(a.amount));
  } else if (sort === "alpha") {
    out.sort((a, b) => a.title.localeCompare(b.title));
  }

  return out;
}, [data, tab, q, source, state, sort]);


  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };


  return (
    <div>
      {/* HERO */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #0A2342 0%, #1b3d6b 55%, #2c5aa0 100%)", color: "white" }}
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <motion.h1
                className="display-6 fw-bold mb-2"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Grants & Support for Rural Learners
              </motion.h1>
              <motion.p
                className="lead mb-0"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                Discover scholarships, loans, and incentives from <strong>Government</strong> and <strong>NGOs</strong>.
                Apply early and track deadlines easily.
              </motion.p>
            </div>
            <div className="col-lg-5">
              <motion.div
                className="card border-0 shadow-lg"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-12 col-md-5">
                      <input
                        className="form-control"
                        placeholder="Search grants, keywords…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <select className="form-select" value={source} onChange={(e) => setSource(e.target.value)}>
                        {SOURCES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-6 col-md-2">
                      <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="col-12 col-md-2">
                      <select className="form-select" value={state} onChange={(e) => setState(e.target.value)}>
                        {STATES.map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="small text-warning mt-2 d-flex align-items-center gap-2">
                    <Filter size={16} /> Tip: Sort by closest deadline to plan your applications.
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
          {TABS.map((t) => (
            <li className="nav-item" key={t}>
              <button className={`nav-link ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t}
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
                <motion.div
                  key={item.id}
                  className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <GrantCard
                    item={item}
                    saved={saved.has(item.id)}
                    onSave={() => toggleSave(item.id)}
                    onOpen={() => setActive(item)}
                  />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-light border d-flex align-items-center gap-2">
                    <Filter size={18} /> No results. Try clearing filters or changing state/source.
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
          <motion.div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,.4)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="modal-dialog modal-lg modal-dialog-centered"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{active.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setActive(null)} />
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <span className="badge bg-primary-subtle text-primary me-2">{active.kind}</span>
                    <span className="badge bg-secondary-subtle text-secondary">{active.source}</span>
                  </div>
                  <p className="text-secondary mb-2">{active.desc}</p>

                  <ul className="list-unstyled small mb-3">
                    <li className="mb-1 d-flex align-items-center gap-2"><Landmark size={16} /> {active.authority}</li>
                    <li className="mb-1 d-flex align-items-center gap-2"><MapPin size={16} /> {active.state}</li>
                    <li className="mb-1 d-flex align-items-center gap-2"><HandCoins size={16} /> Support: {active.amount}</li>
                    <li className="mb-1 d-flex align-items-center gap-2">
                      <CalendarDays size={16} /> Deadline: {active.deadline || "Rolling"}
                      {daysLeft(active.deadline) !== null && (
                        <span className={`ms-2 badge ${daysLeft(active.deadline) <= 7 ? "bg-danger" : "bg-warning text-dark"}`}>
                          {daysLeft(active.deadline)} days left
                        </span>
                      )}
                    </li>
                  </ul>

                  <div className="d-flex flex-wrap gap-2">
                    {active.eligibility?.map((e) => (
                      <span key={e} className="badge bg-light text-dark border">
                        <ShieldCheck size={14} className="me-1" /> {e}
                      </span>
                    ))}
                    {active.tags?.map((t) => (
                      <span key={t} className="badge bg-light text-dark border">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <div className="small text-secondary d-flex align-items-center gap-2">
                    <Info size={16} /> Always read the official guidelines before applying.
                  </div>
                  <div className="d-flex gap-2">
                    <a href={active.link} className="btn btn-outline-secondary" target="_blank" rel="noreferrer">
                      Official Page <ExternalLink size={16} className="ms-1" />
                    </a>
                    <button className="btn btn-primary">
                      Apply Now
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

/** ---------- Grant Card ---------- */
function GrantCard({ item, saved, onSave, onOpen }) {
  const left = daysLeft(item.deadline);
  const urgent = left !== null && left <= 7;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div className="mb-1">
              <span className="badge bg-primary-subtle text-primary me-2">{item.kind}</span>
              <span className="badge bg-secondary-subtle text-secondary">{item.source}</span>
            </div>
            <h6 className="mb-1">{item.title}</h6>
            <div className="small text-secondary d-flex align-items-center flex-wrap gap-2">
              <MapPin size={16} /> {item.state}
              <span className="text-secondary">•</span>
              <Landmark size={16} /> {item.authority}
            </div>
          </div>
          <button
            className={`btn btn-sm ${saved ? "btn-success" : "btn-outline-secondary"}`}
            onClick={onSave}
            aria-label="Save"
            title={saved ? "Saved" : "Save"}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <p className="text-secondary small mt-3 mb-2" style={{ minHeight: 48 }}>
          {item.desc}
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge bg-light text-dark border"><HandCoins size={14} className="me-1" /> {item.amount}</span>
          {item.eligibility?.slice(0, 3).map((e) => (
            <span key={e} className="badge bg-light text-dark border">
              <CheckCircle2 size={14} className="me-1" /> {e}
            </span>
          ))}
        </div>

        {left !== null && (
          <div className={`alert py-1 px-2 small ${urgent ? "alert-danger" : "alert-warning text-dark"} mb-3`}>
            <CalendarDays size={14} className="me-1" />
            {left > 0 ? `${left} days left` : "Deadline today"}
          </div>
        )}

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="small text-secondary d-flex align-items-center gap-2">
            <Clock size={16} /> {item.deadline || "Rolling"}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={onOpen}>
              Details
            </button>
            <a className="btn btn-primary" href={item.link} target="_blank" rel="noreferrer">
              Apply
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
