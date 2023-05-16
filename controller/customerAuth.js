const { customer } = require("../model/customer");
const { Tranjection } = require("../model/TranjectionSchema");

//! Add Customer In The User List
const addCustomer = async (userData, req, res, next) => {
  try {
    const { name, email, phone, business } = userData;
    const d = new Date();
    const NewCustomer = await customer.create({
      ...userData,
      user: req.user,
      date: d.toLocaleDateString(),
    });

    res.status(201).json({
      msg: ` ${name} customer added succesfully`,
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

//! get the One  customer  Detail

const getOneCustomerProfile = async (userData, res) => {
  try {
    const { _id } = userData;

    //! 1) this function is using the map and reduce  methods

    // first find the customer from tranjectionModel with credited and debited
    const transactionUser = await Tranjection.find({
      user: _id,
    });

    // now find out total credit and total debit
    let credited = 0;
    let debited = 0;

    transactionUser.map((elem) => {
      if (elem.Status === "credited") {
        credited = credited + elem.amount;
      } else {
        debited = debited + elem.amount;
      }
    });
    let total = credited - debited;
    console.log(`the credited amount is ${credited}`);
    console.log(`the debited amount is ${debited}`);
    console.log(`the total_amount is ${total}`);

    // now populate the total_credit ,toral_debit and total_amount to the customer schema

    const data = {
      total_credited: credited,
      total_debited: debited,
      total_amount: total,
    };

    // find the customer first
    const customerdetail = await customer.findById({ _id });

    res.status(200).json({
      msg: " the user data are found as below",
      success: "true",
      statusCode: res.statusCode,
      user: customerdetail,
    });
  } catch (error) {
    console.log(error.message);
    res.status(402).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! get All Customer detail

const getAllCustomer = async (req, res) => {
  try {
    //! setting the total value of the customer's

    var total_credited = await Tranjection.aggregate([
      { $match: { Status: "credited" } },
      {
        $group: { _id: "$Status", total: { $sum: "$amount" } },
      },
    ]);
    var total_debited = await Tranjection.aggregate([
      { $match: { Status: "debited" } },
      {
        $group: { _id: "$Status", total: { $sum: "$amount" } },
      },
    ]);

    let credit = 0;
    let debit = 0;
    const totalCredit = total_credited.map((elem) => {
      credit = credit + elem.total;
    });
    const totaldebit = total_debited.map((elem) => {
      debit = debit + elem.total;
    });
    const allCredited = credit;
    const allDebited = debit;
    const totalMoney = credit - debit;

    //! setting the inner Amount value of customers
    // taking the id constant array
    const idArray = [];

    const Allcustomer = await customer.find({});
    // first get the all customer _id
    const allid = Allcustomer.map(async (elem) => {
      idArray.push(elem._id);
    });
    for (let i = 0; i < idArray.length; i++) {
      const transactionUser = await Tranjection.find({
        user: idArray[i],
      });
      // now find out total credit and total debit
      let credited = 0;
      let debited = 0;
      transactionUser.map((elem) => {
        if (elem.Status === "credited") {
          credited = credited + elem.amount;
        } else {
          debited = debited + elem.amount;
        }
      });
      let allCredited = credited;
      let allDebited = debited;
      let total = credited - debited;
      // console.log(`the credited amount is ${credited}`);
      // console.log(`the debited amount is ${debited}`);
      // console.log(`the total_amount is ${total}`);

      // now updata the customer schema the total_credit ,toral_debit and total_amount to the customer schema
      const creditUpdate = await customer.findByIdAndUpdate(
        { _id: idArray[i] || user },
        { $set: { total_credited: allCredited } }
      );
      const debitUpdate = await customer.findByIdAndUpdate(
        { _id: idArray[i] || user },
        { $set: { total_debited: allDebited } }
      );
      const totalUpdate = await customer.findByIdAndUpdate(
        { _id: idArray[i] || user },
        { $set: { total_amount: total } }
      );
      var customedetail = await customer.find({});
    }

    res.status(200).json({
      msg: "all customer are here",
      success: "true",
      Total_CreditedAmount: allCredited,
      Total_DebitedAmount: allDebited,
      total_Amount: totalMoney,
      statusCode: res.statusCode,
      customers: customedetail,
    });
  } catch (error) {
    console.log(error.message);
    res.status(402).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

//! get amount from the customer For Accounting

const EnterAmount = async (userData, res) => {
  try {
    const { user, amount, Status } = userData;

    if (!user === "" || !amount === "" || Status === "") {
      res.status(400).json({
        msg: `plz fill the require User:-${user} Amount:-${amount} Status:-${Status}`,
        status: "false",
        statusCode: res.statusCode,
      });
    }

    if (Status === "credited") {
      const newAmount = Tranjection.create({
        ...userData,
        total_credited: amount,
        date: new Date(),
      });
      res.status(200).json({ msg: `the ${amount} is ${Status}` });
    } else {
      if (Status === "debited") {
        const newAmount = Tranjection.create({
          ...userData,
          total_debited: amount,
          date: new Date(),
        });
        res.status(200).json({ msg: `the ${amount} is ${Status}` });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(402).json({
      msg: error.message,
      status: "false",
      statusCode: res.statusCode,
    });
  }
};

module.exports = {
  addCustomer,
  getOneCustomerProfile,
  getAllCustomer,
  EnterAmount,
};
