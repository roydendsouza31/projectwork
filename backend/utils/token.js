const jwt = require("jsonwebtoken");

const createNewToken = (userId) => {
  const secretKey = "my_secret_key_123"; // Replace 'your_secret_key_here' with your actual secret key
  return jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
};

module.exports = { createNewToken };
