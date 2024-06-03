const crypto = require("crypto");
function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

const secretKey = generateRandomString(32);
console.log(secretKey);
