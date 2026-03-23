import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "./../App";
import { useAuth } from "../contex/AuthContext";
import "./Login.css";
import heroImg from "../assets/hero-Img.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const navigate = useNavigate();
  const { setLoginStatus } = useContext(LoginContext);
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    if (!email) return toast.warn("Email must be entered");
    if (!password) return toast.warn("Password must be entered");

    setIsLoading(true);
    setLoadingMsg("Connecting to server...");

    const msgTimer1 = setTimeout(
      () => setLoadingMsg("Server is waking up, please wait..."),
      3000,
    );
    const msgTimer2 = setTimeout(() => setLoadingMsg("Almost there..."), 10000);
    const msgTimer3 = setTimeout(
      () => setLoadingMsg("Taking longer than usual, still trying..."),
      20000,
    );

    try {
      const result = await authLogin(email, password);

      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      clearTimeout(msgTimer3);

      // ✅ Debug - remove after fixing
      console.log("Login result:", result);

      if (result.success) {
        const token = sessionStorage.getItem("token");

        if (!token) {
          toast.error("Login failed: no token returned");
          setIsLoading(false);
          return;
        }

        // ✅ Decode token
        const payload = JSON.parse(atob(token.split(".")[1]));

        // ✅ Debug - remove after fixing
        console.log("Token payload:", payload);
        console.log("Role:", payload.role);

        // ✅ Save email to sessionStorage
        sessionStorage.setItem("email", payload.email);

        // ✅ Update login status
        setLoginStatus(true);

        toast.success("Login successful");

        // ✅ Small delay to make sure state updates before navigate
        setTimeout(() => {
          if (payload.role === "admin") {
            console.log("Navigating to /admin");
            navigate("/admin");
          } else {
            console.log("Navigating to /home");
            navigate("/home");
          }
        }, 100);
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      clearTimeout(msgTimer3);
      console.error("Login error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setLoadingMsg("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <img src={heroImg} alt="Online learning" className="login-image" />
        <h1 className="login-brand">E‑Learn Hub</h1>
        <p className="login-tagline">
          Continue your learning journey with top mentors.
        </p>
      </div>

      <div className="login-form-wrapper">
        <div className="login-card">
          <h2 className="login-heading">Log in to your account</h2>
          <p className="login-subheading">
            Welcome back! Please enter your details.
          </p>

          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            className="login-button"
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                {loadingMsg || "Signing in..."}
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default Login;
