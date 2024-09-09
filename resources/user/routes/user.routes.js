import express from "express";
import { createPassword, login, signUp } from "../controllers/user.controllers.js";
import { forgotPassword, resendOTP, resetPassword, verifyOTP } from "../controllers/forgotPassword.js";

// write user routes logic here
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/verify", verifyOTP);
router.put("/resend", resendOTP);
router.put("/create", createPassword);
router.put("/forgot", forgotPassword);
router.put("/reset/:userId", resetPassword);



export default router;
