require("dotenv").config();

const mongoString = process.env.DATABASE_URL;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5500",
  })
);
app.use(bodyParser.json());
app.use("/api", routes);

mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.listen(3000, () => {
  console.log(`Server Started at ${port}`);
});
