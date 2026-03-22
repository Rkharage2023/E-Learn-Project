import axios from "axios";

const API_URL = "https://e-learn-project.onrender.com";

// ✅ ADD COURSE
export async function addCourse(
  course_name,
  description,
  fees,
  start_date,
  end_date,
  video_expire_days,
) {
  const URL = `${API_URL}/courses/add`; // ✅ added

  const token = sessionStorage.getItem("token");

  return (
    await axios.post(
      URL,
      {
        course_name,
        description,
        fees,
        start_date,
        end_date,
        video_expire_days,
      },
      { headers: { token } },
    )
  ).data;
}

// ✅ DELETE COURSE
export async function deleteCourses(course_id) {
  const URL = `${API_URL}/courses/delete/${course_id}`; // ✅ added

  const token = sessionStorage.getItem("token");

  const result = await axios.delete(URL, {
    headers: { token },
  });

  return result.data;
}

// ✅ GET ALL VIDEOS (WITH TOKEN)
export async function getAllVideoss(token) {
  const URL = `${API_URL}/video/all-videos`; // ✅ added

  const res = await axios.get(URL, {
    headers: { token },
  });

  return res.data;
}

// ✅ ADD VIDEO
export async function addVideos(course_id, title, youtube_url, description) {
  const URL = `${API_URL}/video/add`; // ✅ added

  const token = sessionStorage.getItem("token");

  const response = await axios.post(
    URL,
    { course_id, title, youtube_url, description },
    { headers: { token } },
  );

  return response.data;
}

// ✅ GET ALL VIDEOS
export async function getAllVideos() {
  const URL = `${API_URL}/video/all-videos`; // ✅ added

  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  const response = await axios.get(URL, {
    headers: { email, token },
  });

  return response.data;
}

// ✅ GET ALL COURSES
export async function getAllCourses() {
  const token = sessionStorage.getItem("token");
  const URL = `${API_URL}/courses/all-courses`;

  const response = await axios.get(URL, {
    headers: { token },
  });

  return response.data;
}

// ✅ GET STUDENTS
export async function getStudents(course_id = null) {
  const token = sessionStorage.getItem("token");

  const URL = `${API_URL}/admin/enrolledstudents`; // ✅ added

  const response = await axios.get(URL, {
    headers: { token },
    params: course_id ? { course_id } : {},
  });

  return response.data;
}
