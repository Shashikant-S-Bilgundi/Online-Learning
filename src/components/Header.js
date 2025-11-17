import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";

export default function Header({ currentStudent, onLogout }) {
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState("frame.png");

  useEffect(() => {
    if (currentStudent?.profilePic) setProfileImg(currentStudent.profilePic);
    else setProfileImg("frame.png");
  }, [currentStudent]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    onLogout?.();  
    navigate("/studentlogin");
  };

  const links = [
    { to: "/courses", label: "Learning" },
    { to: "/aiteacher", label: "AI Teacher" },
    { to: "/quizzes", label: "Quizzes" },
    { to: "/mentor", label: "Mentor" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/resources", label: "Resources" },
    { to: "/grants", label: "Grants & Schemes" },
    { to: "/feedback", label: "Feedback" },
    { to: "/myprogress", label: "My Progress" },
  ];

  const closeOffcanvas = () => {
    const el = document.getElementById("mainOffcanvas");
    if (!el) return;
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(el);
    offcanvas.hide();
  };

  return (
    <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
      <header className="w-100 position-sticky top-0 z-3" style={{ backgroundColor: "#0A2342" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-2">
            <div className="d-flex align-items-center ms-2">
              <Link to="/" className="d-block text-decoration-none">
                <span className="text-white fs-4 fw-bold">Edemy</span>
              </Link>
            </div>

            <nav className="d-none d-md-flex align-items-center justify-content-center gap-3">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className="nav-link text-white px-2" onClick={closeOffcanvas}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="d-flex align-items-center gap-3 me-3">
              {currentStudent ? (
                <>
                  
                  <span className="text-white fw-semibold d-none d-sm-inline">
                    {currentStudent.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut size={16} />
                    <span className="d-none d-md-inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/studentlogin" className="btn btn-outline-primary btn-sm">Login</Link>
                  <Link to="/student-register" className="btn btn-outline-light btn-sm">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </motion.div>
  );
}
