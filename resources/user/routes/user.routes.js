import express from "express";
import {
  acceptConnectionRequest,
  checkUserExists,
  createPassword,
  editUserProfile,
  getAllUsers,
  getConnectedUsers,
  getPendingConnections,
  getUserDetails,
  login,
  profilePic,
  sendConnectionRequest,
  signUp,
} from "../controllers/user.controllers.js";
import {
  forgotPassword,
  resendOTP,
  resetPassword,
  verifyOTP,
} from "../controllers/forgotPassword.js";
import upload from "../../../utils/image/multer.js";
import { isAuthenticated } from "../../../middleware/isAuthenticated.js";

// write user routes logic here
const router = express.Router();

// User details and profile management
router.get("/details/:userId", getUserDetails);
router.put("/edit/:userId", editUserProfile);
router.put("/profile/:id", upload.single("profilePic"), profilePic);

// Authentication routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/resend", resendOTP);
router.post("/create", createPassword);

// Password recovery routes
router.post("/forgot", forgotPassword);
router.put("/reset/:userId", resetPassword);

// Connection management
router.put("/:userId/connect", isAuthenticated, sendConnectionRequest);
router.put("/:userId/accept-connection", isAuthenticated, acceptConnectionRequest);
router.get("/connected", isAuthenticated, getConnectedUsers);
router.get("/pending-connect", isAuthenticated, getPendingConnections);

// General user-related routes
router.post("/get", checkUserExists);
router.get("/users", getAllUsers);


export default router;
