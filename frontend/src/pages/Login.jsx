import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
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
  const [serverReady, setServerReady] = useState(false);

  const navigate = useNavigate();
  const { setLoginStatus } = useContext(LoginContext);
  const { login: authLogin } = useAuth();

  // ✅ Ping server when login page loads so it wakes up early
  useEffect(() => {
    warmUpServer();
  }, []);

  const warmUpServer = async () => {
    try {
      await fetch("https://e-learn-project.onrender.com/health");
      setServerReady(true);
    } catch {
      // Server still waking up - that's ok
    }
  };

  const handleLogin = async () => {
    if (!email) {
      toast.warn("Email must be entered");
      return;
    }
    if (!password) {
      toast.warn("Password must be entered");
      return;
    }

    setIsLoading(true);

    // ✅ Show progressive loading messages
    setLoadingMsg("Connecting to server...");

    const msgTimer1 = setTimeout(() => {
      setLoadingMsg("Server is waking up, please wait...");
    }, 3000);

    const msgTimer2 = setTimeout(() => {
      setLoadingMsg("Almost there...");
    }, 10000);

    const msgTimer3 = setTimeout(() => {
      setLoadingMsg("Taking longer than usual, still trying...");
    }, 20000);

    try {
      const result = await authLogin(email, password);

      // Clear timers
      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      clearTimeout(msgTimer3);

      if (result.success) {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Login failed: no token returned");
          setIsLoading(false);
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        sessionStorage.setItem("email", payload.email);
        setLoginStatus(true);
        toast.success("Login successful");

        if (payload.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      clearTimeout(msgTimer3);
      toast.error("Server error, please try again");
    } finally {
      setIsLoading(false);
      setLoadingMsg("");
    }
  };

  return (
    <div className="login-container">
      {/* Left illustration */}
      <div className="login-illustration">
        <img src={heroImg} alt="Online learning" className="login-image" />
        <h1 className="login-brand">E‑Learn Hub</h1>
        <p className="login-tagline">
          Continue your learning journey with top mentors.
        </p>
      </div>

      {/* Right form */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <h2 className="login-heading">Log in to your account</h2>
          <p className="login-subheading">
            Welcome back! Please enter your details.
          </p>

          {/* ✅ Server status indicator */}
          <div className="server-status">
            <span
              className={`status-dot ${serverReady ? "status-ready" : "status-waking"}`}
            />
            <span className="status-text">
              {serverReady ? "Server ready" : "Warming up server..."}
            </span>
          </div>

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
              <span className="login-loading">
                <span className="login-spinner" />
                {loadingMsg || "Signing in..."}
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
