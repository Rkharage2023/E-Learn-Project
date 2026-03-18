// import config from "./config";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ✅ GET ALL ACTIVE COURSES
export async function getAllCourses() {
  const token = sessionStorage.getItem("token"); // ✅ added

  const URL = `${API_URL}/courses/all-active-courses`;

  const res = await axios.get(URL, {
    headers: {
      token: token,
    },
  });

  return res.data;
}

// ✅ MY COURSES
export async function mycourses(email) {
  const URL = `${API_URL}/students/my-courses/${email}`; // ✅ added

  const token = sessionStorage.getItem("token");

  const res = await axios.get(URL, {
    headers: {
      token: token,
    },
  });

  return res.data;
}

// ✅ REGISTER COURSE
export async function registerCourseService(data) {
  const URL = `${API_URL}/students/register-to-course`; // ✅ added

  const token = sessionStorage.getItem("token");

  const res = await axios.post(URL, data, {
    headers: {
      token: token,
    },
  });

  return res.data;
}

// ✅ MY COURSE VIDEOS
export async function myCourseVideos() {
  const URL = `${API_URL}/students/my-course-with-videos`; // ✅ added

  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  const res = await axios.get(URL, {
    headers: {
      email: email,
      token: token,
    },
  });

  return res.data;
}

// ✅ UPDATE COURSE
export async function updateCourse(course_id, courseData) {
  const URL = `${API_URL}/courses/update/${course_id}`; // ✅ added

  const token = sessionStorage.getItem("token");

  const res = await axios.put(URL, courseData, {
    headers: {
      token: token,
    },
  });

  return res.data;
}
