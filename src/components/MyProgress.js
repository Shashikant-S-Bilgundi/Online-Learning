  import { useEffect, useMemo, useState } from "react";
  import { motion } from "framer-motion";
  import axios from "axios";
  import { Clock, Target, TrendingUp, Flame, Trophy, BookOpen, CheckCircle2, Award, CalendarDays } from "lucide-react";

  /* --------- Helpers --------- */
  function minutesToHhMm(min) {
    const h = Math.floor((min || 0) / 60);
    const m = (min || 0) % 60;
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }

  function Sparkline({ data = [], width = 110, height = 32, stroke = "#0d6efd" }) {
    if (!data.length) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = Math.max(1, max - min);
    const stepX = width / (data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={width} height={height}>
        <polyline fill="none" stroke={stroke} strokeWidth="2" points={pts} strokeLinejoin="round" strokeLinecap="round" />
        {data.length > 0 && (
          <circle cx={(data.length - 1) * stepX} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={stroke} />
        )}
      </svg>
    );
  }

  function Donut({ value = 0, size = 140, stroke = 12, color = "#0d6efd", track = "#e9ecef" }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (Math.max(0, Math.min(100, value)) / 100) * c;
    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round" />
        <g transform={`rotate(90 ${size/2} ${size/2})`}>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill="#212529">
            {Math.round(value)}%
          </text>
        </g>
      </svg>
    );
  }

  export function MyProgress() {
    const [kpis, setKpis] = useState({ studyMinutes: 0, accuracy: 0, streak: 0, rank: 0, totalMinutes: 0, completion: 0 });
    const [subjects, setSubjects] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [activity, setActivity] = useState([]);
    const [badges, setBadges] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [mentorSessions, setMentorSessions] = useState([]);

    // Listen for quiz updates (optional)
    useEffect(() => {
      const handler = () => refresh();
      window.addEventListener("progress:updated", handler);
      return () => window.removeEventListener("progress:updated", handler);
    }, []);

    const weekTime = minutesToHhMm(kpis.studyMinutes);
    const totalTime = minutesToHhMm(kpis.totalMinutes);

    const heatMax = useMemo(() => {
      const flat = heatmap.flat();
      return flat.length ? Math.max(...flat) : 1;
    }, [heatmap]);

    const colorFor = (v) => {
      if (!v) return "#f1f3f5";
      const alpha = 0.2 + 0.8 * (v / heatMax);
      return `rgba(13,110,253,${alpha.toFixed(2)})`;
    };

    async function refresh() {
      try {
        const rawStudent = localStorage.getItem("student");
        const token = localStorage.getItem("token");
        const student = rawStudent ? JSON.parse(rawStudent) : null;
        const userId = student?.id || "672f1c3b5b9e7c3e2f7b9a11"; // fallback

        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(`https://online-learning-backend-xi.vercel.app/api/progress/${userId}`);
        const p = res.data?.data || res.data || {};
        setKpis({
          studyMinutes: p.kpis?.studyMinutes ?? 0,
          accuracy: p.kpis?.accuracy ?? 0,
          streak: p.kpis?.streak ?? 0,
          rank: p.kpis?.rank ?? 0,
          totalMinutes: p.kpis?.totalMinutes ?? 0,
          completion: p.kpis?.completion ?? 0,
        });
        setEnrolledCourses(Array.isArray(p.enrolledCourses) ? p.enrolledCourses : []);
        setJoinedClasses(Array.isArray(p.joinedClasses) ? p.joinedClasses : []);
        setMentorSessions(Array.isArray(p.mentorSessions) ? p.mentorSessions : []);

        setSubjects(Array.isArray(p.subjects) ? p.subjects : []);
        setHeatmap(Array.isArray(p.heatmap) ? p.heatmap : []);
        setActivity(Array.isArray(p.activity) ? p.activity : []);
        setBadges(Array.isArray(p.badges) ? p.badges : []);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    }

    useEffect(() => { refresh(); }, []);

    return (
      <div className="container py-4">
        {/* Header */}
        <motion.div initial={{ y:-14, opacity:0 }} animate={{ y:0, opacity:1 }} className="mb-3">
          <h1 className="h3 mb-1">My Progress</h1>
          <div className="text-secondary">Track your learning journey, milestones, and targets.</div>
        </motion.div>

        {/* KPI cards
        <div className="row g-3">
          <motion.div className="col-12 col-md-6 col-lg-3" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-secondary small">Study Time (This Week)</div>
                  <div className="h4 mb-0">{weekTime}</div>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width:48, height:48, background:"rgba(13,110,253,.12)", color:"#0d6efd" }}>
                  <Clock size={24}/>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-12 col-md-6 col-lg-3" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-secondary small">Accuracy</div>
                  <div className="h4 mb-0">{kpis.accuracy}%</div>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width:48, height:48, background:"rgba(25,135,84,.12)", color:"#198754" }}>
                  <TrendingUp size={24}/>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-12 col-md-6 col-lg-3" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-secondary small">Streak</div>
                  <div className="h4 mb-0">{kpis.streak} days</div>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width:48, height:48, background:"rgba(253,126,20,.12)", color:"#fd7e14" }}>
                  <Flame size={24}/>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-12 col-md-6 col-lg-3" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-secondary small">Current Rank</div>
                  <div className="h4 mb-0">#{kpis.rank}</div>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width:48, height:48, background:"rgba(111,66,193,.12)", color:"#6f42c1" }}>
                  <Trophy size={24}/>
                </div>
              </div>
            </div>
          </motion.div>
        </div> */}

        {/* Subject progress + donut */}
        {/* <div className="row g-3 mt-1">
          <motion.div className="col-lg-8" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="mb-0">Subject Progress</h5>
                  <span className="badge bg-primary-subtle text-primary">
                    <CheckCircle2 size={14} className="me-1"/> Updated Weekly
                  </span>
                </div>

                <div className="vstack gap-3">
                  {subjects.map((s) => (
                    <div key={s.name} className="border rounded p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-semibold">{s.name}</div>
                        <div className="small text-secondary">Accuracy: {s.accuracy ?? 0}%</div>
                      </div>
                      <div className="progress mt-2" style={{ height: 8 }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${s.progress ?? 0}%` }}
                            aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.progress ?? 0}/>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="small text-secondary">{s.progress ?? 0}% complete</div>
                        <Sparkline data={s.trend ?? []} />
                      </div>
                    </div>
                  ))}
                  {subjects.length === 0 && (
                    <div className="text-secondary small">No subject stats yet — finish a quiz or lesson to see progress.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-lg-4" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column align-items-center text-center">
                <h5 className="mb-2">Overall Course Completion</h5>
                <Donut value={kpis.completion}/>
                <div className="text-secondary small mt-2">
                  Total time: <strong>{totalTime}</strong>
                </div>
                <div className="alert alert-info small mt-3 w-100 text-start">
                  <CalendarDays size={16} className="me-1"/> Tip: Finish 2 more lessons to hit <strong>{Math.max(65, Math.round(kpis.completion + 5))}%</strong> this week.
                </div>
              </div>
            </div>
          </motion.div>
        </div> */}

        {/* Weekly heatmap + goals */}
        <div className="row g-3 mt-1">
          <motion.div className="col-lg-8" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="mb-2">Weekly Study Heatmap</h5>
                <div className="small text-secondary mb-2">Darker = more minutes studied (last 6 weeks)</div>
                <div className="d-flex gap-3">
                  <div className="d-grid" style={{ gridTemplateColumns: `repeat(${heatmap.length || 0}, 16px)`, gap: 6 }}>
                    {heatmap.map((col, i) => (
                      <div key={i} className="d-grid" style={{ gridTemplateRows: "repeat(7, 16px)", gap: 6 }}>
                        {col.map((v, r) => (
                          <div key={r} title={`${(v||0)*10} min`} style={{ width:16, height:16, borderRadius:4, background: colorFor(v) }}/>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="small text-secondary">
                    <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-lg-4" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="mb-2">Goals</h5>
                <div className="vstack gap-3">
                  <Goal label="Study 6h this week" now={kpis.studyMinutes} max={360}/>
                  <Goal label="Accuracy 80%+" now={kpis.accuracy} max={80}/>
                  <Goal label="Maintain 7-day streak" now={kpis.streak} max={7}/>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enrolled Courses */}
  <div className="row g-3 mt-1">
    <motion.div className="col-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="mb-0">Enrolled Courses</h5>
            <span className="badge bg-secondary-subtle text-secondary">
              {enrolledCourses.length} enrolled
            </span>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-secondary small">
              You haven’t enrolled in any course yet — go to Courses and enroll!
            </div>
          ) : (
            <div className="row g-3">
              {enrolledCourses.map((c) => (
                <div key={c.courseId} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    {c.thumbnail ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="card-img-top"
                        style={{ height: 150, objectFit: "cover" }}
                      />
                    ) : null}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                        <span className="badge bg-primary-subtle text-primary">{c.category || "General"}</span>
                        <span className="badge bg-secondary-subtle text-secondary">{c.level || "All"}</span>
                      </div>
                      <h6 className="mb-2">{c.title}</h6>
                      <div className="small text-secondary mb-2">
                        Enrolled on {new Date(c.enrolledAt).toLocaleDateString()}
                      </div>

                      {/* Optional: tiny static progress bar until you track lesson progress */}
                      <div className="mt-auto">
                        <div className="small text-secondary mb-1">Progress</div>
                        <div className="progress" style={{ height: 6 }}>
                          <div className="progress-bar" style={{ width: "0%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </div>


{/* Joined Classes */}
{/* <div className="row g-3 mt-1">
  <motion.div className="col-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="mb-0">Joined Classes</h5>
          <span className="badge bg-secondary-subtle text-secondary">
            {joinedClasses.length} joined
          </span>
        </div>

        {joinedClasses.length === 0 ? (
          <div className="text-secondary small">
            You haven’t joined any class yet — go to Classes and join a session!
          </div>
        ) : (
          <div className="row g-3">
            {joinedClasses.map((c) => (
              <div key={c.classId} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  {c.thumbnail ? (
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="card-img-top"
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  ) : null}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                      <span className="badge bg-warning text-dark">{c.subject || "General"}</span>
                      <span className="badge bg-dark">{c.mode || "Live"}</span>
                    </div>
                    <h6 className="mb-2">{c.title}</h6>
                    <div className="small text-secondary mb-2">
                      {c.date} • {c.start}-{c.end} {c.room ? `• ${c.room}` : ""}
                    </div>
                    <div className="mt-auto small text-secondary">
                      Joined on {new Date(c.joinedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>  
        )}
      </div>
    </div>
  </motion.div>
</div> */}

{/* Mentor Sessions */}
{/* <div className="row g-3 mt-1">
  <motion.div className="col-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="mb-0">Mentor Sessions</h5>
          <span className="badge bg-secondary-subtle text-secondary">
            {mentorSessions.length} booked
          </span>
        </div>

        {mentorSessions.length === 0 ? (
          <div className="text-secondary small">
            You haven’t booked any mentor sessions yet — find a mentor and book a slot!
          </div>
        ) : (
          <div className="row g-3">
            {mentorSessions.map((m) => (
              <div key={`${m.mentorId}-${m.date}-${m.time}`} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.mentorName}
                      className="card-img-top"
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  ) : null}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                      <span className="badge bg-primary-subtle text-primary">{m.mode || "Live 1:1"}</span>
                      <span className="badge bg-secondary-subtle text-secondary">₹{m.price}</span>
                    </div>
                    <h6 className="mb-1">{m.mentorName}</h6>
                    <div className="small text-secondary mb-2">
                      {(m.subjects || []).join(" • ") || "General"}
                    </div>
                    <div className="small text-secondary mb-2">
                      {m.date} • {m.time} • {m.duration || 45} min {m.city ? `• ${m.city}` : ""}
                    </div>
                    <div className="mt-auto small text-secondary">
                      Booked on {new Date(m.bookedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
</div> */}


        {/* Activity + Badges */}
        <div className="row g-3 mt-1">
          <motion.div className="col-lg-8" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="mb-2">Recent Activity</h5>
                <ul className="list-group list-group-flush">
                  {activity.map(a => (
                    <li key={a.id} className="list-group-item d-flex align-items-start gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width:40, height:40, background:"#f1f3f5" }}>
                        {a.icon === "quiz"     && <Target size={18}/>}
                        {a.icon === "class"    && <Award size={18}/>}
                        {a.icon === "practice" && <TrendingUp size={18}/>}
                        {a.icon === "video"    && <BookOpen size={18}/>}
                      </div>
                      <div>
                        <div className="fw-semibold">{a.text}</div>
                        <div className="small text-secondary">{a.when}</div>
                      </div>
                    </li>
                  ))}
                  {activity.length === 0 && (
                    <li className="list-group-item small text-secondary">No activity yet — take your first quiz!</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-lg-4" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="mb-2">Achievements</h5>
                <div className="vstack gap-2">
                  {badges.map(b => (
                    <div key={b.id} className="d-flex align-items-center gap-3 border rounded p-2">
                      <div className="rounded d-flex align-items-center justify-content-center"
                          style={{ width:36, height:36, background:`${b.color || "#0d6efd"}22`, color:b.color || "#0d6efd" }}>
                        {b.icon || <Trophy size={18}/>}
                      </div>
                      <div>
                        <div className="fw-semibold">{b.name}</div>
                        <div className="small text-secondary">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <div className="text-secondary small">No badges yet — complete quizzes to unlock achievements.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* --------- Small subcomponents --------- */
  function Goal({ label, now = 0, max = 100 }) {
    const pct = Math.min(100, Math.round(((now || 0) / (max || 1)) * 100));
    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <div className="small">{label}</div>
          <div className="small text-secondary">{pct}%</div>
        </div>
        <div className="progress" style={{ height: 8 }}>
          <div className="progress-bar" role="progressbar" style={{ width: `${pct}%` }}/>
        </div>
      </div>
    );
  }
