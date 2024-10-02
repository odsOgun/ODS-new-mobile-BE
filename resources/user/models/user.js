import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      // required: true
    },
    lastName: {
      type: String,
      // required: true
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg",
    },
    jobTitle: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
    placeOfWork: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    otpExpiresAt: {
      type: Date, // Use Date for timestamp
    },
    isOTPVerified: {
      type: Boolean,
      default: "false",
    },
    otp: {
      type: Number,
    },
    skills: {
      type: [String],
    },
    linkedIn: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    externalLink: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
