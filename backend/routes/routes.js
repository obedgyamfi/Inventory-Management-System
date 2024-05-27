const express = require("express");
const UserModel = require("../Schemas/users");
const router = express.Router();
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10; // Adjust as needed (higher = more secure, slower)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function hashPasswordCheck(password, hash) {
  const saltRounds = 10; // Adjust as needed (higher = more secure, slower)
  const hashedPassword = await bcrypt.compare(password, hash);
  return hashedPassword;
}

router.post("/login", async (req, res) => {
  try {
    let EmailVal = req.body.email;
    let password = req.body.password;
    const user = await UserModel.findOne({ email: EmailVal });
    if (user) {
      hashPasswordCheck(password, user.password)
        .then((confirmation) => {
          return confirmation;
        })
        .then((data) => {
          if (data) {
            res.status(200).json("login was success");
          } else {
            res.status(200).json("invalid password !!");
          }
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
      res.status(200).json("User does not exist");
    }
  } catch (error) {
    console.error("Error checking user credentials:", error);
    return false; // Handle errors gracefully
  }
});

router.post("/upload_data", async (req, res) => {
  if (req.body.password !== "") {
    hashPassword(req.body.password)
      .then((hashedPassword) => {
        const data = new UserModel({
          name: req.body.name,
          gender: req.body.gender,
          email: req.body.email,
          password: hashedPassword,
          logDate: new Date(),
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

//Get all Method
// router.get("/getAll", async (req, res) => {
//   try {
//     const data = await Schema.find();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  res.send("Get by ID API");
});

//Update by ID Method
router.patch("/update/:id", (req, res) => {
  res.send("Update by ID API");
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID API");
});

module.exports = router;
