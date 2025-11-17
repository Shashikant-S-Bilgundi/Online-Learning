import { motion } from "framer-motion";
import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
      <footer className="mt-5 border-top" style={{ backgroundColor: "#051932", color: "#d2d7df" }}>

        <div className="container py-5">
          <div className="row g-4">
            {/* Brand + Support */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                  style={{ width: 44, height: 44, backgroundColor: "#794CFF", color: "#fff" }}
                >
                  {/* simple book icon via SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M20 22H6.5a2.5 2.5 0 0 1 0-5H20z" />
                    <path d="M20 2H8a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <p className="h5 fw-bold mb-1">Edemy</p>
                  <p className="mb-0" style={{ color: "#b8c1cc" }}>
                    Personalised learning for every student
                  </p>
                </div>
              </div>

              <p className="small" style={{ color: "#b8c1cc" }}>
                Live classes, interactive videos, and adaptive practice for K-12 and competitive exams.
                Learn at your pace with expert mentors and real-time progress tracking.
              </p>

              <ul className="list-unstyled small mb-3">
                <li className="d-flex align-items-start gap-2 mb-2">
                  <Phone size={16} className="mt-1 flex-shrink-0" />
                  <span>1800-123-0000 <span className="text-secondary">(9am–9pm)</span></span>
                </li>
                <li className="d-flex align-items-start gap-2 mb-2">
                  <Mail size={16} className="mt-1 flex-shrink-0" />
                  <a href="mailto:support@rbdlearning.com" className="link-light text-decoration-none">
                    support@rbdlearning.com
                  </a>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <Clock size={16} className="mt-1 flex-shrink-0" />
                  <span>Live Mentor Support: Mon–Sun, 9:00–21:00 IST</span>
                </li>
              </ul>

              <div className="d-flex gap-2 pt-2">
                <a aria-label="Facebook" href="#" className="btn btn-outline-light btn-sm rounded-3">
                  <FaFacebook />
                </a>
                <a aria-label="Instagram" href="#" className="btn btn-outline-light btn-sm rounded-3">
                  <FaInstagram />
                </a>
                <a aria-label="LinkedIn" href="#" className="btn btn-outline-light btn-sm rounded-3">
                  <FaLinkedin />
                </a>
                <a aria-label="YouTube" href="#" className="btn btn-outline-light btn-sm rounded-3">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-12 col-md-6 col-lg-3">
              <p className="fw-semibold mb-3">Quick Links</p>
              <ul className="list-unstyled small mb-0">
                {[
                  ["Home", "/"],
                  ["Courses", "/courses"],
                  ["Classes", "/classes"],
                  ["Quizzes", "/quizzes"],
                  ["grants & Schemes", "/grants"],
                  ["AI Teacher", "/aiteacher"],
                  ["Feedback", "/feedback"],
                  ["My Progress", "/myprogress"],
                ].map(([label, href]) => (
                  <li key={label} className="mb-2">
                    <a href={href} className="link-light text-decoration-none d-inline-flex align-items-center gap-2">
                      <span
                        className="rounded-circle"
                        style={{ width: 6, height: 6, backgroundColor: "#b8c1cc", display: "inline-block" }}
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div className="col-12 col-md-6 col-lg-3">
              <p className="fw-semibold mb-3">Programs</p>
              <ul className="list-unstyled small mb-0">
                {[
                  "Science",
                  "Maths",
                  "Social",
                  "English",
                  "Kannada",
                  "Hindi",
                ].map((s) => (
                  <li key={s} className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="rounded-circle"
                      style={{ width: 6, height: 6, backgroundColor: "#b8c1cc", display: "inline-block" }}
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get the App / Help Center */}
            <div className="col-12 col-md-6 col-lg-3">
              <p className="fw-semibold mb-3">Get the App</p>
              <p className="small" style={{ color: "#b8c1cc" }}>
                Watch classes, attempt quizzes, and track progress on the go.
              </p>
              <p className="fw-semibold mb-2">Help Center</p>
              <ul className="list-unstyled small mb-0">
                {[
                  ["FAQs"],
                  ["Learner Guidelines"],
                  ["Refund & Cancellation"],
                  ["Terms & Privacy"],
                ].map(([label, href]) => (
                  <li key={label} className="mb-2">
                    <a href={href} className="link-secondary text-decoration-none">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-top py-3">
          <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 small">
            <p className="mb-0">© {year} Edemy Learning. All rights reserved.</p>
            <div className="d-flex align-items-center flex-wrap gap-3">
              <span className="text-secondary">•</span>
              <a href="/terms" className="link-secondary text-decoration-none">
                Terms &amp; Conditions
              </a>
              <span className="text-secondary">•</span>
              <a href="/privacy" className="link-secondary text-decoration-none">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
