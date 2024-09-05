import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
        type: String
    },
    personalDetails: {
        type: String
    },
    aboutMe: {
        type: String
    },
    otpExpiresAt: {
        type: Date, // Use Date for timestamp
      },
    isOTPVerified: {
        type: Boolean,
        default: "false"
    },
    otp: {
        type: Number,
    },
    skills: {
        type: [String]
    },
    socialMedia: {
        type: [String]
    },
    externalLink: {
        type: [String]
    }
},
{
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model('User', userSchema);

export default User;
