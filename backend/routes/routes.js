const express = require("express");
const UserModel = require("../Schemas/users");
const OrderDetails = require("../Schemas/orders");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const limiter = require("../Schemas/limiter");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const secretKey = process.env.JWT_KEY;
//verify JWT token
function verifyToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(403)
      .json({ message: "No token provided, please log in" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    // If token is valid, save user ID to request for use in other routes
    req.userId = decoded.userId;
    next();
  });
}

// Generate a JWT token
function generateToken(userId) {
  const payload = { userId };
  const token = jwt.sign(payload, secretKey, { expiresIn: "30m" });
  return token;
}

// Verify password hash
async function hashPasswordCheck(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Async function for user login
async function userLogin(email, password) {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("User does not exist");
  }

  const passwordMatch = await hashPasswordCheck(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user._id);
  return { token, message: "success" };
}

router.get("/csrf-token", csrfProtection, (req, res) => {
  try {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken, {
      sameSite: "Strict",
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    });
    res.json({ csrfToken });
    console.log("Generated CSRF token:", csrfToken);
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    res.status(500).send("Error generating CSRF token");
  }
});

// Login endpoint with CSRF protection,limiter,validation,CSP
router.post("/login", limiter, csrfProtection, async (req, res) => {
  try {
    console.log("CSRF token received in header:", req.headers["x-xsrf-token"]);
    const csrfToken = req.headers["x-xsrf-token"];
    const email = req.body.email;
    const password = req.body.password;

    if (!csrfToken) {
      res.status(403).send("Missing CSRF token");
      return;
    }

    const result = await userLogin(email, password);
    res.cookie("jwt", result.token, { httpOnly: true, secure: true });
    res.status(200).json(result.message);
  } catch (error) {
    if (error.message === "CSRF token expired") {
      res.status(403).send("CSRF token expired");
    } else if (error.message === "User does not exist") {
      res.status(404).json("User does not exist");
    } else if (error.message === "Invalid password") {
      res.status(400).json("Invalid password");
    } else if (error.message === "Invalid email format") {
      res.status(400).json("Invalid email format");
    } else {
      console.error("Error checking user credentials:", error);
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
});

// Signup
router.post("/upload_data", async (req, res) => {
  if (req.body.password !== "") {
    hashPassword(req.body.password)
      .then((hashedPassword) => {
        const data = new UserModel({
          name: req.body.name,
          gender: req.body.gender,
          email: req.body.email,
          password: hashedPassword,
          logDate: req.body.logDate,
          status: req.body.status,
        });

        return data.save(); // Return the promise from data.save() for chaining
      })
      .then((dataToSave) => {
        res.status(200).json("success");
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          // Handle validation errors specifically
          res.status(400).json({ message: error.message });
        } else {
          console.error("Error hashing password or saving data:", error);
          res.status(500).json({ message: "Internal server error" }); // Generic error for unexpected issues
        }
      });
  } else {
    // Handle case where password is empty
    res.status(400).json({ message: "Password cannot be empty" });
  }
});

router.post("/add_order", verifyToken, csrfProtection, async (req, res) => {
  const { customer, customer_email, type, status, amount, log_Date } = req.body;

  if (!customer || !customer_email || !type || !status || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!customer || !validator.isAlpha(customer)) {
    return res.status(400).json({
      message: "Customer name is required and should contain only letters",
    });
  }
  if (!customer_email || !validator.isEmail(customer_email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (!type || !validator.isAlpha(type)) {
    return res
      .status(400)
      .json({ message: "Type is required and should contain only letters" });
  }
  if (!status || !validator.isInt(status.toString())) {
    return res
      .status(400)
      .json({ message: "Status is required and should be an integer" });
  }
  if (!amount || !validator.isFloat(amount.toString())) {
    return res
      .status(400)
      .json({ message: "Amount is required and should be a number" });
  }
  if (!log_Date || !validator.isISO8601(log_Date)) {
    return res
      .status(400)
      .json({ message: "Valid date is required in ISO 8601 format" });
  }
  try {
    const data = new OrderDetails({
      customer: validator.escape(customer),
      customer_email: validator.normalizeEmail(customer_email),
      type: validator.escape(type),
      status: validator.toInt(status.toString()),
      amount: validator.toFloat(amount.toString()),
      log_Date: new Date(log_Date),
    });
    const response = await data.save();
    if (response) {
      res
        .status(200)
        .json({ message: "operation was successful", order: response });
    }
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    res.status(500).json({ message: "Error saving data to MongoDB" });
  }
});

module.exports = router;
