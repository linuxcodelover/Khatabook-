const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connection successfull...");
  })
  .catch((error) => {
    console.log(error.message);
  });
