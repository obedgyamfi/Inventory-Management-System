try {
  const csrfToken = req.headers["x-xsrf-token"];

  // const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  // if (csrfToken) {
  //   const cookieAge = Date.now() - req.cookies.createdAt.getTime();
  //   if (cookieAge > maxAge) {
  //     res.status(403).send("CSRF token expired");
  //     return;
  //   } else {
  //     let EmailVal = req.body.email.toLowerCase();
  //     let password = req.body.password;
  //     const user = await UserModel.findOne({ email: EmailVal });
  //     if (user) {
  //       hashPasswordCheck(password, user.password)
  //         .then((confirmation) => {
  //           return confirmation;
  //         })
  //         .then((data) => {
  //           if (data) {
  //             const token = generateToken(userId);
  //             res.cookie("jwt", token, { httpOnly: true, secure: true });
  //             res.status(200).json("login was success");
  //           } else {
  //             res.status(200).json("invalid password !!");
  //           }
  //         })
  //         .catch((error) => {
  //           if (error.name === "ValidationError") {
  //             res
  //               .status(400)
  //               .json({ message: "Validating user ended with errors" });
  //           } else {
  //             console.error("Error hashing password or saving data:", error);
  //             res.status(500).json({ message: "Unexpected error occurred" }); // Generic error for unexpected issues
  //           }
  //         });
  //     } else {
  //       res.status(200).json("User does not exist");
  //     }
  //   }
  // } else {
  //   // Handle the case where the cookie is missing
  //   res.status(403).send("Missing CSRF token");
  //   return;
  // }
} catch (error) {
  console.error("Error checking user credentials:", error);
  return false; // Handle errors gracefully
}

try {
  const csrfToken = req.headers["x-xsrf-token"];

  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  if (csrfToken) {
    const cookieAge = Date.now() - req.cookies.createdAt.getTime();
    if (cookieAge > maxAge) {
      res.status(403).send("CSRF token expired");
      return;
    } else {
      let EmailVal = req.body.email.toLowerCase();
      let password = req.body.password;
      const user = await UserModel.findOne({ email: EmailVal });
      if (user) {
        hashPasswordCheck(password, user.password)
          .then((confirmation) => {
            return confirmation;
          })
          .then((data) => {
            if (data) {
              const token = generateToken(userId);
              res.cookie("jwt", token, { httpOnly: true, secure: true });
              res.status(200).json("login was success");
            } else {
              res.status(200).json("invalid password !!");
            }
          })
          .catch((error) => {
            if (error.name === "ValidationError") {
              res
                .status(400)
                .json({ message: "Validating user ended with errors" });
            } else {
              console.error("Error hashing password or saving data:", error);
              res.status(500).json({ message: "Unexpected error occurred" }); // Generic error for unexpected issues
            }
          });
      } else {
        res.status(200).json("User does not exist");
      }
    }
  } else {
    // Handle the case where the CSRF token is missing
    res.status(403).send("Missing CSRF token");
    return;
  }
} catch (error) {
  console.error("Error checking user credentials:", error);
  return false; // Handle errors gracefully
}

async function userLogin(...args) {
  values = [...args];
  email = args[0];
  password = args[1];
  if (validator.isEmail(email)) {
    return "Validating user ended with errors";
  } else {
    try {
      const csrfToken = req.headers["x-xsrf-token"];
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (csrfToken) {
        const cookieAge = Date.now() - req.cookies.createdAt.getTime();
        if (cookieAge > maxAge) {
          return "CSRF token expired";
        } else {
          const user = await UserModel.findOne({ email: EmailVal });
          if (user) {
            hashPasswordCheck(password, user.password)
              .then((confirmation) => {
                return confirmation;
              })
              .then((data) => {
                if (data) {
                  const token = generateToken(userId);
                  res.cookie("jwt", token, { httpOnly: true, secure: true });
                  return "success";
                } else {
                  return "invalid password !!";
                }
              })
              .catch((error) => {
                if (error.name === "ValidationError") {
                  return "Validating user ended with errors";
                } else {
                  return "Error hashing password or saving data:";
                  // Generic error for unexpected issues
                }
              });
          } else {
            return "User does not exist";
          }
        }
      } else {
        // Handle the case where the CSRF token is missing
        return "Missing CSRF token";
      }
    } catch (error) {
      return "Error checking user credentials:"; // Handle errors gracefully
    }
  }
}
// Login endpoint with CSRF protection
router.post("/login", limiter, (req, res) => {
  console.log("CSRF token received in header:", req.headers["x-xsrf-token"]);
  let EmailVal = req.body.email.toLowerCase();
  let password = req.body.password;
  let Login = userLogin(EmailVal, password);
  if (Login == "CSRF token expired") {
    res.status(403).send("CSRF token expired");
  } else if (Login == "User does not exist") {
    res.status(200).json("User does not exist");
  } else if (Login == "Error checking user credentials") {
    res.status(403).send("Missing CSRF token");
  } else if (Login == "Unexpected error occurred") {
    res.status(500).json({ message: "Unexpected error occurred" });
  } else if (Login == "Error hashing password or saving data") {
    res.status(403).send("Error hashing password or saving data");
  } else if (Login == "Validating user ended with errors") {
    res.status(400).json({ message: "Validating user ended with errors" });
  } else if (Login == "invalid password !!") {
    res.status(400).json({ message: "invalid password !!" });
  } else if (Login == "success") {
    res.status(200).json("success");
  }
});
