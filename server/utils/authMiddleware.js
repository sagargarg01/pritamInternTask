const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Checks if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
  const { intern } = req.cookies;
  if (!intern) {
    return res.status(401).json({
      message: "session ended",
      success: false,
    });
  }

  const decoded = jwt.verify(intern, "secretKeY");
  const user = await User.findById(decoded.id);

  req.user = user;

  next();
};
