import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
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
      type: Date,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
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
    connections: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', "declined"], default: 'pending' },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('User', userSchema);
