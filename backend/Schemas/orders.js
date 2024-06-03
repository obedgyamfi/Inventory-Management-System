const mongoose = require("mongoose");

const login = new mongoose.Schema({
  customer: {
    required: true,
    type: String,
  },
  customer_email: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  amount: {
    required: true,
    type: Number,
  },
  log_Date: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Orders", login);
