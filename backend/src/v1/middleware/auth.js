const jwt = require("jsonwebtoken");

// 1. Verify User Identity
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Bearer token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adds user info (id, role) to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// 2. Verify User Permissions (Role-Based)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user has admin privileges if 'admin' role is required
    if (allowedRoles.includes('admin') && req.user.isAdmin) {
      return next();
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access forbidden: Insufficient permissions." });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
