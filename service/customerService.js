const { customer } = require("../model/customer");

const updateAmount = async (
  user,
  amount,
  data,
  allCredited,
  allDebited,
  total
) => {
  const creditUpdate = await customer.findByIdAndUpdate(
    { _id: data || user },
    { $set: { total_credited: amount || allCredited } }
  );
  const debitUpdate = await customer.findByIdAndUpdate(
    { _id: data || user },
    { $set: { total_debited: amount || allDebited } }
  );
  const totalUpdate = await customer.findByIdAndUpdate(
    { _id: data || user },
    { $set: { total_amount: total } }
  );
};

module.exports = { updateAmount };
