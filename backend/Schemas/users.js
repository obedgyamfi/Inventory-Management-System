const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Firstname: {
    required: true,
    type: String,
  },
  Lastname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  logDate: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
