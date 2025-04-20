const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check admin authentication
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
};

const checkAuth = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({
        status: "fail",
        message: "No token provided",
      });
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token or token expired",
    });
  }
};

module.exports = {
  isAdmin,
  checkAuth,
};
