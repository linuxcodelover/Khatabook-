const { User } = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const IsAuthorize = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    // console.log(token);

    if (!token) {
      res.status(400).json({ msg: "login first" });
    }

    const VerifyUser = await jwt.verify(token, process.env.JWT_SECRET);

    if (!VerifyUser) {
      res.status(400).json({ msg: "you are not authorize user " });
    }
    req.user = await User.findOne({ _id: VerifyUser._id });

    // console.log(req.user);
    next();
  } catch (error) {
    res.status(404).json({
      msg: error.message,
      success: "false",
      statuscode: res.statuscode,
    });
  }
};

module.exports = { IsAuthorize };
