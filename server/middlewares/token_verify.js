const jwt = require("jsonwebtoken");

async function token_verify(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ msg: "Access Denied! No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_PASS);
    req.user = verified; // Attach user data to request
    next(); // Move to the next middleware or route
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
}

module.exports = token_verify;
