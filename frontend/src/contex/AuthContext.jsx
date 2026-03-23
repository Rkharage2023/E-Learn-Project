// contex/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getProfile } from "../services/userService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // ✅ Debug
        console.log("checkAuth payload:", payload);

        setUser({
          email: payload.email,
          role: payload.role, // ✅ make sure role is set
          token,
        });

        try {
          const profileData = await getProfile(token);
          if (profileData.status === "Success") {
            setProfile(profileData.data);
          }
        } catch {
          // profile fetch failing should not block auth
        }
      } catch (error) {
        console.error("checkAuth error:", error);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("email");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);

      // ✅ Debug
      console.log("AuthContext login response:", response);

      if (response.status === "Success") {
        const { token } = response.data;
        sessionStorage.setItem("token", token);

        const payload = JSON.parse(atob(token.split(".")[1]));

        // ✅ Debug
        console.log("AuthContext login payload:", payload);
        console.log("AuthContext login role:", payload.role);

        // ✅ Set user with role
        setUser({
          email: payload.email,
          role: payload.role, // ✅ critical - must include role
          token,
        });

        // fetch profile in background
        try {
          const profileData = await getProfile(token);
          if (profileData?.data) {
            setProfile(profileData.data);
          }
        } catch {
          // ok if profile fails
        }

        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      console.error("AuthContext login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
