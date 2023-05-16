const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    StaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      require: true,
    },
    name: {
      type: String,
      require: "true",
    },
    Attandances: {
      type: String,
      enum: ["Present", "Absent"],
      require: true,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Attandance = mongoose.model("Attadance", attendanceSchema);

module.exports = { Attandance };
