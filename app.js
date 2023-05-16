require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

const app = express();
const database = require("./database/connection");

//initialize cookie-parser
app.use(cookieParser());

// get the json deta using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", require("./router/userRouter"));
app.use("/api/v1/customer", require("./router/customerRouter"));
app.use("/api/v1/staff", require("./router/staffRouter"));

app.listen(PORT, () => {
  console.log(`the server is running on http://127.0.0.1:${PORT}`);
});
