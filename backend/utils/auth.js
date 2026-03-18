const jwt = require("jsonwebtoken");

const result = require("./createResult");
const config = require("../utils/config");
const API_URL = process.env.REACT_APP_API_URL;

function authUser(req, res, next) {
  const path = req.url;
  console.log(path);
  if (
    path == `${API_URL}/users/signin` ||
    path == `${API_URL}/users/signup` ||
    path == `${API_URL}/courses/all-courses` ||
    path == `${API_URL}/courses/all-active-courses` ||
    path == `${API_URL}/students/register-to-course`
  ) {
    next();
  } else {
    const token = req.headers.token;
    if (!token) {
      res.send(result.createResult(`Token Is Missing`));
    } else {
      try {
        const payload = jwt.verify(token, config.SECRET);
        req.headers.uid = payload.uid;
        req.headers.email = payload.email;
        req.headers.role = payload.role;

        next();
      } catch (ex) {
        res.send(result.createResult(`Token Is Invalid`));
      }
    }
  }
}

function roleAuthorization(req, res, next) {
  const role = req.headers.role;
  if (role === "admin") {
    console.log(`welcome admin`);
    return next();
  } else {
    console.log(`Not Authorized`);
    res.send(`Not Authorized`);
  }
}

module.exports = { authUser, roleAuthorization };
