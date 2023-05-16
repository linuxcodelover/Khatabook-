const { User } = require("../model/userSchema");
const { OTP } = require("../model/OTPSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//! New User Registration

const userRegister = async (userData, res) => {
  try {
    const { name, email, phone, password, address, business } = userData;

    // validating the email
    const isEmail = await User.findOne({ email });

    if (isEmail) {
      res.status(409).json({ msg: "email already exists", sucess: "false" });
    }

    // validating the phone number
    const isPhone = await User.findOne({ phone });

    if (isPhone) {
      res
        .status(409)
        .json({ msg: "Phone Number already exists", sucess: "false" });
    }

    // Hashing the password of user

    const hashpassword = await bcrypt.hash(password, 12);
    // console.log(hashpassword);

    const user = User.create({
      ...userData,
      password: hashpassword,
    });

    res.status(201).json({
      msg: `name ${name} registration successful...`,
      success: "true",
      statusCode: res.statusCode,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
      success: "false",
      statusCode: res.statusCode,
    });
  }
};

//! User OTP Generation

const generateOTP = async (userData, res) => {
  try {
    const { email } = userData;
    //  finding email from  userSchema
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      // generate otp
      const otp = Math.floor(100000 + Math.random() * 900000);

      // finding the email in OTPSchema
      const otpEmail = await OTP.findOne({ email: email });
      // console.log(otpEmail);

      if (otpEmail) {
        const updateData = await OTP.findByIdAndUpdate(
          { _id: otpEmail._id },
          {
            $set: {
              OTP1: otp,
            },
          },
          { new: true }
        );
        // console.log(updateData);
        await updateData.save();

        // sending the mail for already user exixts

        const tranporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOption = {
          from: process.env.EMAIL,
          to: email,
          subject: "OTP VERIFICATION",
          html: ` Your OTP is <h1>${otp}</h1>`,
        };

        tranporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log(error.message);
            res.status(400).json({
              msg: error.msg,
              status: "false",
              statusCode: res.statusCode,
            });
          } else {
            res.status(201).json({
              msg: `Email sent ${info.response}`,
              success: true,
              statusCode: res.statusCode,
            });
          }
        });
      } else {
        const newotpUSer = await OTP.create({
          email: email,
          OTP1: otp,
        });

        const tranporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOption = {
          from: process.env.EMAIL,
          to: email,
          subject: "OTP Verification",
          html: `Your OTP is <h1>${otp}</h1>`,
        };

        tranporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log(error.message);
            res.status(400).json({
              msg: error.msg,
              status: "false",
              statusCode: res.statusCode,
            });
          } else {
            res.status(201).json({
              msg: `Email sent ${info.response}`,
              success: true,
              statusCode: res.statusCode,
            });
          }
        });
      }
    } else {
      res.status(404).json({
        msg: (error.message, "email not fond"),
        success: "false",
        statusCode: res.statusCode,
      });
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).json({
      msg: error.message,
      success: "false",
      statusCode: res.statusCode,
    });
  }
};

//! the api for verifying the otp

const verifyOTP = async (userData, res) => {
  try {
    const { OTP1 } = userData;

    // finding the OTP User From OTP Schema
    const VerifiedOTP = await OTP.findOne({ OTP1: OTP1 });

    if (VerifiedOTP) {
      res.status(200).json({
        msg: `the ${VerifiedOTP.email} OTP Verified Successfylly,`,
        success: "true",
        statusCode: res.statusCode,
      });
    } else {
      res.status(400).json({
        msg: error.message,
        success: "false",
        statusCode: res.statusCode,
      });
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).json({
      msg: error.message,
      success: "false",
      statusCode: res.statusCode,
    });
  }
};

//! User Login

const loginUser = async (userData, res) => {
  try {
    const { email, password } = userData;

    // validating the email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(409).json({
        msg: "email does not exists",
        sucess: "false",
        statusCode: res.statusCode,
      });
    }

    // comparing the valid password
    const isMatch = await bcrypt.compare(password, user.password);

    // generating the token

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    user.tokens = await user.tokens.concat({ token: `Bearer ${token}` });
    await user.save();

    // console.log(token);

    if (isMatch) {
      res
        .status(201)
        .cookie(
          "jwt",
          token,
          (expires = new Date(Date.now() + 900000)),
          (httpOnly = true)
        )
        .json({
          msg: `${user.name} Login Successfully....`,
          success: "true",
          statusCode: res.statusCode,
        });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message, success: "false" });
  }
};

//! get the user profile

const userProfile = async (req, res) => {
  try {
    const data = [];
    const user = (await User.find(req.user)).map((elem) => {
      data.push(
        elem._id,
        elem.name,
        elem.email,
        elem.phone,
        elem.address,
        elem.business
      );
    });
    res.status(200).json({
      success: "true",
      statusCode: res.statusCode,
      user: data,
    });
  } catch (error) {
    console.log(error);
    res.status(302).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! get All User

const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({
      msg: "all user are here",
      success: "true",
      statusCode: res.statusCode,
      user: user,
    });
  } catch (error) {
    res
      .status(402)
      .json({ msg: error, status: "false", statusCode: res.statusCode });
  }
};

//! edit profile

const editUser = async (userData, req, res) => {
  try {
    const { name, business, address } = userData;
    const _id = req.user._id;
    // console.log(user);

    // edit name
    const editname = await User.findByIdAndUpdate(
      { _id },
      { $set: { name: name } }
    );

    // edit address
    const editaddress = await User.findByIdAndUpdate(
      { _id },
      { $set: { address: address } }
    );

    // edit business name
    const editbusiness = await User.findByIdAndUpdate(
      { _id },
      { $set: { business: business } }
    );

    res.status(200).json({
      msg: ` ${name} require data are updated`,
      success: "true",
      statusCode: res.statusCode,
    });
  } catch (error) {
    console.log(error.message);
    res.status(302).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! user Logout

const userLogout = async (req, res) => {
  try {
    const _id = req.user._id;
    console.log(_id);

    if (_id) {
      var result = await User.findByIdAndUpdate(
        { _id: _id },
        { $set: { tokens: [] } }
      );
    }

    res
      .status(200)
      .cookie("jwt", "", { expires: new Date(Date.now()) })
      .json({
        msg: "logout Succesfully",
        statusCode: res.statusCode,
        user: result,
      });
  } catch (error) {
    console.log(error);
    res.status(302).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

module.exports = {
  userRegister,
  generateOTP,
  verifyOTP,
  loginUser,
  userProfile,
  getAllUser,
  editUser,
  userLogout,
};
