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
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

app.use(authUser);

// Routes
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/courses", authUser, coursesRouter);
app.use("/students", authUser, studentRouter);
app.use("/video", videosRouter);

app.listen(PORT, () => {
  console.log(`Server Started At Port ${PORT}`);
});
