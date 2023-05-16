const mongoose = require("mongoose");

const amountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    Status: {
      type: String,
      require: true,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tranjection = mongoose.model("Tranjection", amountSchema);

module.exports = { Tranjection };
