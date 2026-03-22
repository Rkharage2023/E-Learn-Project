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
    origin: [
      "https://e-learn-project-ten.vercel.app",
      "https://e-learn-project-nzokdhodi-rkharage2023s-projects.vercel.app",
      "https://e-learn-project.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "email", "role"],
  })
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
