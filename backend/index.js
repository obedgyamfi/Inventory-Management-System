require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const mongoString = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // @shadow pls Add any other external script sources
      styleSrc: ["'self'", "'unsafe-inline'"], // @shadow pls Add any other external style sources
      imgSrc: ["'self'", "data:"], //@shadow pls  Add any other external image sources
      connectSrc: ["'self'"], // @shadow pls Add any other external connect sources
    },
  })
);

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  },
});
app.use(csrfProtection);

// Routes
app.use("/api", routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).send("Form tampered with");
  } else {
    res.status(500).send("Something went wrong");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
