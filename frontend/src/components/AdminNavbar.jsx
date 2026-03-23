import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [coursesOpen, setCoursesOpen] = useState(false);
  const [videosOpen, setVideosOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef(null);

  // ✅ Close all dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeAll();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setCoursesOpen(false);
    setVideosOpen(false);
    setStudentsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    navigate("/login");
  };

  // toggle one dropdown, close others
  const toggle = (name) => {
    setCoursesOpen(name === "courses" ? !coursesOpen : false);
    setVideosOpen(name === "videos" ? !videosOpen : false);
    setStudentsOpen(name === "students" ? !studentsOpen : false);
  };

  return (
    <nav className="an-nav" ref={navRef}>
      <div className="an-inner">
        {/* ── LOGO ── */}
        <button className="an-logo" onClick={() => navigate("/admin")}>
          <span className="an-logo-icon">⚡</span>
          Admin Panel
        </button>

        {/* ── DESKTOP MENU ── */}
        <div className="an-desktop-menu">
          {/* Courses */}
          <div className="an-dropdown">
            <button
              className={`an-menu-btn ${coursesOpen ? "an-menu-btn--active" : ""}`}
              onClick={() => toggle("courses")}
            >
              <i className="bi bi-book" />
              Courses
              <i
                className={`bi bi-chevron-${coursesOpen ? "up" : "down"} an-chevron`}
              />
            </button>
            {coursesOpen && (
              <ul className="an-dropdown-menu">
                <li>
                  <Link
                    to="/allcourses"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-grid" />
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addcourse"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-plus-circle" />
                    Add Course
                  </Link>
                </li>
                <li>
                  <Link
                    to="/deletecourse"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-trash" />
                    Delete Course
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Videos */}
          <div className="an-dropdown">
            <button
              className={`an-menu-btn ${videosOpen ? "an-menu-btn--active" : ""}`}
              onClick={() => toggle("videos")}
            >
              <i className="bi bi-play-circle" />
              Videos
              <i
                className={`bi bi-chevron-${videosOpen ? "up" : "down"} an-chevron`}
              />
            </button>
            {videosOpen && (
              <ul className="an-dropdown-menu">
                <li>
                  <Link
                    to="/getallvideos"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-collection-play" />
                    All Videos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addvideo"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-camera-video" />
                    Add Video
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Students */}
          <div className="an-dropdown">
            <button
              className={`an-menu-btn ${studentsOpen ? "an-menu-btn--active" : ""}`}
              onClick={() => toggle("students")}
            >
              <i className="bi bi-people" />
              Students
              <i
                className={`bi bi-chevron-${studentsOpen ? "up" : "down"} an-chevron`}
              />
            </button>
            {studentsOpen && (
              <ul className="an-dropdown-menu">
                <li>
                  <Link
                    to="/getallstudents"
                    className="an-dropdown-item"
                    onClick={closeAll}
                  >
                    <i className="bi bi-person-lines-fill" />
                    All Students
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Logout */}
          <button className="an-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />
            Log Out
          </button>
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          className="an-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className={`bi bi-${mobileOpen ? "x-lg" : "list"}`} />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="an-mobile-menu">
          {/* Courses Section */}
          <div className="an-mobile-section">
            <p className="an-mobile-section-title">
              <i className="bi bi-book" /> Courses
            </p>
            <Link
              to="/allcourses"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-grid" /> All Courses
            </Link>
            <Link
              to="/addcourse"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-plus-circle" /> Add Course
            </Link>
            <Link
              to="/deletecourse"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-trash" /> Delete Course
            </Link>
          </div>

          <div className="an-mobile-divider" />

          {/* Videos Section */}
          <div className="an-mobile-section">
            <p className="an-mobile-section-title">
              <i className="bi bi-play-circle" /> Videos
            </p>
            <Link
              to="/getallvideos"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-collection-play" /> All Videos
            </Link>
            <Link
              to="/addvideo"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-camera-video" /> Add Video
            </Link>
          </div>

          <div className="an-mobile-divider" />

          {/* Students Section */}
          <div className="an-mobile-section">
            <p className="an-mobile-section-title">
              <i className="bi bi-people" /> Students
            </p>
            <Link
              to="/getallstudents"
              className="an-mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              <i className="bi bi-person-lines-fill" /> All Students
            </Link>
          </div>

          <div className="an-mobile-divider" />

          {/* Logout */}
          <button className="an-mobile-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" /> Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
