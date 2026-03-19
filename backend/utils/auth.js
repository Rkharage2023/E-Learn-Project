// utils/auth.js
const jwt = require("jsonwebtoken");
const result = require("./createResult");
const config = require("./config");

// ✅ Routes that don't need a token — matched by [method, path substring]
const PUBLIC_ROUTES = [
  { method: "POST", path: "/signin" },
  { method: "POST", path: "/signup" },
  { method: "GET", path: "/all-courses" },
  { method: "GET", path: "/all-active-courses" },
  { method: "POST", path: "/register-to-course" },
];

function authUser(req, res, next) {
  const isPublic = PUBLIC_ROUTES.some(
    (r) => r.method === req.method && req.path.startsWith(r.path),
  );

  if (isPublic) return next();

  const token = req.headers.token;

  if (!token) {
    return res.send(result.createResult("Token Is Missing"));
  }

  try {
    const payload = jwt.verify(token, config.SECRET);
    req.headers.uid = payload.uid;
    req.headers.email = payload.email;
    req.headers.role = payload.role;
    next();
  } catch {
    res.send(result.createResult("Token Is Invalid"));
  }
}

function roleAuthorization(req, res, next) {
  const role = req.headers.role;
  if (role === "admin") {
    return next();
  }
  // ✅ Return proper JSON instead of plain text
  return res.status(403).send(result.createResult("Not Authorized"));
}

module.exports = { authUser, roleAuthorization };
