const express = require("express");
const coursesRouter = require("./routes/courses");
const adminRouter = require("./routes/admin");
const studentRouter = require("./routes/students");
const { authUser } = require("./utils/auth");
const userRouter = require("./routes/users");
const videosRouter = require("./routes/videos");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "https://e-learn-project-ten.vercel.app",
      ];

      // ✅ Allow ANY vercel.app subdomain for your project
      const isVercel = origin.endsWith(".vercel.app");

      if (allowedOrigins.includes(origin) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "email", "role"],
  }),
);

app.use(express.json());
// app.use(authUser);
app.use("/courses", coursesRouter); // public routes handle their own auth via roleAuthorization
app.use("/users", authUser, userRouter); // ✅ protect user routes
app.use("/students", authUser, studentRouter);
app.use("/admin", authUser, adminRouter);
app.use("/video", authUser, videosRouter);

app.listen(PORT, () => {
  console.log(`Server Started At Port ${PORT}`);
});
