import express from "express";
import {
  checkUserExists,
  createPassword,
  editUserProfile,
  login,
  profilePic,
  signUp,
} from "../controllers/user.controllers.js";
import {
  forgotPassword,
  resendOTP,
  resetPassword,
  verifyOTP,
} from "../controllers/forgotPassword.js";
import upload from "../../../utils/image/multer.js";

// write user routes logic here
const router = express.Router();

router.post("/get", checkUserExists);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/resend", resendOTP);
router.post("/create", createPassword);
router.post("/forgot", forgotPassword);
router.post("/reset/:userId", resetPassword);
router.put("/edit/:userId", editUserProfile);
router.put("/profile/:id", upload.single("profilePic"), profilePic);

export default router;
