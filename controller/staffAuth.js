const { Staff } = require("../model/staffSchema");
const { Attandance } = require("../model/AttendanceSchema");
const moment = require("moment");
const { isValidObjectId } = require("mongoose");

//! add staff to the user list account

const addStaff = async (userData, req, res, next) => {
  try {
    const { name, phone, address } = userData;

    const NewStaffMember = await Staff.create({
      ...userData,
      user: req.user,
    });

    res.status(201).json({
      msg: ` ${name} staff member added succesfully`,
      success: "true",
      statusCode: res.statusCode,
    });
    next();
  } catch (error) {
    res.status(402).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! get all staff member detail
const getStaffDetail = async (req, res) => {
  try {
    const staffDetail = await Staff.find({});
    res.status(200).json({
      msg: "All Staff Members",
      success: "true",
      statusCode: res.statusCode,
      staff: staffDetail,
    });
  } catch (error) {
    res.status(402).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//!  staff attandance functionality

const staffAttendance = async (userData, res) => {
  try {
    const { data } = userData;

    const startDate = moment().startOf("day").toDate();
    const endDate = moment().endOf("day").toDate();

    const responce = await Promise.all(
      data.map(async (elem) => {
        if (!isValidObjectId(elem.StaffId)) {
          throw new Error(`${elem.StaffId}  invalid StaffId`);
        }

        const staff = await Staff.findById(elem.StaffId);

        if (!staff) {
          throw new Error(`staff not found for  ${elem.StaffId}`);
        }
        const TodayAttandance = await Attandance.findOne({
          StaffId: staff._id,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        if (!TodayAttandance) {
          const present = await Attandance.create({
            StaffId: staff._id,
            name: staff.name,
            Attandances: elem.Attandances,
            date: moment().toDate().toLocaleDateString(),
          });
        }
      })
    );
    return res.status(200).json({ msg: "attandance filled up successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! Show Staff Attandance
const showAttandance = async (userData, res) => {
  try {
    const { StaffId, month, year } = userData;

    const dateSting = `${month} ${year}`;
    const dateFormate = "MM YYYY";
    const startDate = moment(dateSting, dateFormate).startOf("month").toDate();
    const endDate = moment(dateSting, dateFormate).endOf("month").toDate();

    const StaffUser = await Attandance.find({
      StaffId: StaffId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    if (!StaffUser) {
      res.status(404).json({
        msg: "staff member not found",
        status: "false",
        statusCode: res.statusCode,
      });
    } else {
      res.status(200).json({
        msg: `Attandances are as below`,
        statusCode: res.statusCode,
        attandance: StaffUser,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

module.exports = { addStaff, getStaffDetail, staffAttendance, showAttandance };
