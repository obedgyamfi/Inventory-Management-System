const mongoose = require("mongoose");

const login = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: Number,
  },
});

module.exports = mongoose.model("Data", login);
