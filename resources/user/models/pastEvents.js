import mongoose from 'mongoose';

// Schema for speaker details
const speakerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg",
  },
  company: {
    type: String,
    required: true
  },
  about: {
    type: String
  }
});

// Schema for panelist details (similar to speaker details)
const panelistSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg",
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  about: {
    type: String
  }
});

// Schema for sponsor details
const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  logo: {
    type: String, // URL for sponsor logo
    default:
      "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg",
  }
});

// Schema for guest details
const guestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg",
  },
  role: {
    type: String
  },
  company: {
    type: String
  }
});

// Main event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  attendees: {
    type: Number,
    default: 0
  },
  speakers: [speakerSchema], // Array of speaker details
  panelists: [panelistSchema], // Array of panelist details
  sponsors: [sponsorSchema], // Array of sponsor details
  guests: [guestSchema], // Array of guest details
  eventGallery: {
    type: [String], // Array of image URLs
    default: ["https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg"]
  },
  videos: {
    type: String, // Array of video URLs for event recordings
    default: "https://res.cloudinary.com/grazac/image/upload/v1719308203/lol_k_gprc9r.jpg"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
