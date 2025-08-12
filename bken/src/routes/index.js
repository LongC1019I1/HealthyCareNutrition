const coursesRouter = require("./courses");

const authRouter = require("./auth");
const uploadRouter = require("./upload");
const userRouter = require("./user");
const targetRoute = require("./target");
function route(app) {
  app.use("/courses", coursesRouter);
  app.use("/auth", authRouter);
  app.use("/upload", uploadRouter);
  app.use("/user", userRouter);
  app.use("/target", targetRoute);
}

module.exports = route;
