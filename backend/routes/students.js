const express = require("express");

const pool = require("../db/pool");
const result = require("../utils/createResult");
const cryptojs = require("crypto-js");

const router = express.Router();

// router.post("/register-to-course", (req, res) => {
//   const { name, email, course_id, mobile_no } = req.body;
//   const sql1 = "select * from users where email = ?";
//   pool.query(sql1, [email], (error, data) => {
//     if (data.length == 0) {
//       const sql2 = "insert into users(email,password) values (?, ?)";
//       const password = "student";
//       const hashedPassword = cryptojs.SHA256(password).toString();
//       pool.query(sql2, [email, hashedPassword], (error, data) => {
//         if (error) {
//           return res.status(401).send({
//             msg: error,
//           });
//         }
//       });
//       const sql =
//         "insert into students(name,email,course_id,mobile_no) values(?,?,?,?)";
//       pool.query(sql, [name, email, course_id, mobile_no], (error, data) => {
//         return res.send(result.createResult(error, data));
//       });
//     } else {
//       const sql =
//         "insert into students(name,email,course_id,mobile_no) values(?,?,?,?)";
//       pool.query(sql, [name, email, course_id, mobile_no], (error, data) => {
//         if (error) {
//           return res.send({ error: error });
//         }
//         return res.send({
//           data: data,
//         });
//       });
//     }
//   });
// });

// routes/students.js
router.post("/register-to-course", (req, res) => {
  const { name, email, course_id, mobile_no } = req.body;

  // Step 1: Check if already enrolled
  const checkEnrollSql = "SELECT * FROM students WHERE email = ? AND course_id = ?";
  pool.query(checkEnrollSql, [email, course_id], (err, rows) => {
    if (err) return res.send({ status: "error", error: err });

    if (rows.length > 0) {
      return res.send({
        status: "exists",
        message: "User already registered for this course",
      });
    }

    // Step 2: Check if user account exists
    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    pool.query(checkUserSql, [email], (err, users) => {
      if (err) return res.send({ status: "error", error: err });

      if (users.length === 0) {
        // Step 3a: Create user account first, THEN enroll
        const createUserSql = "INSERT INTO users(email, password) VALUES (?, ?)";
        const hashedPassword = cryptojs.SHA256("student").toString();

        pool.query(createUserSql, [email, hashedPassword], (err) => {
          if (err) return res.status(401).send({ status: "error", error: err });

          // ✅ Only enroll AFTER user is created (no race condition)
          enrollStudent(name, email, course_id, mobile_no, res);
        });
      } else {
        // Step 3b: User exists, just enroll
        enrollStudent(name, email, course_id, mobile_no, res);
      }
    });
  });
});

// ✅ Extracted helper to avoid duplication
function enrollStudent(name, email, course_id, mobile_no, res) {
  const sql = "INSERT INTO students(name, email, course_id, mobile_no) VALUES (?, ?, ?, ?)";
  pool.query(sql, [name, email, course_id, mobile_no], (err, data) => {
    if (err) return res.send({ status: "error", error: err });
    return res.send({ status: "success", data });
  });
}

router.put("/change-password", (req, res) => {
  const email = req.headers.email;
  const { newPassword, confirmPassword } = req.body;
  if (newPassword == confirmPassword) {
    const hashedPassword = cryptojs.SHA256(newPassword).toString();
    const sql = `update users set password = ? where email = ?`;
    pool.query(sql, [hashedPassword, email], (error, data) => {
      res.send(result.createResult(error, data));
    });
  } else {
    res.send(`Password Does Not Match`);
  }
});

// router.get("/my-course", (req, res) => {
//   const email = req.headers.email;
//   if (!email) {
//     return res.send(result.createResult("Unauthorized"));
//   }
//   const sql = `select u.email,s.name,c.course_id,c.course_name
//   from users u inner join students s on (u.email = s.email)
//   inner join courses c on (c.course_id = s.course_id)
//   where u.email = ?`;
//   pool.query(sql, [email], (error, data) => {
//     res.send(result.createResult(error, data));
//   });
// });

router.get("/my-courses/:email", (req, res) => {
  const { email } = req.params;

  const sql = `
    SELECT DISTINCT c.course_id, c.course_name, c.description, c.fees
    FROM courses c
    JOIN students s ON c.course_id = s.course_id
    WHERE s.email = ?
  `;

  pool.query(sql, [email], (err, data) => {
    if (err) {
      res.send({ status: "error", error: err });
    } else {
      res.send({ status: "success", data });
    }
  });
});

router.get("/my-course-with-videos", (req, res) => {
  const email = req.headers.email;
  if (!email) {
    return res.send(result.createResult("Unauthorized"));
  }
  const sql = `SELECT distinct
  c.course_id,
  v.video_id,
  v.title,
  v.description,
  v.youtube_url,
  v.added_at
FROM students s
JOIN courses c ON c.course_id = s.course_id
JOIN videos v ON v.course_id = c.course_id
WHERE s.email = ?
AND DATE_ADD(v.added_at, INTERVAL c.video_expire_days DAY) >= CURDATE();
`;
  pool.query(sql, [email], (error, data) => {
    res.send(result.createResult(error, data));
  });
});

module.exports = router;
