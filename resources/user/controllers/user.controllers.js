import { errorResMsg, successResMsg } from "../../../utils/lib/response.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import User from "../models/user.js";
import { passwordHash, passwordCompare } from "../../../utils/lib/bcrypt.js";
import { signUpSchema } from "../../../utils/validation/validation.js";
import fs from "fs";
import path from "path";
import generateOTP from "../../../utils/lib/OtpMessage.js";
import sendEmail from "../../../utils/email/email-sender.js";
import { createJwtToken } from "../../../middleware/isAuthenticated.js";

// Define __dirname for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return errorResMsg(res, 400, "Email is required");
    }

    // Check if the email is already registered
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return errorResMsg(res, 400, "Email already registered");
    }

    // Generate OTP
    const otp = generateOTP(); // Generate OTP using the imported function
    const url = `https://ogundigitalsummit.com/`;

    // Load email template
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../../../utils/templates/emailVerify.html"),
      "utf8"
    );

    // Replace placeholders with actual values
    const emailTemplate = htmlTemplate
      .replace("{{email}}", email)
      .replace("{{otp}}", otp)
      .replace("{{url}}", url);

    // Send verification email
    await sendEmail(emailTemplate, "Verify Email", email);

    // Create a new user instance with only email and OTP
    const newUser = new User({
      email,
      otp, // Store the OTP in the user object
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return success response
    return successResMsg(res, 201, {
      success: true,
      user: savedUser,
      message: "User created successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return errorResMsg(res, 400, "Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return errorResMsg(res, 404, "User not found");
    }

    // Check if the password is correct
    const isPasswordValid = await passwordCompare(password, user.password);
    if (!isPasswordValid) {
      return errorResMsg(res, 401, "Invalid password");
    }

    //  tokenize your payload
    const token = createJwtToken({ userId: user._id });
    res.cookie("access_token", token);
    // save the token
    user.token = token;
    await user.save();

    // Return success response
    return successResMsg(res, 200, {
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const createPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    // Check if userId, password, and confirmPassword are provided
    if (!password || !email) {
      return errorResMsg(
        res,
        400,
        "User ID, password, and confirm password are required"
      );
    }

    // Find the user by userId
    const user = await User.findOne({email});

    // Check if the user exists
    if (!user) {
      return errorResMsg(res, 404, "User not found");
    }

    // Hash the password
    const hashedPassword = await passwordHash(password);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    return successResMsg(res, 200, {
      success: true,
      message: "Password created successfully",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};
