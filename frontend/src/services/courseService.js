import axios from "axios";

const API_URL = "https://e-learn-project.onrender.com";

// courseService.js

// ✅ For PUBLIC users — only active courses
export async function getActiveCourses() {
  const URL = `${API_URL}/courses/all-active-courses`;
  const res = await axios.get(URL);
  return res.data;
}

// ✅ For ADMIN — all courses regardless of date
export async function getAllCourses() {
  const token = sessionStorage.getItem("token");
  const URL = `${API_URL}/courses/all-courses`;
  const res = await axios.get(URL, {
    headers: { token },
  });
  return res.data;
}

export async function mycourses(email) {
  const token = sessionStorage.getItem("token");

  // ✅ Debug
  console.log("mycourses called with:", email);
  console.log("token used:", token);

  if (!email) {
    throw new Error("Email is required");
  }

  if (!token) {
    throw new Error("Token is required");
  }

  const res = await axios.get(
    `https://e-learn-project.onrender.com/students/my-courses/${email}`,
    {
      headers: {
        token: token,
      },
      timeout: 30000, // ✅ 30 second timeout for slow Render cold starts
    },
  );

  console.log("mycourses raw response:", res.data);
  return res.data;
}

// ✅ REGISTER COURSE (unchanged)
export async function registerCourseService(data) {
  const token = sessionStorage.getItem("token");
  const URL = `${API_URL}/students/register-to-course`;
  const res = await axios.post(URL, data, {
    headers: { token },
  });
  return res.data;
}

// ✅ MY COURSE VIDEOS (unchanged)
export async function myCourseVideos() {
  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");
  const URL = `${API_URL}/students/my-course-with-videos`;
  const res = await axios.get(URL, {
    headers: { email, token },
  });
  return res.data;
}

// ✅ UPDATE COURSE (unchanged)
export async function updateCourse(course_id, courseData) {
  const token = sessionStorage.getItem("token");
  const URL = `${API_URL}/courses/update/${course_id}`;
  const res = await axios.put(URL, courseData, {
    headers: { token },
  });
  return res.data;
}
