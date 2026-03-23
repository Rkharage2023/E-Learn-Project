import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { mycourses } from "../services/courseService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

    // ✅ Debug - remove after fixing
    console.log("email from session:", email);
    console.log("token from session:", token);

    if (!email || !token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const result = await mycourses(email);

      // ✅ Debug - remove after fixing
      console.log("API result:", result);

      // ✅ Handle all possible status values
      if (result.status === "success" || result.status === "Success") {
        setCourses(result.data || []);
      } else if (result.status === "error") {
        console.log("API error:", result.error);
        setError("Failed to load courses");
        toast.error("Failed to load courses");
      } else {
        console.log("Unknown status:", result);
        setError("Something went wrong");
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setError("Failed to connect to server");
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="mb-4">My Registered Courses</h3>

        {/* ✅ Loading state */}
        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading your courses...</p>
          </div>
        )}

        {/* ✅ Error state */}
        {!loading && error && (
          <div className="text-center mt-5">
            <p className="text-danger">{error}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                setLoading(true);
                setError(null);
                loadMyCourses();
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ✅ Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center mt-5">
            <h5 className="text-muted">No courses registered yet</h5>
            <p className="text-muted">
              Browse our courses and register to get started
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate("/courses")}
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* ✅ Courses list */}
        {!loading && !error && courses.length > 0 && (
          <div className="row g-4">
            {courses.map((c) => (
              <div key={c.course_id} className="col-md-4">
                <div className="card shadow h-100">
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "160px", fontWeight: "600" }}
                  >
                    Course Image
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{c.course_name}</h5>
                    <p className="text-muted flex-grow-1">{c.description}</p>
                    <strong className="mb-3">₹ {c.fees}</strong>
                    <button
                      className="btn btn-primary btn-sm mt-auto"
                      onClick={() =>
                        navigate(`/my-course/${c.course_id}/videos`)
                      }
                    >
                      View Videos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyCourses;
