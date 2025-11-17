import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Eye, BookmarkPlus, BookmarkCheck, FileText, Image as ImageIcon,
  FileSpreadsheet, FileCode, Film, Filter, Search, Layers, X
} from "lucide-react";

// 🔹 ADD THIS
const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

const CATEGORIES = ["All", "English", "Social Science", "Maths", "Science"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const FORMATS = ["All", "PDF", "Image", "Video", "XLS", "PPT", "Code"];

function FormatBadge({ format }) {
  // ... (unchanged)
}

export function Resources() {
  const [resources, setResources] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");
  const [fmt, setFmt] = useState("All");
  const [active, setActive] = useState(null);
  const [saved, setSaved] = useState(new Set());
  const [showSaves, setShowSaves] = useState(false);

  // Fetch resources from backend API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/resources`,
          {
            params: { category: cat, level: lvl, format: fmt, q }
          }
        );
        if (data.success) setResources(data.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };
    fetchResources();
  }, [cat, lvl, fmt, q]);

  const filtered = useMemo(() => resources, [resources]);

  const toggleSave = (id) => {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const savedList = resources.filter(r => saved.has(r._id));

  return (
    <div className="container py-4">
      {/* HERO + Filters */}
      <section className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A2342 0%, #1b3d6b 55%, #2c5aa0 100%)", color: "white" }}
      >
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <motion.h1 className="h2 h1-md fw-bold mb-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              Material Resources & Downloads
            </motion.h1>
            <motion.p className="mb-0" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
              Curated notes, practice sets, slides, code templates, and more. Filter and download what you need.
            </motion.p>
          </div>
          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="card border-0 shadow-lg">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-12">
                    <div className="input-group">
                      <span className="input-group-text bg-white"><Search size={16} /></span>
                      <input className="form-control" placeholder="Search resources…" value={q} onChange={e => setQ(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-6">
                    <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <select className="form-select" value={lvl} onChange={e => setLvl(e.target.value)}>
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  {/* <div className="col-12">
                    <select className="form-select" value={fmt} onChange={e => setFmt(e.target.value)}>
                      {FORMATS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div> */}
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2 small text-secondary">
                  <div className="d-inline-flex align-items-center gap-1">
                    <Filter size={14} /> Showing <strong className="ms-1">{filtered.length}</strong> of {resources.length}
                  </div>
                  <button className="btn btn-sm btn-outline-light" onClick={() => setShowSaves(true)}>
                    <BookmarkCheck size={14} className="me-1" /> My Saves ({saved.size})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section>
        <div className="row g-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((r, i) => (
              <motion.div key={r._id} className="col-12 col-sm-6 col-lg-4"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img src={r.thumbnail} alt={r.title} className="card-img-top" style={{ height: 170, objectFit: "cover" }} />
                    <div className="position-absolute top-0 start-0 m-2 d-flex gap-2">
                      <FormatBadge format={r.format} />
                      <span className="badge bg-secondary">{r.level}</span>
                    </div>
                    <button className="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 d-flex align-items-center gap-1" onClick={() => setActive(r)}>
                      <Eye size={16} /> Preview
                    </button>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="badge bg-primary-subtle text-primary">{r.category}</span>
                      <span className="text-secondary small">{r.size}</span>
                    </div>
                    <h6 className="mt-2 mb-2">{r.title}</h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {r.tags.map(t => <span key={t} className="badge bg-light text-dark border">{t}</span>)}
                    </div>
                    <div className="mt-auto d-grid gap-2">
                      <a href={r.downloadUrl || "#"} download className={`btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 ${r.downloadUrl ? "" : "disabled"}`}>
                        <Download size={18} /> Download
                      </a>
                      <button className={`btn ${saved.has(r._id) ? "btn-success" : "btn-outline-secondary"} d-inline-flex align-items-center justify-content-center gap-2`} onClick={() => toggleSave(r._id)}>
                        {saved.has(r._id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />} {saved.has(r._id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* PREVIEW MODAL & SAVED DRAWER */}
      {/* Keep your existing preview modal and saved drawer code unchanged, just use r._id instead of r.id */}
    </div>
  );
}
