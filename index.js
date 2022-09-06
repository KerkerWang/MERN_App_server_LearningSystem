const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// connect to Mongo Atlas
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to Mongo Atlas.");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
// parse incoming requests with JSON payloads
app.use(express.json());
// parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// cors()可讓兩個port同時運作在同一網站上
app.use(cors());
// 將"/api/user"路徑導向authRoute, 不需被保護, 任何人都可以註冊
app.use("/api/user", authRoute);
// 將"/api/courses"路徑導向courseRoute, 需要被passport保護, 資格為instructor才可製作course
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
// 這裡的port不能選3000，因為react預設運行的port為3000，所以server需選一個非3000的port。
