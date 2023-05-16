const express = require("express");
const userRouter = express.Router();
const {
  userRegister,
  generateOTP,
  verifyOTP,
  loginUser,
  userProfile,
  getAllUser,
  userLogout,
  editUser,
} = require("../controller/userAuth");

// initializing the middleware
const { IsAuthorize } = require("../middleware/userMiddleware");

// register user route
userRouter.post("/register-user", async (req, res) => {
  await userRegister(req.body, res);
});

//  User OTP Verification
userRouter.post("/generate-otp", async (req, res) => {
  await generateOTP(req.body, res);
});

//  User OTP Verification
userRouter.post("/verify-otp", async (req, res) => {
  await verifyOTP(req.body, res);
});

// login user route
userRouter.post("/login-user", async (req, res) => {
  await loginUser(req.body, res);
});

//user profile route
userRouter.get("/user-profile/", IsAuthorize, async (req, res) => {
  await userProfile(req, res);
});

//get  all user profile route
userRouter.get("/allUser/", IsAuthorize, async (req, res) => {
  await getAllUser(req, res);
});
+(
  //edit user profile route
  userRouter.patch("/editUser/", IsAuthorize, async (req, res) => {
    await editUser(req.body, req, res);
  })
);

// user Logout
userRouter.get("/logout", IsAuthorize, async (req, res) => {
  await userLogout(req, res);
});

module.exports = userRouter;
