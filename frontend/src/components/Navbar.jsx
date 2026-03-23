import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../contex/AuthContext";
import { useState } from "react";
import "./Navbar.css";
import "./profiledropdown.css";
import "./ChangePassword.css";

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [coursesOpen, setCoursesOpen] = useState(false);
  const [videosOpen, setVideosOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);

  const closeAll = () => {
    setCoursesOpen(false);
    setVideosOpen(false);
    setStudentsOpen(false);
  };

  return (
    <>
      {/* Overlay to close dropdowns on outside click */}
      {(coursesOpen || videosOpen || studentsOpen) && (
        <div className="nav-overlay" onClick={closeAll} />
      )}

      <nav className="navbar navbar-light bg-white ud-navbar">
        <div className="container-xxl">
          {/* LEFT - Logo */}
          <div className="nav-left">
            <Link
              className="navbar-brand ud-logo"
              to={isAdmin ? "/admin" : "/home"}
            >
              E‑Learn
            </Link>
          </div>

          {/* CENTER - Search */}
          <div className="ud-search">
            <span className="ud-search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control"
              type="search"
              placeholder="Search for anything"
            />
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            {isAdmin ? (
              <>
                {/* Admin - Courses Dropdown */}
                <div className="nav-dropdown">
                  <button
                    className="nav-dropdown-btn"
                    onClick={() => {
                      setCoursesOpen(!coursesOpen);
                      setVideosOpen(false);
                      setStudentsOpen(false);
                    }}
                  >
                    Courses
                    <i
                      className={`bi bi-chevron-${coursesOpen ? "up" : "down"} ms-1`}
                    ></i>
                  </button>
                  {coursesOpen && (
                    <ul className="nav-dropdown-menu">
                      <li>
                        <Link
                          to="/allcourses"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Get All Courses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/addcourse"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Add Course
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/deletecourse"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Delete Course
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Admin - Videos Dropdown */}
                <div className="nav-dropdown">
                  <button
                    className="nav-dropdown-btn"
                    onClick={() => {
                      setVideosOpen(!videosOpen);
                      setCoursesOpen(false);
                      setStudentsOpen(false);
                    }}
                  >
                    Videos
                    <i
                      className={`bi bi-chevron-${videosOpen ? "up" : "down"} ms-1`}
                    ></i>
                  </button>
                  {videosOpen && (
                    <ul className="nav-dropdown-menu">
                      <li>
                        <Link
                          to="/getallvideos"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Get All Videos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/addvideo"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Add Videos
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Admin - Students Dropdown */}
                <div className="nav-dropdown">
                  <button
                    className="nav-dropdown-btn"
                    onClick={() => {
                      setStudentsOpen(!studentsOpen);
                      setCoursesOpen(false);
                      setVideosOpen(false);
                    }}
                  >
                    Students
                    <i
                      className={`bi bi-chevron-${studentsOpen ? "up" : "down"} ms-1`}
                    ></i>
                  </button>
                  {studentsOpen && (
                    <ul className="nav-dropdown-menu">
                      <li>
                        <Link
                          to="/getallstudents"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          Get All Students
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Student - Courses Dropdown */}
                <div className="nav-dropdown">
                  <button
                    className="nav-dropdown-btn"
                    onClick={() => {
                      setCoursesOpen(!coursesOpen);
                      setVideosOpen(false);
                    }}
                  >
                    Courses
                    <i
                      className={`bi bi-chevron-${coursesOpen ? "up" : "down"} ms-1`}
                    ></i>
                  </button>
                  {coursesOpen && (
                    <ul className="nav-dropdown-menu">
                      <li>
                        <Link
                          to="/courses"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          All Courses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-courses"
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          My Courses
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>

                {/* About Us */}
                <Link to="/aboutus" className="nav-top-link">
                  About Us
                </Link>
              </>
            )}

            {/* Profile / Login */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="nav-auth-btn">
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
