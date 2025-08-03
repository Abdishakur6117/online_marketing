const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Ogolaansho la'aan! Admin kaliya" });
  }
  next();
};

export default adminMiddleware;
