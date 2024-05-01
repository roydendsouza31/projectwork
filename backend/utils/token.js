const jwt = require("jsonwebtoken");

const createNewToken = (userId) => {
  const secretKey =
    "pqWTiaSXkVuZGs5kElyMXSEpHHu1dlBxz9qdcKBhhxp7j2z4BjNCxdlgrGNpwUn";
  return jwt.sign({ userId }, secretKey, { expiresIn: "1d" });
};

module.exports = { createNewToken };
