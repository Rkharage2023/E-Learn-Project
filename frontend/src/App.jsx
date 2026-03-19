// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { createContext, useState } from "react";
import Admin from "./pages/Admin";
import AddCourse from "./pages/AddCourse";
import AllCourses from "./pages/AllCourses";
import GetAllStudents from "./pages/GetAllStudents";
import GetAllVideos from "./pages/GetAllVideos";
import AddVideo from "./pages/AddVideo";
import DeleteCourse from "./pages/DeleteCourse";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import AdminCourseDetails from "./pages/AdminCourseDetails";
import CourseRegister from "./pages/CourseRegister";
import MyCourses from "./pages/MyCourses";
import MyCourseVideos from "./pages/MyCourseVideos";
import AddVideoForm from "./pages/AddVideoForm";
import AboutUs from "./pages/AboutUs";
import ChangePassword from "./components/ChangePassword";
import UpdateCourse from "./pages/UpdateCourse";

export const LoginContext = createContext();

// ✅ Helper to check if token in sessionStorage is valid (not expired)
function isTokenValid() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check expiry if your JWT has one
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      sessionStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ✅ Helper to get role from token
function getRoleFromToken() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function App() {
  // ✅ Initialize from sessionStorage so refresh doesn't log user out
  const [loginStatus, setLoginStatus] = useState(isTokenValid());

  const role = getRoleFromToken();

  return (
    <>
      <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course-register" element={<CourseRegister />} />

          {/* Student protected routes */}
          <Route
            path="/profile"
            element={loginStatus ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/change-password"
            element={
              loginStatus ? <ChangePassword /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/my-courses"
            element={loginStatus ? <MyCourses /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-course/:courseId/videos"
            element={
              loginStatus ? <MyCourseVideos /> : <Navigate to="/login" />
            }
          />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              loginStatus && role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/addcourse"
            element={
              loginStatus && role === "admin" ? (
                <AddCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/allcourses"
            element={
              loginStatus && role === "admin" ? (
                <AllCourses />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/getallstudents"
            element={
              loginStatus && role === "admin" ? (
                <GetAllStudents />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/getallvideos"
            element={
              loginStatus && role === "admin" ? (
                <GetAllVideos />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/addvideo"
            element={
              loginStatus && role === "admin" ? (
                <AddVideo />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/addvideoform/:courseId"
            element={
              loginStatus && role === "admin" ? (
                <AddVideoForm />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/deletecourse"
            element={
              loginStatus && role === "admin" ? (
                <DeleteCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/update-course/:id"
            element={
              loginStatus && role === "admin" ? (
                <UpdateCourse />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admincourse/:id"
            element={
              loginStatus && role === "admin" ? (
                <AdminCourseDetails />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </LoginContext.Provider>

      <ToastContainer />
    </>
  );
}

export default App;
