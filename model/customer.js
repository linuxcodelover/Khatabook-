const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      min: 10,
      max: 10,
    },
    business: {
      type: String,
      require: true,
    },
    total_credited: {
      type: Number,
      require: true,
    },
    total_debited: {
      type: Number,
      require: true,
    },

    total_amount: {
      type: Number,
      require: true,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

var customer = mongoose.model("Customers", customerSchema);

module.exports = { customer };
