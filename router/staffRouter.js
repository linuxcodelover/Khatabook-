const express = require("express");
const staffRouter = express.Router();

const { IsAuthorize } = require("../middleware/userMiddleware");
const {
  addStaff,
  getStaffDetail,
  staffAttendance,
  showAttandance,
} = require("../controller/staffAuth");

// add the staff in user list
staffRouter.post("/addStaff", IsAuthorize, async (req, res, next) => {
  await addStaff(req.body, req, res, next);
});

// get all staff member list
staffRouter.get("/getStaffDetail", IsAuthorize, async (req, res) => {
  await getStaffDetail(req, res);
});

// Fill staff attandance route
staffRouter.post("/staffAttandance", IsAuthorize, async (req, res) => {
  await staffAttendance(req.body, res);
});

// show the staff attndance month wise using the staff id

staffRouter.get("/showAttandance", IsAuthorize, async (req, res) => {
  await showAttandance(req.body, res);
});

module.exports = staffRouter;
