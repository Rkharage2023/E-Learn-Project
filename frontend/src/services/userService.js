import axios from "axios";

const API_URL = "https://e-learn-project.onrender.com";

// ✅ LOGIN
export async function loginUser(email, password) {
  const URL = `${API_URL}/users/signin`; // ✅ added

  const body = { email, password };
  const response = await axios.post(URL, body);
  return response.data;
}

// ✅ REGISTER
export async function registerUser(name, email, password, mobile) {
  const URL = `${API_URL}/users/signup`; // ✅ added

  const body = { name, email, password, mobile };
  const response = await axios.post(URL, body);
  return response.data;
}

// ✅ GET COURSES
export async function getCourses(token) {
  const URL = `${API_URL}/courses/all-active-courses`;
  const headers = token ? { token } : {};
  const response = await axios.get(URL, { headers });
  return response.data;
}

// ✅ GET PROFILE
export async function getProfile(token) {
  const URL = `${API_URL}/users/profile`; // ✅ added

  const headers = { token };
  const response = await axios.get(URL, { headers });
  return response.data;
}

// ✅ CHANGE PASSWORD
export async function changePassword(newPassword, token) {
  const URL = `${API_URL}/users/change-password`; // ✅ added

  const body = { newPassword };

  const headers = {
    "Content-Type": "application/json",
    token,
  };

  const response = await axios.post(URL, body, { headers });
  return response.data;
}
