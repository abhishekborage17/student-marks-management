exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.session.userRole)) {
      next();
    } else {
      res.status(403).send("Access denied.");
    }
  };
};
