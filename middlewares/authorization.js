const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isAuthorized = async function (req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(403).json({ error: "Authorization header not found!" });
  }

  const token = authHeaders.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) return res.status(403).json({ error: "Not Authorized!" });
    next();
  } catch (ex) {
    return res.status(403).json({ error: "Not Authorized!" });
  }
};

module.exports = isAuthorized;
