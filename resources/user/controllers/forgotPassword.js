import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import generateOTP from "../../../utils/lib/OtpMessage.js";
import sendEmail from "../../../utils/email/email-sender.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { errorResMsg, successResMsg } from "../../../utils/lib/response.js";


// Define __dirname for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check for the user and save the OTP
    const user = await User.findOne({ email });
    if (!user) {
      // Handle the case when user is not found
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP(); // Generate OTP
    const url = `https://ogundigitalsummit.com/`;
    const expiresAt = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../../../utils/templates/forgotPassword.html"),
      "utf8"
    );

    const emailTemplate = htmlTemplate
      .replace("{{email}}", email)
      .replace("{{otp}}", otp)
      .replace("{{url}}", url);

    // Send a verification email
    await sendEmail(emailTemplate, "Forgot Password Email", email);

    // Save the OTP and expiration time to the user object
    user.otp = otp;
    user.otpExpiresAt = expiresAt; // Store the expiration timestamp
    await user.save();

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
    const { otp } = req.body; // Extract otp from request body
  
    try {
      // Find user by OTP instead of userId
      const user = await User.findOne({ otp });
  
      if (!user) {
        return res.status(404).json({ message: "User not found or invalid OTP" });
      }
  
      // Check if the OTP is not expired
      if (user.otpExpiresAt > Date.now()) {
        user.otp = null; // Clear OTP after successful verification
        user.otpExpiresAt = null;
        await user.save();
  
        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return res.status(500).json({ message: "OTP verification failed" });
    }
  };
  
export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { userId } = req.params;

  try {
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return errorResMsg(res, 400, "Passwords do not match");
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return errorResMsg(res, 404, "User not found");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return successResMsg(res, 200, "Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    return errorResMsg(res, 500, "Internal server error");
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check for the user and save the OTP
    const user = await User.findOne({ email });
    if (!user) {
      // Handle the case when user is not found
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP(); // Generate new OTP
    const url = `https://ogundigitalsummit.com/`;
    const expiresAt = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../../../utils/templates/resendOtp.html"),
      "utf8"
    );

    const emailTemplate = htmlTemplate
      .replace("{{email}}", email)
      .replace("{{otp}}", otp)
      .replace("{{url}}", url);

    // Send a verification email
    await sendEmail(emailTemplate, "Forgot Password Email", email);

    // Save the new OTP and expiration time to the user object
    user.otp = otp;
    user.otpExpiresAt = expiresAt; // Store the expiration timestamp
    await user.save();

    res.status(200).json({ message: "OTP resent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};