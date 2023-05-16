const express = require("express");
const customerRouter = express.Router();

const { IsAuthorize } = require("../middleware/userMiddleware");
const {
  addCustomer,
  getOneCustomerProfile,
  getAllCustomer,
  EnterAmount,
} = require("../controller/customerAuth");

// Add New customer in user account
customerRouter.post("/addCustomer", IsAuthorize, async (req, res, next) => {
  await addCustomer(req.body, req, res, next);
});

// get the profile of the customer
customerRouter.get("/onecustomerprofile", IsAuthorize, async (req, res) => {
  await getOneCustomerProfile(req.body, res);
});

// get all customer  list
customerRouter.get("/getallcustomer", IsAuthorize, async (req, res, next) => {
  await getAllCustomer(req, res);
});

// get amount from the customer
customerRouter.post("/customeramounts", IsAuthorize, async (req, res) => {
  await EnterAmount(req.body, res);
});

module.exports = customerRouter;
