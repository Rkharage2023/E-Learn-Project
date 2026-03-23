import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { mycourses } from "../services/courseService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MyCourses.css";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");

    if (!email || !token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const result = await mycourses(email);

      if (result.status === "success" || result.status === "Success") {
        setCourses(result.data || []);
      } else {
        setError("Failed to load courses");
        toast.error("Failed to load courses");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server");
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadMyCourses();
  };

  return (
    <>
      <Navbar />

      <div className="mc-page">
        {/* ── HERO HEADER ── */}
        <div className="mc-header">
          <div className="mc-header-inner">
            <p className="mc-header-eyebrow">Your Learning Journey</p>
            <h1 className="mc-header-title">My Courses</h1>
            <p className="mc-header-sub">
              Pick up where you left off and keep growing.
            </p>
          </div>
          {/* decorative blobs */}
          <div className="mc-blob mc-blob-1" />
          <div className="mc-blob mc-blob-2" />
        </div>

        {/* ── CONTENT ── */}
        <div className="mc-content">
          {/* LOADING */}
          {loading && (
            <div className="mc-center">
              <div className="mc-spinner">
                <div className="mc-spinner-ring" />
              </div>
              <p className="mc-center-text">Loading your courses…</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="mc-center">
              <div className="mc-empty-icon">⚠️</div>
              <h3 className="mc-center-title">Something went wrong</h3>
              <p className="mc-center-text">{error}</p>
              <button className="mc-btn-primary" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && courses.length === 0 && (
            <div className="mc-center">
              <div className="mc-empty-icon">📚</div>
              <h3 className="mc-center-title">No courses yet</h3>
              <p className="mc-center-text">
                You haven't registered for any courses. Browse our catalog and
                start learning today.
              </p>
              <button
                className="mc-btn-primary"
                onClick={() => navigate("/courses")}
              >
                Browse Courses
              </button>
            </div>
          )}

          {/* COURSES GRID */}
          {!loading && !error && courses.length > 0 && (
            <>
              {/* Stats bar */}
              <div className="mc-stats">
                <div className="mc-stat">
                  <span className="mc-stat-number">{courses.length}</span>
                  <span className="mc-stat-label">
                    {courses.length === 1 ? "Course" : "Courses"} Enrolled
                  </span>
                </div>
                <button
                  className="mc-btn-outline"
                  onClick={() => navigate("/courses")}
                >
                  + Enroll in More
                </button>
              </div>

              <div className="mc-grid">
                {courses.map((c, index) => (
                  <div
                    className="mc-card"
                    key={c.course_id}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* Card top color band */}
                    <div className="mc-card-band" />

                    {/* Card image placeholder */}
                    <div className="mc-card-thumb">
                      <span className="mc-card-thumb-icon">🎓</span>
                    </div>

                    {/* Badge */}
                    <div className="mc-card-body">
                      <span className="mc-badge">Enrolled</span>

                      <h3 className="mc-card-title">{c.course_name}</h3>

                      <p className="mc-card-desc">
                        {c.description?.length > 80
                          ? c.description.slice(0, 80) + "…"
                          : c.description}
                      </p>

                      {/* Footer */}
                      <div className="mc-card-footer">
                        <span className="mc-card-price">₹ {c.fees}</span>
                        <button
                          className="mc-btn-primary mc-btn-sm"
                          onClick={() =>
                            navigate(`/my-course/${c.course_id}/videos`)
                          }
                        >
                          ▶ Watch Videos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyCourses;
