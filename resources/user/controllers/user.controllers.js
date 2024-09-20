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
import cloudinary from "../../../utils/image/cloudinary.js";

// Define __dirname for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return errorResMsg(res, 400, "Email is required");
    }

    // Check if the email is already registered
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return successResMsg(res, 200, { registered: true, email });
    } else {
      return successResMsg(res, 200, { registered: false, email });
    }
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return errorResMsg(res, 400, "Email is required");
    }

    // Check if the email is already registered
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      // If the user exists and is not verified, resend OTP
      if (!checkUser.isOTPVerified) {
        // Generate OTP
        const otp = generateOTP();
        const url = `https://ogundigitalsummit.com/`;
        const otpExpiresAt = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes

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

        // Update user's OTP and expiration in the database
        checkUser.otp = otp;
        checkUser.otpExpiresAt = otpExpiresAt;
        await checkUser.save();

        return successResMsg(res, 200, {
          success: true,
          message: "User already exists but is not verified. OTP resent.",
        });
      }

      // If the email is already verified
      return errorResMsg(res, 400, "Email already registered and verified");
    }

    // Generate OTP for new user
    const otp = generateOTP();
    const url = `https://ogundigitalsummit.com/`;
    const otpExpiresAt = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes

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

    // Create a new user instance with email, OTP, and expiration
    const newUser = new User({
      email,
      otp,
      otpExpiresAt,
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
    const user = await User.findOne({ email });

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

export const editUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      profilePicture,
      placeOfWork,
      aboutMe,
      skills,
      socialMedia,
      externalLink,
    } = req.body;

    // Validate the presence of userId
    if (!userId) {
      return errorResMsg(res, 400, "User ID is required");
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return errorResMsg(res, 404, "User not found");
    }

    // Update the user fields with the provided values
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profilePicture = profilePicture || user.profilePicture;
    user.placeOfWork = placeOfWork || user.placeOfWork;
    user.aboutMe = aboutMe || user.aboutMe;
    user.skills = skills || user.skills;
    user.socialMedia = socialMedia || user.socialMedia;
    user.externalLink = externalLink || user.externalLink;

    // Save the updated user profile
    const updatedUser = await user.save();

    // Return success response
    return successResMsg(res, 200, {
      success: true,
      user: updatedUser,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const profilePic = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return errorResMsg(res, 400, "User not found");
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { profilePicture: result.secure_url },
      {
        upsert: true,
        runValidators: true,
        isNew: true, // immutable checker
      }
    );
    // success response
    return successResMsg(res, 200, {
      success: true,
      user: updatedUser,
      message: "User profile picture updated successfully",
    });
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, error.message, {
      message: "internal server error",
    });
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate the presence of userId
    if (!userId) {
      return errorResMsg(res, 400, "User ID is required");
    }

    // Find the user by ID
    const user = await User.findById(userId).select("-password -otp -otpExpiresAt");

    // Check if the user exists
    if (!user) {
      return errorResMsg(res, 404, "User not found");
    }

    // Return success response with user details
    return successResMsg(res, 200, {
      success: true,
      user,
      message: "User details retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, {
      error: error.message,
      message: "Internal server error",
    });
  }
};