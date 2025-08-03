import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Token ma jiro" });
    

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findOne({
//       _id: decoded.id,
//       isActive: true,
//     }).select("-password");

//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: "Ogolaansho la'aan, isticmaale ma jiro" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     res.status(401).json({
//       message: "Ogolaansho la'aan, token waa invalid ama wuu dhacay",
//     });
//   }
// };


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Ogolaansho la'aan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      isActive: true,
    }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Ogolaansho la'aan" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token-ka wuu dhacay" });
    }

    res.status(401).json({ message: "Token waa invalid" });
  }
};


export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Access denied. Invalid token." });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export default authMiddleware;
