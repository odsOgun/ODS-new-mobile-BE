import jwt from "jsonwebtoken";
import { errorResMsg } from "../utils/lib/response";
import logger from "../utils/log/logger";


const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return errorResMsg(res, 401, "Authentication failed");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return errorResMsg(res, 401, "Authentication failed");
    req.user = decoded;
    next();
  } catch (error) {
    return errorResMsg(res, 401, "Authentication failed: 🔒🔒🔒🔒🔒");
  }
};


export default isAuthenticated;
